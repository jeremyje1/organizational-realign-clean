// lib/assessment-db.ts
// Direct database operations for assessments since they're not in the main Prisma schema

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AssessmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYZED' | 'DELIVERED';
export type AssessmentTier = 'INDIVIDUAL' | 'TEAM' | 'ENTERPRISE';
export type CollaboratorRole = 'ADMIN' | 'COLLABORATOR' | 'VIEWER';

export interface Assessment {
  id: string;
  user_id: string;
  tier: AssessmentTier;
  status: AssessmentStatus;
  stripe_customer_id?: string;
  stripe_session_id?: string;
  survey_id?: string;
  report_url?: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  team_id?: string;
  shared_with?: string[];
  sharing_settings?: {
    public: boolean;
    team_access: boolean;
    external_sharing: boolean;
  };
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  survey_id: string;
  status: string;
  responses: any;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface AssessmentCollaborator {
  id: string;
  assessment_id: string;
  email: string;
  role: CollaboratorRole;
  invited_at: Date;
  joined_at?: Date;
}

export interface AssessmentVersion {
  id: string;
  assessment_id: string;
  version_number: number;
  changes: any;
  changed_by: string;
  change_reason?: string;
  created_at: Date;
}

export class AssessmentDB {
  static async createAssessment(data: {
    userId: string;
    tier: AssessmentTier;
    stripeCustomerId?: string;
    stripeSessionId?: string;
  }): Promise<Assessment> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    await prisma.$executeRaw`
      INSERT INTO "public"."assessments" (
        "id", "user_id", "tier", "status", "stripe_customer_id", "stripe_session_id", 
        "created_at", "updated_at"
      ) VALUES (
        ${id}, ${data.userId}, ${data.tier}, 'PENDING', 
        ${data.stripeCustomerId}, ${data.stripeSessionId}, ${now}, ${now}
      )
    `;

    const assessment = await this.findAssessmentById(id);
    if (!assessment) {
      throw new Error('Failed to create assessment');
    }
    return assessment;
  }

  static async findAssessmentById(id: string): Promise<Assessment | null> {
    const result = await prisma.$queryRaw<Assessment[]>`
      SELECT * FROM "public"."assessments" WHERE "id" = ${id}
    `;
    
    return result[0] || null;
  }

  static async findAssessmentBySessionId(sessionId: string): Promise<Assessment | null> {
    const result = await prisma.$queryRaw<Assessment[]>`
      SELECT * FROM "public"."assessments" WHERE "stripe_session_id" = ${sessionId}
    `;
    
    return result[0] || null;
  }

  static async updateAssessmentStatus(id: string, status: AssessmentStatus): Promise<Assessment | null> {
    const now = new Date();
    
    await prisma.$executeRaw`
      UPDATE "public"."assessments" 
      SET "status" = ${status}, "updated_at" = ${now}
      WHERE "id" = ${id}
    `;

    return this.findAssessmentById(id);
  }

  static async findUserAssessments(userId: string): Promise<Assessment[]> {
    const result = await prisma.$queryRaw<Assessment[]>`
      SELECT * FROM "public"."assessments" 
      WHERE "user_id" = ${userId}
      ORDER BY "created_at" DESC
    `;
    
    return result;
  }

  static async updateAssessmentPremium(
    id: string, 
    plan: string, 
    paymentData?: {
      stripeSessionId?: string;
      stripeCustomerId?: string;
      paymentAmount?: number;
      paymentStatus?: string;
      paidAt?: Date;
      customerEmail?: string;
    }
  ): Promise<Assessment | null> {
    const now = new Date();
    
    // First, update the assessment tier based on the plan
    const tier = plan === 'enterprise' ? 'ENTERPRISE' : 'TEAM';
    
    await prisma.$executeRaw`
      UPDATE "public"."assessments" 
      SET 
        "tier" = ${tier}, 
        "status" = 'ANALYZED',
        "updated_at" = ${now},
        "stripe_session_id" = COALESCE(${paymentData?.stripeSessionId}, "stripe_session_id"),
        "stripe_customer_id" = COALESCE(${paymentData?.stripeCustomerId}, "stripe_customer_id")
      WHERE "id" = ${id}
    `;

    // Store additional payment data if provided
    if (paymentData) {
      try {
        await prisma.$executeRaw`
          INSERT INTO "public"."assessment_payments" (
            "id", "assessment_id", "plan", "amount", "status", "paid_at", 
            "customer_email", "stripe_session_id", "created_at"
          ) VALUES (
            ${crypto.randomUUID()}, ${id}, ${plan}, ${paymentData.paymentAmount || 0}, 
            ${paymentData.paymentStatus || 'completed'}, ${paymentData.paidAt || now}, 
            ${paymentData.customerEmail || ''}, ${paymentData.stripeSessionId || ''}, ${now}
          )
          ON CONFLICT ("assessment_id") DO UPDATE SET
            "plan" = EXCLUDED.plan,
            "amount" = EXCLUDED.amount,
            "status" = EXCLUDED.status,
            "paid_at" = EXCLUDED.paid_at,
            "customer_email" = EXCLUDED.customer_email,
            "stripe_session_id" = EXCLUDED.stripe_session_id
        `;
      } catch (error) {
        console.error('Failed to store payment data:', error);
        // Continue even if payment data storage fails
      }
    }

    return this.findAssessmentById(id);
  }

  static async getAssessmentResponses(assessmentId: string): Promise<SurveyResponse | null> {
    const result = await prisma.$queryRaw<SurveyResponse[]>`
      SELECT * FROM "public"."survey_responses" WHERE "id" = ${assessmentId}
    `;
    
    return result[0] || null;
  }

  static async addCollaborator(
    assessmentId: string,
    email: string,
    role: CollaboratorRole
  ): Promise<AssessmentCollaborator> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    await prisma.$executeRaw`
      INSERT INTO "public"."assessment_collaborators" (
        "id", "assessment_id", "email", "role", "invited_at"
      ) VALUES (
        ${id}, ${assessmentId}, ${email}, ${role}, ${now}
      )
    `;

    const result = await prisma.$queryRaw<AssessmentCollaborator[]>`
      SELECT * FROM "public"."assessment_collaborators" 
      WHERE "id" = ${id}
    `;
    
    return result[0];
  }

  static async getCollaborators(assessmentId: string): Promise<AssessmentCollaborator[]> {
    const result = await prisma.$queryRaw<AssessmentCollaborator[]>`
      SELECT * FROM "public"."assessment_collaborators" 
      WHERE "assessment_id" = ${assessmentId}
      ORDER BY "role", "invited_at" DESC
    `;
    
    return result;
  }

  static async removeCollaborator(assessmentId: string, email: string): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM "public"."assessment_collaborators" 
      WHERE "assessment_id" = ${assessmentId} AND "email" = ${email}
    `;
  }

  static async checkCollaboratorAccess(assessmentId: string, email: string): Promise<boolean> {
    const result = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "public"."assessment_collaborators" 
      WHERE "assessment_id" = ${assessmentId} AND "email" = ${email}
    `;
    
    return result[0]?.count > 0;
  }

  static async checkCollaboratorRole(
    assessmentId: string,
    email: string,
    role: CollaboratorRole
  ): Promise<boolean> {
    const result = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "public"."assessment_collaborators" 
      WHERE "assessment_id" = ${assessmentId} AND "email" = ${email} AND "role" = ${role}
    `;
    
    return result[0]?.count > 0;
  }

  static async updateCollaboratorStatus(
    assessmentId: string,
    email: string,
    joined: boolean
  ): Promise<AssessmentCollaborator | null> {
    const now = new Date();
    
    await prisma.$executeRaw`
      UPDATE "public"."assessment_collaborators" 
      SET "joined_at" = ${joined ? now : null}
      WHERE "assessment_id" = ${assessmentId} AND "email" = ${email}
    `;

    const result = await prisma.$queryRaw<AssessmentCollaborator[]>`
      SELECT * FROM "public"."assessment_collaborators" 
      WHERE "assessment_id" = ${assessmentId} AND "email" = ${email}
    `;
    
    return result[0] || null;
  }

  static async getSharedAssessments(userEmail: string): Promise<Assessment[]> {
    const result = await prisma.$queryRaw<Assessment[]>`
      SELECT a.* 
      FROM "public"."assessments" a
      JOIN "public"."assessment_collaborators" ac ON a.id = ac.assessment_id
      WHERE ac.email = ${userEmail}
      ORDER BY a.updated_at DESC
    `;
    
    return result;
  }

  // Version tracking methods for real-time collaboration
  static async getAssessmentVersions(assessmentId: string): Promise<AssessmentVersion[]> {
    const result = await prisma.$queryRaw<AssessmentVersion[]>`
      SELECT * FROM "AssessmentVersion" 
      WHERE "assessment_id" = ${assessmentId}
      ORDER BY "version_number" DESC
    `;
    
    return result;
  }

  static async getLatestVersion(assessmentId: string): Promise<AssessmentVersion | null> {
    const result = await prisma.$queryRaw<AssessmentVersion[]>`
      SELECT * FROM "AssessmentVersion" 
      WHERE "assessment_id" = ${assessmentId}
      ORDER BY "version_number" DESC
      LIMIT 1
    `;
    
    return result[0] || null;
  }

  static async createAssessmentVersion(
    assessmentId: string,
    versionNumber: number,
    changes: any,
    changedBy: string,
    changeReason?: string
  ): Promise<AssessmentVersion> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    await prisma.$executeRaw`
      INSERT INTO "AssessmentVersion" (
        "id", "assessment_id", "version_number", "changes", "changed_by", "change_reason", "created_at"
      ) VALUES (
        ${id}, ${assessmentId}, ${versionNumber}, ${JSON.stringify(changes)}, ${changedBy}, ${changeReason}, ${now}
      )
    `;

    const result = await prisma.$queryRaw<AssessmentVersion[]>`
      SELECT * FROM "AssessmentVersion" 
      WHERE "id" = ${id}
    `;
    
    return result[0];
  }

  static async getAssessmentSection(
    assessmentId: string,
    section: string
  ): Promise<any> {
    // Get the latest version of the assessment that contains this section
    const result = await prisma.$queryRaw<AssessmentVersion[]>`
      SELECT * FROM "AssessmentVersion" 
      WHERE "assessment_id" = ${assessmentId} 
      AND "changes"->>'section' = ${section}
      ORDER BY "version_number" DESC
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].changes;
  }

  static async updateAnalysisResults(
    id: string, 
    analysisResults: any,
    aiOpportunityAssessment: any,
    aiReadinessScore?: number
  ): Promise<Assessment | null> {
    const now = new Date();
    
    try {
      await prisma.$executeRaw`
        UPDATE "public"."assessments" 
        SET 
          "analysis_results" = ${JSON.stringify(analysisResults)}::jsonb, 
          "ai_opportunity_assessment" = ${JSON.stringify(aiOpportunityAssessment)}::jsonb,
          "ai_readiness_score" = ${aiReadinessScore || null},
          "status" = 'ANALYZED',
          "updated_at" = ${now}
        WHERE "id" = ${id}
      `;

      return this.findAssessmentById(id);
    } catch (error) {
      console.error('Error updating analysis results:', error);
      return null;
    }
  }

  static async getAssessment(assessmentId: string): Promise<Assessment | null> {
    try {
      const result = await prisma.$queryRaw<Assessment[]>`
        SELECT * FROM "public"."assessments" WHERE "id" = ${assessmentId}
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }
  }
}

export { prisma as assessmentPrisma };
