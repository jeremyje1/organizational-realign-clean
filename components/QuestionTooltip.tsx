"use client";
import React, { useState } from 'react';
import { Info, HelpCircle, ChevronRight } from 'lucide-react';

interface QuestionTooltipProps {
  title: string;
  explanation?: string;
  examples?: string[];
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export default function QuestionTooltip({ 
  title: _title, 
  explanation, 
  examples = [], 
  children, 
  position = 'top',
  size = 'md'
}: QuestionTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
  };

  const sizeClasses = {
    sm: 'max-w-xs text-xs',
    md: 'max-w-sm text-sm',
    lg: 'max-w-lg text-sm'
  };

  const showTooltip = isVisible || isHovered;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help inline-block"
        role="button"
        tabIndex={0}
        aria-label="Show help information"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVisible(!isVisible);
          }
        }}
      >
        {children}
      </div>
      
      {showTooltip && (explanation || examples.length > 0) && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsVisible(false)}
          />
          
          <div 
            className={`
              absolute z-50 
              ${positionClasses[position]} 
              ${sizeClasses[size]}
              animate-in fade-in zoom-in-95 duration-200
              md:animate-none
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Tooltip content */}
            <div className="bg-slate-800 text-slate-100 rounded-xl p-5 shadow-2xl border border-slate-600/50 backdrop-blur-sm">
              {/* Arrow - hidden on mobile */}
              <div className={`hidden md:block absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
              
              {/* Close button for mobile */}
              <button 
                className="md:hidden absolute top-2 right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                onClick={() => setIsVisible(false)}
                aria-label="Close help"
              >
                ×
              </button>
              
              {/* Title */}
              <div className="font-semibold text-slate-200 mb-3 pr-8 md:pr-6 leading-tight">
                💡 Quick Help
              </div>
              
              {/* Explanation */}
              {explanation && (
                <div className="text-slate-300 mb-4 leading-relaxed">
                  {explanation}
                </div>
              )}
              
              {/* Examples */}
              {examples.length > 0 && (
                <div className="space-y-3">
                  <div className="font-medium text-slate-200 text-xs uppercase tracking-wide flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-600"></span>
                    Examples
                  </div>
                  <ul className="space-y-2">
                    {examples.map((example, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <ChevronRight className="h-3 w-3 mt-1 mr-2 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Mobile interaction hint */}
              <div className="md:hidden mt-4 pt-3 border-t border-slate-600/50 text-xs text-slate-400">
                💡 Tap outside or the × to close
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Icon component for question tooltips
export function QuestionHelpIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <HelpCircle className={`${className} text-slate-400 hover:text-slate-300 transition-colors`} />
  );
}

// Info icon variant
export function QuestionInfoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <Info className={`${className} text-blue-400 hover:text-blue-300 transition-colors`} />
  );
}
