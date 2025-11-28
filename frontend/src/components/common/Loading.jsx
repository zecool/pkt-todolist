import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  size = 'md', 
  text = '로딩 중...', 
  className = '',
  showText = true,
  fullScreen = false 
}) => {
  // Size classes for different loading sizes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const spinnerClass = `${sizeClasses[size]} animate-spin text-green-600`;

  const loadingContent = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''}`}>
      <Loader2 className={spinnerClass} />
      {showText && (
        <p className="mt-2 text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  return fullScreen ? (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 ${className}`}>
      {loadingContent}
    </div>
  ) : (
    <div className={`inline-flex items-center ${className}`}>
      {loadingContent}
    </div>
  );
};

export default Loading;