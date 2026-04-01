'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2',
        variant === 'primary' && 'bg-accent hover:bg-accent-light text-white',
        variant === 'secondary' && 'bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-white',
        variant === 'whatsapp' && 'bg-accent hover:bg-accent-light text-white',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
