"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  estimatedTime?: string;
}

interface Props {
  steps: ProgressStep[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  showTimeEstimates?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export function ProgressTracker({ 
  steps, 
  currentStepId, 
  onStepClick, 
  showTimeEstimates = true,
  variant = 'horizontal' 
}: Props) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress]);

  const getStepIcon = (step: ProgressStep, _index: number) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'current':
        return (
          <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        );
      case 'upcoming':
        return <Circle className="h-5 w-5 text-slate-400" />;
      case 'locked':
        return <Clock className="h-5 w-5 text-slate-500" />;
      default:
        return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-emerald-300';
      case 'current':
        return 'text-purple-300';
      case 'upcoming':
        return 'text-slate-300';
      case 'locked':
        return 'text-slate-500';
      default:
        return 'text-slate-400';
    }
  };

  const canClickStep = (step: ProgressStep) => {
    return step.status === 'completed' || step.status === 'current';
  };

  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100">Progress</h3>
          <div className="text-sm text-slate-400">
            {steps.filter(s => s.status === 'completed').length} of {steps.length} completed
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <button
                onClick={() => canClickStep(step) && onStepClick?.(step.id)}
                disabled={!canClickStep(step)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  step.status === 'current'
                    ? 'bg-purple-500/10 border-purple-400/50 ring-1 ring-purple-400/20'
                    : step.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/20'
                    : canClickStep(step)
                    ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                    : 'bg-slate-800/20 border-slate-700/30 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStepIcon(step, index)}
                  <div className="flex-1">
                    <div className={`font-medium ${getStepColor(step)}`}>
                      {step.label}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {step.description}
                    </div>
                    {showTimeEstimates && step.estimatedTime && (
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {step.estimatedTime}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-4 bg-slate-600/50" />
              )}
            </div>
          ))}
        </div>

        {/* Progress summary */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Overall Progress</span>
            <span className="text-sm font-medium text-slate-200">{Math.round(progress)}%</span>
          </div>
          <div className="bg-slate-600/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="bg-slate-700/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => canClickStep(step) && onStepClick?.(step.id)}
              disabled={!canClickStep(step)}
              className={`flex flex-col items-center space-y-2 group ${
                canClickStep(step) ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div className={`p-2 rounded-full border-2 transition-all duration-200 ${
                step.status === 'completed'
                  ? 'border-emerald-400 bg-emerald-400/20'
                  : step.status === 'current'
                  ? 'border-purple-400 bg-purple-400/20'
                  : 'border-slate-600 bg-slate-700/30'
              } ${canClickStep(step) ? 'group-hover:scale-110' : ''}`}>
                {getStepIcon(step, index)}
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-medium ${getStepColor(step)}`}>
                  {step.label}
                </div>
                {showTimeEstimates && step.estimatedTime && (
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {step.estimatedTime}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current step details */}
      {currentStepIndex >= 0 && (
        <div className="card p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getStepIcon(steps[currentStepIndex], currentStepIndex)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100 mb-2">
                {steps[currentStepIndex].label}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                {steps[currentStepIndex].description}
              </p>
              
              {showTimeEstimates && steps[currentStepIndex].estimatedTime && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  Estimated time: {steps[currentStepIndex].estimatedTime}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">
            {steps.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">
            {steps.filter(s => s.status === 'current').length}
          </div>
          <div className="text-sm text-slate-400">In Progress</div>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <div className="text-2xl font-bold text-slate-400">
            {steps.filter(s => s.status === 'upcoming' || s.status === 'locked').length}
          </div>
          <div className="text-sm text-slate-400">Remaining</div>
        </div>
      </div>
    </div>
  );
}
