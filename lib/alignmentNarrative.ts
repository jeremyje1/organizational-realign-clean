import { AIReadinessScores, AIReadinessResponse } from './aiReadinessEngine';

export interface AlignmentInsights {
  strategicGaps: string[];
  pedagogicalAlignment: string;
  studentSuccessConnection: string;
  ethicalConsiderations: string;
  nextSteps: string[];
}

export class AlignmentNarrativeHelper {
  generateAlignmentNarrative(
    scores: AIReadinessScores,
    responses: AIReadinessResponse[],
    institutionName?: string
  ): AlignmentInsights {
    const alignmentScore = scores.domains.alignment;
    const alignmentResponses = responses.filter(r => r.questionId.startsWith('alignment_'));
    
    // Analyze specific alignment responses
    const strategicTies = this.analyzeResponse(alignmentResponses, 'alignment_1');
    const pedagogicalValues = this.analyzeResponse(alignmentResponses, 'alignment_2');
    const studentSuccessKPIs = this.analyzeResponse(alignmentResponses, 'alignment_3');
    const ethicalFramework = this.analyzeResponse(alignmentResponses, 'alignment_4');

    const insights: AlignmentInsights = {
      strategicGaps: this.identifyStrategicGaps(strategicTies, alignmentScore),
      pedagogicalAlignment: this.assessPedagogicalAlignment(pedagogicalValues),
      studentSuccessConnection: this.evaluateStudentSuccessConnection(studentSuccessKPIs),
      ethicalConsiderations: this.analyzeEthicalFramework(ethicalFramework),
      nextSteps: this.generateNextSteps(alignmentScore, strategicTies, pedagogicalValues, studentSuccessKPIs, ethicalFramework)
    };

    return insights;
  }

  private analyzeResponse(responses: AIReadinessResponse[], questionId: string): number {
    const response = responses.find(r => r.questionId === questionId);
    return response?.score ?? 0;
  }

  private identifyStrategicGaps(strategicTies: number, alignmentScore: any): string[] {
    const gaps: string[] = [];

    if (strategicTies <= 1) {
      gaps.push("AI initiatives lack clear connection to institutional strategic priorities");
      gaps.push("Need explicit mapping between AI projects and strategic plan objectives");
    }

    if (alignmentScore && alignmentScore.percentage && alignmentScore.percentage < 60) {
      gaps.push("Insufficient integration between AI planning and institutional mission");
      gaps.push("AI governance may not reflect institutional values and priorities");
    }

    if (strategicTies === 0) {
      gaps.push("Critical gap: AI investments may not support core institutional outcomes");
    }

    return gaps;
  }

  private assessPedagogicalAlignment(pedagogicalValues: number): string {
    if (pedagogicalValues >= 3) {
      return "Strong pedagogical alignment: Faculty and staff view AI as supporting core educational values and teaching practices. This creates a foundation for sustainable AI adoption that enhances rather than disrupts educational excellence.";
    } else if (pedagogicalValues >= 2) {
      return "Moderate pedagogical alignment: There is general agreement that AI can support educational goals, but some concerns remain about potential conflicts with pedagogical approaches. Targeted faculty development could strengthen alignment.";
    } else if (pedagogicalValues >= 1) {
      return "Emerging pedagogical concerns: Faculty and staff have mixed views about AI's compatibility with educational values. This suggests need for deeper dialogue about how AI can enhance rather than compromise pedagogical integrity.";
    } else {
      return "Significant pedagogical misalignment: Faculty and staff perceive AI tools as conflicting with core educational values. This represents a critical barrier that must be addressed through comprehensive change management and faculty engagement.";
    }
  }

  private evaluateStudentSuccessConnection(studentSuccessKPIs: number): string {
    if (studentSuccessKPIs >= 3) {
      return "Excellent student success integration: AI projects consistently include KPIs aligned to student outcomes such as persistence, equity gap reduction, and learning achievement. This ensures AI investments directly contribute to institutional mission fulfillment.";
    } else if (studentSuccessKPIs >= 2) {
      return "Good student success focus: AI projects often include student success metrics, though this could be more systematic. Consider standardizing student outcome KPIs across all AI initiatives to maximize impact.";
    } else if (studentSuccessKPIs >= 1) {
      return "Inconsistent student success connection: Some AI projects include student outcome measures, but this is not systematic. There's significant opportunity to strengthen the connection between AI investments and student success goals.";
    } else {
      return "Missing student success connection: AI projects rarely include KPIs tied to student outcomes. This represents a critical gap that undermines the strategic value of AI investments for an educational institution.";
    }
  }

  private analyzeEthicalFramework(ethicalFramework: number): string {
    if (ethicalFramework >= 3) {
      return "Mature ethical AI framework: Institution has formally adopted and operationalized ethical AI principles that reflect institutional values. This provides strong foundation for responsible AI implementation.";
    } else if (ethicalFramework >= 2) {
      return "Developing ethical framework: Ethical AI principles have been adopted but may need stronger operationalization. Focus on translating principles into practical guidelines and decision-making processes.";
    } else if (ethicalFramework >= 1) {
      return "Early ethical development: Ethical AI principles are in draft form. This is a positive start that needs continued development and institutional approval to ensure responsible AI adoption.";
    } else {
      return "Ethical framework gap: No formal ethical AI principles have been developed. This represents a significant risk for responsible AI implementation and should be addressed as a high priority.";
    }
  }

  private generateNextSteps(
    alignmentScore: any,
    strategicTies: number,
    pedagogicalValues: number,
    studentSuccessKPIs: number,
    ethicalFramework: number
  ): string[] {
    const steps: string[] = [];

    // Strategic alignment steps
    if (strategicTies <= 1) {
      steps.push("Conduct strategic alignment audit of all current AI initiatives");
      steps.push("Develop AI project approval process requiring strategic justification");
    }

    // Pedagogical alignment steps
    if (pedagogicalValues <= 1) {
      steps.push("Host faculty forums on AI and pedagogical values");
      steps.push("Create AI and teaching excellence working group");
    }

    // Student success steps
    if (studentSuccessKPIs <= 1) {
      steps.push("Standardize student success KPIs for all AI projects");
      steps.push("Partner with student success and institutional research teams");
    }

    // Ethical framework steps
    if (ethicalFramework <= 1) {
      steps.push("Develop institutional AI ethics framework");
      steps.push("Establish AI ethics review process for new initiatives");
    }

    // Overall alignment improvement
    if (alignmentScore.percentage < 70) {
      steps.push("Create AI-Strategic Plan alignment dashboard");
      steps.push("Integrate AI planning into institutional strategic planning cycles");
    }

    return steps;
  }

  generateAlignmentVisual(scores: AIReadinessScores): string {
    const alignmentScore = scores.domains.alignment?.percentage || 0;
    const strategicScore = scores.domains.strategy?.percentage || 0;
    const overallScore = (scores.overall / 5) * 100;

    // Generate simple ASCII visualization for PDF
    const createBar = (percentage: number, width: number = 20): string => {
      const filled = Math.round((percentage / 100) * width);
      const empty = width - filled;
      return '█'.repeat(filled) + '░'.repeat(empty);
    };

    return `
Alignment Dashboard
==================

Strategic Alignment:     ${createBar(alignmentScore)} ${alignmentScore.toFixed(1)}%
Overall AI Readiness:    ${createBar(overallScore)}    ${overallScore.toFixed(1)}%
Strategic Planning:      ${createBar(strategicScore)}  ${strategicScore.toFixed(1)}%

Alignment Status: ${alignmentScore >= 80 ? 'STRONG' : alignmentScore >= 60 ? 'MODERATE' : alignmentScore >= 40 ? 'DEVELOPING' : 'CRITICAL GAP'}
`;
  }

  generateOpportunityMap(scores: AIReadinessScores, insights: AlignmentInsights): string {
    const alignmentLevel = scores.domains.alignment?.percentage || 0;
    
    return `
AI OPPORTUNITY MAP
For Strategic Planning and Consulting Sessions

ALIGNMENT LEVEL: ${alignmentLevel >= 80 ? 'ADVANCED' : alignmentLevel >= 60 ? 'DEVELOPING' : alignmentLevel >= 40 ? 'EMERGING' : 'FOUNDATIONAL'}

STRATEGIC GAPS IDENTIFIED:
${insights.strategicGaps.map(gap => `• ${gap}`).join('\n')}

IMMEDIATE OPPORTUNITIES (Next 90 Days):
${insights.nextSteps.slice(0, 3).map((step, i) => `${i + 1}. ${step}`).join('\n')}

MEDIUM-TERM INITIATIVES (3-12 Months):
${insights.nextSteps.slice(3, 6).map((step, i) => `${i + 1}. ${step}`).join('\n')}

FACILITATION QUESTIONS:
• How do our current AI initiatives advance our mission and strategic priorities?
• What student success metrics should guide our AI investment decisions?
• How can we ensure AI adoption enhances rather than compromises our pedagogical values?
• What governance structures do we need to maintain strategic alignment?

SUCCESS INDICATORS:
• All AI projects tied to specific strategic plan objectives
• Student success KPIs integrated into AI project evaluation
• Faculty confidence in AI's pedagogical compatibility
• Operational AI ethics framework reflecting institutional values

CONSULTING FOCUS AREAS:
${alignmentLevel < 40 ? '• Strategic foundation and mission alignment\n• Basic AI governance and ethics framework' : ''}
${alignmentLevel >= 40 && alignmentLevel < 70 ? '• Strategic integration and measurement\n• Faculty engagement and pedagogical alignment' : ''}
${alignmentLevel >= 70 ? '• Advanced strategic optimization\n• Scaling and impact measurement' : ''}
`;
  }
}

export const alignmentNarrativeHelper = new AlignmentNarrativeHelper();
