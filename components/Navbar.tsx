import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="flex-between fixed top-0 z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="https://images.squarespace-cdn.com/content/v1/65441f09edf0fe6e1cdc551e/be84ec6a-2b9c-4e6e-bc7e-57f4ad9e5dc5/White_Accent.png"
          width={32}
          height={32}
          alt="Orchestro Logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Orchestro AI
        </p>
      </Link>

      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
