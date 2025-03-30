import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-gray-600">正在加载中，请稍候...</p>
    </div>
  );
}

export default LoadingSpinner;