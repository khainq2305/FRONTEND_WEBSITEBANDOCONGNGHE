import React from 'react';

const CopyableRow = ({ label, value }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex justify-between items-center border-b py-1 text-sm">
      <span className="text-gray-600">{label}</span>
      <span
        onClick={handleCopy}
        className="text-gray-800 font-medium cursor-pointer hover:underline"
      >
        {value}
      </span>
    </div>
  );
};

export default CopyableRow;
