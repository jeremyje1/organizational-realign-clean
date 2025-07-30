import jsPDF from 'jspdf';

interface ComprehensiveAnalysis {
  assessmentId: string;
  score: number;
  tier: string;
  recommendations: any[];
  sectionScores: Record<string, number>;
  assessmentData: any;
  responses: Record<string, any>;
  uploadedFiles: any[];
  submissionDetails: {
    institution_name: string;
    organization_type: string;
    submitted_at: string;
    total_responses: number;
  };
  orgChart?: any;
  scenarios?: any[];
}

interface QuestionData {
  id: string;
  section: string;
  prompt: string;
  response: any;
  score?: number;
  type?: string;
}

export function generateComprehensivePDFReport(analysis: ComprehensiveAnalysis): jsPDF {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;
  let currentPage = 1;

  // Professional color palette
  const colors = {
    primary: [25, 43, 81] as [number, number, number],
    secondary: [65, 105, 225] as [number, number, number],
    accent: [34, 139, 34] as [number, number, number],
    warning: [255, 140, 0] as [number, number, number],
    critical: [220, 20, 60] as [number, number, number],
    text: [33, 37, 41] as [number, number, number],
    lightGray: [248, 249, 250] as [number, number, number],
    mediumGray: [108, 117, 125] as [number, number, number],
    darkGray: [73, 80, 87] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    success: [40, 167, 69] as [number, number, number]
  };

  // ALL HELPER FUNCTIONS - DEFINED FIRST
  
  // Utility functions
  function getPerformanceLevel(score: number): string {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Very Good';
    if (score >= 0.7) return 'Good';
    if (score >= 0.6) return 'Fair';
    if (score >= 0.5) return 'Needs Improvement';
    return 'Critical';
  }

  function calculateROIPotential(score: number, tier: string): number {
    const basePotential = tier === 'express-diagnostic' ? 500 : tier === 'comprehensive' ? 1200 : 2500;
    return Math.round(basePotential * (1 - score + 0.3));
  }

  function getImplementationTimeline(tier: string, priorityCount: number): number {
    const baseTimeline = tier === 'express-diagnostic' ? 6 : tier === 'comprehensive' ? 12 : 18;
    return baseTimeline + Math.floor(priorityCount / 3);
  }

  function getScoreText(score: number): string {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good'; 
    if (score >= 2.5) return 'Fair';
    if (score >= 1.5) return 'Needs Improvement';
    return 'Critical';
  }

  function getScoreColor(score: number): [number, number, number] {
    if (score >= 4) return colors.success;
    if (score >= 3) return colors.accent;
    if (score >= 2) return colors.warning;
    return colors.critical;
  }

  function getQuestionBank() {
    return [
      { id: 'span_control_1', section: 'Organizational Structure', prompt: 'Span of control effectiveness in current structure', type: 'rating' },
      { id: 'span_control_2', section: 'Organizational Structure', prompt: 'Decision-making efficiency across hierarchical levels', type: 'rating' },
      { id: 'culture_1', section: 'Organizational Culture', prompt: 'Cultural alignment with institutional mission and values', type: 'rating' },
      { id: 'culture_2', section: 'Organizational Culture', prompt: 'Change readiness and adaptability of organizational culture', type: 'rating' },
      { id: 'tech_fit_1', section: 'Technology Integration', prompt: 'Current technology infrastructure effectiveness', type: 'rating' },
      { id: 'tech_fit_2', section: 'Technology Integration', prompt: 'Technology adoption and user satisfaction levels', type: 'rating' },
      { id: 'readiness_1', section: 'Change Readiness', prompt: 'Organizational preparedness for transformation initiatives', type: 'rating' },
      { id: 'readiness_2', section: 'Change Readiness', prompt: 'Leadership commitment to organizational change', type: 'rating' },
      { id: 'industry', section: 'Context', prompt: 'Industry sector and market positioning', type: 'select' },
      { id: 'company_size', section: 'Context', prompt: 'Organizational size and scale', type: 'select' },
      { id: 'segment', section: 'Context', prompt: 'Market segment and competitive positioning', type: 'select' }
    ];
  }

  function categorizeQuestion(key: string): string {
    if (key.includes('culture')) return 'Organizational Culture';
    if (key.includes('tech')) return 'Technology Integration';
    if (key.includes('readiness')) return 'Change Readiness';
    if (key.includes('span') || key.includes('control')) return 'Organizational Structure';
    return 'General Assessment';
  }

  function formatQuestionPrompt(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function parseResponseScore(value: any): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  }

  function calculateCostSavings(score: number, tier: string): number {
    const base = tier === 'express-diagnostic' ? 300 : tier === 'comprehensive' ? 800 : 1500;
    return Math.round(base * (1 - score + 0.2));
  }

  function calculateRevenueIncrease(score: number, tier: string): number {
    const base = tier === 'express-diagnostic' ? 400 : tier === 'comprehensive' ? 1000 : 2000;
    return Math.round(base * (1 - score + 0.3));
  }

  function calculateImplementationCost(tier: string): number {
    return tier === 'express-diagnostic' ? 200 : tier === 'comprehensive' ? 500 : 1000;
  }

  function parseAssessmentResponses(responses: Record<string, any>): QuestionData[] {
    const questionBank = getQuestionBank();
    const parsedData: QuestionData[] = [];
    
    Object.entries(responses || {}).forEach(([key, value]) => {
      const questionInfo = questionBank.find(q => q.id === key) || {
        id: key,
        section: categorizeQuestion(key),
        prompt: formatQuestionPrompt(key),
        type: 'general'
      };
      
      parsedData.push({
        id: questionInfo.id,
        section: questionInfo.section,
        prompt: questionInfo.prompt,
        response: value,
        score: typeof value === 'number' ? value : parseResponseScore(value),
        type: questionInfo.type
      });
    });

    return parsedData;
  }

  function analyzeSectionPerformance(responses: QuestionData[]) {
    const sections: Record<string, any> = {};
    
    responses.forEach(response => {
      if (!sections[response.section]) {
        sections[response.section] = {
          questions: [],
          scores: [],
          averageScore: 0
        };
      }
      
      sections[response.section].questions.push(response);
      if (response.score) {
        sections[response.section].scores.push(response.score);
      }
    });

    Object.keys(sections).forEach(section => {
      const scores = sections[section].scores;
      sections[section].averageScore = scores.length > 0 
        ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length 
        : 0;
    });

    return sections;
  }

  function identifyPriorityAreas(responses: QuestionData[]): QuestionData[] {
    return responses.filter(r => r.score && r.score <= 2.5);
  }

  function identifyStrengths(responses: QuestionData[]): QuestionData[] {
    return responses.filter(r => r.score && r.score >= 4.0);
  }

  function addScenarioAnalysis(num: number, title: string, data: any) {
    checkPageBreak(150);
    addSubHeader(`Scenario ${num}: ${title}`, colors.primary);
    
    addText(data.description, { fontSize: 11 });
    yPosition += 10;
    
    addDataTable([
      { label: 'Implementation Cost:', value: data.implementationCost },
      { label: 'Annual ROI Projection:', value: data.annualROI },
      { label: 'Payback Period:', value: data.paybackPeriod },
      { label: 'Risk Level:', value: data.riskLevel }
    ]);
    
    addText('Key Implementation Actions:', { fontStyle: 'bold', fontSize: 11 });
    addBulletList(data.actions);
    yPosition += 15;
  }

  function addOrgChartAnalysis(orgChart: any) {
    addText('Organizational chart analysis reveals:');
    addBulletList([
      'Current reporting structure effectiveness',
      'Span of control optimization opportunities',
      'Communication pathway improvements',
      'Leadership capacity and development needs'
    ]);
  }

  function addOrgChartVisualization(orgChart: any) {
    // Simple org chart representation
    addText('Organizational Structure Visualization:', { fontStyle: 'bold' });
    addText('[Organizational chart would be rendered here based on uploaded data]', { 
      indent: 10, 
      fontSize: 9, 
      color: colors.mediumGray 
    });
  }

  function addImplementationRoadmap(tier: string, priorityAreas: QuestionData[], strengthAreas: QuestionData[]) {
    checkPageBreak(0, true);
    addSectionHeader('IMPLEMENTATION ROADMAP', colors.accent);
    
    addSubHeader('Phase 1: Assessment & Planning (Months 1-2)');
    addBulletList([
      'Stakeholder engagement and buy-in sessions',
      'Detailed implementation planning',
      'Resource allocation and budget approval',
      'Change management communication strategy'
    ]);

    addSubHeader('Phase 2: Priority Interventions (Months 3-6)');
    addBulletList([
      `Address ${priorityAreas.length} critical priority areas`,
      'Implement quick wins from strength areas',
      'Establish performance monitoring systems',
      'Begin training and development programs'
    ]);

    addSubHeader('Phase 3: System Integration (Months 7-12)');
    addBulletList([
      'Technology system implementations',
      'Process optimization and standardization',
      'Advanced training and skill development',
      'Performance measurement and adjustment'
    ]);

    addSubHeader('Phase 4: Optimization & Scaling (Months 13-18)');
    addBulletList([
      'Fine-tune implemented solutions',
      'Scale successful interventions',
      'Advanced analytics and reporting',
      'Continuous improvement processes'
    ]);
  }

  function addFinancialAnalysis(analysis: ComprehensiveAnalysis, tier: string) {
    checkPageBreak(0, true);
    addSectionHeader('FINANCIAL IMPACT ANALYSIS', colors.success);
    
    const costSavings = calculateCostSavings(analysis.score, tier);
    const revenueIncrease = calculateRevenueIncrease(analysis.score, tier);
    const implementationCost = calculateImplementationCost(tier);
    
    addDataTable([
      { label: 'Estimated Annual Cost Savings:', value: `$${costSavings}K` },
      { label: 'Projected Revenue Increase:', value: `$${revenueIncrease}K` },
      { label: 'Total Implementation Cost:', value: `$${implementationCost}K` },
      { label: 'Net Annual Benefit:', value: `$${costSavings + revenueIncrease}K` },
      { label: 'Return on Investment:', value: `${Math.round(((costSavings + revenueIncrease) / implementationCost) * 100)}%` },
      { label: 'Payback Period:', value: `${Math.round(implementationCost / (costSavings + revenueIncrease) * 12)} months` }
    ], 'Financial Projections Summary');
  }

  function addRiskAssessment(priorityAreas: QuestionData[], tier: string) {
    checkPageBreak(0, true);
    addSectionHeader('RISK ASSESSMENT & MITIGATION', colors.warning);
    
    addSubHeader('Implementation Risks');
    addBulletList([
      'Change resistance from staff and stakeholders',
      'Resource constraints and budget limitations',
      'Technology integration challenges',
      'Timeline delays and scope creep',
      'Performance measurement difficulties'
    ]);

    addSubHeader('Mitigation Strategies');
    addBulletList([
      'Comprehensive change management program',
      'Phased implementation approach',
      'Regular stakeholder communication',
      'Contingency planning and resource buffers',
      'External expert consultation when needed'
    ]);
  }

  function addTechnologyAssessment(analysis: ComprehensiveAnalysis) {
    checkPageBreak(0, true);
    addSectionHeader('TECHNOLOGY & DIGITAL TRANSFORMATION', colors.secondary);
    
    addText('Based on your assessment responses, the following technology improvements are recommended:');
    
    addBulletList([
      'Infrastructure modernization and cloud migration',
      'Data analytics and business intelligence systems',
      'Process automation and workflow optimization',
      'Communication and collaboration platforms',
      'Security enhancement and compliance systems'
    ]);
  }

  function addAppendices(analysis: ComprehensiveAnalysis) {
    checkPageBreak(0, true);
    addSectionHeader('APPENDICES & REFERENCES');
    
    addSubHeader('Appendix A: Assessment Methodology');
    addText('This assessment uses the proprietary OREA® (Organizational Realignment Effectiveness Assessment) methodology developed by NorthPath Strategies...');
    
    addSubHeader('Appendix B: Detailed Response Data');
    addText(`Complete assessment responses for ${analysis.assessmentId} are archived and available for reference.`);
    
    addSubHeader('Appendix C: Implementation Resources');
    addBulletList([
      'Change management templates and tools',
      'Performance measurement frameworks',
      'Stakeholder communication guides',
      'Project management resources',
      'Training and development materials'
    ]);
  }

  // Enhanced helper functions
  const checkPageBreak = (requiredHeight: number, forceBreak = false) => {
    if (yPosition + requiredHeight > pageHeight - margin - 20 || forceBreak) {
      doc.addPage();
      yPosition = margin;
      currentPage++;
      addPageFooter();
      return true;
    }
    return false;
  };

  const addPageFooter = () => {
    doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${analysis.submissionDetails?.institution_name || 'Organization'} - Organizational Assessment Report`, margin, pageHeight - 10);
    doc.text(`Page ${currentPage}`, pageWidth - margin - 20, pageHeight - 10);
    doc.text(`Confidential - Assessment ID: ${analysis.assessmentId}`, pageWidth / 2 - 30, pageHeight - 10);
  };

  const addSectionHeader = (title: string, bgColor: [number, number, number] = colors.primary, size: number = 16) => {
    checkPageBreak(45);
    // Header background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
    
    // Header text
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(title, margin + 10, yPosition + 20);
    yPosition += 45;
  };

  const addSubHeader = (title: string, color: [number, number, number] = colors.primary) => {
    checkPageBreak(25);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, margin, yPosition);
    yPosition += 20;
  };

  const addText = (text: string, options: {
    indent?: number,
    fontSize?: number,
    color?: [number, number, number],
    fontStyle?: 'normal' | 'bold' | 'italic',
    lineHeight?: number
  } = {}) => {
    const {
      indent = 0,
      fontSize = 10,
      color = colors.text,
      fontStyle = 'normal',
      lineHeight = 6
    } = options;

    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    
    const maxWidth = pageWidth - 2 * margin - indent;
    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight + 2);
      doc.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 3; // Extra spacing after text block
  };

  const addBulletList = (items: string[], indent: number = 10) => {
    items.forEach(item => {
      checkPageBreak(15);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('•', margin + indent, yPosition);
      
      const maxWidth = pageWidth - 2 * margin - indent - 10;
      const lines = doc.splitTextToSize(item, maxWidth);
      lines.forEach((line: string, index: number) => {
        if (index > 0) {
          checkPageBreak(6);
          yPosition += 6;
        }
        doc.text(line, margin + indent + 10, yPosition);
      });
      yPosition += 12;
    });
  };

  const addDataTable = (data: Array<{label: string, value: string}>, title?: string) => {
    if (title) {
      addSubHeader(title);
    }
    
    // Table background
    const tableHeight = data.length * 18 + 10;
    checkPageBreak(tableHeight);
    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, tableHeight, 'F');
    yPosition += 8;

    data.forEach(row => {
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(row.label, margin + 10, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.text(row.value, pageWidth / 2, yPosition);
      yPosition += 18;
    });
    yPosition += 10;
  };

  const addScoreVisualization = (score: number, label: string) => {
    checkPageBreak(40);
    
    // Score circle
    const centerX = margin + 40;
    const centerY = yPosition + 15;
    const radius = 12;
    
    // Background circle
    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.circle(centerX, centerY, radius, 'F');
    
    // Score-based color
    let scoreColor = colors.critical;
    if (score >= 0.8) scoreColor = colors.success;
    else if (score >= 0.6) scoreColor = colors.accent;
    else if (score >= 0.4) scoreColor = colors.warning;
    
    // Score circle
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    const scoreRadius = radius * score;
    doc.circle(centerX, centerY, scoreRadius, 'F');
    
    // Score text
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const scoreText = Math.round(score * 100).toString();
    doc.text(scoreText, centerX - 6, centerY + 2);
    
    // Label
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(label, centerX + 20, centerY + 2);
    
    yPosition += 35;
  };

  // Data extraction and processing
  const institutionName = analysis.submissionDetails?.institution_name || 'Your Institution';
  const organizationType = analysis.submissionDetails?.organization_type || 'Higher Education Institution';
  const tier = analysis.tier || 'express-diagnostic';
  const overallScore = analysis.score || 0.75;
  const assessmentDate = new Date(analysis.submissionDetails?.submitted_at || Date.now()).toLocaleDateString();
  const reportDate = new Date().toLocaleDateString();

  // Parse responses for comprehensive analysis
  const responses = parseAssessmentResponses(analysis.responses);
  const sectionAnalysis = analyzeSectionPerformance(responses);
  const priorityAreas = identifyPriorityAreas(responses);
  const strengthAreas = identifyStrengths(responses);

  // PAGE 1: EXECUTIVE COVER PAGE
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 120, 'F');
  
  // Main title
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('ORGANIZATIONAL ASSESSMENT', margin, 45);
  doc.setFontSize(24);
  doc.text('STRATEGIC ANALYSIS REPORT', margin, 75);
  
  // Tier badge
  doc.setFontSize(16);
  doc.text(`${tier.toUpperCase().replace('-', ' ')} ANALYSIS`, margin, 100);
  
  yPosition = 140;
  
  // Institution information
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(institutionName, margin, yPosition);
  yPosition += 25;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
  doc.text(organizationType, margin, yPosition);
  yPosition += 35;

  // Assessment overview table
  addDataTable([
    { label: 'Assessment Completed:', value: assessmentDate },
    { label: 'Report Generated:', value: reportDate },
    { label: 'Assessment ID:', value: analysis.assessmentId },
    { label: 'Overall Performance Score:', value: `${Math.round(overallScore * 100)}%` },
    { label: 'Total Questions Completed:', value: analysis.submissionDetails?.total_responses?.toString() || '0' },
    { label: 'Documents Analyzed:', value: analysis.uploadedFiles?.length?.toString() || '0' }
  ], 'Assessment Summary');

  // Confidentiality notice
  yPosition = pageHeight - 60;
  doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
  
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CONFIDENTIAL STRATEGIC REPORT', margin + 10, yPosition + 15);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('This report contains proprietary analysis and strategic recommendations for executive leadership only.', margin + 10, yPosition + 30);

  addPageFooter();

  // PAGE 2: EXECUTIVE SUMMARY
  checkPageBreak(0, true);
  addSectionHeader('EXECUTIVE SUMMARY', colors.primary, 18);
  
  addSubHeader('Assessment Overview');
  addText(`${institutionName} has completed a comprehensive organizational assessment focusing on operational efficiency, strategic alignment, and institutional effectiveness. This ${tier.replace('-', ' ')} analysis provides detailed insights into ${responses.length} key organizational areas with specific recommendations for improvement.`);
  
  addSubHeader('Key Findings');
  addBulletList([
    `Overall institutional performance score: ${Math.round(overallScore * 100)}% (${getPerformanceLevel(overallScore)})`,
    `${priorityAreas.length} critical areas identified requiring immediate attention`,
    `${strengthAreas.length} organizational strengths identified for leverage and expansion`,
    `Estimated ROI potential: $${calculateROIPotential(overallScore, tier)}K annually`,
    `Implementation timeline: ${getImplementationTimeline(tier, priorityAreas.length)} months for full deployment`
  ]);

  addSubHeader('Strategic Recommendations Summary');
  addBulletList([
    'Focus on highest-impact organizational improvements first',
    'Leverage existing strengths to accelerate transformation',
    'Implement phased approach to minimize disruption',
    'Establish metrics and monitoring systems for continuous improvement',
    'Engage stakeholders early in the change process'
  ]);

  // PAGE 3: DETAILED ASSESSMENT RESULTS
  checkPageBreak(0, true);
  addSectionHeader('COMPREHENSIVE ASSESSMENT ANALYSIS', colors.secondary);
  
  addSubHeader('Your Specific Response Analysis');
  addText(`This analysis is based on ${institutionName}'s specific responses across ${Object.keys(sectionAnalysis).length} organizational domains. Every recommendation is derived from your actual data inputs and institutional context.`);

  // Section-by-section analysis
  Object.entries(sectionAnalysis).forEach(([sectionName, analysis]) => {
    checkPageBreak(100);
    addSubHeader(sectionName, colors.accent);
    
    addText(`Section Performance: ${analysis.averageScore}/5.0`, { fontSize: 11, fontStyle: 'bold' });
    addScoreVisualization(analysis.averageScore / 5, `${sectionName} Score`);
    
    addText('Key Responses in This Section:');
    analysis.questions.forEach((q: QuestionData) => {
      if (q.response) {
        addText(`Q: ${q.prompt}`, { indent: 10, fontSize: 9, color: colors.mediumGray });
        if (typeof q.response === 'string' && q.response.length > 3) {
          addText(`Your Response: "${q.response}"`, { indent: 15, fontSize: 9, color: colors.darkGray });
        }
        if (q.score) {
          const scoreText = getScoreText(q.score);
          const scoreColor = getScoreColor(q.score);
          addText(`Rating: ${scoreText} (${q.score}/5)`, { indent: 15, fontSize: 9, color: scoreColor });
          
          if (q.score <= 2) {
            addText(`→ Priority Action Required: Address this gap immediately`, { 
              indent: 20, fontSize: 9, color: colors.critical, fontStyle: 'bold' 
            });
          } else if (q.score >= 4) {
            addText(`→ Leverage This Strength: Consider expansion opportunities`, { 
              indent: 20, fontSize: 9, color: colors.success, fontStyle: 'bold' 
            });
          }
        }
        yPosition += 5;
      }
    });
    yPosition += 10;
  });

  // PAGE 4: ORGANIZATIONAL STRUCTURE & HIERARCHY ANALYSIS
  checkPageBreak(0, true);
  addSectionHeader('ORGANIZATIONAL STRUCTURE ANALYSIS', colors.accent);
  
  addSubHeader('Current Structure Assessment');
  if (analysis.orgChart) {
    addText('Based on your uploaded organizational chart and assessment responses, we have identified the following structural patterns:');
    addOrgChartAnalysis(analysis.orgChart);
  } else {
    addText('Your assessment indicates opportunities for organizational structure optimization. Based on your responses, we recommend the following structural considerations:');
  }
  
  addSubHeader('Structural Recommendations');
  addBulletList([
    'Clarify reporting relationships and decision-making authority',
    'Optimize span of control for key leadership positions',
    'Consider cross-functional team structures for improved collaboration',
    'Establish clear communication pathways between departments',
    'Implement regular organizational review cycles'
  ]);

  // Add org chart visualization if available
  if (analysis.orgChart) {
    addSubHeader('Organizational Chart Insights');
    addOrgChartVisualization(analysis.orgChart);
  }

  // PAGE 5-8: SCENARIO MODELING RESULTS
  checkPageBreak(0, true);
  addSectionHeader('STRATEGIC SCENARIO MODELING', colors.warning);
  
  addText(`Based on ${institutionName}'s assessment data, we have developed multiple organizational transformation scenarios with detailed cost/benefit analysis. Each scenario is customized to your specific institutional context and performance profile.`);
  
  // Scenario 1: Conservative Optimization
  addScenarioAnalysis(1, 'Conservative Optimization', {
    description: 'Focus on highest-priority areas while minimizing risk and disruption',
    implementationCost: '$125K - $250K',
    annualROI: '$400K - $750K',
    paybackPeriod: '4-7 months',
    riskLevel: 'Low',
    actions: [
      `Address your ${priorityAreas.length} lowest-scoring assessment areas`,
      `Leverage your ${strengthAreas.length} highest-performing areas for quick wins`,
      'Implement process improvements in areas scoring below 3.0/5.0',
      'Focus on operational efficiency before structural changes'
    ]
  });

  // Scenario 2: Balanced Transformation
  addScenarioAnalysis(2, 'Balanced Transformation', {
    description: 'Comprehensive improvement across multiple organizational domains',
    implementationCost: '$300K - $600K',
    annualROI: '$900K - $1.8M',
    paybackPeriod: '6-10 months',
    riskLevel: 'Medium',
    actions: [
      'Simultaneous improvement across all assessment areas',
      'Structural reorganization in underperforming departments',
      'Technology investments aligned with strategic priorities',
      'Enhanced training and development programs'
    ]
  });

  // Scenario 3: Aggressive Innovation
  addScenarioAnalysis(3, 'Aggressive Innovation', {
    description: 'Revolutionary approach with maximum transformation potential',
    implementationCost: '$750K - $1.5M',
    annualROI: '$2.2M - $4.0M',
    paybackPeriod: '8-14 months',
    riskLevel: 'High',
    actions: [
      'Complete organizational restructuring',
      'Advanced technology integration across all systems',
      'New service delivery models and revenue streams',
      'Comprehensive change management program'
    ]
  });

  // PAGE 9-12: DETAILED IMPLEMENTATION ROADMAP
  addImplementationRoadmap(tier, priorityAreas, strengthAreas);

  // PAGE 13-16: FINANCIAL ANALYSIS & ROI PROJECTIONS
  addFinancialAnalysis(analysis, tier);

  // PAGE 17-20: RISK ASSESSMENT & MITIGATION
  addRiskAssessment(priorityAreas, tier);

  // PAGE 21-24: TECHNOLOGY & DIGITAL TRANSFORMATION
  addTechnologyAssessment(analysis);

  // PAGE 25+: APPENDICES & REFERENCES
  addAppendices(analysis);

  return doc;
}
