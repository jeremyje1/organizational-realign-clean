/**
 * Org Chart Database Operations
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import { assessmentPrisma } from './assessment-db';

export interface OrgChart {
  id: string;
  assessmentId: string;
  chartData: string;
  svgContent?: string | null;
  scenarios?: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrgChartData {
  assessmentId: string;
  chartData: string;
  svgContent?: string;
  scenarios?: string | null;
  metadata: any;
}

export class OrgChartDB {
  /**
   * Create a new org chart record
   */
  static async createOrgChart(data: CreateOrgChartData): Promise<OrgChart> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    await assessmentPrisma.$executeRaw`
      INSERT INTO "public"."OrgChart" (
        "id", "assessment_id", "chart_data", "svg_content", "scenarios", "metadata", "created_at", "updated_at"
      ) VALUES (
        ${id}, ${data.assessmentId}, ${data.chartData}, ${data.svgContent || null}, 
        ${data.scenarios || null}, ${JSON.stringify(data.metadata)}, ${now}, ${now}
      )
      ON CONFLICT ("assessment_id") DO UPDATE SET
        "chart_data" = EXCLUDED.chart_data,
        "svg_content" = EXCLUDED.svg_content,
        "scenarios" = EXCLUDED.scenarios,
        "metadata" = EXCLUDED.metadata,
        "updated_at" = EXCLUDED.updated_at
    `;

    const orgChart = await this.getOrgChart(data.assessmentId);
    if (!orgChart) {
      throw new Error('Failed to create org chart');
    }
    return orgChart;
  }

  /**
   * Get org chart by assessment ID
   */
  static async getOrgChart(assessmentId: string): Promise<OrgChart | null> {
    try {
      const result = await assessmentPrisma.$queryRaw<Array<{
        id: string;
        assessment_id: string;
        chart_data: string;
        svg_content: string | null;
        scenarios: string | null;
        metadata: any;
        created_at: Date;
        updated_at: Date;
      }>>`
        SELECT * FROM "public"."OrgChart" WHERE "assessment_id" = ${assessmentId}
      `;
      
      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        assessmentId: row.assessment_id,
        chartData: row.chart_data,
        svgContent: row.svg_content,
        scenarios: row.scenarios,
        metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error fetching org chart:', error);
      return null;
    }
  }

  /**
   * Update existing org chart
   */
  static async updateOrgChart(
    assessmentId: string,
    updates: Partial<CreateOrgChartData>
  ): Promise<OrgChart | null> {
    const now = new Date();
    
    try {
      // Build dynamic update query
      const setParts: string[] = [];
      const values: any[] = [];
      
      if (updates.chartData !== undefined) {
        setParts.push(`"chart_data" = $${values.length + 1}`);
        values.push(updates.chartData);
      }
      
      if (updates.svgContent !== undefined) {
        setParts.push(`"svg_content" = $${values.length + 1}`);
        values.push(updates.svgContent);
      }
      
      if (updates.scenarios !== undefined) {
        setParts.push(`"scenarios" = $${values.length + 1}`);
        values.push(updates.scenarios);
      }
      
      if (updates.metadata !== undefined) {
        setParts.push(`"metadata" = $${values.length + 1}`);
        values.push(JSON.stringify(updates.metadata));
      }
      
      setParts.push(`"updated_at" = $${values.length + 1}`);
      values.push(now);
      
      values.push(assessmentId); // For WHERE clause
      
      await assessmentPrisma.$executeRawUnsafe(`
        UPDATE "public"."OrgChart" 
        SET ${setParts.join(', ')}
        WHERE "assessment_id" = $${values.length}
      `, ...values);

      return this.getOrgChart(assessmentId);
    } catch (error) {
      console.error('Error updating org chart:', error);
      throw new Error('Failed to update org chart');
    }
  }

  /**
   * Delete org chart by assessment ID
   */
  static async deleteOrgChart(assessmentId: string): Promise<boolean> {
    try {
      await assessmentPrisma.$executeRaw`
        DELETE FROM "public"."OrgChart" WHERE "assessment_id" = ${assessmentId}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting org chart:', error);
      return false;
    }
  }

  /**
   * List all org charts for a user (via their assessments)
   */
  static async getUserOrgCharts(userId: string): Promise<OrgChart[]> {
    try {
      const result = await assessmentPrisma.$queryRaw<Array<{
        id: string;
        assessment_id: string;
        chart_data: string;
        svg_content: string | null;
        scenarios: string | null;
        metadata: any;
        created_at: Date;
        updated_at: Date;
      }>>`
        SELECT oc.* 
        FROM "public"."OrgChart" oc
        JOIN "public"."assessments" a ON oc.assessment_id = a.id
        WHERE a.user_id = ${userId}
        ORDER BY oc.updated_at DESC
      `;
      
      return result.map(row => ({
        id: row.id,
        assessmentId: row.assessment_id,
        chartData: row.chart_data,
        svgContent: row.svg_content,
        scenarios: row.scenarios,
        metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching user org charts:', error);
      return [];
    }
  }

  /**
   * Get org chart statistics
   */
  static async getOrgChartStats(assessmentId: string): Promise<{
    nodeCount: number;
    totalCost: number;
    lastUpdated: Date;
    hasScenarios: boolean;
  } | null> {
    const orgChart = await this.getOrgChart(assessmentId);
    if (!orgChart) {
      return null;
    }

    return {
      nodeCount: orgChart.metadata?.roleCount || 0,
      totalCost: orgChart.metadata?.totalCost || 0,
      lastUpdated: orgChart.updatedAt,
      hasScenarios: !!orgChart.scenarios
    };
  }
}

// Export helper functions for backward compatibility
export async function getAssessment(assessmentId: string) {
  const { AssessmentDB } = await import('./assessment-db');
  return AssessmentDB.getAssessment(assessmentId);
}

export async function createOrgChart(data: CreateOrgChartData) {
  return OrgChartDB.createOrgChart(data);
}

export async function getOrgChart(assessmentId: string) {
  return OrgChartDB.getOrgChart(assessmentId);
}

export async function updateOrgChart(assessmentId: string, updates: Partial<CreateOrgChartData>) {
  return OrgChartDB.updateOrgChart(assessmentId, updates);
}

export async function deleteOrgChart(assessmentId: string) {
  return OrgChartDB.deleteOrgChart(assessmentId);
}
