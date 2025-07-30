'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, ArrowLeft, Building, Users, Target } from 'lucide-react'
import Link from 'next/link'

export default function TierBasedAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const assessmentSteps = [
    {
      title: "Organizational Structure",
      icon: <Building className="w-6 h-6" />,
      questions: [
        {
          id: "structure_clarity",
          text: "How clear are reporting relationships in your organization?",
          type: "scale",
          options: [
            { value: 1, label: "Very unclear" },
            { value: 2, label: "Somewhat unclear" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Somewhat clear" },
            { value: 5, label: "Very clear" }
          ]
        }
      ]
    },
    {
      title: "Team Dynamics",
      icon: <Users className="w-6 h-6" />,
      questions: [
        {
          id: "team_collaboration",
          text: "How effectively do teams collaborate across departments?",
          type: "scale",
          options: [
            { value: 1, label: "Very ineffective" },
            { value: 2, label: "Somewhat ineffective" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Somewhat effective" },
            { value: 5, label: "Very effective" }
          ]
        }
      ]
    },
    {
      title: "Strategic Alignment",
      icon: <Target className="w-6 h-6" />,
      questions: [
        {
          id: "strategy_alignment",
          text: "How aligned are day-to-day operations with strategic goals?",
          type: "scale",
          options: [
            { value: 1, label: "Not aligned" },
            { value: 2, label: "Slightly aligned" },
            { value: 3, label: "Moderately aligned" },
            { value: 4, label: "Well aligned" },
            { value: 5, label: "Perfectly aligned" }
          ]
        }
      ]
    }
  ]

  const progress = ((currentStep + 1) / assessmentSteps.length) * 100

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentQuestion = () => assessmentSteps[currentStep]?.questions[0]
  const currentAnswer = getCurrentQuestion() ? answers[getCurrentQuestion().id] : null

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Assessment Complete!
              </CardTitle>
              <p className="text-gray-600">
                We're analyzing your responses with our proprietary algorithms
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AI analysis using OCI™ algorithm
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Personalized recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detailed insights report
                  </li>
                </ul>
              </div>
              
              <Link href="/assessment/results" className="w-full block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg">
                  View Your Results
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Step {currentStep + 1} of {assessmentSteps.length}
            </Badge>
            <span className="text-sm text-gray-500 font-medium">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                {assessmentSteps[currentStep]?.icon}
              </div>
              <div>
                <Badge variant="outline" className="mb-2">
                  {assessmentSteps[currentStep]?.title}
                </Badge>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  {getCurrentQuestion()?.text}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getCurrentQuestion()?.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(getCurrentQuestion().id, option.value)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {currentAnswer === option.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg"
          >
            {currentStep === assessmentSteps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
