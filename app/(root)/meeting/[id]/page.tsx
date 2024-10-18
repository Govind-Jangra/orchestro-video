"use client";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

const Meeting = ({ params }: { params: { id: string } }) => {
  const { id } = useParams();

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(id);

  if (!call || isCallLoading) return <Loader />;

  return (
    <main className="h-screen flex flex-col">
      <Navbar/> 
      
      <div className="flex-grow p-16">
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupComplete ? (
              <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
            ) : (
              <MeetingRoom />
            )}
          </StreamTheme>
        </StreamCall>
      </div>
    </main>
  );
};

export default Meeting;
