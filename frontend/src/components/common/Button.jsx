import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  type = 'button',
  onClick,
  ...props 
}) => {
  // Define variant classes
  const variantClasses = {
    primary: '!bg-green-600 hover:!bg-green-700 active:!bg-green-800 !text-white !border-2 !border-green-600 shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-500',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-2 border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent',
  };

  // Define size classes
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  // Construct class names
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed';
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    loading ? 'cursor-not-allowed' : ''
  }`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};


export default Button;