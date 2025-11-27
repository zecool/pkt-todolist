import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  label,
  id,
  type = 'text',
  as = 'input',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 text-base font-normal text-[#212121]
    bg-white border rounded-lg appearance-none
    focus:outline-none focus:ring-2 focus:ring-[#00C73C] focus:ring-offset-2 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-[#F44336] focus:ring-[#F44336]' : 'border-[#E0E0E0]'}
    ${className}
  `;

  const InputComponent = as;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#212121] mb-2">
          {label} {required && <span className="text-[#F44336]">*</span>}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={rows}
          className={baseClasses}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={baseClasses}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-sm text-[#F44336]">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  as: PropTypes.oneOf(['input', 'textarea']),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.number,
};

export default Input;