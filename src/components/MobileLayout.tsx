'use client';

import React from 'react';
import MobileNavbar from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20">{children}</main>
      <MobileNavbar />
    </div>
  );
};

export default Layout;