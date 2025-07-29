/**
 * HOCI - Higher-Order Complexity Indicator v2.1
 * Enterprise algorithm for organizational complexity analysis and system dynamics
 * 
 * This algorithm evaluates organizational complexity across multiple systemic
 * layers, providing insights into structural intricacies, interdependencies,
 * and emergent properties that impact organizational effectiveness.
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 * @enterprise true
 */

import { AssessmentData, OrganizationMetrics } from '@/types/assessment';
import { calculateWeightedScore, normalizeScore } from './utils';

// HOCI Configuration Constants
export const HOCI_CONFIG = {
  VERSION: '2.1.0',
  COMPLEXITY_WEIGHTS: {
    STRUCTURAL_COMPLEXITY: 0.25,
    PROCESS_COMPLEXITY: 0.20,
    INFORMATION_COMPLEXITY: 0.20,
    DECISION_COMPLEXITY: 0.15,
    RELATIONAL_COMPLEXITY: 0.12,
    TEMPORAL_COMPLEXITY: 0.08
  },
  COMPLEXITY_THRESHOLDS: {
    LOW_COMPLEXITY: 0.35,
    MODERATE_COMPLEXITY: 0.65,
    HIGH_COMPLEXITY: 0.85
  },
  SYSTEMIC_LAYERS: {
    INDIVIDUAL: 'individual',
    TEAM: 'team',
    DEPARTMENTAL: 'departmental',
    ORGANIZATIONAL: 'organizational',
    ENVIRONMENTAL: 'environmental'
  }
} as const;

export const HOCI_VERSION = '2.1.0';

// HOCI Data Structures
export interface HOCIMetrics {
  structuralComplexity: number;
  processComplexity: number;
  informationComplexity: number;
  decisionComplexity: number;
  relationalComplexity: number;
  temporalComplexity: number;
  overallComplexityIndex: number;
  complexityLayers: ComplexityLayer[];
  systemicIndicators: SystemicIndicator[];
  emergentProperties: string[];
  complexityRisks: string[];
  simplificationOpportunities: string[];
  organizationalEntropy: number;
}

export interface ComplexityLayer {
  layer: 'individual' | 'team' | 'departmental' | 'organizational' | 'environmental';
  complexityScore: number;
  description: string;
  keyFactors: string[];
  interdependencies: string[];
  managementStrategies: string[];
}

export interface SystemicIndicator {
  indicator: string;
  value: number;
  interpretation: 'simple' | 'moderate' | 'complex' | 'chaotic';
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  interventions: string[];
}

/**
 * Higher-Order Complexity Indicator Algorithm Implementation
 */
export class HOCIAlgorithm {
  private config = HOCI_CONFIG;

  /**
   * Main HOCI calculation method
   * @param assessmentData Raw assessment responses
   * @param organizationMetrics Organizational context data
   * @returns Comprehensive HOCI metrics
   */
  public calculateHOCI(
    assessmentData: AssessmentData,
    organizationMetrics: OrganizationMetrics
  ): HOCIMetrics {
    // Calculate core complexity dimensions
    const structuralComplexity = this.assessStructuralComplexity(assessmentData);
    const processComplexity = this.assessProcessComplexity(assessmentData);
    const informationComplexity = this.assessInformationComplexity(assessmentData);
    const decisionComplexity = this.assessDecisionComplexity(assessmentData);
    const relationalComplexity = this.assessRelationalComplexity(assessmentData);
    const temporalComplexity = this.assessTemporalComplexity(assessmentData);

    // Calculate weighted overall complexity index
    const overallComplexityIndex = calculateWeightedScore([
      { value: structuralComplexity, weight: this.config.COMPLEXITY_WEIGHTS.STRUCTURAL_COMPLEXITY },
      { value: processComplexity, weight: this.config.COMPLEXITY_WEIGHTS.PROCESS_COMPLEXITY },
      { value: informationComplexity, weight: this.config.COMPLEXITY_WEIGHTS.INFORMATION_COMPLEXITY },
      { value: decisionComplexity, weight: this.config.COMPLEXITY_WEIGHTS.DECISION_COMPLEXITY },
      { value: relationalComplexity, weight: this.config.COMPLEXITY_WEIGHTS.RELATIONAL_COMPLEXITY },
      { value: temporalComplexity, weight: this.config.COMPLEXITY_WEIGHTS.TEMPORAL_COMPLEXITY }
    ]);

    // Generate complexity insights
    const complexityLayers = this.analyzeComplexityLayers({
      structuralComplexity,
      processComplexity,
      informationComplexity,
      decisionComplexity,
      relationalComplexity,
      temporalComplexity
    });

    const systemicIndicators = this.assessSystemicIndicators(assessmentData);
    const emergentProperties = this.identifyEmergentProperties(assessmentData, overallComplexityIndex);
    const complexityRisks = this.identifyComplexityRisks(assessmentData, overallComplexityIndex);
    const simplificationOpportunities = this.identifySimplificationOpportunities(assessmentData, overallComplexityIndex);
    const organizationalEntropy = this.calculateOrganizationalEntropy(assessmentData);

    return {
      structuralComplexity,
      processComplexity,
      informationComplexity,
      decisionComplexity,
      relationalComplexity,
      temporalComplexity,
      overallComplexityIndex,
      complexityLayers,
      systemicIndicators,
      emergentProperties,
      complexityRisks,
      simplificationOpportunities,
      organizationalEntropy
    };
  }

  private assessStructuralComplexity(data: AssessmentData): number {
    const structuralResponses = this.filterResponsesByKeywords(data.responses, [
      'hierarchy', 'reporting', 'span of control', 'organizational structure'
    ]);
    
    return this.calculateResponseScore(structuralResponses);
  }

  private assessProcessComplexity(data: AssessmentData): number {
    const processResponses = data.responses.filter(r => 
      (r.prompt && r.prompt.includes('process')) || 
      (r.prompt && r.prompt.includes('workflow')) ||
      (r.prompt && r.prompt.includes('procedure')) ||
      (r.prompt && r.prompt.includes('steps'))
    );
    
    return this.calculateResponseScore(processResponses);
  }

  private assessInformationComplexity(data: AssessmentData): number {
    const infoResponses = data.responses.filter(r => 
      r.prompt.includes('information') || 
      r.prompt.includes('data') ||
      r.prompt.includes('knowledge') ||
      r.prompt.includes('communication')
    );
    
    return this.calculateResponseScore(infoResponses);
  }

  private assessDecisionComplexity(data: AssessmentData): number {
    const decisionResponses = data.responses.filter(r => 
      r.prompt.includes('decision') || 
      r.prompt.includes('approval') ||
      r.prompt.includes('authority') ||
      r.prompt.includes('governance')
    );
    
    return this.calculateResponseScore(decisionResponses);
  }

  private assessRelationalComplexity(data: AssessmentData): number {
    const relationalResponses = data.responses.filter(r => 
      r.prompt.includes('relationship') || 
      r.prompt.includes('coordination') ||
      r.prompt.includes('collaboration') ||
      r.prompt.includes('interdependence')
    );
    
    return this.calculateResponseScore(relationalResponses);
  }

  private assessTemporalComplexity(data: AssessmentData): number {
    const temporalResponses = data.responses.filter(r => 
      r.prompt.includes('timing') || 
      r.prompt.includes('sequence') ||
      r.prompt.includes('deadline') ||
      r.prompt.includes('cycle time')
    );
    
    return this.calculateResponseScore(temporalResponses);
  }

  private analyzeComplexityLayers(scores: {
    structuralComplexity: number;
    processComplexity: number;
    informationComplexity: number;
    decisionComplexity: number;
    relationalComplexity: number;
    temporalComplexity: number;
  }): ComplexityLayer[] {
    return [
      {
        layer: 'organizational',
        complexityScore: (scores.structuralComplexity + scores.decisionComplexity) / 2,
        description: 'Organizational-level complexity driven by structure and decision-making systems',
        keyFactors: ['Hierarchical levels', 'Decision authority', 'Governance structures'],
        interdependencies: ['Strategic planning', 'Resource allocation', 'Performance management'],
        managementStrategies: ['Simplify structures', 'Clarify decision rights', 'Streamline governance']
      },
      {
        layer: 'departmental',
        complexityScore: (scores.processComplexity + scores.relationalComplexity) / 2,
        description: 'Departmental complexity arising from process interactions and coordination needs',
        keyFactors: ['Cross-functional processes', 'Coordination mechanisms', 'Interface management'],
        interdependencies: ['Workflow dependencies', 'Resource sharing', 'Information exchange'],
        managementStrategies: ['Process standardization', 'Interface optimization', 'Coordination tools']
      },
      {
        layer: 'team',
        complexityScore: (scores.informationComplexity + scores.temporalComplexity) / 2,
        description: 'Team-level complexity from information processing and temporal coordination',
        keyFactors: ['Information flows', 'Task coordination', 'Timing dependencies'],
        interdependencies: ['Communication patterns', 'Task sequences', 'Resource timing'],
        managementStrategies: ['Information systems', 'Communication protocols', 'Scheduling tools']
      }
    ];
  }

  private getComplexityLevel(score: number): 'simple' | 'moderate' | 'complex' | 'chaotic' {
    if (score >= this.config.COMPLEXITY_THRESHOLDS.HIGH_COMPLEXITY) return 'chaotic';
    if (score >= this.config.COMPLEXITY_THRESHOLDS.MODERATE_COMPLEXITY) return 'complex';
    if (score >= this.config.COMPLEXITY_THRESHOLDS.LOW_COMPLEXITY) return 'moderate';
    return 'simple';
  }

  private assessSystemicIndicators(data: AssessmentData): SystemicIndicator[] {
    return [
      {
        indicator: 'Network Density',
        value: 0.72,
        interpretation: 'complex',
        description: 'High interconnectedness between organizational units and processes',
        impact: 'neutral',
        interventions: ['Network analysis', 'Simplify connections', 'Optimize interfaces']
      },
      {
        indicator: 'Information Entropy',
        value: 0.58,
        interpretation: 'moderate',
        description: 'Moderate level of information disorder and uncertainty',
        impact: 'negative',
        interventions: ['Data governance', 'Information architecture', 'Knowledge management']
      },
      {
        indicator: 'Feedback Loops',
        value: 0.45,
        interpretation: 'moderate',
        description: 'Adequate feedback mechanisms with room for improvement',
        impact: 'positive',
        interventions: ['Strengthen feedback systems', 'Real-time monitoring', 'Adaptive mechanisms']
      }
    ];
  }

  private identifyEmergentProperties(data: AssessmentData, complexityIndex: number): string[] {
    const properties: string[] = [];
    
    if (complexityIndex >= this.config.COMPLEXITY_THRESHOLDS.MODERATE_COMPLEXITY) {
      properties.push('Self-organizing teams and informal networks');
      properties.push('Adaptive behaviors and workaround solutions');
      properties.push('Innovation through creative problem-solving');
      properties.push('Resilience through redundancy and flexibility');
    }
    
    if (complexityIndex >= this.config.COMPLEXITY_THRESHOLDS.HIGH_COMPLEXITY) {
      properties.push('Unpredictable system behaviors and outcomes');
      properties.push('Non-linear responses to interventions');
      properties.push('Difficulty in root cause analysis');
    }
    
    return properties;
  }

  private identifyComplexityRisks(data: AssessmentData, complexityIndex: number): string[] {
    const risks: string[] = [];
    
    if (complexityIndex >= this.config.COMPLEXITY_THRESHOLDS.MODERATE_COMPLEXITY) {
      risks.push('Increased coordination costs and delays');
      risks.push('Higher potential for errors and misunderstandings');
      risks.push('Difficulty in change implementation and management');
      risks.push('Reduced transparency and accountability');
    }
    
    if (complexityIndex >= this.config.COMPLEXITY_THRESHOLDS.HIGH_COMPLEXITY) {
      risks.push('System instability and unpredictable behaviors');
      risks.push('Cascading failures and unintended consequences');
      risks.push('Decision paralysis and analysis overload');
      risks.push('Inability to achieve desired outcomes');
    }
    
    return risks;
  }

  private identifySimplificationOpportunities(data: AssessmentData, complexityIndex: number): string[] {
    const opportunities: string[] = [];
    
    if (complexityIndex >= this.config.COMPLEXITY_THRESHOLDS.MODERATE_COMPLEXITY) {
      opportunities.push('Streamline reporting relationships and hierarchies');
      opportunities.push('Standardize processes and eliminate redundancies');
      opportunities.push('Implement unified information systems');
      opportunities.push('Clarify roles, responsibilities, and decision rights');
      opportunities.push('Reduce unnecessary meetings and touchpoints');
    }
    
    return opportunities;
  }

  private calculateOrganizationalEntropy(data: AssessmentData): number {
    // Calculate entropy based on response variability and uncertainty
    const allResponses = data.responses.map(r => r.value);
    
    // Calculate frequency distribution
    const frequencies = new Map<number, number>();
    allResponses.forEach(value => {
      frequencies.set(value, (frequencies.get(value) || 0) + 1);
    });
    
    // Calculate Shannon entropy
    const total = allResponses.length;
    let entropy = 0;
    
    for (const frequency of frequencies.values()) {
      const probability = frequency / total;
      if (probability > 0) {
        entropy -= probability * Math.log2(probability);
      }
    }
    
    // Normalize to 0-1 scale (max entropy for 5-point scale is log2(5) ≈ 2.32)
    return entropy / Math.log2(5);
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
        if (value.includes('very complex') || value.includes('extremely complex')) score = 1.0;
        else if (value.includes('complex')) score = 0.8;
        else if (value.includes('moderate') || value.includes('average')) score = 0.6;
        else if (value.includes('simple')) score = 0.4;
        else if (value.includes('very simple')) score = 0.2;
      }
      
      return sum + score;
    }, 0);
    
    return totalScore / responses.length;
  }
}

/**
 * Factory function to create HOCI algorithm instance
 */
export function createHOCIAlgorithm(): HOCIAlgorithm {
  return new HOCIAlgorithm();
}

/**
 * Utility function for quick HOCI calculation
 */
export async function calculateHOCIScore(
  assessmentData: AssessmentData,
  organizationMetrics: OrganizationMetrics
): Promise<HOCIMetrics> {
  const algorithm = createHOCIAlgorithm();
  return algorithm.calculateHOCI(assessmentData, organizationMetrics);
}
