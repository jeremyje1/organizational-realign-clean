import { NextRequest, NextResponse } from 'next/server';
import { generatePDFReport } from '../../../../lib/pdf-report-generator';
import { generateComprehensivePDFReport } from '../../../../lib/comprehensive-pdf-generator';
import { generateDataDrivenPDFReport } from '../../../../lib/data-driven-pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { analysis } = await request.json();
    
    console.log('Generating PDF with comprehensive generator, analysis data:', {
      hasAssessmentData: !!analysis.assessmentData,
      hasResponses: !!analysis.responses,
      hasUploadedFiles: !!analysis.uploadedFiles,
      tier: analysis.tier,
      score: analysis.score
    });

        // Use the new data-driven PDF generator for the most comprehensive analysis
    const doc = generateDataDrivenPDFReport({
      assessmentId: analysis.assessmentId || `ASSESS_${Date.now()}`,
      score: analysis.score || 0.75,
      tier: analysis.tier || 'express-diagnostic',
      recommendations: analysis.recommendations || [],
      sectionScores: analysis.sectionScores || {},
      assessmentData: analysis.assessmentData || {},
      responses: analysis.responses || {},
      uploadedFiles: analysis.uploadedFiles || [],
      submissionDetails: {
        institution_name: analysis.assessmentData?.institution_name || 'Your Organization',
        organization_type: analysis.assessmentData?.organization_type || 'Organization',
        submitted_at: analysis.assessmentData?.submitted_at || new Date().toISOString(),
        total_responses: Object.keys(analysis.responses || {}).length
      }
    });
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="organizational-analysis-${analysis.assessmentId || 'report'}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}
