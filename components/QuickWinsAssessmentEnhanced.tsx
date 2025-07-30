'use client';

// Enhanced QuickWinsAssessment Component with Team Collaboration
import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Lightbulb,
  Target,
  Zap,
  BarChart3,
  Sparkles,
  Users,
  Mail,
  UserPlus,
  Eye,
  PieChart,
  MessageSquare
} from 'lucide-react';
import { 
  QUICK_WINS_QUESTIONS, 
  QuickWinsAlgorithm, 
  QuickWinsResult
} from '@/data/quickWinsQuestions';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'invited' | 'completed' | 'in_progress';
  answers?: Record<string, number>;
}

interface QuickWinsAssessmentProps {
  onComplete?: (results: QuickWinsResult[]) => void;
  onUpgrade?: () => void;
}

export default function QuickWinsAssessmentEnhanced({ onComplete, onUpgrade }: QuickWinsAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<QuickWinsResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Team collaboration state
  const [teamMode, setTeamMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamResults, setTeamResults] = useState<Record<string, QuickWinsResult[]>>({});
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [activeTab, setActiveTab] = useState<'individual' | 'team' | 'comparison'>('individual');

  const currentQuestion = QUICK_WINS_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUICK_WINS_QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUICK_WINS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment complete
      const assessmentResults = QuickWinsAlgorithm.calculateResults(newAnswers);
      setResults(assessmentResults);
      setIsComplete(true);
      setTimeout(() => setShowResults(true), 500);
      onComplete?.(assessmentResults);
      // Send results via email if user stored
      const stored = localStorage.getItem('quickWinsUser');
      if (stored) {
        const { email, name } = JSON.parse(stored);
        fetch('/api/quick-wins/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, results: assessmentResults }),
        }).catch(err => console.error('Report send failed:', err));
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Team collaboration functions
  const inviteTeamMember = async () => {
    if (!newMemberEmail || !newMemberName) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole || 'Team Member',
      status: 'invited'
    };

    setTeamMembers([...teamMembers, newMember]);
    
    // In a real app, this would send an email invitation
    console.log(`Invitation sent to ${newMemberEmail}`);
    
    // Clear form
    setNewMemberEmail('');
    setNewMemberName('');
    setNewMemberRole('');
  };

  const simulateTeamMemberCompletion = (memberId: string) => {
    // Simulate a team member completing the assessment with slightly different answers
    const simulatedAnswers: Record<string, number> = {};
    QUICK_WINS_QUESTIONS.forEach(q => {
      // Add some variation to answers for realistic team perspective differences
      const baseAnswer = answers[q.id] || Math.floor(Math.random() * (q.type === 'rating' ? 5 : 4)) + 1;
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      simulatedAnswers[q.id] = Math.max(1, Math.min(q.type === 'rating' ? 5 : 4, baseAnswer + variation));
    });

    const memberResults = QuickWinsAlgorithm.calculateResults(simulatedAnswers);
    setTeamResults(prev => ({ ...prev, [memberId]: memberResults }));
    
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: 'completed', answers: simulatedAnswers }
        : member
    ));
  };

  const calculateTeamAverageResults = (): QuickWinsResult[] => {
    const allResults = [results, ...Object.values(teamResults)];
    if (allResults.length === 0) return [];

    const categories = ['Organizational Structure', 'Process Efficiency', 'Technology & Systems', 'Cost Management'];
    
    return categories.map(category => {
      const categoryResults = allResults.map(resultSet => 
        resultSet.find(r => r.category === category)
      ).filter(Boolean);

      if (categoryResults.length === 0) {
        return {
          category,
          percentage: 0,
          score: 0,
          maxScore: 100,
          recommendations: [],
          potentialSavings: { annual: '$0', timeReduction: '0%' }
        };
      }

      const avgPercentage = Math.round(
        categoryResults.reduce((sum, r) => sum + r!.percentage, 0) / categoryResults.length
      );

      // Combine unique recommendations
      const allRecommendations = categoryResults.flatMap(r => r!.recommendations);
      const uniqueRecommendations = [...new Set(allRecommendations)];

      // Average potential savings (simplified for demo)
      const avgAnnual = categoryResults.reduce((sum, r) => {
        const amount = parseInt(r!.potentialSavings.annual.replace(/[^0-9]/g, '')) || 0;
        return sum + amount;
      }, 0) / categoryResults.length;

      return {
        category,
        percentage: avgPercentage,
        score: avgPercentage,
        maxScore: 100,
        recommendations: uniqueRecommendations.slice(0, 5),
        potentialSavings: {
          annual: `$${Math.round(avgAnnual).toLocaleString()}`,
          timeReduction: `${Math.round(avgPercentage * 0.3)}%`
        }
      };
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'structure': Target,
      'efficiency': Zap,
      'technology': BarChart3,
      'costs': DollarSign
    };
    return iconMap[category as keyof typeof iconMap] || Lightbulb;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      'structure': 'from-blue-500 to-indigo-500',
      'efficiency': 'from-green-500 to-emerald-500',
      'technology': 'from-purple-500 to-violet-500',
      'costs': 'from-orange-500 to-red-500'
    };
    return colorMap[category as keyof typeof colorMap] || 'from-gray-500 to-slate-500';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 70) return 'Strong';
    if (percentage >= 40) return 'Moderate';
    return 'Needs Attention';
  };

  // Helper function to render results content
  const renderResultsContent = (resultsData: QuickWinsResult[], insights: any, avgScore: number, prefix: string) => {
    return (
      <>
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{prefix} Assessment Score</h3>
                <Badge className={`text-lg px-4 py-2 ${getScoreColor(avgScore)}`}>
                  {Math.round(avgScore)}% - {getScoreLabel(avgScore)}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-slate-700">Potential Annual Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{insights.totalPotentialSavings}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-slate-700">Top Priority Area</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{insights.topPriority}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {resultsData.map((result, index) => {
            const Icon = getCategoryIcon(result.category.toLowerCase().split(' ')[0]);
            const colorClass = getCategoryColor(result.category.toLowerCase().split(' ')[0]);
            
            return (
              <motion.div
                key={result.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{result.category}</CardTitle>
                      </div>
                      <Badge className={`${getScoreColor(result.percentage)} border`}>
                        {result.percentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={result.percentage} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 text-green-600 mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">Annual Savings</span>
                          </div>
                          <p className="text-slate-700">{result.potentialSavings.annual}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-blue-600 mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Time Reduction</span>
                          </div>
                          <p className="text-slate-700">{result.potentialSavings.timeReduction}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Quick Wins
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-600">
                          {result.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </>
    );
  };

  if (isComplete && showResults) {
    const overallInsights = QuickWinsAlgorithm.getOverallInsights(results);
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
    const teamAverageResults = calculateTeamAverageResults();
    const hasTeamData = teamMode && Object.keys(teamResults).length > 0;

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {teamMode && hasTeamData ? 'Your Team Quick Wins Results' : 'Your Quick Wins Results'}
          </h1>
          <p className="text-lg text-slate-600">
            {teamMode && hasTeamData 
              ? `Collaborative insights from ${teamMembers.filter(m => m.status === 'completed').length + 1} team member${teamMembers.filter(m => m.status === 'completed').length > 0 ? 's' : ''}`
              : 'Immediate improvement opportunities identified'
            }
          </p>
        </motion.div>

        {/* Team Results Tabs */}
        {teamMode && hasTeamData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Your Results
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Average
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="mt-6">
                {renderResultsContent(results, overallInsights, averageScore, "Your")}
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                {renderResultsContent(teamAverageResults, QuickWinsAlgorithm.getOverallInsights(teamAverageResults), teamAverageResults.reduce((sum, r) => sum + r.percentage, 0) / teamAverageResults.length, "Team")}
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                <div className="grid gap-6">
                  <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        Team Perspective Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Organizational Structure', 'Process Efficiency', 'Technology & Systems', 'Cost Management'].map((category) => {
                          const myScore = results.find(r => r.category === category)?.percentage || 0;
                          const teamScore = teamAverageResults.find(r => r.category === category)?.percentage || 0;
                          const difference = teamScore - myScore;
                          
                          return (
                            <div key={category} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800">{category}</h4>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-slate-600">You: {myScore}%</span>
                                  <span className="text-sm text-slate-600">Team: {teamScore}%</span>
                                </div>
                              </div>
                              <Badge 
                                variant={Math.abs(difference) <= 5 ? 'secondary' : difference > 0 ? 'default' : 'destructive'}
                                className="ml-2"
                              >
                                {difference > 0 ? '+' : ''}{Math.round(difference)}%
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Single Results View (when no team data) */}
        {(!teamMode || !hasTeamData) && (
          renderResultsContent(results, overallInsights, averageScore, "Your")
        )}

        {/* Call to Action - Always show at the end */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready for the Complete Analysis?</h3>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                Based on your {Math.round(averageScore)}% organizational efficiency score, our <strong>Express Diagnostic</strong> can 
                provide detailed analysis and strategic recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/api/stripe/create-tier-checkout?tier=express-diagnostic'}
                  size="lg"
                  className="bg-yellow-400 text-slate-800 hover:bg-yellow-300 px-8 py-3 text-lg font-semibold"
                >
                  Get Express Diagnostic - $2,495
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={onUpgrade}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 px-8 py-3"
                >
                  View All Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Assessment Complete!</h2>
          <p className="text-slate-600">Analyzing your responses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Team Mode Toggle */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Team Collaboration Mode</h3>
                    <p className="text-sm text-slate-600">
                      {teamMode 
                        ? "Get multiple perspectives from your team members" 
                        : "Enable to invite team members for collaborative assessment"
                      }
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={teamMode}
                  onCheckedChange={(checked) => setTeamMode(checked)}
                />
              </div>
              
              {teamMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-purple-200"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Invite Team Members
                      </h4>
                      <div className="space-y-2">
                        <Input
                          placeholder="Name"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Role (optional)"
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="text-sm"
                        />
                        <Button 
                          onClick={inviteTeamMember}
                          size="sm"
                          className="w-full"
                          disabled={!newMemberEmail || !newMemberName}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team Members ({teamMembers.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{member.name}</p>
                              <p className="text-xs text-slate-600">{member.role}</p>
                            </div>
                            <Badge 
                              variant={member.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {member.status === 'completed' ? '✓' : member.status === 'in_progress' ? '...' : '✉️'}
                            </Badge>
                            {member.status === 'invited' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => simulateTeamMemberCompletion(member.id)}
                                className="text-xs p-1 h-6"
                              >
                                Simulate
                              </Button>
                            )}
                          </div>
                        ))}
                        {teamMembers.length === 0 && (
                          <p className="text-sm text-slate-500 text-center py-2">
                            No team members invited yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">
            {teamMode ? 'Team ' : ''}Assessment
          </h1>
          <Badge variant="outline" className="text-sm">
            {currentQuestionIndex + 1} of {QUICK_WINS_QUESTIONS.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-slate-600 mt-2">
          {Math.round(progress)}% complete • ~{Math.ceil((QUICK_WINS_QUESTIONS.length - currentQuestionIndex - 1) * 0.5)} minutes remaining
        </p>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-gradient-to-r ${getCategoryColor(currentQuestion.category)} rounded-lg`}>
                  {(() => {
                    const Icon = getCategoryIcon(currentQuestion.category);
                    return <Icon className="h-5 w-5 text-white" />;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.description && (
                    <p className="text-sm text-slate-600 mt-2">{currentQuestion.description}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left p-4 h-auto justify-start hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => handleAnswer(index + 1)}
                    >
                      <span className="w-6 h-6 border border-slate-300 rounded-full mr-3 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Rate from 1 (Poor) to 5 (Excellent)</p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => handleAnswer(rating)}
                      >
                        {rating}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-slate-500 flex items-center">
          Press any option to continue
        </div>
      </div>
    </div>
  );
}
