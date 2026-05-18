import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'destructive' | 'warning' | 'success';
  className?: string;
}

export function Badge({ children, variant = 'destructive', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
