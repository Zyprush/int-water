/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import navItems from "./navItems";
import { NavLink } from "./NavLink";

const SideNavbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen w-56 hidden md:flex md:flex-col z-50">
      <span className="h-60 bg-neutral px-5 border-r  border-zinc-300 hidden transition-width duration-300 md:flex flex-col justify-center items-center">
        <div className="avatar mx-auto">
          <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <p className="text-white text-sm font-semibold mt-2">Jhon Doe</p>
        <p className="text-white text-xs">Staff</p>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav className="flex w-56 bg-neutral custom-shadow border-r dark:border-zinc-700 relative h-auto flex-col items-start justify-start pt-5 px-0 gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
              isMinimized={false} // or any appropriate value
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
