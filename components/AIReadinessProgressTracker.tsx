"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Users, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AI Readiness Assessment Step
 */
interface AIReadinessStep {
  id: string;
  label: string;
  description: string;
  section: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  estimatedTime?: string;
  teamProgress?: {
    completed: number;
    total: number;
  };
}

/**
 * Props for AI Readiness Progress Tracker
 */
interface AIReadinessProgressTrackerProps {
  steps: AIReadinessStep[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  showTimeEstimates?: boolean;
  showTeamProgress?: boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
    progress: number;
  }>;
}

export function AIReadinessProgressTracker({
  steps,
  currentStepId,
  onStepClick,
  showTimeEstimates = true,
  showTeamProgress = false,
  variant = 'horizontal',
  teamMembers = []
}: AIReadinessProgressTrackerProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const completedSteps = steps.filter(s => s.status === 'completed').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress]);

  const getStepIcon = (step: AIReadinessStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'current':
        return (
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
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

  const getStepColor = (step: AIReadinessStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-emerald-300';
      case 'current':
        return 'text-blue-300';
      case 'upcoming':
        return 'text-slate-300';
      case 'locked':
        return 'text-slate-500';
      default:
        return 'text-slate-400';
    }
  };

  const canClickStep = (step: AIReadinessStep) => {
    return step.status === 'completed' || step.status === 'current';
  };

  if (variant === 'compact') {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{completedSteps}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Progress</p>
              <p className="text-xs text-slate-400">{completedSteps} of {steps.length} completed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-400">{Math.round(progress)}%</p>
            {showTeamProgress && teamMembers.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users className="h-3 w-3" />
                {teamMembers.length} members
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md" />
            AI Readiness Progress
          </h3>
          <div className="text-sm text-slate-400">
            {completedSteps} of {steps.length} completed
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => canClickStep(step) && onStepClick?.(step.id)}
                disabled={!canClickStep(step)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  step.status === 'current'
                    ? 'bg-blue-500/10 border-blue-400/50 ring-1 ring-blue-400/20'
                    : step.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/20'
                    : canClickStep(step)
                    ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                    : 'bg-slate-800/20 border-slate-700/30 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStepIcon(step)}
                  <div className="flex-1">
                    <div className={`font-medium ${getStepColor(step)}`}>
                      {step.label}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {step.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      {showTimeEstimates && step.estimatedTime && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime}
                        </div>
                      )}
                      {showTeamProgress && step.teamProgress && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {step.teamProgress.completed}/{step.teamProgress.total} completed
                        </div>
                      )}
                    </div>
                  </div>
                  {step.status === 'current' && (
                    <ChevronRight className="h-4 w-4 text-blue-400" />
                  )}
                </div>
              </button>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-4 bg-slate-600/50" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Team progress summary */}
        {showTeamProgress && teamMembers.length > 0 && (
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Progress
            </h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{Math.round(member.progress)}%</p>
                    <div className="w-16 bg-slate-600/30 rounded-full h-1">
                      <div
                        className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall progress summary */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Overall Progress</span>
            <span className="text-sm font-medium text-slate-200">{Math.round(progress)}%</span>
          </div>
          <div className="bg-slate-600/30 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${animatedProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Assessment Progress</h3>
          <div className="text-sm text-slate-400">
            {completedSteps} of {steps.length} completed ({Math.round(progress)}%)
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => canClickStep(step) && onStepClick?.(step.id)}
              disabled={!canClickStep(step)}
              className={`flex flex-col items-center space-y-2 group ${
                canClickStep(step) ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div className={`p-3 rounded-full border-2 transition-all duration-200 ${
                step.status === 'completed'
                  ? 'border-emerald-400 bg-emerald-400/20'
                  : step.status === 'current'
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-slate-600 bg-slate-700/30'
              } ${canClickStep(step) ? 'group-hover:scale-110' : ''}`}>
                {getStepIcon(step)}
              </div>
              
              <div className="text-center max-w-20">
                <div className={`text-sm font-medium ${getStepColor(step)} line-clamp-2`}>
                  {step.label}
                </div>
                {showTimeEstimates && step.estimatedTime && (
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 justify-center">
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
      <AnimatePresence mode="wait">
        {currentStepIndex >= 0 && (
          <motion.div
            key={currentStepId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-400/30"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStepIcon(steps[currentStepIndex])}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-2">
                  {steps[currentStepIndex].label}
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  {steps[currentStepIndex].description}
                </p>
                <div className="flex items-center gap-4">
                  {showTimeEstimates && steps[currentStepIndex].estimatedTime && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4" />
                      Estimated time: {steps[currentStepIndex].estimatedTime}
                    </div>
                  )}
                  {showTeamProgress && steps[currentStepIndex].teamProgress && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="h-4 w-4" />
                      Team: {steps[currentStepIndex].teamProgress!.completed}/{steps[currentStepIndex].teamProgress!.total} completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">
            {steps.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">
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
