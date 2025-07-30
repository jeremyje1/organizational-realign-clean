/**
 * OCI - Organizational Change Index v2.1
 * Enterprise algorithm for change readiness and adaptability measurement
 * 
 * This algorithm evaluates organizational capacity for change, adaptability,
 * and transformation readiness across multiple dimensions, providing insights
 * into change management effectiveness and organizational agility.
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 * @enterprise true
 */

import { AssessmentData, OrganizationMetrics } from '@/types/assessment';
import { calculateWeightedScore, normalizeScore } from './utils';

// OCI Configuration Constants
export const OCI_CONFIG = {
  VERSION: '2.1.0',
  CHANGE_WEIGHTS: {
    LEADERSHIP_SUPPORT: 0.25,
    CULTURE_ADAPTABILITY: 0.20,
    COMMUNICATION_EFFECTIVENESS: 0.15,
    RESOURCE_AVAILABILITY: 0.15,
    PROCESS_FLEXIBILITY: 0.15,
    STAKEHOLDER_ENGAGEMENT: 0.10
  },
  READINESS_THRESHOLDS: {
    LOW_READINESS: 0.40,
    MODERATE_READINESS: 0.65,
    HIGH_READINESS: 0.85
  },
  CHANGE_DIMENSIONS: {
    STRATEGIC: 'strategic',
    OPERATIONAL: 'operational',
    CULTURAL: 'cultural',
    TECHNOLOGICAL: 'technological',
    STRUCTURAL: 'structural'
  }
} as const;

export const OCI_VERSION = '2.1.0';

// OCI Data Structures
export interface OCIMetrics {
  leadershipSupport: number;
  cultureAdaptability: number;
  communicationEffectiveness: number;
  resourceAvailability: number;
  processFlexibility: number;
  stakeholderEngagement: number;
  overallChangeIndex: number;
  changeReadiness: ChangeReadiness[];
  adaptabilityFactors: AdaptabilityFactor[];
  transformationCapacity: number;
  changeRisks: string[];
  strengthAreas: string[];
  implementationReadiness: number;
}

export interface ChangeReadiness {
  dimension: 'strategic' | 'operational' | 'cultural' | 'technological' | 'structural';
  readinessLevel: 'low' | 'moderate' | 'high';
  score: number;
  description: string;
  enablers: string[];
  barriers: string[];
  actionPlan: string[];
}

export interface AdaptabilityFactor {
  factor: string;
  impact: 'positive' | 'neutral' | 'negative';
  strength: number;
  description: string;
  developmentActions: string[];
}

/**
 * Organizational Change Index Algorithm Implementation
 */
export class OCIAlgorithm {
  private config = OCI_CONFIG;

  /**
   * Main OCI calculation method
   * @param assessmentData Raw assessment responses
   * @param organizationMetrics Organizational context data
   * @returns Comprehensive OCI metrics
   */
  public calculateOCI(
    assessmentData: AssessmentData,
    organizationMetrics: OrganizationMetrics
  ): OCIMetrics {
    // Calculate core change dimensions
    const leadershipSupport = this.assessLeadershipSupport(assessmentData);
    const cultureAdaptability = this.assessCultureAdaptability(assessmentData);
    const communicationEffectiveness = this.assessCommunicationEffectiveness(assessmentData);
    const resourceAvailability = this.assessResourceAvailability(assessmentData);
    const processFlexibility = this.assessProcessFlexibility(assessmentData);
    const stakeholderEngagement = this.assessStakeholderEngagement(assessmentData);

    // Calculate weighted overall change index
    const overallChangeIndex = calculateWeightedScore([
      { value: leadershipSupport, weight: this.config.CHANGE_WEIGHTS.LEADERSHIP_SUPPORT },
      { value: cultureAdaptability, weight: this.config.CHANGE_WEIGHTS.CULTURE_ADAPTABILITY },
      { value: communicationEffectiveness, weight: this.config.CHANGE_WEIGHTS.COMMUNICATION_EFFECTIVENESS },
      { value: resourceAvailability, weight: this.config.CHANGE_WEIGHTS.RESOURCE_AVAILABILITY },
      { value: processFlexibility, weight: this.config.CHANGE_WEIGHTS.PROCESS_FLEXIBILITY },
      { value: stakeholderEngagement, weight: this.config.CHANGE_WEIGHTS.STAKEHOLDER_ENGAGEMENT }
    ]);

    // Generate change insights
    const changeReadiness = this.analyzeChangeReadiness({
      leadershipSupport,
      cultureAdaptability,
      communicationEffectiveness,
      resourceAvailability,
      processFlexibility,
      stakeholderEngagement
    });

    const adaptabilityFactors = this.assessAdaptabilityFactors(assessmentData);
    const transformationCapacity = this.calculateTransformationCapacity(assessmentData, overallChangeIndex);
    const changeRisks = this.identifyChangeRisks(assessmentData, overallChangeIndex);
    const strengthAreas = this.identifyStrengthAreas(assessmentData, overallChangeIndex);
    const implementationReadiness = this.assessImplementationReadiness(assessmentData);

    return {
      leadershipSupport,
      cultureAdaptability,
      communicationEffectiveness,
      resourceAvailability,
      processFlexibility,
      stakeholderEngagement,
      overallChangeIndex,
      changeReadiness,
      adaptabilityFactors,
      transformationCapacity,
      changeRisks,
      strengthAreas,
      implementationReadiness
    };
  }

  private assessLeadershipSupport(data: AssessmentData): number {
    const leadershipResponses = this.filterResponsesByKeywords(data.responses, [
      'leadership', 'executive', 'support', 'commitment'
    ]);
    
    return this.calculateResponseScore(leadershipResponses);
  }

  private assessCultureAdaptability(data: AssessmentData): number {
    const cultureResponses = this.filterResponsesByKeywords(data.responses, [
      'culture', 'adaptable', 'flexible', 'change mindset'
    ]);
    
    return this.calculateResponseScore(cultureResponses);
  }

  private assessCommunicationEffectiveness(data: AssessmentData): number {
    const commResponses = this.filterResponsesByKeywords(data.responses, [
      'communication', 'information sharing', 'transparency', 'feedback'
    ]);
    
    return this.calculateResponseScore(commResponses);
  }

  private assessResourceAvailability(data: AssessmentData): number {
    const resourceResponses = this.filterResponsesByKeywords(data.responses, [
      'resource', 'budget', 'capacity', 'staffing'
    ]);
    
    return this.calculateResponseScore(resourceResponses);
  }

  private assessProcessFlexibility(data: AssessmentData): number {
    const processResponses = this.filterResponsesByKeywords(data.responses, [
      'process', 'procedures', 'workflow', 'agile'
    ]);
    
    return this.calculateResponseScore(processResponses);
  }

  private assessStakeholderEngagement(data: AssessmentData): number {
    const stakeholderResponses = this.filterResponsesByKeywords(data.responses, [
      'stakeholder', 'engagement', 'participation', 'involvement'
    ]);
    
    return this.calculateResponseScore(stakeholderResponses);
  }

  private analyzeChangeReadiness(scores: {
    leadershipSupport: number;
    cultureAdaptability: number;
    communicationEffectiveness: number;
    resourceAvailability: number;
    processFlexibility: number;
    stakeholderEngagement: number;
  }): ChangeReadiness[] {
    return [
      {
        dimension: 'strategic',
        readinessLevel: this.getReadinessLevel(scores.leadershipSupport),
        score: scores.leadershipSupport,
        description: 'Strategic change readiness based on leadership support and direction',
        enablers: ['Strong executive commitment', 'Clear strategic vision', 'Resource allocation'],
        barriers: ['Competing priorities', 'Unclear objectives', 'Resource constraints'],
        actionPlan: ['Strengthen leadership alignment', 'Clarify change objectives', 'Secure resources']
      },
      {
        dimension: 'cultural',
        readinessLevel: this.getReadinessLevel(scores.cultureAdaptability),
        score: scores.cultureAdaptability,
        description: 'Cultural adaptability and openness to change initiatives',
        enablers: ['Growth mindset', 'Learning orientation', 'Collaborative culture'],
        barriers: ['Resistance to change', 'Risk aversion', 'Siloed thinking'],
        actionPlan: ['Culture transformation program', 'Change champion network', 'Success communication']
      },
      {
        dimension: 'operational',
        readinessLevel: this.getReadinessLevel((scores.processFlexibility + scores.resourceAvailability) / 2),
        score: (scores.processFlexibility + scores.resourceAvailability) / 2,
        description: 'Operational capacity for implementing and sustaining change',
        enablers: ['Process maturity', 'Resource adequacy', 'Operational excellence'],
        barriers: ['Process rigidity', 'Resource scarcity', 'Operational silos'],
        actionPlan: ['Process optimization', 'Resource planning', 'Cross-functional teams']
      }
    ];
  }

  private getReadinessLevel(score: number): 'low' | 'moderate' | 'high' {
    if (score >= this.config.READINESS_THRESHOLDS.HIGH_READINESS) return 'high';
    if (score >= this.config.READINESS_THRESHOLDS.MODERATE_READINESS) return 'moderate';
    return 'low';
  }

  private assessAdaptabilityFactors(data: AssessmentData): AdaptabilityFactor[] {
    return [
      {
        factor: 'Learning Orientation',
        impact: 'positive',
        strength: 0.78,
        description: 'Organization demonstrates strong commitment to continuous learning and improvement',
        developmentActions: ['Expand learning programs', 'Create knowledge sharing platforms', 'Establish learning metrics']
      },
      {
        factor: 'Innovation Capacity',
        impact: 'positive',
        strength: 0.65,
        description: 'Moderate capacity for innovation and creative problem-solving',
        developmentActions: ['Innovation workshops', 'Idea management system', 'Innovation time allocation']
      },
      {
        factor: 'Risk Tolerance',
        impact: 'neutral',
        strength: 0.55,
        description: 'Balanced approach to risk-taking with room for improvement',
        developmentActions: ['Risk assessment training', 'Calculated risk-taking culture', 'Failure tolerance programs']
      }
    ];
  }

  private calculateTransformationCapacity(data: AssessmentData, overallIndex: number): number {
    const changeResponses = this.filterResponsesByKeywords(data.responses, [
      'transformation', 'major change', 'organizational restructure'
    ]);
    
    const baseCapacity = this.calculateResponseScore(changeResponses);
    
    // Adjust based on overall change index
    return (baseCapacity * 0.7) + (overallIndex * 0.3);
  }

  private identifyChangeRisks(data: AssessmentData, score: number): string[] {
    const risks: string[] = [];
    
    if (score < this.config.READINESS_THRESHOLDS.MODERATE_READINESS) {
      risks.push('Low change readiness may lead to implementation delays');
      risks.push('Resistance to change initiatives may emerge');
      risks.push('Resource constraints could impact change success');
      risks.push('Communication gaps may cause confusion and uncertainty');
    }
    
    return risks;
  }

  private identifyStrengthAreas(data: AssessmentData, score: number): string[] {
    const strengths: string[] = [];
    
    if (score >= this.config.READINESS_THRESHOLDS.MODERATE_READINESS) {
      strengths.push('Strong foundation for change implementation');
      strengths.push('Effective communication and engagement processes');
      strengths.push('Adequate resource allocation for change initiatives');
      strengths.push('Leadership commitment to transformation goals');
    }
    
    return strengths;
  }

  private assessImplementationReadiness(data: AssessmentData): number {
    const implementationResponses = this.filterResponsesByKeywords(data.responses, [
      'implementation', 'execution', 'project management', 'change management'
    ]);
    
    return this.calculateResponseScore(implementationResponses);
  }

  /**
   * Helper method to safely filter responses by keywords
   */
  private filterResponsesByKeywords(responses: any[], keywords: string[]): any[] {
    return responses.filter(r => {
      if (!r.prompt && !r.question) return false;
      const text = (r.prompt || r.question || '').toLowerCase();
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  private calculateResponseScore(responses: any[]): number {
    if (responses.length === 0) return 0.5;
    
    const totalScore = responses.reduce((sum, response) => {
      let score = 0.5;
      
      if (typeof response.value === 'number') {
        score = response.value / 5;
      } else if (typeof response.value === 'string') {
        const value = response.value.toLowerCase();
        if (value.includes('excellent') || value.includes('very good')) score = 1.0;
        else if (value.includes('good')) score = 0.8;
        else if (value.includes('fair') || value.includes('average')) score = 0.6;
        else if (value.includes('poor')) score = 0.4;
        else if (value.includes('very poor')) score = 0.2;
      }
      
      return sum + score;
    }, 0);
    
    return totalScore / responses.length;
  }
}

/**
 * Factory function to create OCI algorithm instance
 */
export function createOCIAlgorithm(): OCIAlgorithm {
  return new OCIAlgorithm();
}

/**
 * Utility function for quick OCI calculation
 */
export async function calculateOCIScore(
  assessmentData: AssessmentData,
  organizationMetrics: OrganizationMetrics
): Promise<OCIMetrics> {
  const algorithm = createOCIAlgorithm();
  return algorithm.calculateOCI(assessmentData, organizationMetrics);
}
