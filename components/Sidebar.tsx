"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, Calendar, Clock, Video, User } from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Home", link: "/" },
  { icon: Calendar, label: "Upcoming", link: "/upcoming" },
  { icon: Clock, label: "Previous", link: "/previous" },
  { icon: Video, label: "Recordings", link: "/recordings" },
  { icon: User, label: "Personal Room", link: "/personal-room" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  bg-dark-1 p-6 pt-16 text-white max-sm:hidden lg:w-[264px]">
      <nav className="mt-8">
        {sidebarItems.map((item, index) => (
          <Link 
            href={item.link} 
            key={index} 
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200 ${
              (pathname === item.link || pathname.startsWith(`${item.link}/`))
                ? "bg-gray-700 text-white"
                : ""
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 text-blue-500" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
