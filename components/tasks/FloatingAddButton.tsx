'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAddButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingAddButton({ onClick, className }: FloatingAddButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 rounded-full',
        'bg-blue-600 hover:bg-blue-700 text-white',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        'transition-all duration-200',
        'z-50',
        className
      )}
      aria-label="Add new task"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
}
