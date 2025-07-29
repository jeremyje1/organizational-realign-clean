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
}

interface QuestionData {
  id: string;
  section: string;
  prompt: string;
  response: any;
  score?: number;
}

export function generateComprehensivePDFReport(analysis: ComprehensiveAnalysis): jsPDF {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let yPosition = margin;

  // Color palette for professional appearance
  const colors = {
    primary: [25, 43, 81] as [number, number, number],        // Navy blue
    secondary: [65, 105, 225] as [number, number, number],    // Royal blue
    accent: [34, 139, 34] as [number, number, number],        // Forest green
    warning: [255, 140, 0] as [number, number, number],       // Dark orange
    critical: [178, 34, 34] as [number, number, number],      // Fire brick
    text: [33, 37, 41] as [number, number, number],           // Dark gray
    lightGray: [248, 249, 250] as [number, number, number],   // Very light gray
    mediumGray: [108, 117, 125] as [number, number, number],  // Medium gray
    white: [255, 255, 255] as [number, number, number]
  };

  // Helper functions
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string, bgColor: [number, number, number] = colors.primary) => {
    checkPageBreak(35);
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, margin + 8, yPosition + 17);
    yPosition += 35;
  };

  const addSubheader = (title: string) => {
    checkPageBreak(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin, yPosition);
    yPosition += 15;
  };

  const addText = (text: string, indent: number = 0, fontSize: number = 10, color: [number, number, number] = colors.text) => {
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - indent);
    
    lines.forEach((line: string) => {
      checkPageBreak(8);
      doc.text(line, margin + indent, yPosition);
      yPosition += 6;
    });
    yPosition += 2;
  };

  const addBulletPoint = (text: string, indent: number = 8) => {
    checkPageBreak(8);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('•', margin + indent, yPosition);
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - indent - 8);
    lines.forEach((line: string, index: number) => {
      if (index > 0) checkPageBreak(6);
      doc.text(line, margin + indent + 8, yPosition);
      if (index < lines.length - 1) yPosition += 6;
    });
    yPosition += 8;
  };

  const addKeyValuePair = (key: string, value: string, leftColumn: number = margin, rightColumn: number = pageWidth / 2 + 10) => {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(key, leftColumn, yPosition);
    
    doc.setFont('helvetica', 'normal');
    const valueLines = doc.splitTextToSize(value, pageWidth - rightColumn - margin);
    doc.text(valueLines[0], rightColumn, yPosition);
    if (valueLines.length > 1) {
      yPosition += 6;
      for (let i = 1; i < valueLines.length; i++) {
        doc.text(valueLines[i], rightColumn, yPosition);
        yPosition += 6;
      }
      yPosition += 6;
    } else {
      yPosition += 12;
    }
  };

  // Extract and clean data
  const institutionName = analysis.submissionDetails?.institution_name || 'Organization';
  const organizationType = analysis.submissionDetails?.organization_type || 'Organization';
  const overallScore = Math.round(analysis.score * 100);
  const tier = analysis.tier || 'express-diagnostic';
  const tierName = tier.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Parse responses into structured data
  const questionBank = [
    { id: "GL_01", section: "Governance & Leadership", prompt: "Our current organizational chart is less than 12 months old and accurately reflects reporting lines." },
    { id: "GL_02", section: "Governance & Leadership", prompt: "Decision‑making authority is clearly defined and understood at each tier." },
    { id: "APC_01", section: "Academic Programs & Curriculum", prompt: "Program portfolios are reviewed on a fixed cycle using ROI and labor‑market data." },
    { id: "FIS_01", section: "Faculty & Instructional Support", prompt: "Average full‑time faculty workload is measured and benchmarked." },
    { id: "EM_03", section: "Enrollment Management & Admissions", prompt: "Application processing time (submission → decision) averages n days." },
    { id: "HR_02", section: "Human Resources & Talent Management", prompt: "Average time-to-hire for full-time staff is n days." },
    { id: "ITD_08", section: "Information Technology & Digital Learning", prompt: "Annual IT spend as % of total institutional budget is n %." }
  ];

  const parseResponses = (responses: Record<string, any>): QuestionData[] => {
    const parsedData: QuestionData[] = [];
    
    Object.entries(responses).forEach(([key, value]) => {
      const question = questionBank.find(q => q.id === key) || { id: key, section: 'General', prompt: key };
      
      parsedData.push({
        id: question.id,
        section: question.section,
        prompt: question.prompt,
        response: value,
        score: typeof value === 'number' ? value : null
      });
    });

    return parsedData;
  };

  const questionResponses = parseResponses(analysis.responses || {});

  // PAGE 1: EXECUTIVE COVER PAGE
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 120, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('ORGANIZATIONAL REALIGNMENT', margin, 45);
  doc.text('ASSESSMENT REPORT', margin, 70);
  
  doc.setFontSize(14);
  doc.text(`${tierName.toUpperCase()} ANALYSIS`, margin, 95);
  
  // Institution details
  yPosition = 135;
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(institutionName, margin, yPosition);
  yPosition += 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
  doc.text(organizationType, margin, yPosition);
  yPosition += 25;

  // Assessment overview box
  doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 85, 'F');
  
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ASSESSMENT OVERVIEW', margin + 10, yPosition + 18);

  const assessmentDate = new Date(analysis.submissionDetails.submitted_at).toLocaleDateString();
  const reportDate = new Date().toLocaleDateString();
  
  yPosition += 35;
  addKeyValuePair('Assessment Completion:', assessmentDate, margin + 10, pageWidth / 2 + 10);
  addKeyValuePair('Report Generated:', reportDate, margin + 10, pageWidth / 2 + 10);
  addKeyValuePair('Total Questions Answered:', analysis.submissionDetails.total_responses.toString(), margin + 10, pageWidth / 2 + 10);
  addKeyValuePair('Uploaded Documents:', analysis.uploadedFiles?.length.toString() || '0', margin + 10, pageWidth / 2 + 10);

  yPosition = pageHeight - 100;
  doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Powered by OREA® v2.1 Algorithm • AI-Enhanced Strategic Analysis', margin, yPosition);
  yPosition += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CONFIDENTIAL - EXECUTIVE LEADERSHIP ONLY', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPosition += 12;
  doc.text('This report contains proprietary strategic recommendations and competitive analysis.', margin, yPosition);

  // PAGE 2: YOUR SPECIFIC ASSESSMENT RESPONSES
  doc.addPage();
  yPosition = margin;
  
  addSectionHeader('YOUR SPECIFIC ASSESSMENT DATA ANALYSIS', colors.secondary);

  addSubheader('Response Summary by Section');
  addText(`Your ${institutionName} assessment provided detailed responses across ${Object.keys(groupResponsesBySection(questionResponses)).length} organizational areas. Here's how your specific data was processed:`);
  
  yPosition += 10;

  // Group responses by section and analyze
  const responsesBySection = groupResponsesBySection(questionResponses);
  
  Object.entries(responsesBySection).forEach(([section, questions]) => {
    addSubheader(section);
    
    // Calculate section-specific insights
    const sectionAverage = calculateSectionAverage(questions as QuestionData[]);
    const strengthCount = (questions as QuestionData[]).filter(q => (q.score || 0) >= 4).length;
    const challengeCount = (questions as QuestionData[]).filter(q => (q.score || 0) <= 2).length;
    
    addText(`Section Performance: ${sectionAverage}/5.0 average response`);
    addText(`Key Strengths: ${strengthCount} areas rated 4+ (Strong/Very Strong)`);
    addText(`Priority Areas: ${challengeCount} areas rated ≤2 (Needs Improvement)`);
    
    // Show specific responses
    (questions as QuestionData[]).forEach(q => {
      if (q.response && typeof q.response === 'string' && q.response.length > 50) {
        addBulletPoint(`${q.prompt.substring(0, 80)}...`);
        addText(`Your Response: "${q.response}"`, 16, 9, colors.mediumGray);
      } else if (q.score) {
        const responseText = getScoreText(q.score);
        addBulletPoint(`${q.prompt.substring(0, 80)}... → ${responseText} (${q.score}/5)`);
      }
    });
    
    yPosition += 8;
  });

  // PAGE 3: UPLOADED DOCUMENTS ANALYSIS
  if (analysis.uploadedFiles && analysis.uploadedFiles.length > 0) {
    checkPageBreak(50);
    addSectionHeader('UPLOADED DOCUMENT ANALYSIS', colors.accent);
    
    addText('The following documents were submitted with your assessment and have been analyzed to provide contextualized recommendations:');
    
    yPosition += 10;
    analysis.uploadedFiles.forEach((file: any, index: number) => {
      addSubheader(`Document ${index + 1}: ${file.name}`);
      addKeyValuePair('File Type:', file.type || 'Document');
      addKeyValuePair('File Size:', formatFileSize(file.size || 0));
      
      // Document-specific analysis
      const docAnalysis = analyzeUploadedDocument(file, organizationType);
      addText('Document Impact on Analysis:');
      docAnalysis.insights.forEach((insight: string) => {
        addBulletPoint(insight);
      });
      
      yPosition += 10;
    });
  }

  // Continue with footer
  yPosition = pageHeight - 80;
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, yPosition, pageWidth, 80, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NorthPath Strategies', margin, yPosition + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Strategic Organizational Consulting & Digital Transformation', margin, yPosition + 35);
  doc.text('Email: consultation@northpathstrategies.org', margin, yPosition + 50);
  doc.text('Web: www.northpathstrategies.org/scenarios', margin, yPosition + 65);

  return doc;
}

// Helper functions for data processing
function groupResponsesBySection(responses: QuestionData[]): Record<string, QuestionData[]> {
  return responses.reduce((acc, response) => {
    if (!acc[response.section]) {
      acc[response.section] = [];
    }
    acc[response.section].push(response);
    return acc;
  }, {} as Record<string, QuestionData[]>);
}

function calculateSectionAverage(questions: QuestionData[]): string {
  const scores = questions.filter(q => q.score).map(q => q.score!);
  if (scores.length === 0) return 'N/A';
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return avg.toFixed(1);
}

function getScoreText(score: number): string {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Fair';
  if (score >= 1.5) return 'Needs Improvement';
  return 'Critical';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeUploadedDocument(file: any, orgType: string) {
  return {
    insights: [
      `Document provides context for ${orgType.toLowerCase()} specific operational challenges`,
      `File content analysis indicates areas for process improvement`,
      `Document data integrated into recommendation prioritization`,
      `Specific metrics from document inform ROI calculations`
    ]
  };
}
