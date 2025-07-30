"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Calculator } from "lucide-react";

interface Props {
  onSubmit(value: number): void;
  initialValue?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function NumericInput({ 
  onSubmit, 
  initialValue, 
  placeholder = "Enter a number...", 
  min,
  max,
  step = 1,
  disabled = false 
}: Props) {
  const [val, setVal] = useState(initialValue?.toString() ?? "");
  const [isSubmitted, setIsSubmitted] = useState(!!initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (initialValue !== undefined) {
      setVal(initialValue.toString());
      setIsSubmitted(true);
    }
  }, [initialValue]);

  const validateValue = (value: string): string | null => {
    if (value.trim() === "") return "Please enter a value";
    
    const parsed = Number(value);
    if (isNaN(parsed)) return "Please enter a valid number";
    
    if (min !== undefined && parsed < min) return `Value must be at least ${min}`;
    if (max !== undefined && parsed > max) return `Value must be no more than ${max}`;
    
    return null;
  };

  const handleSubmit = () => {
    if (disabled) return;
    
    const validationError = validateValue(val);
    if (validationError) {
      setError(validationError);
      return;
    }

    const parsed = Number(val);
    onSubmit(parsed);
    setIsSubmitted(true);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (value: string) => {
    setVal(value);
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="number"
              value={val}
              onChange={(e) => handleChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className={`w-full bg-slate-700/50 border rounded-lg px-4 py-3 pr-10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                error 
                  ? 'border-red-500/50 focus:ring-red-400 focus:border-red-400' 
                  : isSubmitted
                  ? 'border-emerald-500/50 focus:ring-emerald-400 focus:border-emerald-400'
                  : 'border-slate-600/50 focus:ring-purple-400 focus:border-purple-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder={placeholder}
            />
            
            {/* Input icon */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {error ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : isSubmitted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Calculator className="h-5 w-5 text-slate-400" />
              )}
            </div>
          </div>

          {/* Input constraints hint */}
          {(min !== undefined || max !== undefined) && isFocused && !error && (
            <div className="absolute -bottom-8 left-0 text-xs text-slate-400 bg-slate-800/90 px-2 py-1 rounded border border-slate-600/50">
              {min !== undefined && max !== undefined 
                ? `Range: ${min} - ${max}`
                : min !== undefined 
                ? `Minimum: ${min}`
                : `Maximum: ${max}`
              }
            </div>
          )}
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            isSubmitted 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default ring-emerald-400/50'
              : error
              ? 'bg-red-600 hover:bg-red-700 text-white ring-red-400/50'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl ring-purple-400/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={disabled || isSubmitted}
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : error ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Error
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-300 bg-red-900/20 px-3 py-2 rounded-lg border border-red-500/30">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Success message */}
      {isSubmitted && !error && (
        <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          Value saved: <strong>{val}</strong>
        </div>
      )}
    </div>
  );
}