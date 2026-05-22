import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'glow-orange' | 'glow-green' | 'glow-blue' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  style = {},
  ...props
}: ButtonProps) {
  const widthStyle: React.CSSProperties = fullWidth ? { width: '100%' } : {};

  // Map variant to CSS class
  const variantClass: Record<string, string> = {
    primary: 'btn-primary',
    glass: 'btn-glass',
    outline: 'btn-outline',
    'glow-orange': 'btn-glow-orange',
    'glow-green': 'btn-glow-green',
    'glow-blue': 'btn-glow-blue',
    danger: 'btn-danger',
  };

  return (
    <button
      className={`btn ${variantClass[variant] ?? 'btn-glass'} ${className}`}
      style={{ ...widthStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
