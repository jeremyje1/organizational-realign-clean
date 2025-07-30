import { NextRequest, NextResponse } from 'next/server';
import { parseUploads } from '@/lib/parseUploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type - align with onboarding page promises
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/pdf', // .pdf
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/zip', // .zip (for BPMN diagrams)
      'application/x-zip-compressed' // Alternative zip MIME type
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported formats: .csv, .xlsx, .xls, .pdf, .docx, .zip' }, 
        { status: 400 }
      );
    }

    // Get file content as buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse the uploaded file
    const result = await parseUploads(buffer, file.name, file.type);
    
    return NextResponse.json({
      success: result.success,
      fileName: file.name,
      recordsProcessed: result.recordsProcessed,
      tables: result.tables,
      warnings: result.warnings,
      errors: result.errors
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
