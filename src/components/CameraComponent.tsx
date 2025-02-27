'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IconX, IconCamera } from '@tabler/icons-react';
import WaterConsumptionResult from './Result';

interface CameraComponentProps {
  isCameraOpen: boolean;
  closeCamera: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ isCameraOpen, closeCamera }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } }, }); //front cam
        //const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true }); //back
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(imageDataUrl);
        processImage(imageDataUrl);
      }
    }
  };

  const processImage = async (imageDataUrl: string) => {
    setIsProcessing(true);
    try {
      const blob = await (await fetch(imageDataUrl)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setRecognizedText(data.text);
      console.log('Recognized Text:', data.text);
    } catch (error) {
      console.error('Error processing image:', error);
      setRecognizedText('Error processing image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {!image ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 border-2 border-white rounded-full p-2"></div>
              </div>
              <button
                onClick={captureImage}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-full"
              >
                <IconCamera size={32} />
              </button>
            </>
          ) : (
            <div className="relative w-full h-full">
              <img src={image} alt="Captured" className="w-full h-full object-cover" />
              {isProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4">Processing image...</p>
                  </div>
                </div>
              ) : (
                <>
                  {!isProcessing && recognizedText !== null && (
                    <div className="absolute inset-0 bg-white">
                      <WaterConsumptionResult recognizedText={recognizedText} closeCamera={closeCamera} />
                    </div>
                  )}
                  <button
                    onClick={closeCamera}
                    className="absolute top-2 right-1 px-4  py-2  bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
          <button
            onClick={closeCamera}
            className="absolute top-4 right-4 text-white mt-14"
          >
            <IconX size={24} />
          </button>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </>
  );
};

export default CameraComponent;