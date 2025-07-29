// Quick Wins Assessment - Free Demo Version
// Provides immediate value while showcasing full assessment capabilities

export interface QuickWinsQuestion {
  id: string;
  type: 'multiple-choice' | 'rating' | 'boolean';
  category: 'structure' | 'efficiency' | 'technology' | 'costs';
  question: string;
  options?: string[];
  weight: number; // Impact weight for scoring
  description?: string;
}

export interface QuickWinsResult {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: string[];
  potentialSavings: {
    annual: string;
    timeReduction: string;
  };
}

export const QUICK_WINS_QUESTIONS: QuickWinsQuestion[] = [
  // Organizational Structure (3 questions)
  {
    id: 'org_layers',
    type: 'multiple-choice',
    category: 'structure',
    question: 'How many management layers exist between front-line staff and the CEO?',
    options: ['2-3 layers', '4-5 layers', '6-7 layers', '8+ layers'],
    weight: 10,
    description: 'Excessive layers can slow decision-making and increase costs'
  },
  {
    id: 'role_clarity',
    type: 'rating',
    category: 'structure',
    question: 'How clearly defined are job roles and responsibilities? (1-5 scale)',
    weight: 8,
    description: 'Clear roles reduce overlap and improve efficiency'
  },
  {
    id: 'decision_speed',
    type: 'multiple-choice',
    category: 'structure',
    question: 'How long does it typically take to get approval for a $1,000 expense?',
    options: ['Same day', '2-3 days', '1 week', '2+ weeks'],
    weight: 9,
    description: 'Decision speed impacts operational agility'
  },

  // Process Efficiency (3 questions)
  {
    id: 'manual_processes',
    type: 'multiple-choice',
    category: 'efficiency',
    question: 'What percentage of your routine tasks are still done manually?',
    options: ['0-20% (Most tasks are automated)', '20-40% (Many tasks automated)', '40-60% (Some automation)', '60-80% (Limited automation)', '80-100% (Mostly manual)'],
    weight: 10,
    description: 'Manual processes are prime candidates for automation'
  },
  {
    id: 'meeting_efficiency',
    type: 'multiple-choice',
    category: 'efficiency',
    question: 'How much time does your team spend in meetings per week?',
    options: ['Less than 10 hours', '10-20 hours', '20-30 hours', 'More than 30 hours'],
    weight: 7,
    description: 'Excessive meetings reduce productive work time'
  },
  {
    id: 'duplicate_work',
    type: 'multiple-choice',
    category: 'efficiency',
    question: 'How much duplicate work occurs across departments?',
    options: ['Very little - roles are clearly separated', 'Some overlap in routine tasks', 'Frequent duplication of efforts', 'Significant waste from duplicate work'],
    weight: 9,
    description: 'Duplicate efforts waste resources and time'
  },

  // Technology & Systems (3 questions)
  {
    id: 'system_integration',
    type: 'rating',
    category: 'technology',
    question: 'How well do your different software systems communicate with each other? (1-5 scale)',
    weight: 8,
    description: 'Poor integration leads to data silos and inefficiency'
  },
  {
    id: 'data_access',
    type: 'multiple-choice',
    category: 'technology',
    question: 'How long does it take to generate a basic performance report?',
    options: ['Minutes', '1-2 hours', 'Half a day', 'Multiple days'],
    weight: 7,
    description: 'Quick data access enables faster decision-making'
  },
  {
    id: 'automation_level',
    type: 'multiple-choice',
    category: 'technology',
    question: 'What percentage of your routine tasks are automated?',
    options: ['Most tasks (80%+) are automated', 'Many tasks (60-80%) are automated', 'Some tasks (30-60%) are automated', 'Few tasks (less than 30%) are automated'],
    weight: 9,
    description: 'Automation reduces errors and frees up human resources'
  },

  // Cost Management (3 questions)
  {
    id: 'vendor_management',
    type: 'multiple-choice',
    category: 'costs',
    question: 'How often do you review and renegotiate vendor contracts?',
    options: ['Quarterly or more often', 'Annually', 'Every 2-3 years', 'Rarely or never'],
    weight: 8,
    description: 'Regular vendor reviews can uncover significant savings'
  },
  {
    id: 'resource_utilization',
    type: 'multiple-choice',
    category: 'costs',
    question: 'What percentage of your office space/resources are actively used?',
    options: ['90-100%', '70-89%', '50-69%', 'Less than 50%'],
    weight: 7,
    description: 'Underutilized resources represent hidden costs'
  },
  {
    id: 'process_waste',
    type: 'multiple-choice',
    category: 'costs',
    question: 'How streamlined are your approval processes?',
    options: ['Very efficient - minimal delays', 'Mostly efficient with some bottlenecks', 'Moderately efficient but could improve', 'Slow and bureaucratic with many delays'],
    weight: 9,
    description: 'Streamlining processes can yield immediate savings'
  }
];

// Scoring and recommendation logic
export class QuickWinsAlgorithm {
  static calculateResults(answers: Record<string, number>): QuickWinsResult[] {
    const categories = ['structure', 'efficiency', 'technology', 'costs'];
    const results: QuickWinsResult[] = [];

    categories.forEach(category => {
      const categoryQuestions = QUICK_WINS_QUESTIONS.filter(q => q.category === category);
      let totalScore = 0;
      let maxScore = 0;

      categoryQuestions.forEach(question => {
        const answer = answers[question.id] || 0;
        const normalizedScore = this.normalizeScore(question, answer);
        totalScore += normalizedScore * question.weight;
        maxScore += 5 * question.weight; // Max normalized score is 5
      });

      const percentage = Math.round((totalScore / maxScore) * 100);
      
      results.push({
        category: this.getCategoryName(category),
        score: totalScore,
        maxScore,
        percentage,
        recommendations: this.getRecommendations(category, percentage),
        potentialSavings: this.calculateSavings(category, percentage)
      });
    });

    return results;
  }

  private static normalizeScore(question: QuickWinsQuestion, answer: number): number {
    if (question.type === 'rating') {
      return 6 - answer; // Invert rating so 1 becomes 5 (better)
    }
    
    if (question.type === 'multiple-choice') {
      // First option is best (5 points), last is worst (1 point)
      const optionCount = question.options?.length || 4;
      return optionCount + 1 - answer;
    }
    
    return answer;
  }

  private static getCategoryName(category: string): string {
    const names = {
      'structure': 'Organizational Structure',
      'efficiency': 'Process Efficiency',
      'technology': 'Technology & Systems',
      'costs': 'Cost Management'
    };
    return names[category as keyof typeof names] || category;
  }

  private static getRecommendations(category: string, percentage: number): string[] {
    const recommendationMap = {
      structure: {
        high: [
          "Continue maintaining clear organizational hierarchy",
          "Document and standardize decision-making processes",
          "Consider cross-training for key roles"
        ],
        medium: [
          "Flatten management layers where possible",
          "Clarify roles and responsibilities across departments",
          "Implement faster approval processes for routine decisions"
        ],
        low: [
          "Conduct organizational restructuring assessment",
          "Define clear job descriptions and accountability measures",
          "Establish streamlined decision-making protocols"
        ]
      },
      efficiency: {
        high: [
          "Maintain current process optimization efforts",
          "Look for emerging automation opportunities",
          "Share best practices across teams"
        ],
        medium: [
          "Identify and eliminate redundant processes",
          "Implement meeting efficiency protocols",
          "Standardize common workflows"
        ],
        low: [
          "Conduct comprehensive process mapping",
          "Eliminate duplicate work across departments",
          "Implement time-tracking for key activities"
        ]
      },
      technology: {
        high: [
          "Continue investing in system integration",
          "Explore AI and advanced automation opportunities",
          "Maintain robust data governance"
        ],
        medium: [
          "Improve system integration and data flow",
          "Implement automated reporting dashboards",
          "Standardize software tools across departments"
        ],
        low: [
          "Audit current technology stack for redundancies",
          "Implement integrated business management system",
          "Automate manual data entry and reporting processes"
        ]
      },
      costs: {
        high: [
          "Maintain current cost management practices",
          "Explore strategic partnerships for cost reduction",
          "Implement predictive cost analysis"
        ],
        medium: [
          "Establish regular vendor review cycles",
          "Optimize space and resource utilization",
          "Implement cost-benefit analysis for new initiatives"
        ],
        low: [
          "Conduct comprehensive vendor audit and renegotiation",
          "Eliminate underutilized resources and subscriptions",
          "Implement strict budget controls and approval processes"
        ]
      }
    };

    const level = percentage >= 70 ? 'high' : percentage >= 40 ? 'medium' : 'low';
    return recommendationMap[category as keyof typeof recommendationMap]?.[level] || [];
  }

  private static calculateSavings(category: string, percentage: number): { annual: string; timeReduction: string } {
    // Conservative estimates based on category and current performance
    const savingsMap = {
      structure: {
        high: { annual: '$5,000-15,000', timeReduction: '2-5 hours/week' },
        medium: { annual: '$15,000-40,000', timeReduction: '5-12 hours/week' },
        low: { annual: '$40,000-100,000', timeReduction: '12-25 hours/week' }
      },
      efficiency: {
        high: { annual: '$8,000-20,000', timeReduction: '3-8 hours/week' },
        medium: { annual: '$20,000-50,000', timeReduction: '8-15 hours/week' },
        low: { annual: '$50,000-120,000', timeReduction: '15-30 hours/week' }
      },
      technology: {
        high: { annual: '$10,000-25,000', timeReduction: '4-10 hours/week' },
        medium: { annual: '$25,000-60,000', timeReduction: '10-20 hours/week' },
        low: { annual: '$60,000-150,000', timeReduction: '20-40 hours/week' }
      },
      costs: {
        high: { annual: '$12,000-30,000', timeReduction: '2-6 hours/week' },
        medium: { annual: '$30,000-75,000', timeReduction: '6-12 hours/week' },
        low: { annual: '$75,000-200,000', timeReduction: '12-25 hours/week' }
      }
    };

    const level = percentage >= 70 ? 'high' : percentage >= 40 ? 'medium' : 'low';
    return savingsMap[category as keyof typeof savingsMap]?.[level] || 
           { annual: 'Contact for estimate', timeReduction: 'Contact for estimate' };
  }

  static getOverallInsights(results: QuickWinsResult[]): {
    totalPotentialSavings: string;
    topPriority: string;
    nextSteps: string[];
  } {
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
    const lowestCategory = results.reduce((min, r) => r.percentage < min.percentage ? r : min, results[0]);
    
    return {
      totalPotentialSavings: this.estimateOverallSavings(averageScore),
      topPriority: lowestCategory.category,
      nextSteps: [
        "Schedule a comprehensive organizational assessment",
        `Focus immediately on ${lowestCategory.category.toLowerCase()} improvements`,
        "Implement quick wins identified in this analysis",
        "Track progress with key performance indicators"
      ]
    };
  }

  private static estimateOverallSavings(averageScore: number): string {
    if (averageScore >= 70) return '$50,000-150,000 annually';
    if (averageScore >= 40) return '$150,000-400,000 annually';
    return '$400,000-1,000,000+ annually';
  }
}
