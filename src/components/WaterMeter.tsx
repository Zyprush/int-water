import React from 'react';

interface WaterMeterProps {
  value: number;
  unit: string;
  title: string;
  maxValue?: number;
}

const WaterMeter: React.FC<WaterMeterProps> = ({ value, unit, title, maxValue = 1500000 }) => {
  // Calculate the percentage for the progress
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
      <div className="relative w-64 h-64">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E6E6E6"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#948979"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        {/* Central text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-primary">{value.toLocaleString()}</span>
          <span className="text-xl text-primary">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default WaterMeter;