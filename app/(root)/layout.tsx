import React, { ReactNode } from "react";
import { Metadata } from "next";
import StreamVideoProvider from "@/providers/StreamClientProvider";

export const metadata: Metadata = {
  title: "Orchestro",
  description: "A meeting scheduling app for everyone.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
