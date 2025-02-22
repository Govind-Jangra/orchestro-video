import CallList from "@/components/CallList";
import React from "react";

const Upcoming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <CallList type="upcoming" />
    </section>
  );
};

export default Upcoming;
