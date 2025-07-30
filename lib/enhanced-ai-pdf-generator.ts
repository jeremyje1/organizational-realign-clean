import jsPDF from 'jspdf';
import { runOpenAI } from './openai';
import { generateOrgChartImage, AIImageGenerator } from './ai-image-generator';
import { HistoricalTrendAnalyzer } from './historical-trend-analyzer';
import { IndustryDataIntegrator } from './industry-data-integrator';
import { LivePeerBenchmarking } from './live-peer-benchmarking';

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
  openEndedResponses?: Record<string, any>;
}

interface AIInsights {
  executiveSummary: string;
  detailedAnalysis: string;
  strategicRecommendations: string;
  implementationPlan: string;
  riskAssessment: string;
  industryComparisons: string;
  financialProjections: string;
  changeManagement: string;
  orgChartAnalysis?: string;
}

export async function generateEnhancedAIPDFReport(analysis: ComprehensiveAnalysis): Promise<jsPDF> {
  console.log('Generating enhanced AI-powered PDF report with tier-based scaling, historical trends, live benchmarks, and org chart visualization...');
  
  // Get tier-based content settings
  const assessmentTier = analysis.tier || 'express-diagnostic';
  const tierSettings = {
    'express-diagnostic': { targetPages: 25, analysisDepth: 'standard', includeAdvanced: false },
    'one-time-diagnostic': { targetPages: 35, analysisDepth: 'comprehensive', includeAdvanced: true },
    'comprehensive-package': { targetPages: 45, analysisDepth: 'comprehensive', includeAdvanced: true },
    'enterprise-transformation': { targetPages: 55, analysisDepth: 'enterprise', includeAdvanced: true }
  };
  const settings = tierSettings[assessmentTier as keyof typeof tierSettings] || tierSettings['express-diagnostic'];
  
  console.log(`📊 Generating ${assessmentTier} tier report (target: ${settings.targetPages} pages, depth: ${settings.analysisDepth})`);
  
  // Initialize advanced analytics engines
  const historicalAnalyzer = new HistoricalTrendAnalyzer();
  const industryIntegrator = new IndustryDataIntegrator();
  const peerBenchmarking = new LivePeerBenchmarking();
  
  // Generate comprehensive AI insights with enhanced context
  const [aiInsights, historicalInsights, industryBenchmarks, peerAnalysis] = await Promise.all([
    generateComprehensiveAIInsights(analysis),
    settings.includeAdvanced ? 
      historicalAnalyzer.generateHistoricalAIInsights(analysis.assessmentId, analysis) :
      Promise.resolve(''),
    settings.includeAdvanced ?
      industryIntegrator.getLiveBenchmarks(
        analysis.submissionDetails?.organization_type as any || 'higher_education',
        'medium',
        'mixed'
      ).then(benchmarks => industryIntegrator.generateIndustryContextAI(analysis, benchmarks)) :
      Promise.resolve(''),
    settings.includeAdvanced ?
      peerBenchmarking.findSimilarPeers(analysis).then(async cohort => {
        const competitiveIntel = await peerBenchmarking.generateCompetitiveIntelligence(analysis, cohort);
        return peerBenchmarking.generatePeerBenchmarkingAI(analysis, cohort, competitiveIntel);
      }) :
      Promise.resolve('')
  ]);
  
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

  // Helper functions
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
    doc.text(`${analysis.submissionDetails?.institution_name || 'Organization'} - AI-Enhanced Assessment Report`, margin, pageHeight - 10);
    doc.text(`Page ${currentPage}`, pageWidth - margin - 20, pageHeight - 10);
    doc.text(`Confidential - Assessment ID: ${analysis.assessmentId}`, pageWidth / 2 - 30, pageHeight - 10);
  };

  const addImageFromBase64 = (base64Data: string, x: number, y: number, width: number, height: number) => {
    try {
      // Check if we need a page break
      checkPageBreak(height + 20);
      
      // Add the image
      const imgProps = doc.getImageProperties('data:image/png;base64,' + base64Data);
      const imgWidth = width;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      doc.addImage('data:image/png;base64,' + base64Data, 'PNG', x, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      // Add placeholder text instead
      addText(`[Org Chart Image - Error loading: ${error instanceof Error ? error.message : 'Unknown error'}]`, {
        fontSize: 10,
        color: colors.mediumGray,
        fontStyle: 'italic'
      });
    }
  };

  const addSVGAsText = (svgContent: string, title: string = 'Organizational Chart') => {
    addSubHeader(title);
    addText('[Professional SVG Organizational Chart Generated]', {
      fontSize: 12,
      color: colors.secondary,
      fontStyle: 'bold'
    });
    addText('High-quality organizational chart visualization created with professional styling and AI analysis.', {
      fontSize: 10,
      color: colors.text
    });
    yPosition += 10;
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
    yPosition += 3;
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

  // Data extraction
  const institutionName = analysis.submissionDetails?.institution_name || 'Your Institution';
  const organizationType = analysis.submissionDetails?.organization_type || 'Higher Education Institution';
  const tier = analysis.tier || 'express-diagnostic';
  const overallScore = analysis.score || 0.75;
  const assessmentDate = new Date(analysis.submissionDetails?.submitted_at || Date.now()).toLocaleDateString();
  const reportDate = new Date().toLocaleDateString();

  // PAGE 1: EXECUTIVE COVER PAGE
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 120, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('AI-ENHANCED ASSESSMENT', margin, 45);
  doc.setFontSize(24);
  doc.text('STRATEGIC INTELLIGENCE REPORT', margin, 75);
  doc.setFontSize(16);
  doc.text(`${tier.toUpperCase().replace('-', ' ')} + AI ANALYSIS`, margin, 100);
  
  yPosition = 140;
  
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

  // Enhanced overview with AI badge
  addDataTable([
    { label: 'Assessment Completed:', value: assessmentDate },
    { label: 'Report Generated:', value: reportDate },
    { label: 'Analysis Method:', value: 'AI-Enhanced + Data-Driven' },
    { label: 'AI Model Used:', value: 'GPT-4o (Latest)' },
    { label: 'Overall Performance Score:', value: `${Math.round(overallScore * 100)}%` },
    { label: 'Total Data Points Analyzed:', value: (analysis.submissionDetails?.total_responses || 0 + (analysis.uploadedFiles?.length || 0) * 10).toString() }
  ], 'Enhanced Assessment Summary');

  addPageFooter();

  // PAGE 2-4: AI-GENERATED EXECUTIVE SUMMARY
  checkPageBreak(0, true);
  addSectionHeader('AI-ENHANCED EXECUTIVE SUMMARY', colors.primary, 18);
  
  // Parse and format the AI-generated executive summary
  const summaryParagraphs = aiInsights.executiveSummary.split('\n\n');
  summaryParagraphs.forEach(paragraph => {
    if (paragraph.trim()) {
      if (paragraph.includes('Key Findings') || paragraph.includes('Strategic') || paragraph.includes('Summary')) {
        addSubHeader(paragraph.trim());
      } else {
        addText(paragraph.trim());
        yPosition += 5;
      }
    }
  });

  // PAGE 5-8: DEEP AI ANALYSIS
  checkPageBreak(0, true);
  addSectionHeader('COMPREHENSIVE AI INTELLIGENCE', colors.secondary);
  
  addSubHeader('AI-Powered Institutional Analysis');
  addText('This analysis leverages advanced AI to provide contextual insights specific to your organization type, size, and industry. The following analysis goes beyond traditional scoring to identify patterns, correlations, and strategic opportunities.');
  
  const analysisPoints = aiInsights.detailedAnalysis.split('\n').filter(line => line.trim());
  analysisPoints.forEach(point => {
    if (point.includes(':') && point.length < 100) {
      addSubHeader(point.trim(), colors.accent);
    } else if (point.trim().startsWith('•') || point.trim().startsWith('-')) {
      const bulletPoints = analysisPoints.filter(p => p.trim().startsWith('•') || p.trim().startsWith('-'));
      addBulletList(bulletPoints.map(p => p.replace(/^[•-]\s*/, '')));
      return;
    } else if (point.trim().length > 20) {
      addText(point.trim());
    }
  });

  // PAGE 9-12: AI STRATEGIC RECOMMENDATIONS
  checkPageBreak(0, true);
  addSectionHeader('AI-GENERATED STRATEGIC ROADMAP', colors.accent);
  
  addSubHeader('Intelligent Recommendations');
  addText('Based on AI analysis of your specific responses, institutional context, and industry benchmarks:');
  
  const recommendations = aiInsights.strategicRecommendations.split('\n').filter(line => line.trim());
  let currentSection = '';
  
  recommendations.forEach(rec => {
    if (rec.includes('Priority') || rec.includes('Phase') || rec.includes('Term') || rec.includes('Strategic')) {
      addSubHeader(rec.trim(), colors.primary);
    } else if (rec.trim().startsWith('•') || rec.trim().startsWith('-') || rec.trim().match(/^\d+\./)) {
      addBulletList([rec.replace(/^[•-]\s*|\d+\.\s*/, '')]);
    } else if (rec.trim().length > 20) {
      addText(rec.trim());
    }
  });

  // PAGE 13-16: IMPLEMENTATION PLAN
  checkPageBreak(0, true);
  addSectionHeader('AI-OPTIMIZED IMPLEMENTATION PLAN', colors.warning);
  
  addText('This implementation plan is customized by AI based on your organizational readiness, resource constraints, and strategic priorities identified in your assessment.');
  
  const implementationSections = aiInsights.implementationPlan.split('\n\n');
  implementationSections.forEach(section => {
    if (section.trim()) {
      const lines = section.split('\n');
      if (lines[0] && lines[0].includes('Phase') || lines[0].includes('Month') || lines[0].includes('Quarter')) {
        addSubHeader(lines[0].trim());
        lines.slice(1).forEach(line => {
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            addBulletList([line.replace(/^[•-]\s*/, '')]);
          } else if (line.trim()) {
            addText(line.trim());
          }
        });
      }
    }
  });

  // PAGE 17-20: RISK ANALYSIS
  checkPageBreak(0, true);
  addSectionHeader('AI RISK ASSESSMENT & MITIGATION', colors.critical);
  
  const riskSections = aiInsights.riskAssessment.split('\n\n');
  riskSections.forEach(section => {
    if (section.trim()) {
      const firstLine = section.split('\n')[0];
      if (firstLine.includes('Risk') || firstLine.includes('Mitigation') || firstLine.includes('Strategy')) {
        addSubHeader(firstLine.trim());
        const content = section.replace(firstLine, '').trim();
        addText(content);
      }
    }
  });

  // PAGE 21-24: INDUSTRY BENCHMARKING
  checkPageBreak(0, true);
  addSectionHeader('AI INDUSTRY INTELLIGENCE', colors.secondary);
  
  addText('AI-powered comparison with industry standards and best practices:');
  addText(aiInsights.industryComparisons);

  // PAGE 25-28: FINANCIAL PROJECTIONS
  checkPageBreak(0, true);
  addSectionHeader('AI FINANCIAL IMPACT MODELING', colors.success);
  
  addText(aiInsights.financialProjections);

  // PAGE 29+: CHANGE MANAGEMENT
  checkPageBreak(0, true);
  addSectionHeader('AI-POWERED CHANGE STRATEGY', colors.accent);
  
  addText(aiInsights.changeManagement);

  // PAGE 30+: AI-GENERATED ORGANIZATIONAL CHART & ANALYSIS
  if (analysis.orgChart || aiInsights.orgChartAnalysis) {
    checkPageBreak(0, true);
    addSectionHeader('AI-ENHANCED ORGANIZATIONAL ANALYSIS', colors.primary);
    
    // Generate AI-powered org chart image
    try {
      console.log('🎨 Generating AI org chart visualization...');
      
      const orgChartImage = await generateOrgChartImage({
        orgChart: analysis.orgChart,
        institutionName: institutionName,
        organizationType: organizationType,
        style: 'executive',
        theme: organizationType.toLowerCase().includes('education') ? 'education' : 'corporate',
        includeMetrics: true
      });

      if (orgChartImage.success) {
        if (orgChartImage.imageData) {
          addSubHeader('AI-Generated Organizational Chart', colors.secondary);
          addText('Professional organizational chart generated using DALL-E 3 with institutional context and assessment data integration.');
          addImageFromBase64(orgChartImage.imageData, margin, yPosition, pageWidth - 2 * margin - 20, 0);
        } else if (orgChartImage.fallbackSVG) {
          addSVGAsText(orgChartImage.fallbackSVG, 'Professional Organizational Chart');
        }
      } else {
        addSubHeader('Organizational Structure Analysis', colors.secondary);
        addText('Organizational chart generation encountered an issue, but structural analysis is included below.');
      }

      // Add AI analysis of org chart
      if (aiInsights.orgChartAnalysis) {
        addSubHeader('AI Organizational Structure Insights');
        addText(aiInsights.orgChartAnalysis);
      } else if (analysis.orgChart) {
        // Add basic org chart data summary
        addSubHeader('Organizational Data Summary');
        try {
          const chartData = typeof analysis.orgChart.data === 'string' 
            ? JSON.parse(analysis.orgChart.data) 
            : analysis.orgChart.data;
          
          if (Array.isArray(chartData)) {
            addDataTable([
              { label: 'Total Roles Identified:', value: chartData.length.toString() },
              { label: 'Organizational Levels:', value: Math.max(...chartData.map(role => role.level || 1)).toString() },
              { label: 'Departments:', value: Array.from(new Set(chartData.map(role => role.department || 'General'))).length.toString() },
              { label: 'Total FTE Count:', value: chartData.reduce((sum, role) => sum + (role.fte || 1), 0).toFixed(1) },
              { label: 'Estimated Annual Cost:', value: `$${chartData.reduce((sum, role) => sum + (role.annualCost || 75000), 0).toLocaleString()}` }
            ], 'Organizational Metrics');
          }
        } catch (error) {
          console.error('Error processing org chart data:', error);
          addText('Organizational chart data is available but requires additional processing for detailed analysis.');
        }
      }

      // Add scenario analysis if available
      if (analysis.scenarios && Array.isArray(analysis.scenarios)) {
        addSubHeader('Scenario Cost Analysis', colors.warning);
        analysis.scenarios.forEach((scenario: any, index: number) => {
          addText(`Scenario ${index + 1}: ${scenario.name || `Option ${index + 1}`}`, {
            fontStyle: 'bold',
            fontSize: 12
          });
          addText(`Projected Cost: $${(scenario.totalCost || 0).toLocaleString()}`);
          addText(`Efficiency Rating: ${scenario.efficiency || 'Not calculated'}`);
          yPosition += 5;
        });
      }

    } catch (error) {
      console.error('Error generating org chart section:', error);
      addSubHeader('Organizational Structure Analysis', colors.secondary);
      addText('Organizational analysis is being processed. Please contact support if you need immediate access to detailed organizational charts.');
    }
  }

  // ADVANCED ANALYTICS SECTIONS (for higher tiers only)
  if (settings.includeAdvanced) {
    try {
      // HISTORICAL TREND ANALYSIS
      if (historicalInsights) {
        checkPageBreak(0, true);
        addSectionHeader('LONGITUDINAL PERFORMANCE ANALYSIS', colors.accent);
        addSubHeader('Historical Performance Trends');
        addText('Advanced AI analysis of your institution\'s performance trajectory over time, including predictive insights and trend-based recommendations.');
        addText(historicalInsights);
      }

      // REAL-TIME INDUSTRY BENCHMARKING
      if (industryBenchmarks) {
        checkPageBreak(0, true);
        addSectionHeader('LIVE INDUSTRY INTELLIGENCE', colors.secondary);
        addSubHeader('Real-Time Market Context');
        addText('Current industry data integrated from authoritative sources including government databases, professional associations, and economic indicators.');
        addText(industryBenchmarks);
      }

      // LIVE PEER BENCHMARKING
      if (peerAnalysis) {
        checkPageBreak(0, true);
        addSectionHeader('COMPETITIVE PEER ANALYSIS', [65, 105, 225]);
        addSubHeader('Live Peer Benchmarking');
        addText('Dynamic comparison with similar institutions based on real assessment data, providing actionable competitive intelligence.');
        addText(peerAnalysis);
      }

      // INTEGRATED STRATEGIC SYNTHESIS
      checkPageBreak(0, true);
      addSectionHeader('AI-POWERED STRATEGIC SYNTHESIS', colors.success);
      addSubHeader('Integrated Intelligence Summary');
      addText('Comprehensive analysis combining historical performance, industry context, peer benchmarking, and predictive modeling to provide definitive strategic guidance.');
      
      // Generate synthesized recommendations
      const synthesizedInsights = await runOpenAI(`
        As a senior strategic consultant, provide integrated strategic recommendations for ${analysis.submissionDetails?.institution_name} based on comprehensive intelligence analysis.
        
        Synthesize insights from: historical performance patterns, real-time industry data, peer competitive analysis.
        
        Provide prioritized recommendations for immediate actions (90 days), strategic initiatives (6-18 months), and transformational goals (2+ years).
        
        Focus on actionable strategies that leverage competitive advantages while addressing improvement opportunities identified through the comprehensive analysis.
      `, {
        model: 'gpt-4o',
        maxTokens: 2000,
        temperature: 0.4
      });
      
      addText(synthesizedInsights);

      // EXECUTIVE ACTION DASHBOARD
      addSubHeader('Priority Action Matrix');
      addText('Based on all available intelligence, the following actions are prioritized by impact potential and implementation feasibility:');
      
      // Add action matrix table
      addDataTable([
        { label: 'Immediate Priority (0-90 days):', value: 'Address competitive gaps identified in peer analysis' },
        { label: 'Short-term Focus (3-12 months):', value: 'Implement industry-standard practices in underperforming areas' },
        { label: 'Strategic Initiative (1-2 years):', value: 'Leverage historical strengths for competitive advantage' },
        { label: 'Continuous Monitoring:', value: 'Track peer performance and industry trends quarterly' }
      ], 'Strategic Action Timeline');
    } catch (error) {
      console.error('Advanced analytics error:', error);
      addText('Note: Some advanced analytics features encountered issues but core assessment analysis is complete.');
    }
  }

  // Final page with enhanced summary
  checkPageBreak(0, true);
  addSectionHeader('CONCLUSION & NEXT STEPS', colors.primary);
  addSubHeader('Report Summary');
  
  const finalSummary = settings.includeAdvanced ? 
    'This comprehensive AI-enhanced assessment leverages historical data analysis, real-time industry intelligence, and live peer benchmarking to provide unparalleled strategic insights. The recommendations are based on actual market data and proven best practices from similar high-performing institutions.' :
    'This AI-enhanced assessment provides strategic recommendations based on your institutional profile and assessment responses. For more comprehensive analysis including historical trends and competitive intelligence, consider upgrading to a higher-tier assessment.';
  
  addText(finalSummary);
  yPosition += 10;
  
  addSubHeader('Implementation Support');
  addText(`As a ${assessmentTier} client, you have access to specific implementation resources and support channels. Contact your assessment team to discuss next steps and implementation planning.`);

  console.log(`✅ Enhanced AI-powered PDF report generated successfully with ${currentPage} pages (target: ${settings.targetPages})`);

  return doc;
}

async function generateComprehensiveAIInsights(analysis: ComprehensiveAnalysis): Promise<AIInsights> {
  console.log('Generating comprehensive AI insights with GPT-4o...');
  
  const institutionContext = {
    name: analysis.submissionDetails?.institution_name,
    type: analysis.submissionDetails?.organization_type,
    size: analysis.submissionDetails?.total_responses,
    score: analysis.score,
    tier: analysis.tier,
    responses: analysis.responses,
    openEnded: analysis.openEndedResponses,
    sectionScores: analysis.sectionScores
  };

  // Generate Executive Summary
  const executiveSummary = await runOpenAI(`
    You are an expert organizational consultant with 20+ years of experience in higher education and institutional transformation. 

    Create a comprehensive 3-page executive summary for ${institutionContext.name} (${institutionContext.type}) based on this assessment data:
    
    Overall Score: ${institutionContext.score}/5.0
    Service Tier: ${institutionContext.tier}
    Section Scores: ${JSON.stringify(institutionContext.sectionScores, null, 2)}
    Key Responses: ${JSON.stringify(institutionContext.responses, null, 2)}
    Open-Ended Responses: ${JSON.stringify(institutionContext.openEnded, null, 2)}

    Structure the executive summary with:
    1. Strategic Overview (2-3 paragraphs summarizing institutional health)
    2. Critical Success Factors (what's working well)
    3. Priority Challenge Areas (what needs immediate attention)  
    4. Competitive Position Analysis
    5. Transformation Opportunity Assessment
    6. Leadership Recommendations

    Use authoritative, strategic language appropriate for C-suite executives. Include specific data points and scores. Make concrete, actionable recommendations based on the actual assessment data provided.
  `, { 
    model: 'gpt-4o',
    maxTokens: 4000,
    temperature: 0.3
  });

  // Generate Detailed Analysis
  const detailedAnalysis = await runOpenAI(`
    As a senior organizational analyst, provide an in-depth analysis of ${institutionContext.name}'s organizational health:

    Assessment Data: ${JSON.stringify(institutionContext, null, 2)}

    Analyze:
    1. Organizational Structure & Governance Effectiveness
    2. Operational Efficiency & Process Optimization
    3. Technology Integration & Digital Maturity
    4. Cultural Alignment & Change Readiness
    5. Financial Performance & Resource Utilization
    6. Strategic Planning & Execution Capability
    7. Stakeholder Engagement & Communication
    8. Risk Management & Compliance Posture

    For each area, identify:
    - Current state assessment based on the data
    - Gap analysis against best practices
    - Interconnections between different organizational areas
    - Specific opportunities for improvement
    
    Use the actual scores and responses to support your analysis.
  `, { 
    model: 'gpt-4o',
    maxTokens: 4000,
    temperature: 0.4
  });

  // Generate Strategic Recommendations  
  const strategicRecommendations = await runOpenAI(`
    Based on the assessment of ${institutionContext.name}, create a strategic recommendation framework:

    Data Context: ${JSON.stringify(institutionContext, null, 2)}

    Provide recommendations in this structure:

    IMMEDIATE PRIORITIES (0-90 days):
    - Quick wins that can be implemented immediately
    - Critical issues requiring urgent attention
    - Low-hanging fruit opportunities

    SHORT-TERM INITIATIVES (3-12 months):
    - Process improvements and operational changes
    - Technology implementations
    - Training and development programs

    LONG-TERM STRATEGIC CHANGES (1-3 years):
    - Structural transformations
    - Cultural change initiatives  
    - Strategic capability building

    For each recommendation, specify:
    - Rationale based on assessment data
    - Expected impact and benefits
    - Resource requirements
    - Success metrics
    - Implementation considerations

    Prioritize recommendations based on ROI, feasibility, and strategic importance.
  `, { 
    model: 'gpt-4o',
    maxTokens: 3500,
    temperature: 0.5
  });

  // Generate Implementation Plan
  const implementationPlan = await runOpenAI(`
    Create a detailed implementation roadmap for ${institutionContext.name} based on their assessment results:

    ${JSON.stringify(institutionContext, null, 2)}

    Structure as a phased implementation plan:

    PHASE 1 - Foundation Setting (Months 1-3):
    - Detailed planning and stakeholder alignment
    - Quick wins and early momentum building
    - Infrastructure preparation

    PHASE 2 - Core Implementation (Months 4-9):
    - Major system implementations
    - Process redesign and optimization
    - Training and change management

    PHASE 3 - Integration & Optimization (Months 10-15):
    - System integration and data connectivity
    - Performance optimization
    - Advanced capability development

    PHASE 4 - Scaling & Continuous Improvement (Months 16-24):
    - Scaling successful initiatives
    - Continuous improvement processes
    - Advanced analytics and reporting

    For each phase include:
    - Specific milestones and deliverables
    - Resource allocation and staffing
    - Risk mitigation strategies
    - Success criteria and KPIs
    - Dependencies and critical path items
  `, { 
    model: 'gpt-4o',
    maxTokens: 3500,
    temperature: 0.4
  });

  // Generate Risk Assessment
  const riskAssessment = await runOpenAI(`
    Conduct a comprehensive risk assessment for ${institutionContext.name}'s transformation initiative:

    Assessment Context: ${JSON.stringify(institutionContext, null, 2)}

    Identify and analyze:

    HIGH-RISK AREAS:
    - Organizational resistance to change
    - Resource and capacity constraints  
    - Technology integration challenges
    - Regulatory and compliance risks

    MEDIUM-RISK AREAS:
    - Timeline and scope management
    - Stakeholder engagement challenges
    - Performance measurement difficulties
    - External market pressures

    LOW-RISK AREAS:
    - Areas of organizational strength
    - Supportive factors and enablers

    For each risk category provide:
    - Specific risk factors based on assessment data
    - Probability and potential impact assessment
    - Early warning indicators
    - Detailed mitigation strategies
    - Contingency planning approaches
    - Monitoring and control mechanisms

    Include risk interdependencies and cascading effects.
  `, { 
    model: 'gpt-4o',
    maxTokens: 3000,
    temperature: 0.3
  });

  // Generate Industry Comparisons
  const industryComparisons = await runOpenAI(`
    Provide industry benchmarking analysis for ${institutionContext.name} in the ${institutionContext.type} sector:

    Institution Data: ${JSON.stringify(institutionContext, null, 2)}

    Compare performance against:
    1. Industry averages for ${institutionContext.type} organizations
    2. Best-in-class institutions of similar size and type
    3. Emerging trends and future state benchmarks

    Analysis areas:
    - Operational efficiency metrics
    - Technology adoption and digital maturity
    - Financial performance indicators
    - Organizational effectiveness measures
    - Innovation and transformation readiness

    Identify:
    - Competitive advantages and differentiators
    - Performance gaps and improvement opportunities  
    - Industry position and market standing
    - Benchmarking against leading practices
    - Future-state aspirational targets

    Provide specific data-driven insights about where this institution stands relative to peers.
  `, { 
    model: 'gpt-4o',
    maxTokens: 2500,
    temperature: 0.4
  });

  // Generate Financial Projections
  const financialProjections = await runOpenAI(`
    Develop financial impact projections for ${institutionContext.name}'s transformation initiative:

    Current State: ${JSON.stringify(institutionContext, null, 2)}

    Model financial impacts across:

    COST SAVINGS OPPORTUNITIES:
    - Process efficiency improvements
    - Technology automation benefits
    - Resource optimization gains
    - Operational waste reduction

    REVENUE ENHANCEMENT POTENTIAL:
    - Service delivery improvements
    - New capability development
    - Operational excellence benefits
    - Strategic positioning advantages

    INVESTMENT REQUIREMENTS:
    - Technology infrastructure costs
    - Training and development expenses
    - Change management investments
    - External consulting and support

    Provide:
    - Year 1-3 financial projections
    - ROI analysis and payback periods
    - Cash flow impact modeling
    - Sensitivity analysis scenarios
    - Risk-adjusted financial returns
    - Cost-benefit analysis summary

    Base projections on assessment data and industry benchmarks for ${institutionContext.type} organizations.
  `, { 
    model: 'gpt-4o',
    maxTokens: 2500,
    temperature: 0.3
  });

  // Generate Change Management Strategy
  const changeManagement = await runOpenAI(`
    Design a comprehensive change management strategy for ${institutionContext.name}:

    Organizational Context: ${JSON.stringify(institutionContext, null, 2)}

    Develop change strategy covering:

    CHANGE READINESS ASSESSMENT:
    - Current culture and change capacity
    - Leadership commitment and capability
    - Historical change experiences
    - Stakeholder influence mapping

    CHANGE COMMUNICATION PLAN:
    - Key messages and value propositions
    - Stakeholder-specific communication strategies
    - Communication channels and frequency
    - Feedback and engagement mechanisms

    TRAINING & DEVELOPMENT FRAMEWORK:
    - Skill gap analysis and development needs
    - Training program design and delivery
    - Competency building pathways
    - Performance support systems

    RESISTANCE MANAGEMENT:
    - Anticipated sources of resistance
    - Resistance mitigation strategies
    - Stakeholder engagement approaches
    - Culture change interventions

    SUCCESS ENABLERS:
    - Leadership behaviors and modeling
    - Organizational structure adjustments
    - Incentive and recognition alignment
    - Measurement and monitoring systems

    Tailor recommendations specifically to the organizational profile and assessment results.
  `, { 
    model: 'gpt-4o',
    maxTokens: 3000,
    temperature: 0.4
  });

  // Generate Organizational Chart Analysis (if org chart data exists)
  let orgChartAnalysis = '';
  if (analysis.orgChart) {
    orgChartAnalysis = await runOpenAI(`
      Provide comprehensive AI analysis of the organizational structure for ${institutionContext.name}:

      Org Chart Data: ${JSON.stringify(analysis.orgChart, null, 2)}
      Assessment Context: ${JSON.stringify(institutionContext, null, 2)}
      
      Analyze the organizational structure across these dimensions:

      STRUCTURAL ANALYSIS:
      - Hierarchy effectiveness and span of control
      - Role clarity and reporting relationships
      - Department alignment and integration
      - Leadership distribution and decision-making flows

      EFFICIENCY ASSESSMENT:
      - Organizational complexity and redundancies
      - Resource allocation and utilization
      - Communication pathways and bottlenecks
      - Operational effectiveness by department

      COST OPTIMIZATION OPPORTUNITIES:
      - Overstaffed or understaffed areas
      - Role consolidation possibilities
      - Cross-functional efficiency gains
      - Strategic restructuring recommendations

      CAPABILITY ANALYSIS:
      - Core competency distribution
      - Skills gaps and development needs
      - Succession planning considerations
      - Talent management priorities

      STRATEGIC ALIGNMENT:
      - Structure-strategy fit assessment
      - Support for institutional goals
      - Agility and adaptability factors
      - Growth and scaling considerations

      CHANGE RECOMMENDATIONS:
      - Immediate structural improvements
      - Medium-term reorganization opportunities
      - Long-term strategic restructuring
      - Implementation complexity and risks

      Provide specific, actionable insights based on the actual organizational data and assessment results.
    `, { 
      model: 'gpt-4o',
      maxTokens: 3500,
      temperature: 0.3
    });
  }

  return {
    executiveSummary,
    detailedAnalysis,
    strategicRecommendations,
    implementationPlan,
    riskAssessment,
    industryComparisons,
    financialProjections,
    changeManagement,
    orgChartAnalysis
  };
}

// Generate synthesized strategic recommendations combining all data sources
async function generateSynthesizedRecommendations(
  analysis: ComprehensiveAnalysis,
  historicalInsights: string,
  industryBenchmarks: string,
  peerAnalysis: string
): Promise<string> {
  const institutionContext = {
    name: analysis.submissionDetails?.institution_name,
    type: analysis.submissionDetails?.organization_type,
    score: analysis.score,
    tier: analysis.tier
  };

  return await runOpenAI(`
    As a senior strategic consultant, synthesize the following comprehensive intelligence into definitive strategic recommendations for ${institutionContext.name}:

    CURRENT ASSESSMENT DATA:
    - Overall Performance Score: ${institutionContext.score}/5.0
    - Service Tier: ${institutionContext.tier}
    - Institution Type: ${institutionContext.type}

    HISTORICAL PERFORMANCE CONTEXT:
    ${historicalInsights}

    REAL-TIME INDUSTRY INTELLIGENCE:
    ${industryBenchmarks}

    COMPETITIVE PEER ANALYSIS:
    ${peerAnalysis}

    Based on this comprehensive intelligence, provide INTEGRATED STRATEGIC RECOMMENDATIONS that:

    1. IMMEDIATE ACTIONS (Next 90 Days):
       - Specific tactical moves based on competitive gaps
       - Quick wins that align with industry trends
       - Risk mitigation priorities

    2. STRATEGIC INITIATIVES (6-18 Months):
       - Competitive positioning moves
       - Industry-aligned capability building
       - Historical strength leveraging

    3. TRANSFORMATIONAL GOALS (2+ Years):
       - Visionary positioning based on market intelligence
       - Industry leadership opportunities
       - Sustainable competitive advantages

    For each recommendation, specify:
    - Strategic rationale combining all data sources
    - Expected impact on competitive position
    - Resource requirements and success metrics
    - Connection to historical performance patterns

    Prioritize recommendations by:
    - Potential competitive impact
    - Implementation feasibility
    - Alignment with industry trends
    - Historical success likelihood

    Use authoritative, strategic language appropriate for executive decision-making.
  `, {
    model: 'gpt-4o',
    maxTokens: 3500,
    temperature: 0.4
  });
}
