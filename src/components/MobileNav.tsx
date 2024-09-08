'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconScan, IconUser, IconX } from '@tabler/icons-react';

const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isActive = (path: string) => pathname === path;

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access the camera. Please make sure you have given the necessary permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  return (
    <>
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <video
            autoPlay
            playsInline
            ref={(videoElement) => {
              if (videoElement && stream) {
                videoElement.srcObject = stream;
              }
            }}
            className="w-full h-full object-cover"
          />
          <button
            onClick={closeCamera}
            className="absolute top-4 right-4 text-white"
          >
            <IconX size={24} />
          </button>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-40">
        <div className="flex justify-between items-center relative">
          <Link href="/scanner/dashboard" className={`flex flex-col items-center ml-12 ${isActive('/scanner/dashboard') ? 'text-green-500' : 'text-white'}`}>
            <IconHome className={`w-6 h-6 ${isActive('/scanner/dashboard') ? 'text-green-500' : 'text-white'}`} stroke={1.5} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button
              onClick={openCamera}
              className="bg-pink-500 rounded-full p-4 shadow-lg"
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