"use client";

import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 3));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="relative w-32 h-32 rounded-full border-4 border-sky-500 overflow-hidden">
        {/* Water fill effect */}
        <div 
          className="absolute bottom-0 w-full bg-sky-400/80 transition-all duration-300 ease-in-out"
          style={{ height: `${progress}%` }}
        >
          {/* Wave effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 animate-wave1 opacity-70">
              <div className="absolute top-0 left-0 w-[200%] h-full">
                <div className="absolute top-[-25%] left-[-25%] w-[50%] h-[200%] bg-sky-300 rounded-[40%] animate-spin-slow transform rotate-0" />
                <div className="absolute top-[-25%] right-[-25%] w-[50%] h-[200%] bg-sky-300 rounded-[40%] animate-spin-slow transform rotate-0" />
              </div>
            </div>
            <div className="absolute inset-0 animate-wave2 opacity-50">
              <div className="absolute top-0 left-0 w-[200%] h-full">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[200%] bg-sky-200 rounded-[40%] animate-spin-slower transform rotate-0" />
                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[200%] bg-sky-200 rounded-[40%] animate-spin-slower transform rotate-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Ripple effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-4 h-4 bg-sky-200 rounded-full animate-ping opacity-75" />
          <div className="absolute w-3 h-3 bg-sky-300 rounded-full animate-ping delay-300 opacity-75" />
        </div>

        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm z-10 mix-blend-difference">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
