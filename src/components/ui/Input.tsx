'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full min-w-0 max-w-full bg-dark-light border border-gray-700 rounded-lg px-3 sm:px-4 py-3 text-white',
          'placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          'transition-colors text-base box-border',
          className
        )}
        {...props}
      />
    </div>
  );
}
