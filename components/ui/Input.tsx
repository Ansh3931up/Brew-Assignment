import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

// Module-level counter for generating unique IDs
let inputIdCounter = 0;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    // Use ref to store generated ID (only created once)
    const generatedIdRef = useRef<string | null>(null);
    if (!id && !generatedIdRef.current) {
      generatedIdRef.current = `input-${++inputIdCounter}`;
    }
    const inputId = id || generatedIdRef.current || '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-gray-300',
            'bg-white text-gray-900',
            'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
