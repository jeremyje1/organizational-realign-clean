import * as XLSX from 'xlsx';
import type { Position, OrgUnit, SyncResult } from '@/types/data-connectors';

export async function parseUploads(
  buffer: Buffer, 
  fileName: string, 
  mimeType: string
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    recordsProcessed: 0,
    tables: [],
    warnings: [],
    errors: []
  };

  try {
    let data: any[][];

    // Parse file based on type
    if (mimeType === 'text/csv') {
      data = parseCSV(buffer);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      data = parseXLSX(buffer);
    } else {
      throw new Error('Unsupported file type');
    }

    // Determine file type and mapping based on filename
    if (fileName.toLowerCase().includes('positions')) {
      await processPositions(data, result);
    } else if (fileName.toLowerCase().includes('org_units') || fileName.toLowerCase().includes('organizational_units')) {
      await processOrgUnits(data, result);
    } else {
      result.warnings.push(`Unable to determine table mapping for file: ${fileName}`);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseCSV(buffer: Buffer): any[][] {
  const csvText = buffer.toString('utf-8');
  const lines = csvText.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    // Simple CSV parsing - in production, consider using a proper CSV parser
    return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
  });
}

function parseXLSX(buffer: Buffer): any[][] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}

async function processPositions(data: any[][], result: SyncResult): Promise<void> {
  if (data.length < 2) {
    result.warnings.push('Positions file must have at least a header row and one data row');
    return;
  }

  const headers = data[0].map((h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
  const rows = data.slice(1);

  // Map common column variations to standard names
  const columnMappings: Record<string, string> = {
    'position_id': 'positionId',
    'positionid': 'positionId',
    'id': 'positionId',
    'unit_id': 'unitId',
    'unitid': 'unitId',
    'department_id': 'unitId',
    'title': 'title',
    'position_title': 'title',
    'job_title': 'title',
    'fte': 'fte',
    'full_time_equivalent': 'fte',
    'salary': 'salary',
    'annual_salary': 'salary',
    'benefits_': 'benefitsPercent',
    'benefits_percent': 'benefitsPercent',
    'benefits_percentage': 'benefitsPercent',
    'vacant_yn': 'vacant',
    'vacant': 'vacant',
    'is_vacant': 'vacant'
  };

  // Find required positionId column
  const positionIdIndex = findColumnIndex(headers, ['position_id', 'positionid', 'id']);
  if (positionIdIndex === -1) {
    throw new Error('Required column "positionId" not found in positions file');
  }

  const positions: Position[] = [];
  
  for (const row of rows) {
    if (row.length === 0 || !row[positionIdIndex]) continue;

    const position: Position = {
      positionId: String(row[positionIdIndex])
    };

    // Map other columns
    headers.forEach((header, index) => {
      const mappedColumn = columnMappings[header];
      if (mappedColumn && row[index] !== undefined && row[index] !== '') {
        switch (mappedColumn) {
          case 'unitId':
            position.unitId = String(row[index]);
            break;
          case 'title':
            position.title = String(row[index]);
            break;
          case 'fte':
            position.fte = parseFloat(row[index]) || 0;
            break;
          case 'salary':
            position.salary = parseFloat(row[index]) || 0;
            break;
          case 'benefitsPercent':
            position.benefitsPercent = parseFloat(row[index]) || 0;
            break;
          case 'vacant':
            position.vacant = ['y', 'yes', 'true', '1'].includes(String(row[index]).toLowerCase());
            break;
        }
      }
    });

    positions.push(position);
  }

  // In a real implementation, you would save to database
  // For now, we'll just track the processed records
  result.recordsProcessed = positions.length;
  result.tables.push('Position');
  
  console.log(`Processed ${positions.length} position records`);
}

async function processOrgUnits(data: any[][], result: SyncResult): Promise<void> {
  if (data.length < 2) {
    result.warnings.push('Org units file must have at least a header row and one data row');
    return;
  }

  const headers = data[0].map((h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
  const rows = data.slice(1);

  const columnMappings: Record<string, string> = {
    'unit_id': 'unitId',
    'unitid': 'unitId',
    'id': 'unitId',
    'parent_id': 'parentId',
    'parentid': 'parentId',
    'parent_unit_id': 'parentId',
    'name': 'name',
    'unit_name': 'name',
    'department_name': 'name',
    'type': 'type',
    'unit_type': 'type',
    'department_type': 'type',
    'location': 'location',
    'office_location': 'location'
  };

  // Find required columns
  const unitIdIndex = findColumnIndex(headers, ['unit_id', 'unitid', 'id']);
  const nameIndex = findColumnIndex(headers, ['name', 'unit_name', 'department_name']);
  
  if (unitIdIndex === -1) {
    throw new Error('Required column "unitId" not found in org units file');
  }
  if (nameIndex === -1) {
    throw new Error('Required column "name" not found in org units file');
  }

  const orgUnits: OrgUnit[] = [];
  
  for (const row of rows) {
    if (row.length === 0 || !row[unitIdIndex] || !row[nameIndex]) continue;

    const orgUnit: OrgUnit = {
      unitId: String(row[unitIdIndex]),
      name: String(row[nameIndex])
    };

    // Map other columns
    headers.forEach((header, index) => {
      const mappedColumn = columnMappings[header];
      if (mappedColumn && row[index] !== undefined && row[index] !== '') {
        switch (mappedColumn) {
          case 'parentId':
            orgUnit.parentId = String(row[index]);
            break;
          case 'type':
            orgUnit.type = String(row[index]);
            break;
          case 'location':
            orgUnit.location = String(row[index]);
            break;
        }
      }
    });

    orgUnits.push(orgUnit);
  }

  result.recordsProcessed = orgUnits.length;
  result.tables.push('OrgUnit');
  
  console.log(`Processed ${orgUnits.length} org unit records`);
}

function findColumnIndex(headers: string[], candidates: string[]): number {
  for (const candidate of candidates) {
    const index = headers.indexOf(candidate);
    if (index !== -1) return index;
  }
  return -1;
}
