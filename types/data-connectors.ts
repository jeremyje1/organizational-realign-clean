// Data models for organizational data connectors

export interface Position {
  positionId: string;
  unitId?: string;
  title?: string;
  fte?: number;
  salary?: number;
  benefitsPercent?: number;
  vacant?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrgUnit {
  unitId: string;
  parentId?: string;
  name: string;
  type?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DataConnectorConfig {
  type: 'csv' | 'xlsx' | 'xls' | 'pdf' | 'docx' | 'zip' | 'api';
  source: string;
  mappings: Record<string, string>;
  schedule?: string;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  warnings: string[];
  tables: string[];
}

// Workday specific types
export interface WorkdayPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  employeeCount: number;
  isVacant: boolean;
  createdDate: string;
  lastModified: string;
}

export interface WorkdayOrgUnit {
  id: string;
  name: string;
  parentId?: string;
  type: string;
  location?: string;
  managerName?: string;
  costCenter?: string;
}

export interface WorkdayApiResponse<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: string;
}
