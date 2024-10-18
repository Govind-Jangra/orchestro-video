"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Calendar, Clock, Video, User, Menu } from "lucide-react"; // lucide icons
import { sidebarLinks } from "@/constants"; // Use your updated constants
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Home, label: "Home", link: "/" },
  { icon: Calendar, label: "Upcoming", link: "/upcoming" },
  { icon: Clock, label: "Previous", link: "/previous" },
  { icon: Video, label: "Recordings", link: "/recordings" },
  { icon: User, label: "Personal Room", link: "/personal-room" },
];

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="h-9 w-9 text-white cursor-pointer sm:hidden" />
        </SheetTrigger>

        <SheetContent side="left" className="border-none bg-dark-1">
          <SheetClose asChild>
            <Link href="/" className="flex items-center gap-1">
              <img
                src="https://images.squarespace-cdn.com/content/v1/65441f09edf0fe6e1cdc551e/be84ec6a-2b9c-4e6e-bc7e-57f4ad9e5dc5/White_Accent.png"
                alt="Orchestro Logo"
                className="w-8 h-8"
              />
              <p className="text-[26px] font-extrabold text-white">
                Orchestro AI
              </p>
            </Link>
          </SheetClose>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <nav className="flex h-full flex-col gap-6 pt-16 text-white">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.link;

                return (
                  <SheetClose asChild key={index}>
                    <Link
                      href={item.link}
                      className={cn(
                        "flex gap-4 items-center p-4 rounded-lg w-full max-w-60 hover:bg-gray-700 transition-colors duration-200",
                        {
                          "bg-gray-700 text-white": isActive,
                          "text-gray-300": !isActive,
                        }
                      )}
                    >
                      <item.icon className="h-5 w-5 text-blue-500" />
                      <p className="font-semibold">{item.label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
