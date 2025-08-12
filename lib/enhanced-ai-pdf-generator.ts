import jsPDF from 'jspdf';
import { runOpenAI } from './openai';

// Clean minimal implementation. Advanced analytics intentionally removed pending refactor.
// Only responsibility: produce a concise PDF with core metrics + single AI summary block.

export interface ComprehensiveAnalysis {
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

export async function generateEnhancedAIPDFReport(analysis: ComprehensiveAnalysis): Promise<jsPDF> {
  const tier = normalizeTier(analysis.tier);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 18;
  let y = margin;

  const colors = {
    primary: [15, 61, 130] as [number, number, number],
    text: [34, 38, 46] as [number, number, number],
    accent: [212, 175, 55] as [number, number, number]
  };

  const newPage = () => { doc.addPage(); y = margin; addFooter(); };
  const addFooter = () => {
    const page = doc.getNumberOfPages();
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 126, 134);
    doc.text(`Assessment ID: ${analysis.assessmentId}`, margin, pageHeight - 8);
    doc.text(`Page ${page}`, pageWidth - margin - 20, pageHeight - 8);
  };

  const addHeader = (title: string) => {
    if (y + 30 > pageHeight - margin) newPage();
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y, pageWidth - margin * 2, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin + 4, y + 9);
    y += 20;
    doc.setTextColor(...colors.text);
  };

  const addText = (text: string, options: { size?: number; bold?: boolean; gap?: number } = {}) => {
    const { size = 10, bold = false, gap = 6 } = options;
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach(line => {
      if (y + 8 > pageHeight - margin) newPage();
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.text(line, margin, y);
      y += gap;
    });
    y += 2;
  };

  const addKeyValueTable = (rows: { label: string; value: string | number }[], title?: string) => {
    if (title) addText(title, { bold: true, size: 11, gap: 7 });
    rows.forEach(r => {
      if (y + 8 > pageHeight - margin) newPage();
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(r.label + ':', margin, y);
      doc.setFont('helvetica', 'normal'); doc.text(String(r.value), margin + 60, y);
      y += 6;
    });
    y += 4;
  };

  // Title Page
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(255, 255, 255);
  doc.text('NorthPath Strategies', pageWidth / 2, 40, { align: 'center' });
  doc.setFontSize(16);
  doc.text('AI-Enhanced Organizational Assessment', pageWidth / 2, 58, { align: 'center' });
  doc.setFontSize(12); doc.setFont('helvetica', 'normal');
  doc.text(`${analysis.submissionDetails.institution_name}`, pageWidth / 2, 78, { align: 'center' });
  doc.text(`Tier: ${tier}`, pageWidth / 2, 88, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 98, { align: 'center' });
  doc.text(`Assessment ID: ${analysis.assessmentId}`, pageWidth / 2, 108, { align: 'center' });
  doc.addPage(); y = margin;

  // Overview Section
  addHeader('EXECUTIVE OVERVIEW');
  addKeyValueTable([
    { label: 'Overall Score', value: analysis.score.toFixed(2) + ' / 5.00' },
    { label: 'Responses', value: analysis.submissionDetails.total_responses },
    { label: 'Organization Type', value: analysis.submissionDetails.organization_type },
  ], 'Snapshot');

  // Section Scores
  addHeader('SECTION SCORES');
  const sectionRows = Object.entries(analysis.sectionScores || {}).map(([k, v]) => ({ label: k, value: (v as number).toFixed(2) }));
  addKeyValueTable(sectionRows.slice(0, 12));

  // AI Executive Summary (single AI call for brevity)
  addHeader('AI EXECUTIVE SUMMARY');
  try {
    const summary = await runOpenAI(
      `Provide a concise executive summary (<= 6 bullet paragraphs) for an organizational assessment. Context: ${JSON.stringify({ score: analysis.score, sections: analysis.sectionScores, tier })}`,
      { model: 'gpt-4o', maxTokens: 850, temperature: 0.4 }
    );
    addText(summary);
  } catch (e) {
    addText('AI summary unavailable.');
  }

  // Recommendations (from provided data if exists)
  if (analysis.recommendations?.length) {
    addHeader('RECOMMENDATIONS (RAW)');
    analysis.recommendations.slice(0, 8).forEach((r: any, i: number) => {
      addText(`${i + 1}. ${typeof r === 'string' ? r : r.title || JSON.stringify(r)}`);
    });
  }

  // Risks (derived simple heuristic)
  addHeader('RISK SIGNALS');
  const lowSections = Object.entries(analysis.sectionScores || {})
    .filter(([_, v]) => (v as number) < 3)
    .map(([k, v]) => `${k} (${(v as number).toFixed(2)})`);
  addText(lowSections.length ? `Below-threshold domains: ${lowSections.join(', ')}` : 'No domains below threshold baseline.');

  // Next Steps
  addHeader('NEXT STEPS');
  addText('1. Run additional diagnostics monthly for trend baselining.');
  addText('2. Prioritize remediation in lowest-scoring structural domains.');
  addText('3. Engage scenario modeling to quantify capacity + savings.');
  addText('4. Align leadership accountability to top 3 improvement levers.');

  addFooter();
  return doc;
}

function normalizeTier(raw: string): string {
  if (!raw) return 'monthly-subscription';
  if (raw === 'express-diagnostic') return 'monthly-subscription';
  return raw;
}

export default generateEnhancedAIPDFReport;
