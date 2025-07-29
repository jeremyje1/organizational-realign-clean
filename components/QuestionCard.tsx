"use client";

import React from 'react';
import { CheckCircle2, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import LikertInput from './LikertInput';
import NumericInput from './NumericInput';
import { SelectInput } from './SelectInput';
import QuestionTooltip from './QuestionTooltip';

interface Question {
  id: string;
  text: string;
  type: 'likert' | 'number' | 'select' | 'multi-select' | 'text';
  options?: string[];
  tooltip?: {
    explanation?: string;
    examples?: string[];
  };
}

interface QuestionCardProps {
  question: Question;
  index: number;
  isAnswered: boolean;
  needsAttention: boolean;
  multiSelectAnswers?: Map<string, Set<number>>;
  onAnswer: (questionId: string, value?: number | null, stringValue?: string) => void;
  onMultiSelectAnswer: (questionId: string, optionIndex: number, checked: boolean) => void;
}

export default function QuestionCard({
  question: q,
  index,
  isAnswered,
  needsAttention,
  multiSelectAnswers,
  onAnswer,
  onMultiSelectAnswer
}: QuestionCardProps) {
  // Determine the question section for the badge (you may need to add section to your Question interface)
  const questionSection = "Organizational Assessment"; // You can make this dynamic based on your data

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-700">{index + 1}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {questionSection}
          </Badge>
          {isAnswered && (
            <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
          )}
          {needsAttention && (
            <AlertTriangle className="w-5 h-5 text-amber-600 ml-auto animate-pulse" />
          )}
        </div>
        
        <CardTitle className="text-xl leading-relaxed text-gray-900 flex items-start gap-2">
          {q.text}
          {q.tooltip && (
            <QuestionTooltip 
              explanation={q.tooltip.explanation}
              examples={q.tooltip.examples}
            />
          )}
        </CardTitle>
        
        {q.tooltip?.explanation && (
          <CardDescription className="text-base text-gray-600">
            {q.tooltip.explanation}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {q.type === "likert" && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 px-2">
              <span>Strongly Disagree</span>
              <span>Neutral</span>
              <span>Strongly Agree</span>
            </div>
            <LikertInput onSelect={(v) => onAnswer(q.id, v)} />
          </div>
        )}

        {q.type === "number" && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-700 font-medium">
              Enter a numeric value:
            </label>
            <NumericInput onSubmit={(v) => onAnswer(q.id, v)} />
          </div>
        )}

        {q.type === "select" && q.options && (
          <div className="space-y-4">
            {q.id === 'INST_TYPE' && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-700 font-medium text-sm">📋 Institution Type Selection</span>
                </div>
                <p className="text-sm text-blue-600">
                  This selection customizes your assessment questions and provides relevant recommendations.
                </p>
              </div>
            )}
            <SelectInput
              options={q.options}
              placeholder="Select an option..."
              onSelect={(v) => onAnswer(q.id, undefined, v)}
              className="w-full"
            />
          </div>
        )}

        {q.type === "multi-select" && q.options && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              Select all that apply:
            </div>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => {
                const isSelected = multiSelectAnswers?.get(q.id)?.has(optionIndex) || false;
                return (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onMultiSelectAnswer(q.id, optionIndex, e.target.checked)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{option}</span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {q.type === "text" && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-700 font-medium">
              Your response:
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter your response here..."
              onChange={(e) => onAnswer(q.id, undefined, e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
