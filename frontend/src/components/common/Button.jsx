import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  onClick, 
  className = '', 
  type = 'button', 
  ...props 
}) => {
  // Define variant classes
  const variantClasses = {
    primary: 'bg-[#00C73C] text-white hover:bg-[#00A832] active:bg-[#008A28] border-transparent',
    secondary: 'bg-white text-[#00C73C] border-[#00C73C] hover:bg-[#00C73C] hover:text-white',
    danger: 'bg-[#F44336] text-white hover:bg-[#D32F2F] active:bg-[#B71C1C] border-transparent',
    outline: 'bg-white text-[#424242] border-[#E0E0E0] hover:bg-gray-50',
    ghost: 'bg-transparent text-[#424242] hover:bg-gray-100 border-transparent',
  };

  // Define size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Combine classes
  const classes = `
    inline-flex items-center justify-center font-medium rounded-lg border
    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00C73C] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;