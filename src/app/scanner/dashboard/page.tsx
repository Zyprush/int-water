"use client";

import Layout from '@/components/MobileLayout';
import React, { useState, useRef } from 'react';

const Dashboard: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: JSON.stringify({ image: selectedImage }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setRecognizedText(data.text);
    } catch (error) {
      console.error('Error processing image:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      setRecognizedText(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={handleSelectImage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Select Image
          </button>
        </div>
        {selectedImage && (
          <div className="mb-4">
            <img src={selectedImage} alt="Selected" className="max-w-full h-auto" />
            <button
              onClick={handleUpload}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Image'}
            </button>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <h2 className="font-bold mb-2">Error:</h2>
            <p>{errorMessage}</p>
          </div>
        )}
        {recognizedText && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Recognized Text:</h2>
            <p>{recognizedText}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;