/**
 * Enhanced Question Bank for Higher Education
 * Aligned with pricing tiers and industry-specific language
 * 
 * @version 2.0.0
 * @author NorthPath Strategies
 */

export type QuestionType = 'likert' | 'numeric' | 'text' | 'upload';
export type OrganizationType = 'higher-education' | 'healthcare' | 'public-sector' | 'corporate';

export interface Question {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  tags?: string[];
  tierMinimum?: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation';
  organizationTypes?: OrganizationType[];
  required?: boolean;
  helpText?: string;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Core Questions - Available across all tiers
 * Focused on fundamental organizational assessment
 */
export const CORE_QUESTIONS: Question[] = [
  // Governance & Leadership (Essential for all tiers)
  {
    id: "GL_01",
    section: "Governance & Leadership",
    prompt: "Our current organizational chart is less than 12 months old and accurately reflects reporting lines.",
    type: "likert",
    required: true,
    helpText: "Accurate org charts are essential for understanding span of control and reporting efficiency."
  },
  {
    id: "GL_02",
    section: "Governance & Leadership",
    prompt: "Decision-making authority is clearly defined and understood at each organizational level.",
    type: "likert",
    required: true,
    helpText: "Clear authority structures reduce delays and improve operational efficiency."
  },
  {
    id: "GL_03",
    section: "Governance & Leadership",
    prompt: "Cross-functional committees effectively break down departmental silos.",
    type: "likert",
    helpText: "Effective cross-functional collaboration is a key indicator of organizational maturity."
  },
  {
    id: "GL_04",
    section: "Governance & Leadership",
    prompt: "Executive leadership routinely reviews KPIs tied to strategic institutional goals.",
    type: "likert",
    required: true,
    helpText: "Regular KPI review ensures alignment between operations and strategic objectives."
  },
  {
    id: "GL_05",
    section: "Governance & Leadership",
    prompt: "We have a documented change-management framework that has been successfully implemented in the past three years.",
    type: "likert",
    helpText: "Proven change management capabilities are essential for successful organizational transformation."
  },

  // Academic Programs & Curriculum (Higher Ed Specific)
  {
    id: "APC_01",
    section: "Academic Programs & Curriculum",
    prompt: "Academic program portfolios are reviewed on a fixed cycle (e.g., every 3-5 years) using enrollment, ROI, and labor-market data.",
    type: "likert",
    organizationTypes: ["higher-education"],
    required: true,
    helpText: "Regular program review ensures academic offerings align with market demand and institutional resources."
  },
  {
    id: "APC_02",
    section: "Academic Programs & Curriculum",
    prompt: "Courses with enrollment below 60% capacity receive systematic intervention (consolidation, modality changes, etc.).",
    type: "likert",
    organizationTypes: ["higher-education"],
    helpText: "Low-enrollment courses represent inefficient resource allocation and cost-saving opportunities."
  },
  {
    id: "APC_03",
    section: "Academic Programs & Curriculum",
    prompt: "Transfer articulation agreements are centrally tracked and actively maintained.",
    type: "likert",
    organizationTypes: ["higher-education"],
    helpText: "Well-managed articulation agreements improve student success and institutional partnerships."
  },
  {
    id: "APC_04",
    section: "Academic Programs & Curriculum",
    prompt: "Faculty have clear authority to propose stackable credentials and micro-credentials aligned with regional workforce demand.",
    type: "likert",
    organizationTypes: ["higher-education"],
    helpText: "Agile credential development responds to evolving industry needs and revenue opportunities."
  },

  // Healthcare Service Lines (Healthcare Specific)
  {
    id: "HSL_01",
    section: "Service Lines & Clinical Programs",
    prompt: "Clinical service lines are reviewed annually using patient volume, profitability, and quality outcome data.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    helpText: "Regular service line review ensures clinical offerings align with community needs and financial sustainability."
  },
  {
    id: "HSL_02",
    section: "Service Lines & Clinical Programs",
    prompt: "Physician scheduling optimization reduces gaps in coverage while maintaining quality care standards.",
    type: "likert",
    organizationTypes: ["healthcare"],
    helpText: "Optimized scheduling improves patient access while controlling labor costs."
  },
  {
    id: "HSL_03",
    section: "Service Lines & Clinical Programs",
    prompt: "Cross-training protocols exist for critical nursing and support roles across multiple units.",
    type: "likert",
    organizationTypes: ["healthcare"],
    helpText: "Cross-training improves staffing flexibility and reduces overtime costs."
  },
  {
    id: "HSL_04",
    section: "Service Lines & Clinical Programs",
    prompt: "Quality metrics are consistently tracked and reported for all major service lines.",
    type: "likert",
    organizationTypes: ["healthcare"],
    helpText: "Quality tracking ensures clinical excellence and regulatory compliance."
  },

  // Business Operations (Corporate/Public Sector)
  {
    id: "BOP_01",
    section: "Business Operations & Services",
    prompt: "Core business processes are regularly reviewed for efficiency using performance metrics and customer feedback.",
    type: "likert",
    organizationTypes: ["corporate", "public-sector"],
    required: true,
    helpText: "Regular process review ensures operations align with organizational goals and customer needs."
  },
  {
    id: "BOP_02",
    section: "Business Operations & Services",
    prompt: "Service delivery standards are documented and consistently measured across all departments.",
    type: "likert",
    organizationTypes: ["corporate", "public-sector"],
    helpText: "Standardized service delivery improves quality and operational efficiency."
  },
  {
    id: "BOP_03",
    section: "Business Operations & Services",
    prompt: "Customer or stakeholder feedback is systematically collected and integrated into process improvements.",
    type: "likert",
    organizationTypes: ["corporate", "public-sector"],
    helpText: "Customer feedback drives continuous improvement and service quality."
  },
  {
    id: "BOP_04",
    section: "Business Operations & Services",
    prompt: "Cross-departmental collaboration protocols facilitate efficient project delivery and problem-solving.",
    type: "likert",
    organizationTypes: ["corporate", "public-sector"],
    helpText: "Effective collaboration reduces silos and improves organizational agility."
  },

  // Finance, Budget & Procurement
  {
    id: "FIN_01",
    section: "Finance, Budget & Procurement",
    prompt: "We use activity-based costing or similar methodologies to allocate overhead costs to academic and administrative units.",
    type: "likert",
    required: true,
    helpText: "Activity-based costing provides accurate unit cost data for informed resource allocation decisions."
  },
  {
    id: "FIN_02",
    section: "Finance, Budget & Procurement",
    prompt: "Monthly budget variance reports are produced within five business days of month-end close.",
    type: "likert",
    required: true,
    helpText: "Timely financial reporting enables proactive budget management and corrective actions."
  },
  {
    id: "FIN_03",
    section: "Finance, Budget & Procurement",
    prompt: "What percentage of invoice processing is automated (AP/AR functions)?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    helpText: "Invoice automation reduces processing costs and improves accuracy."
  },
  {
    id: "FIN_04",
    section: "Finance, Budget & Procurement",
    prompt: "Capital projects follow a standardized approval process with documented ROI thresholds.",
    type: "likert",
    helpText: "Standardized capital approval processes ensure strategic alignment and fiscal responsibility."
  },

  // Human Resources & Talent Management
  {
    id: "HR_01",
    section: "Human Resources & Talent Management",
    prompt: "Position descriptions are current (updated within 24 months) and stored in a searchable digital repository.",
    type: "likert",
    required: true,
    helpText: "Current job descriptions are essential for accurate role analysis and organizational design."
  },
  {
    id: "HR_02",
    section: "Human Resources & Talent Management",
    prompt: "What is the average time-to-hire for full-time professional staff positions (in days)?",
    type: "numeric",
    validationRules: { min: 1, max: 365 },
    required: true,
    helpText: "Time-to-hire metrics indicate HR process efficiency and competitive positioning."
  },
  {
    id: "HR_03",
    section: "Human Resources & Talent Management",
    prompt: "Cross-training documentation exists for more than 20% of mission-critical roles.",
    type: "likert",
    helpText: "Cross-training reduces single points of failure and improves operational resilience."
  },
  {
    id: "HR_04",
    section: "Human Resources & Talent Management",
    prompt: "Succession planning documentation exists for all key leadership positions (department chairs and above).",
    type: "likert",
    helpText: "Succession planning ensures leadership continuity and reduces transition risks."
  },

  // File Upload Questions - Essential for comprehensive analysis
  {
    id: "UPLOAD_01",
    section: "Organizational Data Upload",
    prompt: "Upload your current organizational chart or structure document (PDF, Excel, or image format)",
    type: "upload",
    helpText: "Current org charts help validate reporting structures and identify optimization opportunities."
  },
  {
    id: "UPLOAD_02",
    section: "Organizational Data Upload",
    prompt: "Upload recent budget documents or financial summary (Excel or PDF format)",
    type: "upload",
    helpText: "Budget documents provide context for cost allocation and efficiency recommendations."
  },
  {
    id: "UPLOAD_03",
    section: "Organizational Data Upload",
    prompt: "Upload staff roster or employee directory (Excel or CSV format)",
    type: "upload",
    helpText: "Staff data enables precise span-of-control analysis and role optimization recommendations."
  }
];

/**
 * Advanced Questions - Available for Monthly Subscription and above
 * Deeper operational and strategic assessment
 */
export const ADVANCED_QUESTIONS: Question[] = [
  // Faculty & Instructional Support
  {
    id: "FIS_01",
    section: "Faculty & Instructional Support",
    prompt: "Average full-time faculty workload (teaching, service, scholarship) is measured against peer institution benchmarks.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Faculty workload benchmarking ensures competitive and sustainable teaching loads."
  },
  {
    id: "FIS_02",
    section: "Faculty & Instructional Support",
    prompt: "Part-time and adjunct faculty hiring follows a standardized onboarding and performance evaluation process.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Standardized adjunct processes improve teaching quality and administrative efficiency."
  },
  {
    id: "FIS_03",
    section: "Faculty & Instructional Support",
    prompt: "Professional development funds are allocated using transparent, merit-based criteria.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Transparent development funding promotes faculty growth and institutional investment."
  },

  // Enrollment Management & Admissions
  {
    id: "EM_01",
    section: "Enrollment Management & Admissions",
    prompt: "Our CRM system serves as the single source of truth for all prospective student data.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    required: true,
    helpText: "Centralized prospect data eliminates duplicates and improves recruitment efficiency."
  },
  {
    id: "EM_02",
    section: "Enrollment Management & Admissions",
    prompt: "Enrollment yield models are updated at least annually using predictive analytics.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Predictive yield models improve enrollment forecasting and resource planning."
  },
  {
    id: "EM_03",
    section: "Enrollment Management & Admissions",
    prompt: "What is the average application processing time from submission to admission decision (in days)?",
    type: "numeric",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: 1, max: 180 },
    helpText: "Fast application processing improves student experience and yield rates."
  },

  // Student Affairs & Success Services
  {
    id: "SAS_01",
    section: "Student Affairs & Success Services",
    prompt: "Every enrolled student is assigned a professional academic advisor or success coach.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Professional advising improves retention and time-to-graduation outcomes."
  },
  {
    id: "SAS_02",
    section: "Student Affairs & Success Services",
    prompt: "Early-alert systems trigger intervention outreach within 48 hours of academic risk indicators.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Rapid intervention improves student success and reduces attrition costs."
  }
];

/**
 * Enterprise Questions - Available for Comprehensive Package and above
 * Strategic and advanced analytics focus
 */
export const ENTERPRISE_QUESTIONS: Question[] = [
  // Information Technology & Digital Learning
  {
    id: "ITD_01",
    section: "Information Technology & Digital Learning",
    prompt: "We operate on a single, integrated ERP/SIS platform across all campuses and locations.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    required: true,
    helpText: "System integration reduces costs and improves data consistency across the institution."
  },
  {
    id: "ITD_02",
    section: "Information Technology & Digital Learning",
    prompt: "System uptime consistently meets or exceeds 99.9% service level agreements.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "High system availability is essential for student and staff productivity."
  },
  {
    id: "ITD_03",
    section: "Information Technology & Digital Learning",
    prompt: "A formal governance board reviews and approves all generative AI pilots for data security and privacy compliance.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    tags: ["AI"],
    helpText: "AI governance ensures responsible adoption while managing institutional risk."
  },

  // Institutional Research, Planning & Effectiveness
  {
    id: "IRP_01",
    section: "Institutional Research, Planning & Effectiveness",
    prompt: "All major institutional data sources feed into a centralized data warehouse or lake.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tierMinimum: "comprehensive-package",
    helpText: "Centralized data architecture enables comprehensive analytics and reporting."
  },
  {
    id: "IRP_02",
    section: "Institutional Research, Planning & Effectiveness",
    prompt: "Executive dashboards refresh automatically and meet stakeholder information needs.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Real-time dashboards support data-driven decision making at all levels."
  },
  {
    id: "IRP_03",
    section: "Institutional Research, Planning & Effectiveness",
    prompt: "Self-service analytics tools enable department-level staff to generate their own reports.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Self-service analytics reduces IR workload and improves decision-making speed."
  },

  // Facilities & Campus Operations
  {
    id: "FAC_01",
    section: "Facilities & Campus Operations",
    prompt: "Comprehensive space utilization studies have been conducted within the last 24 months.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Recent space studies identify optimization opportunities and cost reduction potential."
  },
  {
    id: "FAC_02",
    section: "Facilities & Campus Operations",
    prompt: "Preventive maintenance completion rates consistently exceed 90%.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "High preventive maintenance rates reduce emergency repairs and extend asset life."
  }
];

/**
 * Transformation Questions - Available for Enterprise Transformation only
 * Advanced strategic and predictive analytics
 */
export const TRANSFORMATION_QUESTIONS: Question[] = [
  // Advanced Analytics & Predictive Modeling
  {
    id: "AA_01",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Machine learning models predict student success outcomes and trigger interventions.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["AI", "Predictive"],
    helpText: "Predictive models enable proactive student success interventions."
  },
  {
    id: "AA_02",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Financial forecasting models incorporate multiple scenario analyses and Monte Carlo simulations.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["Monte Carlo"],
    helpText: "Advanced financial modeling improves budget accuracy and risk management."
  },
  {
    id: "AA_03",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Real-time benchmarking compares institutional performance to peer institutions.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    helpText: "Continuous benchmarking maintains competitive positioning and identifies opportunities."
  },

  // Strategic Integration & APIs
  {
    id: "SI_01",
    section: "Strategic Integration & APIs",
    prompt: "API integrations connect our core systems to external data sources (e.g., NSC, IPEDS, labor market data).",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    helpText: "External data integration enriches institutional analytics and decision-making."
  },
  {
    id: "SI_02",
    section: "Strategic Integration & APIs",
    prompt: "Real-time collaboration tools enable cross-functional teams to work simultaneously on strategic planning.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["Collaboration"],
    helpText: "Collaborative planning tools improve strategic alignment and implementation speed."
  }
];

/**
 * Get questions based on tier and organization type
 */
export function getQuestionsForTier(
  tier: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): Question[] {
  let questions = [...CORE_QUESTIONS];

  // Add tier-appropriate questions
  if (tier !== 'one-time-diagnostic') {
    questions = [...questions, ...ADVANCED_QUESTIONS];
  }
  
  if (tier === 'comprehensive-package' || tier === 'enterprise-transformation') {
    questions = [...questions, ...ENTERPRISE_QUESTIONS];
  }
  
  if (tier === 'enterprise-transformation') {
    questions = [...questions, ...TRANSFORMATION_QUESTIONS];
  }

  // Filter by organization type
  return questions.filter(q => 
    !q.organizationTypes || q.organizationTypes.includes(organizationType)
  );
}

/**
 * Get required questions for a tier
 */
export function getRequiredQuestions(
  tier: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): Question[] {
  return getQuestionsForTier(tier, organizationType).filter(q => q.required);
}

/**
 * Validate question responses for completeness
 */
export function validateResponses(
  responses: Record<string, any>,
  tier: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): { valid: boolean; missingRequired: string[]; warningOptional: string[] } {
  const requiredQuestions = getRequiredQuestions(tier, organizationType);
  const allQuestions = getQuestionsForTier(tier, organizationType);
  
  const missingRequired = requiredQuestions
    .filter(q => !responses[q.id] || responses[q.id] === '')
    .map(q => q.id);
  
  const answeredCount = Object.keys(responses).length;
  const totalQuestions = allQuestions.length;
  const completionRate = answeredCount / totalQuestions;
  
  const warningOptional = completionRate < 0.8 ? 
    [`Completion rate: ${Math.round(completionRate * 100)}%. Consider answering more questions for better insights.`] : 
    [];

  return {
    valid: missingRequired.length === 0,
    missingRequired,
    warningOptional
  };
}
