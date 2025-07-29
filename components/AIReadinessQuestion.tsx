"use client";

import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  X, 
  MessageSquare, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced question types for AI readiness assessment
 */
interface AIReadinessQuestion {
  id: string;
  section: string;
  question: string;
  type: 'multiple-choice' | 'likert' | 'text' | 'numeric' | 'upload' | 'team-input';
  options?: Array<{
    value: string;
    label: string;
    weight?: number;
  }>;
  validationRules?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  helpText?: string;
  contextPrompt?: string;
  enableContext?: boolean;
  tierMinimum?: string;
  teamInput?: {
    allowMultipleResponses: boolean;
    requireConsensus: boolean;
    roles: string[];
  };
}

/**
 * Response data structure
 */
interface QuestionResponse {
  value: any;
  context?: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  confidence?: number;
  teamResponses?: Array<{
    userId: string;
    userName: string;
    value: any;
    context?: string;
    timestamp: Date;
  }>;
}

/**
 * Props for the enhanced question component
 */
interface AIReadinessQuestionProps {
  question: AIReadinessQuestion;
  response?: QuestionResponse;
  onResponseChange: (questionId: string, response: QuestionResponse) => void;
  isTeamMode?: boolean;
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  disabled?: boolean;
  showValidation?: boolean;
}

export function AIReadinessQuestion({
  question,
  response,
  onResponseChange,
  isTeamMode = false,
  currentUser,
  teamMembers = [],
  disabled = false,
  showValidation = true
}: AIReadinessQuestionProps) {
  const [showContext, setShowContext] = useState(false);
  const [contextValue, setContextValue] = useState(response?.context || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [confidence, setConfidence] = useState(response?.confidence || 5);

  // Validation function
  const validateResponse = (value: any): string | null => {
    if (!question.validationRules) return null;
    
    const rules = question.validationRules;
    
    if (rules.required && (!value || value === '')) {
      return 'This field is required';
    }
    
    if (question.type === 'text' && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum ${rules.minLength} characters required`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum ${rules.maxLength} characters allowed`;
      }
    }
    
    if (question.type === 'numeric' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Minimum value is ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Maximum value is ${rules.max}`;
      }
    }
    
    return null;
  };

  // Handle response change with validation
  const handleResponseChange = (value: any) => {
    const error = validateResponse(value);
    setValidationError(error);
    
    const newResponse: QuestionResponse = {
      value,
      context: contextValue,
      timestamp: new Date(),
      userId: currentUser?.id,
      userName: currentUser?.name,
      confidence: confidence,
      ...(isTeamMode && response?.teamResponses && {
        teamResponses: response.teamResponses
      })
    };
    
    onResponseChange(question.id, newResponse);
  };

  // Handle context change
  const handleContextChange = (context: string) => {
    setContextValue(context);
    if (response) {
      const updatedResponse: QuestionResponse = {
        ...response,
        context,
        timestamp: new Date()
      };
      onResponseChange(question.id, updatedResponse);
    }
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    handleResponseChange([...uploadedFiles, ...fileArray]);
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    handleResponseChange(newFiles);
  };

  // Render team responses for collaborative questions
  const renderTeamResponses = () => {
    if (!isTeamMode || !response?.teamResponses) return null;
    
    return (
      <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Responses ({response.teamResponses.length})
        </h4>
        <div className="space-y-3">
          {response.teamResponses.map((teamResponse, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-slate-300">
                  {teamResponse.userName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-200">
                    {teamResponse.userName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {teamResponse.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-slate-300">
                  {question.type === 'multiple-choice' || question.type === 'likert'
                    ? question.options?.find(opt => opt.value === teamResponse.value)?.label || teamResponse.value
                    : teamResponse.value
                  }
                </div>
                {teamResponse.context && (
                  <div className="mt-2 text-xs text-slate-400 italic">
                    "{teamResponse.context}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render confidence slider for subjective questions
  const renderConfidenceSlider = () => {
    if (question.type === 'upload' || question.type === 'numeric') return null;
    
    return (
      <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Response Confidence</span>
          <span className="text-sm font-medium text-slate-200">{confidence}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Low confidence</span>
          <span>High confidence</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                {question.section}
              </Badge>
              {question.tierMinimum && (
                <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                  {question.tierMinimum}
                </Badge>
              )}
              {isTeamMode && question.teamInput && (
                <Badge variant="outline" className="text-green-400 border-green-400/50">
                  <Users className="h-3 w-3 mr-1" />
                  Team
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-relaxed text-slate-100">
              {question.question}
            </CardTitle>
            {question.helpText && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-blue-500/10 rounded border border-blue-400/30">
                <HelpCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300">{question.helpText}</p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question Response Input */}
        <div className="space-y-3">
          {question.type === 'multiple-choice' && (
            <RadioGroup
              value={response?.value || ''}
              onValueChange={disabled ? () => {} : handleResponseChange}
            >
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-slate-600/50 hover:bg-slate-700/30 transition-colors">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value} 
                      className="mt-1" 
                    />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 text-sm leading-relaxed cursor-pointer text-slate-200"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {question.type === 'likert' && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <RadioGroup
                value={response?.value || ''}
                onValueChange={disabled ? () => {} : handleResponseChange}
                className="flex justify-between"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center space-y-2">
                    <RadioGroupItem 
                      value={value.toString()} 
                      id={`${question.id}-${value}`}
                    />
                    <Label 
                      htmlFor={`${question.id}-${value}`}
                      className="text-xs text-slate-400 cursor-pointer"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {question.type === 'text' && (
            <Textarea
              value={response?.value || ''}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Enter your response..."
              disabled={disabled}
              className="min-h-[120px] bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
            />
          )}

          {question.type === 'numeric' && (
            <Input
              type="number"
              value={response?.value || ''}
              onChange={(e) => handleResponseChange(Number(e.target.value))}
              placeholder="Enter a number..."
              disabled={disabled}
              min={question.validationRules?.min}
              max={question.validationRules?.max}
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
            />
          )}

          {question.type === 'upload' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 mb-2">
                  Drop files here or click to upload
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id={`upload-${question.id}`}
                  disabled={disabled}
                />
                <label
                  htmlFor={`upload-${question.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Choose Files
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded border border-slate-600/50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-200">{file.name}</span>
                        <span className="text-xs text-slate-400">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Validation Error */}
        <AnimatePresence>
          {showValidation && validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confidence Slider */}
        {renderConfidenceSlider()}

        {/* Context Input */}
        {question.enableContext && (
          <div className="space-y-3">
            <button
              onClick={() => setShowContext(!showContext)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              {showContext ? 'Hide' : 'Add'} Additional Context
            </button>
            
            <AnimatePresence>
              {showContext && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {question.contextPrompt && (
                    <p className="text-sm text-slate-400">{question.contextPrompt}</p>
                  )}
                  <Textarea
                    value={contextValue}
                    onChange={(e) => handleContextChange(e.target.value)}
                    placeholder="Provide additional context or clarification..."
                    className="min-h-[80px] bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Team Responses */}
        {renderTeamResponses()}

        {/* Response Status */}
        {response && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>
              Answered {response.timestamp.toLocaleString()}
              {response.userName && ` by ${response.userName}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
