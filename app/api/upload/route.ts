import { NextRequest, NextResponse } from 'next/server';
import { parseUploads } from '@/lib/parseUploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`Upload attempt: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Validate file type - align with onboarding page promises
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/pdf', // .pdf (standard)
      'application/x-pdf', // .pdf (alternative)
      'application/acrobat', // .pdf (alternative)
      'application/vnd.pdf', // .pdf (alternative)
      'text/pdf', // .pdf (alternative)
      'text/x-pdf', // .pdf (alternative)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/zip', // .zip (for BPMN diagrams)
      'application/x-zip-compressed' // Alternative zip MIME type
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.log(`Rejected file type: ${file.type}. Allowed types:`, allowedTypes);
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Supported formats: .csv, .xlsx, .xls, .pdf, .docx, .zip` }, 
        { status: 400 }
      );
    }

    // Get file content as buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Handle different file types
    let result;
    
    if (file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Parse structured data files (CSV, Excel)
      result = await parseUploads(buffer, file.name, file.type);
    } else {
      // For other file types (PDF, DOCX, ZIP), just acknowledge the upload
      result = {
        success: true,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        recordsProcessed: 0,
        tables: [],
        warnings: [],
        errors: [],
        message: `File "${file.name}" uploaded successfully and stored for analysis.`
      };
    }
    
    return NextResponse.json({
      success: result.success,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      recordsProcessed: result.recordsProcessed || 0,
      tables: result.tables || [],
      warnings: result.warnings || [],
      errors: result.errors || [],
      message: result.message || `File processed successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
