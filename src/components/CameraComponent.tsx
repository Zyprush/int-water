'use client';

import React, { useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';

interface CameraComponentProps {
  isCameraOpen: boolean;
  closeCamera: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ isCameraOpen, closeCamera }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: 'environment' } }, // Rear camera
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access the camera. Please make sure you have given the necessary permissions.');
      }
    };

    if (isCameraOpen) {
      openCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  return (
    <>
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
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
    </>
  );
};

export default CameraComponent;
