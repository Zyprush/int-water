'use client';

import React, { useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';

interface CameraComponentProps {
  isCameraOpen: boolean;
  closeCamera: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ isCameraOpen, closeCamera }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Capture image function
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg'); // Image in base64 format
        sendImageToAPI(imageData);
      }
    }
  };

  // Send image to the API
  const sendImageToAPI = async (imageData: string) => {
    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }), // Send base64 image data
      });

      const result = await response.json();
      if (response.ok) {
        alert('Processed image data: ' + result.text);
      } else {
        alert('Error processing image: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending image to API:', error);
      alert('Failed to send image for processing.');
    }
  };

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
          <canvas ref={canvasRef} className="hidden" /> {/* Canvas to capture the image */}
          <button
            onClick={captureImage}
            className="absolute bottom-4 left-4 text-white bg-blue-600 px-4 py-2 rounded"
          >
            Capture Image
          </button>
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
