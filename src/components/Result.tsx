import React from 'react';

interface ResultComponentProps {
  recognizedText: string | null;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ recognizedText }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Result</h1>
      <p>Water Consumption: {recognizedText} m³</p>
      <p>Name of Consumer: Cherrylou Villarin</p>
      <p>Water Meter Serial Number: 123456</p>

      {/* You can add your buttons like Cancel, Upload, etc., here */}
      <div className="mt-4">
        <button className="bg-red-500 text-white p-2 rounded mr-2">Cancel</button>
        <button className="bg-green-500 text-white p-2 rounded">Upload</button>
      </div>
    </div>
  );
};

export default ResultComponent;
