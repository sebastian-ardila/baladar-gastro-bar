'use client';

import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full min-w-0 max-w-full bg-dark-light border border-gray-700 rounded-lg px-3 sm:px-4 py-3 text-white',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          'transition-colors text-base appearance-none box-border',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
