import React from "react";
import MeetingTypeList from "@/components/MeetingTypeList";

const Home: React.FC = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <MeetingTypeList />
    </section>
  );
};

export default Home;
