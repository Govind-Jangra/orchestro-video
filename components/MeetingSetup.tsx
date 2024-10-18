/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const [isRecordingOptedIn, setIsRecordingOptedIn] = useState(false);

  const call = useCall();

  if (!call)
    throw new Error("useCall must be used within a StreamCall component");

  useEffect(() => {
    if (isMicCamToggledOn) {
      call.camera.enable();
      call.microphone.enable();
    } else {
      call.camera.disable();
      call.microphone.disable();
    }
  }, [isMicCamToggledOn]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Check to enable camera and microphone
        </label>
        <DeviceSettings />
      </div>

      {/* Opt-in for Meeting Recording */}
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isRecordingOptedIn}
            onChange={(e) => setIsRecordingOptedIn(e.target.checked)}
          />
          Opt in for meeting recording and summarization
        </label>
      </div>

      {/* Button */}
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
          if (isRecordingOptedIn) {
            console.log("User opted in for meeting recording and summarization.");
          }
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
