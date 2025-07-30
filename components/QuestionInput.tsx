"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Check, 
  AlertCircle, 
  Flag,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  prompt: string;
  type: 'text' | 'numeric' | 'likert' | 'select' | 'multiselect' | 'upload';
  required?: boolean;
  options?: string[];
  section: string;
  tags?: string[];
  priority?: 'high' | 'medium' | 'low';
  helpText?: string;
}

interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  isFlagged: boolean;
  onFlagChange: (flagged: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function QuestionInput({
  question,
  value,
  onChange,
  isFlagged,
  onFlagChange,
  disabled = false,
  className
}: QuestionInputProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (value !== undefined && value !== '' && value !== null) {
      setHasInteracted(true);
    }
  }, [value]);

  const handleValueChange = (newValue: any) => {
    setHasInteracted(true);
    onChange(newValue);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <motion.textarea
            className={cn(
              "w-full min-h-[120px] p-4 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-100 placeholder-slate-400",
              "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200",
              "backdrop-blur-sm resize-none",
              hasInteracted && value && "border-emerald-500/50 bg-emerald-500/5"
            )}
            placeholder="Enter your response..."
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        );

      case 'numeric':
        return (
          <motion.input
            type="number"
            className={cn(
              "w-full p-4 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-100 placeholder-slate-400",
              "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200",
              "backdrop-blur-sm",
              hasInteracted && value !== undefined && value !== '' && "border-emerald-500/50 bg-emerald-500/5"
            )}
            placeholder="Enter a number..."
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value ? Number(e.target.value) : '')}
            disabled={disabled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        );

      case 'likert':
        const likertOptions = ['1', '2', '3', '4', '5'];
        const likertLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
        
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-5 gap-2">
              {likertOptions.map((option, index) => (
                <motion.button
                  key={option}
                  onClick={() => handleValueChange(option)}
                  disabled={disabled}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all duration-200 text-center font-medium",
                    "hover:scale-105 active:scale-95",
                    value === option
                      ? "border-purple-400 bg-purple-400/20 text-purple-300 shadow-lg shadow-purple-400/20"
                      : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xl font-bold">{option}</div>
                  <div className="text-xs mt-1 opacity-80">{likertLabels[index]}</div>
                </motion.button>
              ))}
            </div>
            {hasInteracted && value && (
              <motion.div
                className="flex items-center space-x-2 text-emerald-400 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Check className="h-4 w-4" />
                <span>Response recorded: {likertLabels[parseInt(value) - 1]}</span>
              </motion.div>
            )}
          </motion.div>
        );

      case 'select':
        return (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {question.options?.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleValueChange(option)}
                disabled={disabled}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all duration-200",
                  "hover:bg-slate-700/50 hover:border-slate-500",
                  value === option
                    ? "border-purple-400 bg-purple-400/10 text-purple-300"
                    : "border-slate-600 bg-slate-800/30 text-slate-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {value === option && <Check className="h-5 w-5 text-purple-400" />}
                </div>
              </motion.button>
            ))}
          </motion.div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        
        return (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-slate-400 mb-3">
              Select all that apply ({selectedValues.length} selected)
            </div>
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <motion.button
                  key={option}
                  onClick={() => {
                    const newValue = isSelected
                      ? selectedValues.filter(v => v !== option)
                      : [...selectedValues, option];
                    handleValueChange(newValue);
                  }}
                  disabled={disabled}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all duration-200",
                    "hover:bg-slate-700/50 hover:border-slate-500",
                    isSelected
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : "border-slate-600 bg-slate-800/30 text-slate-200"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && <Check className="h-5 w-5 text-emerald-400" />}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "border-2 border-dashed border-slate-600 rounded-lg p-8 text-center transition-all duration-200",
              "hover:border-purple-400 hover:bg-purple-400/5",
              hasInteracted && value && "border-emerald-500 bg-emerald-500/5"
            )}>
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">Drag & drop files here or click to browse</p>
              <p className="text-slate-500 text-sm">Supported formats: CSV, XLSX, XLS, PDF, DOCX, ZIP</p>
              
              <Button
                onClick={() => {
                  // File upload logic would go here
                  handleValueChange(['sample-file.pdf']);
                }}
                disabled={disabled}
                className="mt-4"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            
            {value && Array.isArray(value) && value.length > 0 && (
              <motion.div
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center space-x-2 text-emerald-400">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Files uploaded:</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {value.map((file: string, index: number) => (
                    <li key={index} className="text-sm text-emerald-300 ml-6">
                      • {file}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm",
      "hover:border-slate-600/50 transition-all duration-200",
      className
    )}>
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3 mb-3">
              <h3 className="text-lg font-medium text-slate-100 leading-relaxed">
                {question.prompt}
              </h3>
              {question.required && (
                <span className="text-red-400 text-sm font-medium">*</span>
              )}
            </div>
            
            {/* Question metadata */}
            <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
              <span className="bg-slate-800 px-2 py-1 rounded">
                {question.section}
              </span>
              {question.priority && (
                <span className={cn(
                  "px-2 py-1 rounded font-medium",
                  question.priority === 'high' ? "bg-red-900/30 text-red-400" :
                  question.priority === 'medium' ? "bg-amber-900/30 text-amber-400" :
                  "bg-slate-800 text-slate-400"
                )}>
                  {question.priority} priority
                </span>
              )}
              {question.tags && question.tags.length > 0 && (
                <span className="text-slate-500">
                  Tags: {question.tags.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Help toggle */}
          {question.helpText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-slate-400 hover:text-slate-200"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Help text */}
        {showHelp && question.helpText && (
          <motion.div
            className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-200">{question.helpText}</p>
            </div>
          </motion.div>
        )}

        {/* Question Input */}
        <div className="mb-4">
          {renderInput()}
        </div>

        {/* Flag for Follow-up Checkbox as specified in requirements */}
        <motion.div 
          className="flex items-center space-x-3 pt-4 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Checkbox
            id={`flag-${question.id}`}
            checked={isFlagged}
            onCheckedChange={onFlagChange}
            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
          />
          <Label 
            htmlFor={`flag-${question.id}`}
            className="text-sm text-slate-300 cursor-pointer flex items-center space-x-2"
          >
            <Flag className="h-4 w-4 text-amber-400" />
            <span>Flag this question for follow-up discussion</span>
          </Label>
        </motion.div>

        {/* Flag confirmation */}
        {isFlagged && (
          <motion.div
            className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-2 text-amber-400 text-sm">
              <Flag className="h-4 w-4" />
              <span className="font-medium">Flagged for follow-up</span>
            </div>
            <p className="text-amber-200/80 text-xs mt-1">
              This question will appear in your final review summary for further discussion.
            </p>
          </motion.div>
        )}

        {/* Validation feedback */}
        {question.required && hasInteracted && (!value || (Array.isArray(value) && value.length === 0)) && (
          <motion.div
            className="mt-3 bg-red-900/20 border border-red-500/30 rounded-lg p-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>This question is required</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
