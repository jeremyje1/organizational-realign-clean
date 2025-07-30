import { NextRequest, NextResponse } from 'next/server';
import { PDFReportGenerator } from '../../../../lib/pdf-report-generator';
import { AssessmentDB } from '../../../../lib/assessment-db';

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, includeAI = false } = await request.json();
    
    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Fetch assessment data
    const assessment = await AssessmentDB.findAssessmentById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Fetch analysis data
    const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assessmentId }),
    });

    if (!analysisResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch analysis data' }, { status: 500 });
    }

    const { analysis } = await analysisResponse.json();

    // Optionally fetch AI analysis
    let aiAnalysis = null;
    if (includeAI) {
      try {
        const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/analysis/ai-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assessmentId, analysisData: analysis }),
        });
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiAnalysis = aiData.analysis;
        }
      } catch (error) {
        console.error('AI analysis fetch error:', error);
      }
    }

    // Prepare report data
    const institutionType = (assessment as any).institution_type || 'corporate';
    const reportData = {
      analysis: aiAnalysis || analysis,
      institutionName: (assessment as any).institution_name || 'Your Organization',
      assessmentDate: (assessment as any).created_at?.toISOString() || new Date().toISOString(),
      generatedBy: (assessment as any).user_email || 'Anonymous User',
      includeAI: !!aiAnalysis,
      institutionType: institutionType
    };

    // Generate PDF
    const generator = new PDFReportGenerator(institutionType);
    const pdfBlob = await generator.generateReport(reportData);

    // Convert blob to buffer for response
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Return PDF as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="organizational-analysis-report-${assessmentId}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate PDF report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
