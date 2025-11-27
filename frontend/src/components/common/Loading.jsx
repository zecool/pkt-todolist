import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'md', message = '로딩 중...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-[#00C73C] ${sizeClasses[size]}`} />
      {message && <p className="mt-2 text-sm text-[#757575]">{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;