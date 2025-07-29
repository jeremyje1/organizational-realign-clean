'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  term: string;
  definition: string;
  className?: string;
}

export default function InfoTooltip({ term, definition, className = '' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <span 
        className="text-blue-600 dark:text-blue-400 underline decoration-dotted cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
      >
        {term}
      </span>
      <Info className="h-3 w-3 ml-1 text-blue-500 opacity-60" />
      
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 pointer-events-none">
          <div className="font-medium mb-1">{term}</div>
          <div className="text-gray-300">{definition}</div>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
}