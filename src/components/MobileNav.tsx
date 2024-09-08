'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconScan, IconUser } from '@tabler/icons-react';
import CameraComponent from './CameraComponent'; // Import CameraComponent

const MobileNavbar: React.FC = () => {
    const pathname = usePathname();
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const openCamera = () => {
        setIsCameraOpen(true);
    };

    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    return (
        <>
            <CameraComponent isCameraOpen={isCameraOpen} closeCamera={closeCamera} />
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-40">
                <div className="flex justify-between items-center relative">
                    <Link href="/scanner/dashboard" className={`flex flex-col items-center ml-12 ${isActive('/scanner/dashboard') ? 'text-green-500' : 'text-white'}`}>
                        <IconHome className={`w-6 h-6 ${isActive('/scanner/dashboard') ? 'text-green-500' : 'text-white'}`} stroke={1.5} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                        <button
                            onClick={openCamera}
                            className="bg-green-500 rounded-full p-4 shadow-lg"
                        >
                            <IconScan className="w-6 h-6 text-white" stroke={1.5} />
                        </button>
                    </div>
                    <Link href="/scanner/profile" className={`flex flex-col items-center mr-12 ${isActive('/scanner/profile') ? 'text-green-500' : 'text-white'}`}>
                        <IconUser className={`w-6 h-6 ${isActive('/scanner/profile') ? 'text-green-500' : 'text-white'}`} stroke={1.5} />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default MobileNavbar;
