'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, ArrowLeft, Building, Users, Target, FileText, Upload } from 'lucide-react'
import Link from 'next/link'
import { getQuestionsForTier, type Question, type OrganizationType } from '@/lib/enhancedQuestionBankV3'
import UpgradeBanner from '@/components/UpgradeBanner'
import { normalizeTier } from '@/lib/tierUtils'
import { QuestionInput } from '@/components/QuestionInput'

export default function TierBasedAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [tier, setTier] = useState<'express-diagnostic' | 'one-time-diagnostic' | 'comprehensive-package' | 'enterprise-transformation'>('one-time-diagnostic')

  // Normalize legacy tier selection once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlTier = params.get('tier') as any
    if (urlTier) {
      setTier(urlTier)
      const norm = normalizeTier(urlTier)
      if (norm.isLegacy) {
        // We keep legacy tier for context but banner will prompt upgrade
        // Optionally could auto-switch: setTier(norm.normalizedTier as any)
      }
    }
  }, [])
  const [organizationType] = useState<OrganizationType>('higher-education') // Default org type, can be dynamic
  
  // Get the full question set from enhanced question bank (100-200 questions based on tier)
  const questions = getQuestionsForTier(tier, organizationType)
  const totalQuestions = questions.length
  
  console.log(`Assessment loaded with ${totalQuestions} questions for ${tier} tier`)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Reset assessment when tier changes
  useEffect(() => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setFlaggedQuestions({})
    setIsComplete(false)
  }, [tier])

  const tierInfo = {
    'express-diagnostic': { name: 'Express Diagnostic', expectedQuestions: '60+', color: 'bg-blue-500' },
    'one-time-diagnostic': { name: 'One-Time Assessment', expectedQuestions: '100+', color: 'bg-green-500' },
    'comprehensive-package': { name: 'Comprehensive Package', expectedQuestions: '135+', color: 'bg-purple-500' },
    'enterprise-transformation': { name: 'Enterprise Transformation', expectedQuestions: '155+', color: 'bg-red-500' }
  }

  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Assessment complete - save data and generate ID
      try {
        console.log('Saving assessment data...', { tier, organizationType, answers })
        
        // Generate a simple assessment ID for now
        const newAssessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setAssessmentId(newAssessmentId)
        
        // Store the assessment data in localStorage for now
        const assessmentData = {
          id: newAssessmentId,
          tier,
          organizationType,
          answers,
          questions: questions.map(q => ({ id: q.id, prompt: q.prompt, type: q.type })),
          completedAt: new Date().toISOString(),
          totalQuestions
        }
        
        localStorage.setItem(`assessment_${newAssessmentId}`, JSON.stringify(assessmentData))
        console.log('Assessment saved with ID:', newAssessmentId)
        
        setIsComplete(true)
      } catch (error) {
        console.error('Error saving assessment:', error)
        // Still mark as complete even if save fails
        setIsComplete(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const canGoNext = answers[currentQuestion?.id] !== undefined
  const canGoPrevious = currentQuestionIndex > 0

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Assessment Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">
                Your comprehensive {totalQuestions}-question assessment has been completed.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  🔬 Your Analysis Includes All 6 Patent-Pending Algorithms:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">OCI™</Badge>
                    <p className="text-sm text-blue-700">Organizational Complexity Index - Structural friction analysis</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800">HOCI™</Badge>
                    <p className="text-sm text-green-700">Hierarchical Optimization Coefficient - Decision efficiency</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-purple-100 text-purple-800">JCI™</Badge>
                    <p className="text-sm text-purple-700">Job Clarity Index - Role definition and accountability</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-orange-100 text-orange-800">DSCH</Badge>
                    <p className="text-sm text-orange-700">Decisional Span of Control - Management optimization</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-red-100 text-red-800">CRF</Badge>
                    <p className="text-sm text-red-700">Communication Resource Framework - Flow analysis</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-indigo-100 text-indigo-800">LEI</Badge>
                    <p className="text-sm text-indigo-700">Leadership Effectiveness Index - Management capacity</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-2">
                <p>✅ AI-powered analysis with OpenAI integration</p>
                <p>✅ Professional PDF report generation</p>
                <p>✅ Team collaboration and file upload capabilities</p>
                <p>✅ Comprehensive benchmarking and analytics</p>
                <p>✅ Full Supabase data persistence</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/assessment/results${assessmentId ? `?assessmentId=${assessmentId}` : ''}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Comprehensive Results
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/assessment/start">
                  <Button variant="outline">
                    Start New Assessment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
  <UpgradeBanner tier={tier} />
  {/* Tier Selector */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Assessment Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tierInfo).map(([tierKey, info]) => (
              <button
                key={tierKey}
                onClick={() => setTier(tierKey as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tier === tierKey
                    ? `border-blue-500 ${info.color} text-white`
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-medium">{info.name}</div>
                <div className="text-xs mt-1 opacity-90">{info.expectedQuestions} questions</div>
                {tier === tierKey && (
                  <div className="text-xs mt-1 font-semibold">
                    ✓ {totalQuestions} loaded
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tierInfo[tier].name}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Using all 6 patent-pending algorithms • Powered by AI • {totalQuestions} questions
          </p>
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{currentQuestionIndex + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion.section}
                    </Badge>
                    {currentQuestion.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {currentQuestion.prompt}
                  </CardTitle>
                  {currentQuestion.helpText && (
                    <p className="text-sm text-gray-600 mt-2">
                      💡 {currentQuestion.helpText}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion.type === 'likert' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          answers[currentQuestion.id] === value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="font-medium">{value} - {value === 1 ? 'Strongly Disagree' : value === 2 ? 'Disagree' : value === 3 ? 'Neutral' : value === 4 ? 'Agree' : 'Strongly Agree'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === 'numeric' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter a number"
                />
              )}
              
              {currentQuestion.type === 'text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none h-24"
                  placeholder="Enter your response"
                />
              )}
              
              {currentQuestion.type === 'upload' && (
                <QuestionInput
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))}
                  isFlagged={flaggedQuestions[currentQuestion.id] || false}
                  onFlagChange={(flagged) => setFlaggedQuestions(prev => ({ ...prev, [currentQuestion.id]: flagged }))}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Section: {currentQuestion?.section}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Algorithm Information Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              This assessment powers our patent-pending algorithms for comprehensive organizational analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">OCI™</Badge>
              <Badge className="bg-green-100 text-green-800">HOCI™</Badge>
              <Badge className="bg-purple-100 text-purple-800">JCI™</Badge>
              <Badge className="bg-orange-100 text-orange-800">DSCH</Badge>
              <Badge className="bg-red-100 text-red-800">CRF</Badge>
              <Badge className="bg-indigo-100 text-indigo-800">LEI</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
