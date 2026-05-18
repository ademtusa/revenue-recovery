import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'glow-orange' | 'glow-green' | 'glow-blue' | 'outline';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  
  const width = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`btn btn-${variant} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
