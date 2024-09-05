"use client";

import React, { ReactNode } from "react";
import SideNavbar from "./navbar/SideNavbar";
import Header from "./navbar/Header";
import MobileHeader from "./navbar/MobileHeader";

interface NavbarProps {
  children: ReactNode;
}

const NavLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="flex gap-0">
      <SideNavbar />
      <div className="flex flex-col w-full">
        <Header />
        <MobileHeader/>
        <main className="md:pt-10 pt-20 p-5 bg-[rgb(243,245,248)] dark:bg-gray-900 md:h-full h-screen">{children}</main>
      </div>
    </div>
  );
};

export default NavLayout;
