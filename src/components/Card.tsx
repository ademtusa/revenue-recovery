import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className = '', glass = false }: CardProps) {
  return (
    <div className={`${glass ? 'glass-panel' : 'premium-card'} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 border-b border-[var(--border)] ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
