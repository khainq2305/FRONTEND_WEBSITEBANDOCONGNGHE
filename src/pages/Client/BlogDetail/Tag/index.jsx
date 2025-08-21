import React from 'react';

const Tags = () => {
    const arr = [
        
    ]
  return (
    <div className="flex items-center gap-2 text-justify">
      <p className="font-semibold">Tags:</p>
      <div className="flex flex-wrap gap-2 text-sm text-blue-600 cursor-pointer">
        <span className="bg-gray-100 p-1 rounded text-gray-500 hover:bg-gray-200">ra mắt Galaxy S25 Edge</span>
        <span className="bg-gray-100 p-1 rounded text-gray-500 hover:bg-gray-200">Tin tức Samsung</span>
      </div>
    </div>
  );
};

export default Tags;
