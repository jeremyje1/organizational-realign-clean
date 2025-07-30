"use client";

import { useState } from 'react';
import { ChevronDown, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

interface SectionProgress {
  name: string;
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
  isCurrent: boolean;
}

interface Props {
  sections: SectionProgress[];
  currentSectionIndex: number;
  onSectionChange: (sectionIndex: number) => void;
  overallProgress: number;
}

export function QuestionNavigator({ sections, currentSectionIndex, onSectionChange, overallProgress }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSections = sections.filter(s => s.isComplete).length;
  const totalQuestions = sections.reduce((sum, s) => sum + s.totalQuestions, 0);
  const answeredQuestions = sections.reduce((sum, s) => sum + s.answeredQuestions, 0);

  return (
    <div className="relative">
      {/* Main Navigator Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full card p-4 hover:bg-slate-700/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                sections[currentSectionIndex]?.isComplete 
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-400'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400'
              }`}>
                {sections[currentSectionIndex]?.isComplete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  currentSectionIndex + 1
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-slate-100">
                  {sections[currentSectionIndex]?.name || 'Loading...'}
                </div>
                <div className="text-sm text-slate-400">
                  Section {currentSectionIndex + 1} of {sections.length}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-200">
                {Math.round(overallProgress)}% Complete
              </div>
              <div className="text-xs text-slate-400">
                {answeredQuestions} of {totalQuestions} questions
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="bg-slate-700/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500 progress-bar"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expanded Section List */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-20 mt-2 card p-4 max-h-96 overflow-y-auto animate-slide-up">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300 pb-2 border-b border-slate-600/30">
              <span>Assessment Progress</span>
              <span>{completedSections} of {sections.length} sections complete</span>
            </div>

            {sections.map((section, index) => {
              const progress = section.totalQuestions > 0 ? (section.answeredQuestions / section.totalQuestions) * 100 : 0;
              const canNavigate = index <= currentSectionIndex || section.isComplete;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (canNavigate) {
                      onSectionChange(index);
                      setIsExpanded(false);
                    }
                  }}
                  disabled={!canNavigate}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                    section.isCurrent
                      ? 'bg-purple-500/10 border-purple-400/50 ring-1 ring-purple-400/20'
                      : section.isComplete
                      ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/20'
                      : canNavigate
                      ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                      : 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        section.isComplete
                          ? 'bg-emerald-400 text-white'
                          : section.isCurrent
                          ? 'bg-purple-400 text-white'
                          : canNavigate
                          ? 'bg-slate-600 text-slate-300'
                          : 'bg-slate-700 text-slate-500'
                      }`}>
                        {section.isComplete ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : section.isCurrent ? (
                          <Circle className="h-3 w-3 animate-pulse" />
                        ) : canNavigate ? (
                          index + 1
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                      </div>
                      <div className="font-medium text-slate-100 text-sm">
                        {section.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        {section.answeredQuestions}/{section.totalQuestions}
                      </div>
                      {section.answeredQuestions < section.totalQuestions && section.isCurrent && (
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          In progress
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        section.isComplete
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'bg-gradient-to-r from-purple-400 to-pink-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              );
            })}

            {/* Quick Stats */}
            <div className="pt-3 border-t border-slate-600/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-emerald-400">{completedSections}</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-purple-400">{sections.length - completedSections}</div>
                  <div className="text-xs text-slate-400">Remaining</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-slate-300">{Math.round(overallProgress)}%</div>
                  <div className="text-xs text-slate-400">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
