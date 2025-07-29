'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Building2, Users } from 'lucide-react';
import { aiReadinessEngine } from '@/lib/aiReadinessEngine';
import type { AIReadinessResponse } from '@/lib/aiReadinessEngine';

interface AIReadinessFormData {
  institutionName: string;
  institutionType: string;
  enrollmentSize: string;
  responses: { [questionId: string]: string };
}

interface AIReadinessFormProps {
  onComplete: (data: AIReadinessFormData, responses: AIReadinessResponse[]) => void;
}

export function AIReadinessForm({ onComplete }: AIReadinessFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AIReadinessFormData>({
    institutionName: '',
    institutionType: '',
    enrollmentSize: '',
    responses: {}
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AIReadinessFormData>({
    defaultValues: formData
  });

  const questions = aiReadinessEngine.getQuestions();
  const domains = aiReadinessEngine.getDomains();
  const totalSteps = questions.length + 1; // +1 for institution info
  const progress = (currentStep / totalSteps) * 100;

  const institutionTypes = [
    'Public Research University',
    'Private Research University',
    'Public Liberal Arts College',
    'Private Liberal Arts College',
    'Community College',
    'Technical/Vocational School',
    'Graduate School',
    'Online University',
    'Other'
  ];

  const enrollmentSizes = [
    'Under 1,000',
    '1,000 - 5,000',
    '5,001 - 10,000',
    '10,001 - 20,000',
    '20,001 - 30,000',
    'Over 30,000'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
    const newResponses = { ...formData.responses, [questionId]: value };
    setFormData({ ...formData, responses: newResponses });
    setValue(`responses.${questionId}`, value);
  };

  const onSubmit = (data: AIReadinessFormData) => {
    // Convert form responses to scoring format
    const responses: AIReadinessResponse[] = Object.entries(data.responses).map(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.value === value);
      return {
        questionId,
        value,
        score: option?.score || 0
      };
    });

    onComplete(data, responses);
  };

  const getCurrentDomain = () => {
    if (currentStep === 0) return null;
    const currentQuestion = questions[currentStep - 1];
    return domains.find(d => d.id === currentQuestion?.domain);
  };

  const renderInstitutionInfo = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>Institution Information</CardTitle>
            <CardDescription>
              Tell us about your institution to customize your assessment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="institutionName">Institution Name *</Label>
          <Input
            id="institutionName"
            {...register('institutionName', { required: 'Institution name is required' })}
            placeholder="Enter your institution name"
            onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
          />
          {errors.institutionName && (
            <p className="text-sm text-red-600">{errors.institutionName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionType">Institution Type *</Label>
          <RadioGroup
            value={formData.institutionType}
            onValueChange={(value) => {
              setFormData({ ...formData, institutionType: value });
              setValue('institutionType', value);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {institutionTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enrollmentSize">Enrollment Size *</Label>
          <RadioGroup
            value={formData.enrollmentSize}
            onValueChange={(value) => {
              setFormData({ ...formData, enrollmentSize: value });
              setValue('enrollmentSize', value);
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {enrollmentSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={size} />
                  <Label htmlFor={size} className="text-sm">{size}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuestion = () => {
    const question = questions[currentStep - 1];
    const currentDomain = getCurrentDomain();
    
    if (!question) return null;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="mb-2">
              {currentDomain?.name}
            </Badge>
            <span className="text-sm text-gray-500">
              Question {currentStep} of {questions.length}
            </span>
          </div>
          <CardTitle className="text-lg leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.responses[question.id] || ''}
            onValueChange={(value) => handleResponseChange(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 text-sm leading-relaxed cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.institutionName && formData.institutionType && formData.enrollmentSize;
    }
    
    const currentQuestion = questions[currentStep - 1];
    return currentQuestion && formData.responses[currentQuestion.id];
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Readiness Assessment</h1>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Content */}
          {currentStep === 0 ? renderInstitutionInfo() : renderQuestion()}

          {/* Navigation */}
          <div className="max-w-2xl mx-auto mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isLastStep ? (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Complete Assessment
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
