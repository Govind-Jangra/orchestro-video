"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Video } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";

export default function PersonalRoom() {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();
  const { toast } = useToast();

  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`; // Dynamic meeting link

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;
    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: "Link Copied",
    });
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Your Personal Meeting Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="room-link" className="text-gray-100">
              Room Link
            </Label>
            <div className="flex mt-1">
              <Input
                value={meetingLink}
                readOnly
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button
                onClick={copyToClipboard}
                className="ml-2 bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={startRoom}
              className="flex-grow bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Video className="h-4 w-4 mr-1" />
              Start Meeting
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Room Capacity:</strong> Unlimited
          </p>
          <p>
            <strong>Meeting Duration:</strong> Unlimited
          </p>
          <p>
            <strong>Features:</strong> Screen sharing, Recording, Transcription
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
