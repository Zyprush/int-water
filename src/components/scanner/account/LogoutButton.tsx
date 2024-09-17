import React from 'react';
import { IconLogout } from '@tabler/icons-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <button className="flex items-center" onClick={onLogout}>
        <IconLogout className="text-red-500 mr-4" size={24} />
        <h2 className="text-lg font-medium text-red-500">Logout</h2>
      </button>
    </div>
  );
};

export default LogoutButton;