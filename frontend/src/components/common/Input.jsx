import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  id,
  error,
  helpText,
  showPasswordToggle = false,
  className = '',
  inputClassName = '',
  rows,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordWithToggle = type === 'password' && showPasswordToggle;
  const isTextarea = type === 'textarea';

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isPasswordWithToggle && showPassword ? 'text' : type;

  const baseInputClasses = `w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500 ${
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
  } ${inputClassName}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows || 4}
            className={baseInputClasses}
            {...props}
          />
        ) : (
          <input
            type={inputType}
            id={id}
            className={baseInputClasses}
            {...props}
          />
        )}
        {isPasswordWithToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};


export default Input;