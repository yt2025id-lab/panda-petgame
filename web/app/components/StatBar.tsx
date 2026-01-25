
import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const StatBar: React.FC<StatBarProps> = ({ value, icon, color }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[80px]">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-gray-800 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default StatBar;
