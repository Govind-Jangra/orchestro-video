"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, PlayCircle, Link as LinkIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

const NewCallList: React.FC<CallListProps> = ({ type }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Error fetching recordings, try again later",
        });
      }
    };
    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings, toast]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls.slice(0, 10); // Simulating previous meetings
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls.reverse(); // Simulating upcoming meetings
      default:
        return [];
    }
  };

  const calls = getCalls();
  const noCallsMessage = {
    ended: "No Previous Meetings",
    upcoming: "No Upcoming Meetings",
    recordings: "No Recordings",
  }[type];

  const filteredCalls = calls.filter((meeting: Call | CallRecording) => {
    const description =
      (meeting as Call).state?.custom?.description?.toLowerCase() ||
      (meeting as CallRecording).filename?.toLowerCase() ||
      "";
    const meetingDate = new Date(
      (meeting as Call).state?.startsAt || (meeting as CallRecording).start_time
    )
      .toISOString()
      .slice(0, 10); // Extracting date in "YYYY-MM-DD" format
    const matchesDescription = description.includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? meetingDate === filterDate : true;
    return matchesDescription && matchesDate;
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold text-white">
        {type === "ended"
          ? "Previous Meetings"
          : type === "upcoming"
          ? "Upcoming Meetings"
          : "Meeting Recordings"}
      </h1>

      {/* Filter Inputs */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="text-gray-300">Search by Description</Label>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="date-filter" className="text-gray-300">Filter by Date</Label>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead >Title</TableHead>
            <TableHead >Date</TableHead>
            <TableHead >Time</TableHead>
            {type !== "ended" && <TableHead >Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCalls && filteredCalls.length > 0 ? (
            filteredCalls.map((meeting: Call | CallRecording, idx) => {
              const meetingDate = new Date(
                (meeting as Call).state?.startsAt || (meeting as CallRecording).start_time
              );
              return (
                <TableRow key={idx} >
                  <TableCell className="text-gray-300">
                    {(meeting as Call).state?.custom?.description ||
                      (meeting as CallRecording).filename?.substring(0, 20) ||
                      "No Description"}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {meetingDate
                        .toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\//g, ".")}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {meetingDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  {type !== "ended" && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {type === "recordings" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `${(meeting as CallRecording).url}`,
                                "_blank"
                              )
                            }
                            className="border-gray-600 text-gray-300"
                          >
                            <PlayCircle className="h-4 w-4 mr-1 text-gray-400" />
                            Play
                          </Button>
                        ) : type === "upcoming" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/meeting/${(meeting as Call).id}`)
                            }
                            className="border-gray-600 text-gray-300"
                          >
                            <LinkIcon className="h-4 w-4 mr-1 text-gray-400" />
                            Join
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell  className="text-center text-gray-400">
                {noCallsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewCallList;
