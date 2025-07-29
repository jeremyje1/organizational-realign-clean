/**
 * Enhanced Question Bank v2.0 - Mixed Question Types & Organization-Specific Content
 * Comprehensive organizational assessment with Likert, numeric, text, and upload questions
 * Contextualized for different organization types: Higher Education, Healthcare, Nonprofit, Corporate, Government
 */

export type QuestionType = 'likert' | 'numeric' | 'text' | 'upload';
export type OrganizationType = 'higher-education' | 'healthcare' | 'nonprofit' | 'corporate' | 'government';

export interface ValidationRules {
  min?: number;
  max?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
}

export interface Question {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  organizationTypes?: OrganizationType[];
  required?: boolean;
  helpText?: string;
  validationRules?: ValidationRules;
  tierMinimum?: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation';
  tags?: string[];
}

/**
 * Core Questions - Available across all tiers (One-Time Diagnostic and above)
 * Enhanced with mixed question types and organization-specific content
 * NOW COVERS 7 CORE SECTIONS FOR COMPREHENSIVE ANALYSIS
 */
export const CORE_QUESTIONS: Question[] = [
  // === GOVERNANCE & LEADERSHIP (All Organization Types) ===
  {
    id: "GL_01",
    section: "Governance & Leadership",
    prompt: "Our current organizational chart is less than 12 months old and accurately reflects reporting lines.",
    type: "likert",
    required: true,
    helpText: "Current organizational charts are essential for accurate structural analysis and optimization recommendations."
  },
  {
    id: "GL_02",
    section: "Governance & Leadership",
    prompt: "Decision-making authority is clearly defined and understood at each organizational level.",
    type: "likert",
    required: true,
    helpText: "Clear decision-making authority reduces delays and improves organizational efficiency."
  },
  {
    id: "GL_03",
    section: "Governance & Leadership",
    prompt: "Cross-functional steering committees effectively break down operational silos.",
    type: "likert",
    helpText: "Cross-functional collaboration improves communication and reduces redundancy."
  },
  {
    id: "GL_04",
    section: "Governance & Leadership",
    prompt: "Executive leadership routinely reviews KPIs tied to strategic goals.",
    type: "likert",
    helpText: "Regular KPI review ensures strategic alignment and performance accountability."
  },
  {
    id: "GL_05",
    section: "Governance & Leadership",
    prompt: "We have a change-management framework that has been used successfully in the past three years.",
    type: "likert",
    helpText: "Proven change management processes are crucial for successful organizational transformation."
  },
  {
    id: "GL_06",
    section: "Governance & Leadership",
    prompt: "What are your organization's top 3 operational challenges currently facing leadership?",
    type: "text",
    required: true,
    helpText: "Understanding current challenges helps prioritize improvement recommendations."
  },
  {
    id: "GL_07",
    section: "Governance & Leadership",
    prompt: "How many direct reports does your CEO/President have?",
    type: "numeric",
    validationRules: { min: 1, max: 50 },
    required: true,
    helpText: "Span of control analysis helps identify optimal organizational structure."
  },
  {
    id: "GL_08",
    section: "Governance & Leadership",
    prompt: "Describe your biggest resource allocation inefficiency in the past 12 months.",
    type: "text",
    helpText: "Identifying past inefficiencies helps prevent future resource waste."
  },

  // === ACADEMIC PROGRAMS & CURRICULUM (Higher Education) ===
  {
    id: "APC_01",
    section: "Academic Programs & Curriculum",
    prompt: "Program portfolios are reviewed on a fixed cycle using ROI and labor-market data.",
    type: "likert",
    organizationTypes: ["higher-education"],
    required: true,
    helpText: "Regular program review ensures academic offerings align with market demand and institutional resources."
  },
  {
    id: "APC_02",
    section: "Academic Programs & Curriculum",
    prompt: "Courses with <60% enrollment rate receive systematic intervention.",
    type: "likert",
    organizationTypes: ["higher-education"],
    helpText: "Low-enrollment course management improves resource utilization and cost efficiency."
  },
  {
    id: "APC_03",
    section: "Academic Programs & Curriculum",
    prompt: "What percentage of your academic programs have been significantly updated in the past 3 years?",
    type: "numeric",
    organizationTypes: ["higher-education"],
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Program currency indicates responsiveness to industry and student needs."
  },
  {
    id: "APC_04",
    section: "Academic Programs & Curriculum",
    prompt: "Faculty have authority to propose stackable credentials aligned with workforce demand.",
    type: "likert",
    organizationTypes: ["higher-education"],
    helpText: "Agile credential development responds to evolving industry needs and revenue opportunities."
  },
  {
    id: "APC_05",
    section: "Academic Programs & Curriculum",
    prompt: "What academic program or department represents your biggest underperformance challenge?",
    type: "text",
    organizationTypes: ["higher-education"],
    helpText: "Identifying underperforming programs helps target improvement efforts."
  },
  {
    id: "APC_06",
    section: "Academic Programs & Curriculum",
    prompt: "Average class size for undergraduate courses",
    type: "numeric",
    organizationTypes: ["higher-education"],
    validationRules: { min: 1, max: 500 },
    helpText: "Class size analysis helps optimize faculty utilization and educational quality."
  },

  // === SERVICE LINES & CLINICAL PROGRAMS (Healthcare) ===
  {
    id: "SCP_01",
    section: "Service Lines & Clinical Programs",
    prompt: "Clinical service lines are reviewed annually using patient volume, profitability, and quality outcome data.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    helpText: "Regular service line review ensures clinical offerings align with community needs and financial sustainability."
  },
  {
    id: "SCP_02",
    section: "Service Lines & Clinical Programs",
    prompt: "Physician scheduling optimization reduces coverage gaps while maintaining quality care standards.",
    type: "likert",
    organizationTypes: ["healthcare"],
    helpText: "Optimized scheduling improves patient access while controlling labor costs."
  },
  {
    id: "SCP_03",
    section: "Service Lines & Clinical Programs",
    prompt: "What percentage of your clinical services operate at or above break-even?",
    type: "numeric",
    organizationTypes: ["healthcare"],
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Service line profitability analysis identifies optimization opportunities."
  },
  {
    id: "SCP_04",
    section: "Service Lines & Clinical Programs",
    prompt: "Cross-training protocols exist for critical nursing and support roles across multiple units.",
    type: "likert",
    organizationTypes: ["healthcare"],
    helpText: "Cross-training improves staffing flexibility and reduces overtime costs."
  },
  {
    id: "SCP_05",
    section: "Service Lines & Clinical Programs",
    prompt: "What clinical service line or department faces the greatest staffing challenges?",
    type: "text",
    organizationTypes: ["healthcare"],
    helpText: "Identifying staffing challenges helps prioritize workforce development."
  },
  {
    id: "SCP_06",
    section: "Service Lines & Clinical Programs",
    prompt: "Average patient satisfaction score (out of 10)",
    type: "numeric",
    organizationTypes: ["healthcare"],
    validationRules: { min: 1, max: 10 },
    helpText: "Patient satisfaction scores indicate service quality and operational effectiveness."
  },

  // === PROGRAM DELIVERY & SERVICES (Nonprofit) ===
  {
    id: "PDS_01",
    section: "Program Delivery & Services",
    prompt: "Program outcomes are regularly measured and reported using standardized metrics.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    required: true,
    helpText: "Outcome measurement demonstrates impact and supports funding sustainability."
  },
  {
    id: "PDS_02",
    section: "Program Delivery & Services",
    prompt: "Service delivery processes are documented and consistently followed across all programs.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    helpText: "Standardized processes ensure consistent service quality and efficiency."
  },
  {
    id: "PDS_03",
    section: "Program Delivery & Services",
    prompt: "What percentage of your programs achieved their stated outcome goals last year?",
    type: "numeric",
    organizationTypes: ["nonprofit"],
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Program success rates indicate operational effectiveness and impact."
  },
  {
    id: "PDS_04",
    section: "Program Delivery & Services",
    prompt: "Volunteer coordination and management systems support efficient program delivery.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    helpText: "Effective volunteer management maximizes human resources and program capacity."
  },
  {
    id: "PDS_05",
    section: "Program Delivery & Services",
    prompt: "Which program or service area faces the greatest operational challenges?",
    type: "text",
    organizationTypes: ["nonprofit"],
    helpText: "Identifying operational challenges helps focus improvement efforts."
  },
  {
    id: "PDS_06",
    section: "Program Delivery & Services",
    prompt: "Average cost per beneficiary served (in dollars)",
    type: "numeric",
    organizationTypes: ["nonprofit"],
    validationRules: { min: 1, max: 100000 },
    helpText: "Cost per beneficiary analysis helps optimize resource allocation and efficiency."
  },

  // === BUSINESS OPERATIONS & SERVICES (Corporate/Government) ===
  {
    id: "BOS_01",
    section: "Business Operations & Services",
    prompt: "Core business processes are regularly reviewed for efficiency using performance metrics.",
    type: "likert",
    organizationTypes: ["corporate", "government"],
    required: true,
    helpText: "Regular process review ensures operations align with organizational goals and customer needs."
  },
  {
    id: "BOS_02",
    section: "Business Operations & Services",
    prompt: "Service delivery standards are documented and consistently measured across all departments.",
    type: "likert",
    organizationTypes: ["corporate", "government"],
    helpText: "Standardized service delivery improves quality and operational efficiency."
  },
  {
    id: "BOS_03",
    section: "Business Operations & Services",
    prompt: "What percentage of your core processes have been optimized or improved in the past 2 years?",
    type: "numeric",
    organizationTypes: ["corporate", "government"],
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Process improvement rates indicate organizational agility and efficiency focus."
  },
  {
    id: "BOS_04",
    section: "Business Operations & Services",
    prompt: "Customer or stakeholder feedback is systematically collected and integrated into process improvements.",
    type: "likert",
    organizationTypes: ["corporate", "government"],
    helpText: "Customer feedback drives continuous improvement and service quality."
  },
  {
    id: "BOS_05",
    section: "Business Operations & Services",
    prompt: "What business process or department represents your biggest efficiency bottleneck?",
    type: "text",
    organizationTypes: ["corporate", "government"],
    helpText: "Identifying bottlenecks helps target process improvement efforts."
  },
  {
    id: "BOS_06",
    section: "Business Operations & Services",
    prompt: "Average customer satisfaction rating (1-10 scale)",
    type: "numeric",
    organizationTypes: ["corporate", "government"],
    validationRules: { min: 1, max: 10 },
    helpText: "Customer satisfaction scores indicate service quality and operational effectiveness."
  },

  // === FINANCE, BUDGET & PROCUREMENT (All Organization Types) ===
  {
    id: "FIN_01",
    section: "Finance, Budget & Procurement",
    prompt: "We use activity-based costing or similar methodologies to allocate overhead costs to units.",
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
    required: true,
    helpText: "Invoice automation reduces processing costs and improves accuracy."
  },
  {
    id: "FIN_04",
    section: "Finance, Budget & Procurement",
    prompt: "Capital projects follow a standardized approval process with documented ROI thresholds.",
    type: "likert",
    helpText: "Standardized capital approval processes ensure strategic alignment and fiscal responsibility."
  },
  {
    id: "FIN_05",
    section: "Finance, Budget & Procurement",
    prompt: "What financial process or area represents your biggest cost control challenge?",
    type: "text",
    helpText: "Identifying cost control challenges helps target financial efficiency improvements."
  },
  {
    id: "FIN_06",
    section: "Finance, Budget & Procurement",
    prompt: "Average days to process vendor payments",
    type: "numeric",
    validationRules: { min: 1, max: 365 },
    helpText: "Payment processing speed indicates financial operations efficiency."
  },

  // === HUMAN RESOURCES & TALENT MANAGEMENT (All Organization Types) ===
  {
    id: "HR_01",
    section: "Human Resources & Talent Management",
    prompt: "Position descriptions are current (updated within 24 months) and stored in a searchable repository.",
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
    prompt: "Succession planning documentation exists for all key leadership positions.",
    type: "likert",
    helpText: "Succession planning ensures leadership continuity and reduces transition risks."
  },
  {
    id: "HR_05",
    section: "Human Resources & Talent Management",
    prompt: "What HR process or talent management area requires the most improvement?",
    type: "text",
    helpText: "Identifying HR improvement needs helps prioritize talent management investments."
  },
  {
    id: "HR_06",
    section: "Human Resources & Talent Management",
    prompt: "Annual employee turnover rate (percentage)",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    helpText: "Turnover rates indicate employee satisfaction and organizational stability."
  },

  // === INFORMATION TECHNOLOGY & DIGITAL INFRASTRUCTURE (All Organization Types) ===
  {
    id: "IT_01",
    section: "Information Technology & Digital Infrastructure",
    prompt: "We operate on integrated systems that share data effectively across departments.",
    type: "likert",
    required: true,
    helpText: "System integration reduces costs and improves data consistency across the organization."
  },
  {
    id: "IT_02",
    section: "Information Technology & Digital Infrastructure",
    prompt: "System uptime consistently meets or exceeds 99% availability requirements.",
    type: "likert",
    required: true,
    helpText: "High system availability is essential for productivity and service delivery."
  },
  {
    id: "IT_03",
    section: "Information Technology & Digital Infrastructure",
    prompt: "What percentage of your annual budget is allocated to technology and IT infrastructure?",
    type: "numeric",
    validationRules: { min: 0, max: 50 },
    required: true,
    helpText: "IT budget allocation indicates technology investment priorities and capacity."
  },
  {
    id: "IT_04",
    section: "Information Technology & Digital Infrastructure",
    prompt: "A formal governance process reviews and approves all technology implementations.",
    type: "likert",
    helpText: "IT governance ensures strategic alignment and risk management."
  },
  {
    id: "IT_05",
    section: "Information Technology & Digital Infrastructure",
    prompt: "What technology system or digital process represents your biggest operational bottleneck?",
    type: "text",
    helpText: "Identifying technology bottlenecks helps prioritize IT improvement investments."
  },
  {
    id: "IT_06",
    section: "Information Technology & Digital Infrastructure",
    prompt: "Average help desk ticket resolution time (in hours)",
    type: "numeric",
    validationRules: { min: 1, max: 168 },
    helpText: "Ticket resolution time indicates IT support efficiency and user satisfaction."
  },

  // === FACILITIES & OPERATIONS (All Organization Types) ===
  {
    id: "FAC_01",
    section: "Facilities & Operations",
    prompt: "Space utilization studies have been conducted within the last 24 months.",
    type: "likert",
    required: true,
    helpText: "Recent space studies identify optimization opportunities and cost reduction potential."
  },
  {
    id: "FAC_02",
    section: "Facilities & Operations",
    prompt: "Preventive maintenance completion rates consistently exceed 90%.",
    type: "likert",
    helpText: "High preventive maintenance rates reduce emergency repairs and extend asset life."
  },
  {
    id: "FAC_03",
    section: "Facilities & Operations",
    prompt: "What percentage of your facility space is considered underutilized or inefficient?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Space utilization analysis identifies optimization opportunities and cost savings."
  },
  {
    id: "FAC_04",
    section: "Facilities & Operations",
    prompt: "Energy management systems optimize HVAC, lighting, and utility consumption.",
    type: "likert",
    helpText: "Energy optimization reduces operational costs and environmental impact."
  },
  {
    id: "FAC_05",
    section: "Facilities & Operations",
    prompt: "What facilities or operational area represents your highest maintenance cost burden?",
    type: "text",
    helpText: "Identifying high-cost maintenance areas helps target efficiency improvements."
  },
  {
    id: "FAC_06",
    section: "Facilities & Operations",
    prompt: "Annual facilities cost per square foot (in dollars)",
    type: "numeric",
    validationRules: { min: 1, max: 200 },
    helpText: "Cost per square foot analysis helps benchmark facilities efficiency."
  },

  // === STRATEGIC PLANNING & PERFORMANCE MANAGEMENT (All Organization Types) ===
  {
    id: "SPM_01",
    section: "Strategic Planning & Performance Management",
    prompt: "Strategic plans are updated regularly and include measurable performance indicators.",
    type: "likert",
    required: true,
    helpText: "Current strategic plans with KPIs enable effective performance management and accountability."
  },
  {
    id: "SPM_02",
    section: "Strategic Planning & Performance Management",
    prompt: "Performance dashboards provide real-time visibility into key organizational metrics.",
    type: "likert",
    helpText: "Real-time dashboards support data-driven decision making at all levels."
  },
  {
    id: "SPM_03",
    section: "Strategic Planning & Performance Management",
    prompt: "What percentage of your strategic goals were achieved in the past fiscal year?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    required: true,
    helpText: "Strategic goal achievement rates indicate planning effectiveness and execution capability."
  },
  {
    id: "SPM_04",
    section: "Strategic Planning & Performance Management",
    prompt: "Departmental goals are clearly aligned with organizational strategic objectives.",
    type: "likert",
    helpText: "Goal alignment ensures coordinated effort toward strategic priorities."
  },
  {
    id: "SPM_05",
    section: "Strategic Planning & Performance Management",
    prompt: "What strategic initiative or change effort failed to meet expectations in the past 2 years?",
    type: "text",
    helpText: "Understanding past failures helps improve future strategic planning and execution."
  },
  {
    id: "SPM_06",
    section: "Strategic Planning & Performance Management",
    prompt: "Number of formal strategic planning meetings held annually",
    type: "numeric",
    validationRules: { min: 0, max: 52 },
    helpText: "Planning meeting frequency indicates strategic focus and coordination effort."
  },

  // === ORGANIZATIONAL DATA UPLOADS (All Organization Types) ===
  {
    id: "UPLOAD_01",
    section: "Organizational Data Upload",
    prompt: "Upload your current organizational chart or structure document (PDF, Excel, or image format)",
    type: "upload",
    required: true,
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
 * Deeper operational and strategic assessment with organization-specific focus
 */
export const ADVANCED_QUESTIONS: Question[] = [
  // === FACULTY & INSTRUCTIONAL SUPPORT (Higher Education - Advanced) ===
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
    prompt: "What is your current faculty-to-student ratio across all programs?",
    type: "numeric",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: 1, max: 100 },
    helpText: "Faculty-to-student ratios impact educational quality and operational costs."
  },
  {
    id: "FIS_04",
    section: "Faculty & Instructional Support",
    prompt: "Describe your biggest challenge in faculty retention and development.",
    type: "text",
    organizationTypes: ["higher-education"],
    tierMinimum: "monthly-subscription",
    helpText: "Faculty retention challenges impact educational continuity and institutional knowledge."
  },

  // === PATIENT CARE & CLINICAL EXCELLENCE (Healthcare - Advanced) ===
  {
    id: "PC_01",
    section: "Patient Care & Clinical Excellence",
    prompt: "Clinical quality indicators are tracked in real-time with automated alerts for variance.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tierMinimum: "monthly-subscription",
    helpText: "Real-time quality monitoring enables immediate intervention and improved patient outcomes."
  },
  {
    id: "PC_02",
    section: "Patient Care & Clinical Excellence",
    prompt: "Evidence-based protocols are standardized across all clinical departments.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tierMinimum: "monthly-subscription",
    helpText: "Standardized protocols improve care quality and reduce variation in outcomes."
  },
  {
    id: "PC_03",
    section: "Patient Care & Clinical Excellence",
    prompt: "What is your average length of stay compared to national benchmarks (percentage difference)?",
    type: "numeric",
    organizationTypes: ["healthcare"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: -50, max: 100 },
    helpText: "Length of stay comparisons identify efficiency opportunities and care optimization needs."
  },
  {
    id: "PC_04",
    section: "Patient Care & Clinical Excellence",
    prompt: "Describe your most significant patient safety or quality improvement challenge.",
    type: "text",
    organizationTypes: ["healthcare"],
    tierMinimum: "monthly-subscription",
    helpText: "Safety challenges identification helps prioritize quality improvement initiatives."
  },

  // === COMMUNITY IMPACT & FUNDRAISING (Nonprofit - Advanced) ===
  {
    id: "CIF_01",
    section: "Community Impact & Fundraising",
    prompt: "Community impact is measured using evidence-based metrics and reported to stakeholders annually.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    tierMinimum: "monthly-subscription",
    helpText: "Impact measurement demonstrates value and supports funding sustainability."
  },
  {
    id: "CIF_02",
    section: "Community Impact & Fundraising",
    prompt: "Donor relationships are managed through a comprehensive CRM system with automated stewardship.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    tierMinimum: "monthly-subscription",
    helpText: "Systematic donor management improves relationship quality and giving retention."
  },
  {
    id: "CIF_03",
    section: "Community Impact & Fundraising",
    prompt: "What percentage of your annual budget comes from diversified funding sources (non-single donor)?",
    type: "numeric",
    organizationTypes: ["nonprofit"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: 0, max: 100 },
    helpText: "Funding diversification reduces risk and improves organizational sustainability."
  },
  {
    id: "CIF_04",
    section: "Community Impact & Fundraising",
    prompt: "What represents your greatest challenge in demonstrating community impact to funders?",
    type: "text",
    organizationTypes: ["nonprofit"],
    tierMinimum: "monthly-subscription",
    helpText: "Impact measurement challenges help identify evaluation and reporting improvements."
  },

  // === MARKET POSITION & COMPETITIVE ANALYSIS (Corporate - Advanced) ===
  {
    id: "MPC_01",
    section: "Market Position & Competitive Analysis",
    prompt: "Competitive analysis and market positioning are reviewed quarterly with strategic adjustments.",
    type: "likert",
    organizationTypes: ["corporate"],
    tierMinimum: "monthly-subscription",
    helpText: "Regular competitive analysis ensures market responsiveness and strategic agility."
  },
  {
    id: "MPC_02",
    section: "Market Position & Competitive Analysis",
    prompt: "Customer acquisition and retention metrics are tracked against industry benchmarks.",
    type: "likert",
    organizationTypes: ["corporate"],
    tierMinimum: "monthly-subscription",
    helpText: "Customer metrics benchmarking identifies performance gaps and improvement opportunities."
  },
  {
    id: "MPC_03",
    section: "Market Position & Competitive Analysis",
    prompt: "What is your customer retention rate over the past 12 months (percentage)?",
    type: "numeric",
    organizationTypes: ["corporate"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: 0, max: 100 },
    helpText: "Retention rates indicate customer satisfaction and business model effectiveness."
  },
  {
    id: "MPC_04",
    section: "Market Position & Competitive Analysis",
    prompt: "What market or competitive challenge poses the greatest threat to your business?",
    type: "text",
    organizationTypes: ["corporate"],
    tierMinimum: "monthly-subscription",
    helpText: "Competitive threats identification helps prioritize strategic responses and risk mitigation."
  },

  // === CITIZEN SERVICES & PUBLIC ACCOUNTABILITY (Government - Advanced) ===
  {
    id: "CSP_01",
    section: "Citizen Services & Public Accountability",
    prompt: "Citizen satisfaction is measured regularly through standardized surveys and feedback systems.",
    type: "likert",
    organizationTypes: ["government"],
    tierMinimum: "monthly-subscription",
    helpText: "Citizen satisfaction measurement ensures public service quality and accountability."
  },
  {
    id: "CSP_02",
    section: "Citizen Services & Public Accountability",
    prompt: "Performance metrics and outcomes are published transparently for public review.",
    type: "likert",
    organizationTypes: ["government"],
    tierMinimum: "monthly-subscription",
    helpText: "Transparency in performance reporting builds public trust and supports accountability."
  },
  {
    id: "CSP_03",
    section: "Citizen Services & Public Accountability",
    prompt: "What percentage of citizen services are available through digital channels?",
    type: "numeric",
    organizationTypes: ["government"],
    tierMinimum: "monthly-subscription",
    validationRules: { min: 0, max: 100 },
    helpText: "Digital service availability indicates modernization progress and citizen convenience."
  },
  {
    id: "CSP_04",
    section: "Citizen Services & Public Accountability",
    prompt: "What represents your greatest challenge in improving citizen service delivery?",
    type: "text",
    organizationTypes: ["government"],
    tierMinimum: "monthly-subscription",
    helpText: "Service delivery challenges help prioritize public sector improvement initiatives."
  }
];

/**
 * Enterprise Questions - Available for Comprehensive Package and above
 * Strategic and advanced analytics focus with predictive capabilities
 */
export const ENTERPRISE_QUESTIONS: Question[] = [
  // === ADVANCED ANALYTICS & PREDICTIVE MODELING (All Organizations) ===
  {
    id: "AA_01",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Predictive analytics are used to forecast organizational performance and identify emerging trends.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    tags: ["AI", "Predictive"],
    helpText: "Predictive analytics enable proactive decision-making and strategic planning."
  },
  {
    id: "AA_02",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Data-driven decision making is embedded in all major organizational processes.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Data-driven processes improve decision quality and organizational performance."
  },
  {
    id: "AA_03",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "What percentage of your strategic decisions are supported by quantitative analysis?",
    type: "numeric",
    tierMinimum: "comprehensive-package",
    validationRules: { min: 0, max: 100 },
    helpText: "Quantitative decision support indicates analytical maturity and evidence-based management."
  },
  {
    id: "AA_04",
    section: "Advanced Analytics & Predictive Modeling",
    prompt: "Describe your most valuable data insight that led to significant organizational improvement.",
    type: "text",
    tierMinimum: "comprehensive-package",
    helpText: "Successful data insights demonstrate analytical capability and value creation."
  },

  // === DIGITAL TRANSFORMATION & INNOVATION (All Organizations) ===
  {
    id: "DTI_01",
    section: "Digital Transformation & Innovation",
    prompt: "Digital transformation initiatives are guided by a comprehensive strategy with measurable outcomes.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Strategic digital transformation ensures technology investments align with organizational goals."
  },
  {
    id: "DTI_02",
    section: "Digital Transformation & Innovation",
    prompt: "Innovation processes are formalized with dedicated resources and success metrics.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    helpText: "Formal innovation processes increase the likelihood of breakthrough improvements."
  },
  {
    id: "DTI_03",
    section: "Digital Transformation & Innovation",
    prompt: "What percentage of your workforce has been trained on digital tools and capabilities in the past year?",
    type: "numeric",
    tierMinimum: "comprehensive-package",
    validationRules: { min: 0, max: 100 },
    helpText: "Digital skills training indicates transformation readiness and change management effectiveness."
  },
  {
    id: "DTI_04",
    section: "Digital Transformation & Innovation",
    prompt: "What digital transformation initiative has delivered the most significant operational improvement?",
    type: "text",
    tierMinimum: "comprehensive-package",
    helpText: "Successful digital initiatives provide templates for future transformation efforts."
  }
];

/**
 * Transformation Questions - Available for Enterprise Transformation only
 * Advanced strategic and predictive analytics with AI integration
 */
export const TRANSFORMATION_QUESTIONS: Question[] = [
  // === AI INTEGRATION & AUTOMATION (All Organizations - Transformation Level) ===
  {
    id: "AI_01",
    section: "AI Integration & Automation",
    prompt: "AI and machine learning tools are integrated into core operational processes with measurable impact.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["AI", "Automation"],
    helpText: "AI integration demonstrates advanced technological capability and operational optimization."
  },
  {
    id: "AI_02",
    section: "AI Integration & Automation",
    prompt: "Automation has eliminated manual processes in more than 30% of routine administrative tasks.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["Automation"],
    helpText: "High automation rates indicate efficiency gains and resource optimization."
  },
  {
    id: "AI_03",
    section: "AI Integration & Automation",
    prompt: "What percentage of your operational decisions are enhanced by AI or automated systems?",
    type: "numeric",
    tierMinimum: "enterprise-transformation",
    validationRules: { min: 0, max: 100 },
    tags: ["AI"],
    helpText: "AI-enhanced decisions indicate advanced analytical capabilities and operational maturity."
  },
  {
    id: "AI_04",
    section: "AI Integration & Automation",
    prompt: "Describe the most transformative AI or automation implementation in your organization.",
    type: "text",
    tierMinimum: "enterprise-transformation",
    tags: ["AI", "Transformation"],
    helpText: "Transformative AI implementations showcase innovation capability and change leadership."
  },

  // === REAL-TIME COLLABORATION & INTEGRATION (All Organizations - Transformation Level) ===
  {
    id: "RTC_01",
    section: "Real-Time Collaboration & Integration",
    prompt: "Real-time collaboration tools enable seamless cross-functional work and decision-making.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["Collaboration"],
    helpText: "Real-time collaboration improves organizational agility and response times."
  },
  {
    id: "RTC_02",
    section: "Real-Time Collaboration & Integration",
    prompt: "External partnerships and integrations are managed through API connections and automated workflows.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["Integration", "API"],
    helpText: "API integrations enable scalable partnerships and operational efficiency."
  },
  {
    id: "RTC_03",
    section: "Real-Time Collaboration & Integration",
    prompt: "What percentage of your external stakeholder interactions are conducted through integrated digital platforms?",
    type: "numeric",
    tierMinimum: "enterprise-transformation",
    validationRules: { min: 0, max: 100 },
    tags: ["Integration"],
    helpText: "Digital stakeholder integration indicates advanced collaboration capabilities."
  },
  {
    id: "RTC_04",
    section: "Real-Time Collaboration & Integration",
    prompt: "What collaboration or integration challenge would most benefit from advanced technology solutions?",
    type: "text",
    tierMinimum: "enterprise-transformation",
    helpText: "Collaboration challenges identify opportunities for technology-enabled improvements."
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
 * Get unique sections for a tier and organization type
 */
export function getSectionsForTier(
  tier: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): string[] {
  const questions = getQuestionsForTier(tier, organizationType);
  const sections = [...new Set(questions.map(q => q.section))];
  return sections.sort();
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

/**
 * Get question statistics for a tier and organization type
 */
export function getQuestionStats(
  tier: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): {
  total: number;
  required: number;
  byType: Record<QuestionType, number>;
  sections: string[];
} {
  const questions = getQuestionsForTier(tier, organizationType);
  const required = getRequiredQuestions(tier, organizationType);
  const sections = getSectionsForTier(tier, organizationType);
  
  const byType = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  return {
    total: questions.length,
    required: required.length,
    byType,
    sections
  };
}
