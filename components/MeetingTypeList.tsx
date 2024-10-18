"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "react-datepicker/dist/react-datepicker.css";
import {
  Video,
  UserPlus,
  Calendar as CalendarIcon,
  PlayCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import ReactDatePicker from "react-datepicker";

// Define the types for each prop in the component

interface MeetingOptionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

interface NewMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  createMeeting: () => void;
}

interface JoinMeetingDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ScheduleMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  values: {
    dateTime: Date;
    description: string;
  };
  setValues: any;
  createMeeting: () => void;
}

export default function Home() {
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [joinMeetingOpen, setJoinMeetingOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and a time" });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) router.push(`/meeting/${call.id}`);

      toast({ title: "Meeting created successfully" });
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to create meeting" });
    }
  };

  const handleViewRecordings = () => {
    router.push("/recordings");
  };

  return (
    <div className="space-y-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MeetingOption
          icon={Video}
          title="New Meeting"
          description="Start an instant meeting"
          onClick={() => {
            setNewMeetingOpen(true);
            setMeetingState("isInstantMeeting");
          }}
          color="bg-blue-500 hover:bg-blue-600"
        />

        <MeetingOption
          icon={UserPlus}
          title="Join Meeting"
          description="Join using a meeting link"
          onClick={() => {
            setJoinMeetingOpen(true);
            setMeetingState("isJoiningMeeting");
          }}
          color="bg-green-500 hover:bg-green-600"
        />

        <MeetingOption
          icon={CalendarIcon}
          title="Schedule Meeting"
          description="Plan a future meeting"
          onClick={() => {
            setScheduleMeetingOpen(true);
            setMeetingState("isScheduleMeeting");
          }}
          color="bg-purple-500 hover:bg-purple-600"
        />

        <MeetingOption
          icon={PlayCircle}
          title="View Recordings"
          description="Access past meeting recordings"
          onClick={handleViewRecordings}
          color="bg-red-500 hover:bg-red-600"
        />
      </div>

      <NewMeetingDialog
        open={newMeetingOpen}
        onClose={() => {
          setMeetingState(undefined);
          setNewMeetingOpen(false);
        }}
        createMeeting={createMeeting}
      />

      <JoinMeetingDialog
        open={joinMeetingOpen}
        onClose={() => {
          setMeetingState(undefined);
          setJoinMeetingOpen(false);
        }}
      />

      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        values={values}
        createMeeting={createMeeting}
        setValues={setValues}
        onClose={() => {
          setMeetingState(undefined);
          setScheduleMeetingOpen(false);
        }}
      />
    </div>
  );
}

function MeetingOption({ icon: Icon, title, description, onClick, color }: MeetingOptionProps) {
  return (
    <div
      className={`${color} p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-white`}
      onClick={onClick}
    >
      <Icon className="h-12 w-12 mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function NewMeetingDialog({ open, onClose, createMeeting }: NewMeetingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-gray-100  text-white shadow-lg dark:bg-gray-800 dark:text-gray-100 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gray-700 text-xl">
            Start an Instant Meeting
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 mt-4">
        You&apos;re about to start a new meeting. Click the button below to begin.
        </p>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <Button onClick={onClose} variant="outline" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cancel
          </Button>
          <Button onClick={createMeeting} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Start Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JoinMeetingDialog({ open, onClose }: JoinMeetingDialogProps) {
  const [meetingLink, setMeetingLink] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleJoinMeeting = () => {
    if (meetingLink) {
      router.push(meetingLink);
    } else {
      toast({ title: "Please enter a valid meeting link." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-gray-100  text-grey-700 shadow-lg dark:bg-gray-800 dark:text-gray-100 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gray-700 text-xl">
            Join a Meeting
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="meeting-link" className="text-gray-600">
              Meeting Link
            </Label>
            <Input
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Enter the meeting link here"
              id="meeting-link"
              value={meetingLink}
              className="w-full text-grey-800  p-2 mt-2 rounded"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <Button onClick={onClose} variant="outline" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cancel
          </Button>
          <Button onClick={handleJoinMeeting} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Join Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function ScheduleMeetingDialog({
  open,
  onClose,
  values,
  setValues,
  createMeeting,
}: ScheduleMeetingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-6 bg-gray-100 shadow-lg dark:bg-gray-800 dark:text-gray-100 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gray-700 text-xl">
            Schedule a Meeting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="meeting-description" className="text-gray-600 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="meeting-description"
              placeholder="Enter meeting description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              className="w-full rounded text-gray-900 p-2 mt-2 focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <Label htmlFor="date-and-time" className="text-base font-normal leading-[22px] text-black dark:text-gray-300">
              Select Date and Time
            </Label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded text-gray-700 p-2 focus:outline-none"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              createMeeting();
              onClose();
            }}
          >
            Schedule Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
