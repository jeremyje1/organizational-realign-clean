"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onSelect(value: number): void;
  initialValue?: number;
  disabled?: boolean;
}

export default function LikertInput({ onSelect, initialValue, disabled = false }: Props) {
  const [selected, setSelected] = useState<number | null>(initialValue ?? null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    if (disabled) return;
    setSelected(value);
    onSelect(value);
  };

  const labels = [
    "Strongly Disagree",
    "Disagree", 
    "Neutral",
    "Agree",
    "Strongly Agree"
  ];

  const getButtonColor = (n: number) => {
    if (selected === n) {
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg scale-105 ring-2 ring-purple-400/50 transform';
    }
    if (hoveredValue === n) {
      return 'bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-200 border-purple-400/50 scale-102 transform';
    }
    return 'bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 border-slate-600/50 hover:border-slate-500/70 hover:scale-102 transform';
  };

  return (
    <div className="space-y-6">
      {/* Responsive Button Layout */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`flex-1 sm:w-16 sm:h-16 h-14 rounded-xl border-2 text-sm font-bold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1 focus:outline-none focus:ring-3 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              getButtonColor(n)
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
            onClick={() => handleSelect(n)}
            onMouseEnter={() => !disabled && setHoveredValue(n)}
            onMouseLeave={() => setHoveredValue(null)}
            disabled={disabled}
            aria-label={`${labels[n-1]} (${n} out of 5)`}
            role="radio"
            aria-checked={selected === n}
          >
            <span className="font-black text-xl">{n}</span>
            <span className="text-xs sm:hidden opacity-90 px-2 text-center leading-tight font-medium">
              {labels[n-1]}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Labels for Desktop */}
      <div className="hidden sm:flex justify-between text-xs text-slate-400 px-2">
        {labels.map((label, idx) => (
          <span key={idx} className="text-center max-w-[80px] leading-tight">
            {label}
          </span>
        ))}
      </div>

      {/* Enhanced feedback for current selection */}
      {selected && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl backdrop-blur-sm">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-300 font-semibold">
              Selected: {labels[selected - 1]} ({selected}/5)
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
      )}

      {/* Hover feedback for desktop */}
      {hoveredValue && hoveredValue !== selected && (
        <div className="text-center hidden sm:block">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-slate-400">
              Preview: {labels[hoveredValue - 1]} ({hoveredValue}/5)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}