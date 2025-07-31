'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Target, 
  FileText,
  Download,
  Share,
  Building
} from 'lucide-react'
import Link from 'next/link'

interface AnalysisResult {
  summary: {
    overallScore: number;
    readinessLevel: string;
    keyStrengths: string[];
    primaryChallenges: string[];
  };
  sectionScores: {
    [key: string]: {
      score: number;
      level: string;
      description: string;
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
    impact: string;
  }>;
  tier: string;
  organizationType: string;
}

export default function AssessmentResultsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  
  const sessionId = searchParams.get('sessionId')
  const assessmentId = searchParams.get('assessmentId')

  useEffect(() => {
    const fetchResults = async () => {
      if (!sessionId && !assessmentId) {
        setError('No assessment ID or session ID provided')
        setLoading(false)
        return
      }

      try {
        console.log('Fetching results for:', { sessionId, assessmentId })
        
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            assessmentId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Results received:', data)
        setResults(data)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError(err instanceof Error ? err.message : 'Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [sessionId, assessmentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your assessment results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Results</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link href="/assessment/start">
                <Button>Start New Assessment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find results for this assessment.
              </p>
              <Link href="/assessment/start">
                <Button>Start New Assessment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <TrendingUp className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Results
          </h1>
          <p className="text-gray-600">
            Your {results.tier} organizational assessment analysis
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-6 w-6" />
              <span>Overall Assessment Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold flex items-center space-x-2">
                  {getScoreIcon(results.summary.overallScore)}
                  <span className={getScoreColor(results.summary.overallScore)}>
                    {results.summary.overallScore}%
                  </span>
                </div>
                <Badge variant="outline" className="mt-2">
                  {results.summary.readinessLevel} Readiness
                </Badge>
              </div>
              <Progress value={results.summary.overallScore} className="w-1/2" />
            </div>
          </CardContent>
        </Card>

        {/* Section Scores */}
        {results.sectionScores && Object.keys(results.sectionScores).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Section Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.sectionScores).map(([section, data]) => (
                  <div key={section} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{section}</h3>
                      <p className="text-sm text-gray-600">{data.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                        {data.score}%
                      </div>
                      <Badge variant="outline" size="sm">
                        {data.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Key Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.summary.keyStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span>Areas for Improvement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.summary.primaryChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{rec.title}</h3>
                      <div className="flex space-x-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {rec.impact} impact
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share Results</span>
          </Button>
          <Link href="/assessment/start">
            <Button>Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
