import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-24 h-24 rounded-full overflow-hidden">
        <div className="absolute bottom-0 w-full bg-[#00aaff] animate-fill h-0 rounded-b-full" />
        <div className="absolute inset-0 flex items-center justify-center text-[#135D66] font-bold text-sm">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;
