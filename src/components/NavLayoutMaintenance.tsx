"use client";

import React, { ReactNode } from "react";
import SideNavbar from "./navbarMaintenance/SideNavbar";
import Header from "./navbarMaintenance/Header";
import MobileHeader from "./navbarMaintenance/MobileHeader";

interface NavbarProps {
  children: ReactNode;
}

const NavLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="flex gap-0 h-screen">
      <SideNavbar />
      <div className="flex flex-col w-full">
        <Header />
        <MobileHeader/>
        <main className="md:pt-10 pt-20 p-5 overflow-x-auto bg-[rgb(243,245,248)] dark:bg-gray-900 md:h-full h-screen">{children}</main>
      </div>
    </div>
  );
};

export default NavLayout;
