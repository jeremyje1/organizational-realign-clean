/**
 * Enhanced AI Readiness Document Uploader with Student Success Focus
 * Comprehensive document collection for data-driven AI implementation
 * 
 * @version 2.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedFileUpload } from '@/components/ui/enhanced-file-upload';
import { 
  Upload, 
  FileText, 
  Users, 
  GraduationCap,
  Heart,
  BarChart3,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Shield
} from 'lucide-react';

interface DocumentUploadProps {
  onDocumentsUploaded: (documents: UploadedDocument[]) => void;
  tier: string;
  className?: string;
}

interface UploadedDocument {
  id: string;
  category: string;
  subcategory: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: Date;
  analysisComplete: boolean;
  studentImpactPriority: 'critical' | 'high' | 'medium' | 'low';
}

const DOCUMENT_CATEGORIES = {
  student_success: {
    title: 'Student Success & Academic Outcomes',
    description: 'Student performance, retention, and outcome data for AI-enhanced support systems',
    icon: GraduationCap,
    priority: 'critical',
    color: 'bg-green-50 border-green-200',
    subcategories: [
      {
        id: 'retention_data',
        name: 'Retention & Persistence Reports',
        description: 'Term-to-term retention, graduation rates, time-to-degree analysis',
        examples: ['retention_analysis.pdf', 'graduation_rates_by_demographics.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'learning_outcomes',
        name: 'Student Learning Outcomes',
        description: 'Course success rates, learning assessments, competency evaluations',
        examples: ['slo_assessment_results.pdf', 'course_success_analysis.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'equity_gaps',
        name: 'Equity Gap Analysis',
        description: 'Achievement gaps by demographics, inclusive excellence measures',
        examples: ['equity_gap_report.pdf', 'demographic_success_analysis.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'student_satisfaction',
        name: 'Student Engagement & Satisfaction',
        description: 'Student surveys, engagement metrics, satisfaction data',
        examples: ['student_engagement_survey.pdf', 'satisfaction_metrics.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'career_outcomes',
        name: 'Graduate Career Outcomes',
        description: 'Employment rates, career advancement, alumni success tracking',
        examples: ['graduate_employment_report.pdf', 'career_outcomes.xlsx'],
        studentImpact: 'high'
      }
    ]
  },
  
  faculty_teaching: {
    title: 'Faculty Teaching & Learning Support',
    description: 'Teaching effectiveness, curriculum design, and faculty development data',
    icon: BookOpen,
    priority: 'high',
    color: 'bg-blue-50 border-blue-200',
    subcategories: [
      {
        id: 'teaching_effectiveness',
        name: 'Teaching Evaluation Data',
        description: 'Faculty evaluations, teaching effectiveness measures, student feedback',
        examples: ['teaching_evaluations_summary.pdf', 'faculty_performance.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'curriculum_maps',
        name: 'Curriculum & Learning Design',
        description: 'Curriculum maps, learning objectives, course design documentation',
        examples: ['curriculum_map.pdf', 'learning_objectives.docx'],
        studentImpact: 'high'
      },
      {
        id: 'faculty_development',
        name: 'Faculty Development Programs',
        description: 'Professional development participation, technology adoption rates',
        examples: ['faculty_dev_report.pdf', 'tech_adoption_stats.xlsx'],
        studentImpact: 'medium'
      },
      {
        id: 'assessment_practices',
        name: 'Assessment & Grading Practices',
        description: 'Assessment strategies, grading rubrics, feedback mechanisms',
        examples: ['assessment_guidelines.pdf', 'grading_practices.docx'],
        studentImpact: 'medium'
      }
    ]
  },

  student_services: {
    title: 'Student Services & Support Systems',
    description: 'Comprehensive student support, services utilization, and wellness data',
    icon: Heart,
    priority: 'high',
    color: 'bg-pink-50 border-pink-200',
    subcategories: [
      {
        id: 'academic_advising',
        name: 'Academic Advising & Support',
        description: 'Advising effectiveness, student support services utilization',
        examples: ['advising_effectiveness.pdf', 'support_services_usage.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'mental_health',
        name: 'Student Wellness & Mental Health',
        description: 'Counseling services data, wellness programs, mental health support',
        examples: ['wellness_program_report.pdf', 'counseling_utilization.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'financial_aid',
        name: 'Financial Aid & Accessibility',
        description: 'Financial aid distribution, scholarship data, affordability metrics',
        examples: ['financial_aid_report.pdf', 'affordability_analysis.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'career_services',
        name: 'Career Services & Job Placement',
        description: 'Career counseling, job placement rates, employer partnerships',
        examples: ['career_services_report.pdf', 'job_placement_data.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'accessibility_services',
        name: 'Disability Services & Accommodations',
        description: 'Accessibility compliance, accommodation records, inclusive design',
        examples: ['disability_services_report.pdf', 'accommodation_data.xlsx'],
        studentImpact: 'critical'
      }
    ]
  },

  institutional_research: {
    title: 'Institutional Research & Analytics',
    description: 'Data governance, analytics capabilities, and institutional effectiveness',
    icon: BarChart3,
    priority: 'critical',
    color: 'bg-purple-50 border-purple-200',
    subcategories: [
      {
        id: 'institutional_effectiveness',
        name: 'Institutional Effectiveness Reports',
        description: 'IR reports, effectiveness measures, continuous improvement data',
        examples: ['institutional_effectiveness.pdf', 'improvement_metrics.xlsx'],
        studentImpact: 'medium'
      },
      {
        id: 'enrollment_analytics',
        name: 'Enrollment Management & Forecasting',
        description: 'Enrollment data, forecasting models, recruitment analytics',
        examples: ['enrollment_forecast.pdf', 'recruitment_analytics.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'predictive_analytics',
        name: 'Current Analytics & Early Warning',
        description: 'Existing predictive models, early warning systems, data insights',
        examples: ['early_warning_system.pdf', 'predictive_model_results.xlsx'],
        studentImpact: 'critical'
      },
      {
        id: 'data_governance',
        name: 'Data Governance & Privacy',
        description: 'Data policies, privacy frameworks, compliance documentation',
        examples: ['data_governance_policy.pdf', 'privacy_framework.docx'],
        studentImpact: 'medium'
      }
    ]
  },

  financial_resources: {
    title: 'Financial & Resource Management',
    description: 'Budget planning, resource allocation, and operational efficiency data',
    icon: DollarSign,
    priority: 'medium',
    color: 'bg-yellow-50 border-yellow-200',
    subcategories: [
      {
        id: 'budget_planning',
        name: 'Budget & Financial Planning',
        description: 'Annual budgets, financial forecasts, revenue analysis',
        examples: ['annual_budget.pdf', 'financial_forecast.xlsx'],
        studentImpact: 'medium'
      },
      {
        id: 'cost_analysis',
        name: 'Cost Per Student Analysis',
        description: 'Cost per credit hour, student cost analysis, efficiency metrics',
        examples: ['cost_per_student.pdf', 'efficiency_analysis.xlsx'],
        studentImpact: 'medium'
      },
      {
        id: 'technology_investment',
        name: 'Technology Infrastructure Plans',
        description: 'IT investment plans, technology roadmaps, infrastructure capacity',
        examples: ['tech_infrastructure_plan.pdf', 'it_investment_strategy.docx'],
        studentImpact: 'high'
      },
      {
        id: 'grant_funding',
        name: 'Grant Funding & External Revenue',
        description: 'Grant awards, external funding sources, revenue diversification',
        examples: ['grant_funding_report.pdf', 'external_revenue.xlsx'],
        studentImpact: 'medium'
      }
    ]
  },

  stakeholder_engagement: {
    title: 'Stakeholder Engagement & Community',
    description: 'External partnerships, community relations, and stakeholder feedback',
    icon: UserCheck,
    priority: 'medium',
    color: 'bg-indigo-50 border-indigo-200',
    subcategories: [
      {
        id: 'community_partnerships',
        name: 'Community Partnerships',
        description: 'Community engagement, local partnerships, regional collaborations',
        examples: ['community_partnership_report.pdf', 'regional_engagement.docx'],
        studentImpact: 'medium'
      },
      {
        id: 'employer_feedback',
        name: 'Employer & Industry Relations',
        description: 'Employer surveys, industry partnerships, workforce alignment',
        examples: ['employer_survey.pdf', 'industry_partnerships.xlsx'],
        studentImpact: 'high'
      },
      {
        id: 'alumni_engagement',
        name: 'Alumni Engagement & Feedback',
        description: 'Alumni surveys, engagement data, post-graduation feedback',
        examples: ['alumni_survey.pdf', 'graduate_feedback.xlsx'],
        studentImpact: 'medium'
      },
      {
        id: 'board_governance',
        name: 'Board Governance & Strategic Planning',
        description: 'Board minutes, strategic planning documents, governance structure',
        examples: ['board_strategic_plan.pdf', 'governance_structure.docx'],
        studentImpact: 'low'
      }
    ]
  }
};

export function AIReadinessDocumentUploader({ onDocumentsUploaded, tier, className }: DocumentUploadProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState('student_success');

  const handleFileUpload = useCallback((category: string, subcategory: string, files: File[]) => {
    const newDocuments: UploadedDocument[] = files.map(file => {
      const subcategoryData = DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES]
        .subcategories.find(sub => sub.id === subcategory);
      
      return {
        id: crypto.randomUUID(),
        category,
        subcategory,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        analysisComplete: false,
        studentImpactPriority: subcategoryData?.studentImpact as any || 'medium'
      };
    });

    const updatedDocuments = [...uploadedDocuments, ...newDocuments];
    setUploadedDocuments(updatedDocuments);
    onDocumentsUploaded(updatedDocuments);
  }, [uploadedDocuments, onDocumentsUploaded]);

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStudentImpactDescription = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Direct impact on student success and outcomes';
      case 'high': return 'Significant influence on student experience';
      case 'medium': return 'Moderate impact on student services';
      case 'low': return 'Indirect effect on student experience';
      default: return 'Impact assessment pending';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">
                Enhanced Document Analysis for Student Success
              </CardTitle>
              <CardDescription className="text-blue-700">
                Upload institutional documents to generate data-driven AI recommendations 
                centered on improving student outcomes and reducing equity gaps
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Upload Progress */}
      {uploadedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Documents Uploaded ({uploadedDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900 truncate">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-green-700 capitalize">
                        {doc.category.replace('_', ' ')} • {doc.subcategory.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge className={`ml-2 text-xs ${getPriorityBadgeColor(doc.studentImpactPriority)}`}>
                      {doc.studentImpactPriority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs hidden lg:block">{category.title.split(' ')[0]}</span>
                <span className="text-xs lg:hidden">{category.title.substring(0, 8)}...</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
            <Card className={category.color}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {category.title}
                      <Badge className={`${getPriorityBadgeColor(category.priority)}`}>
                        {category.priority} priority
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {category.subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="border-l-4 border-l-blue-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {subcategory.name}
                          <Badge className={`text-xs ${getPriorityBadgeColor(subcategory.studentImpact)}`}>
                            {subcategory.studentImpact} student impact
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {subcategory.description}
                        </CardDescription>
                        <div className="mt-2 text-sm text-blue-700">
                          <Shield className="h-4 w-4 inline mr-1" />
                          {getStudentImpactDescription(subcategory.studentImpact)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Example Files */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Example Documents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {subcategory.examples.map((example, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* File Upload */}
                      <EnhancedFileUpload
                        onFilesSelected={(files) => handleFileUpload(categoryKey, subcategory.id, files)}
                        acceptedTypes={['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.csv']}
                        maxFileSize={50}
                        maxFiles={10}
                        className="border-2 border-dashed border-gray-300 rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Student Success Impact Summary */}
      {uploadedDocuments.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <GraduationCap className="h-5 w-5" />
              Student Success Analysis Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['critical', 'high', 'medium', 'low'].map((priority) => {
                const count = uploadedDocuments.filter(doc => doc.studentImpactPriority === priority).length;
                return (
                  <div key={priority} className="text-center">
                    <div className={`text-2xl font-bold ${
                      priority === 'critical' ? 'text-red-600' :
                      priority === 'high' ? 'text-orange-600' :
                      priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {count}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{priority} Impact</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <p className="text-sm text-green-800">
                <strong>Analysis Enhancement:</strong> Your uploaded documents will enable 
                personalized AI recommendations focused on improving student retention, 
                reducing equity gaps, and enhancing overall student success outcomes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
