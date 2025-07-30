/**
 * CRF - Cultural Resilience Factor v2.1
 * Enterprise algorithm for cultural assessment and resilience measurement
 * 
 * This algorithm analyzes organizational culture strength, adaptability,
 * and resilience to change, providing insights into cultural health
 * and transformation readiness.
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 * @enterprise true
 */

import { AssessmentData, OrganizationMetrics } from '@/types/assessment';
import { calculateWeightedScore, normalizeScore } from './utils';

// CRF Configuration Constants
export const CRF_CONFIG = {
  VERSION: '2.1.0',
  CULTURAL_WEIGHTS: {
    VALUES_ALIGNMENT: 0.30,
    BEHAVIORAL_CONSISTENCY: 0.25,
    ADAPTABILITY: 0.20,
    COHESION: 0.15,
    INNOVATION_OPENNESS: 0.10
  },
  RESILIENCE_THRESHOLDS: {
    LOW_RESILIENCE: 0.35,
    MODERATE_RESILIENCE: 0.65,
    HIGH_RESILIENCE: 0.85
  },
  CULTURAL_DIMENSIONS: {
    POWER_DISTANCE: 'power_distance',
    UNCERTAINTY_AVOIDANCE: 'uncertainty_avoidance',
    INDIVIDUALISM_COLLECTIVISM: 'individualism_collectivism',
    MASCULINITY_FEMININITY: 'masculinity_femininity',
    LONG_TERM_ORIENTATION: 'long_term_orientation',
    INDULGENCE_RESTRAINT: 'indulgence_restraint'
  }
} as const;

// CRF Data Structures
export interface CRFMetrics {
  valuesAlignment: number;
  behavioralConsistency: number;
  adaptability: number;
  cohesion: number;
  innovationOpenness: number;
  overallResilienceScore: number;
  culturalFactors: CulturalFactor[];
  resilienceIndicators: ResilienceIndicator[];
  transformationReadiness: number;
  culturalRisks: string[];
  strengthAreas: string[];
}

export interface CulturalFactor {
  dimension: string;
  score: number;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
}

export interface ResilienceIndicator {
  category: 'stability' | 'flexibility' | 'learning' | 'recovery';
  level: 'low' | 'moderate' | 'high';
  description: string;
  evidencePoints: string[];
  improvementAreas: string[];
}

/**
 * Cultural Resilience Factor Algorithm Implementation
 */
export class CRFAlgorithm {
  private config = CRF_CONFIG;

  /**
   * Main CRF calculation method
   * @param assessmentData Raw assessment responses
   * @param organizationMetrics Organizational context data
   * @returns Comprehensive CRF metrics
   */
  public calculateCRF(
    assessmentData: AssessmentData,
    organizationMetrics: OrganizationMetrics
  ): CRFMetrics {
    // Calculate core cultural dimensions
    const valuesAlignment = this.assessValuesAlignment(assessmentData);
    const behavioralConsistency = this.assessBehavioralConsistency(assessmentData);
    const adaptability = this.assessCulturalAdaptability(assessmentData);
    const cohesion = this.assessCulturalCohesion(assessmentData);
    const innovationOpenness = this.assessInnovationOpenness(assessmentData);

    // Calculate weighted overall resilience score
    const overallResilienceScore = calculateWeightedScore([
      { value: valuesAlignment, weight: this.config.CULTURAL_WEIGHTS.VALUES_ALIGNMENT },
      { value: behavioralConsistency, weight: this.config.CULTURAL_WEIGHTS.BEHAVIORAL_CONSISTENCY },
      { value: adaptability, weight: this.config.CULTURAL_WEIGHTS.ADAPTABILITY },
      { value: cohesion, weight: this.config.CULTURAL_WEIGHTS.COHESION },
      { value: innovationOpenness, weight: this.config.CULTURAL_WEIGHTS.INNOVATION_OPENNESS }
    ]);

    // Generate cultural insights
    const culturalFactors = this.analyzeCulturalFactors(assessmentData);
    const resilienceIndicators = this.assessResilienceIndicators(assessmentData, overallResilienceScore);
    const transformationReadiness = this.calculateTransformationReadiness(assessmentData);
    const culturalRisks = this.identifyCulturalRisks(assessmentData, overallResilienceScore);
    const strengthAreas = this.identifyStrengthAreas(assessmentData, overallResilienceScore);

    return {
      valuesAlignment,
      behavioralConsistency,
      adaptability,
      cohesion,
      innovationOpenness,
      overallResilienceScore,
      culturalFactors,
      resilienceIndicators,
      transformationReadiness,
      culturalRisks,
      strengthAreas
    };
  }

  private assessValuesAlignment(data: AssessmentData): number {
    const valueResponses = this.filterResponsesByKeywords(data.responses, [
      'values', 'mission', 'purpose', 'beliefs'
    ]);
    
    return this.calculateResponseScore(valueResponses);
  }

  private assessBehavioralConsistency(data: AssessmentData): number {
    const behaviorResponses = this.filterResponsesByKeywords(data.responses, [
      'behavior', 'actions', 'practice', 'consistent'
    ]);
    
    return this.calculateResponseScore(behaviorResponses);
  }

  private assessCulturalAdaptability(data: AssessmentData): number {
    const adaptResponses = this.filterResponsesByKeywords(data.responses, [
      'change', 'adapt', 'flexible', 'evolve'
    ]);
    
    return this.calculateResponseScore(adaptResponses);
  }

  private assessCulturalCohesion(data: AssessmentData): number {
    const cohesionResponses = this.filterResponsesByKeywords(data.responses, [
      'unity', 'together', 'shared', 'common'
    ]);
    
    return this.calculateResponseScore(cohesionResponses);
  }

  private assessInnovationOpenness(data: AssessmentData): number {
    const innovationResponses = this.filterResponsesByKeywords(data.responses, [
      'innovation', 'new ideas', 'creative', 'experiment'
    ]);
    
    return this.calculateResponseScore(innovationResponses);
  }

  private analyzeCulturalFactors(data: AssessmentData): CulturalFactor[] {
    return [
      {
        dimension: 'Power Distance',
        score: this.assessPowerDistance(data),
        description: 'Level of hierarchy acceptance and authority distribution',
        impact: 'neutral',
        recommendations: ['Foster more collaborative decision-making', 'Encourage upward feedback']
      },
      {
        dimension: 'Uncertainty Avoidance',
        score: this.assessUncertaintyAvoidance(data),
        description: 'Comfort level with ambiguity and uncertain situations',
        impact: 'positive',
        recommendations: ['Maintain structured processes', 'Provide clear guidelines']
      }
    ];
  }

  private assessResilienceIndicators(data: AssessmentData, overallScore: number): ResilienceIndicator[] {
    const indicators: ResilienceIndicator[] = [];
    
    if (overallScore >= this.config.RESILIENCE_THRESHOLDS.HIGH_RESILIENCE) {
      indicators.push({
        category: 'stability',
        level: 'high',
        description: 'Organization demonstrates high cultural stability and consistency',
        evidencePoints: ['Strong values alignment', 'Consistent behaviors', 'Clear cultural identity'],
        improvementAreas: ['Continue monitoring cultural evolution', 'Maintain cultural practices']
      });
    }
    
    return indicators;
  }

  private calculateTransformationReadiness(data: AssessmentData): number {
    const changeResponses = this.filterResponsesByKeywords(data.responses, [
      'transformation', 'change management', 'readiness'
    ]);
    
    return this.calculateResponseScore(changeResponses);
  }

  private identifyCulturalRisks(data: AssessmentData, score: number): string[] {
    const risks: string[] = [];
    
    if (score < this.config.RESILIENCE_THRESHOLDS.LOW_RESILIENCE) {
      risks.push('Low cultural cohesion may impede organizational effectiveness');
      risks.push('Misaligned values could lead to internal conflicts');
      risks.push('Resistance to change may hinder adaptation');
    }
    
    return risks;
  }

  private identifyStrengthAreas(data: AssessmentData, score: number): string[] {
    const strengths: string[] = [];
    
    if (score >= this.config.RESILIENCE_THRESHOLDS.MODERATE_RESILIENCE) {
      strengths.push('Strong cultural foundation supports organizational goals');
      strengths.push('Good adaptability enables effective change management');
      strengths.push('Cohesive culture enhances collaboration and performance');
    }
    
    return strengths;
  }

  private assessPowerDistance(data: AssessmentData): number {
    const powerResponses = this.filterResponsesByKeywords(data.responses, [
      'hierarchy', 'authority', 'decision'
    ]);
    
    return this.calculateResponseScore(powerResponses);
  }

  private assessUncertaintyAvoidance(data: AssessmentData): number {
    const uncertaintyResponses = this.filterResponsesByKeywords(data.responses, [
      'uncertainty', 'risk', 'ambiguity'
    ]);
    
    return this.calculateResponseScore(uncertaintyResponses);
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
    
    return normalizeScore(totalScore / responses.length);
  }
}

/**
 * Factory function to create CRF algorithm instance
 */
export function createCRFAlgorithm(): CRFAlgorithm {
  return new CRFAlgorithm();
}

/**
 * Utility function for quick CRF calculation
 */
export async function calculateCRFScore(
  assessmentData: AssessmentData,
  organizationMetrics: OrganizationMetrics
): Promise<CRFMetrics> {
  const algorithm = createCRFAlgorithm();
  return algorithm.calculateCRF(assessmentData, organizationMetrics);
}

/**
 * Version information
 */
export const CRF_VERSION = {
  version: '2.1.0',
  releaseDate: '2025-07-12',
  features: [
    'Cultural resilience assessment',
    'Values alignment analysis',
    'Behavioral consistency measurement',
    'Transformation readiness evaluation',
    'Cultural risk identification'
  ]
};
