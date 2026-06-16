import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  placeholder,
  className = '',
  icon,
  ...props
}, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`w-full bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 focus:border-brand focus:ring-1 focus:ring-brand text-zinc-100 placeholder-zinc-500 rounded-lg py-2.5 transition-all duration-300 outline-none ${
            icon ? 'pl-10' : 'pl-4'
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium pl-0.5">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
