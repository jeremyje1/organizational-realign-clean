// NorthPath Realignment Solution Suite - Comprehensive Question Bank
// Based on the master data-collection instrument from northpath_realignment_solution_suite.md

export type QuestionType = 'likert' | 'numeric' | 'text' | 'select' | 'upload' | 'multiselect';

export interface Question {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
  uploadCode?: string;
  tags?: string[];
  vertical?: OrganizationType;
}

export type OrganizationType = 
  | 'community_college' 
  | 'trade_technical' 
  | 'hospital_healthcare' 
  | 'public_university' 
  | 'private_university' 
  | 'nonprofit' 
  | 'government_agency' 
  | 'company_business';

// Algorithm-Specific Parameters (P-1 through P-5)
export const algorithmParameters: Question[] = [
  {
    id: 'P_1',
    section: 'Algorithm Parameters',
    prompt: 'What is your target maximum span-of-control? (Enter the maximum number of direct reports per manager, or 0 for no limit)',
    type: 'numeric',
    required: true,
    tags: ['DSCH', 'SPAN_CONTROL']
  },
  {
    id: 'P_2', 
    section: 'Algorithm Parameters',
    prompt: 'What is your 3-year cost-saving target? (Enter as percentage, e.g., 15 for 15% cost reduction)',
    type: 'numeric',
    required: true,
    tags: ['COST_SAVINGS', 'ROI']
  },
  {
    id: 'P_3',
    section: 'Algorithm Parameters', 
    prompt: 'What is your organization\'s tolerance for restructuring changes?',
    type: 'select',
    options: ['Conservative (minimal changes)', 'Balanced (moderate changes)', 'Aggressive (significant changes)'],
    required: true,
    tags: ['RISK_TOLERANCE', 'CRF']
  },
  {
    id: 'P_4',
    section: 'Algorithm Parameters',
    prompt: 'List any departments or roles that cannot be changed (Enter department names or role titles separated by commas, or leave blank if none)',
    type: 'text',
    required: false,
    tags: ['CONSTRAINTS']
  },
  {
    id: 'P_5',
    section: 'Algorithm Parameters',
    prompt: 'What additional success metrics would you like to track? (Examples: NPS score, HCAHPS rating, employee satisfaction, retention rate)',
    type: 'text',
    required: false,
    tags: ['METRICS', 'KPI']
  }
];

// Universal Data Upload Requirements (U-01 through U-07)
export const universalUploads: Question[] = [
  {
    id: 'U_01',
    section: 'Universal Data Upload',
    prompt: 'Upload your organizational units file - This should be a CSV file containing all departments, divisions, and units in your organization. Required columns: Unit_ID, Parent_ID, Name, Type, Location',
    type: 'upload',
    uploadCode: 'U‑01',
    required: true,
    tags: ['ORG_HIERARCHY']
  },
  {
    id: 'U_02',
    section: 'Universal Data Upload',
    prompt: 'Upload positions.csv (Position_ID, Unit_ID, Title, FTE, Salary, Benefits_%, Vacant_YN)',
    type: 'upload',
    uploadCode: 'U‑02', 
    required: true,
    tags: ['COST_ANALYSIS', 'REDUNDANCY']
  },
  {
    id: 'U_03',
    section: 'Universal Data Upload',
    prompt: 'Upload people.csv (Person_ID, Position_ID, Supervisor_ID, Hire_Date, Remote_YN)',
    type: 'upload',
    uploadCode: 'U‑03',
    required: true,
    tags: ['SPAN_LAYERS', 'DSCH']
  },
  {
    id: 'U_04',
    section: 'Universal Data Upload',
    prompt: 'Upload systems_inventory.xlsx (Sheets: Applications, Licenses, Integrations)',
    type: 'upload',
    uploadCode: 'U‑04',
    required: true,
    tags: ['LEI', 'LICENSE_EFFICIENCY']
  },
  {
    id: 'U_05',
    section: 'Universal Data Upload',
    prompt: 'Upload Strategic plan / charter (PDF)',
    type: 'upload',
    uploadCode: 'U‑05',
    required: true,
    tags: ['CONSTRAINTS', 'STRATEGY']
  },
  {
    id: 'U_06',
    section: 'Universal Data Upload',
    prompt: 'Upload BPMN diagrams (ZIP, optional)',
    type: 'upload',
    uploadCode: 'U‑06',
    required: false,
    tags: ['PROCESS_MINING']
  },
  {
    id: 'U_07',
    section: 'Universal Data Upload',
    prompt: 'Upload Data‑governance policy (PDF, optional)',
    type: 'upload',
    uploadCode: 'U‑07',
    required: false,
    tags: ['PRIVACY_GATING']
  }
];

// Universal Diagnostic Questionnaire (Sections 1-11)
export const universalQuestions: Question[] = [
  // Section 1: Organizational Structure & Role Alignment
  {
    id: 'Q1_1',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'List departments present at every site and flag overlaps',
    type: 'text',
    required: true,
    tags: ['ORG_STRUCTURE', 'OVERLAP']
  },
  {
    id: 'Q1_2',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Rate (1‑5) clarity between central vs. local responsibilities',
    type: 'likert',
    required: true,
    tags: ['CLARITY', 'GOVERNANCE']
  },
  {
    id: 'Q1_3',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Upload U‑01 with duplicates highlighted',
    type: 'upload',
    uploadCode: 'U‑01',
    required: true,
    tags: ['ORG_HIERARCHY', 'DUPLICATES']
  },
  {
    id: 'Q1_4',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Average management layers CEO → front‑line',
    type: 'numeric',
    required: true,
    tags: ['LAYERS', 'SPAN_CONTROL']
  },
  {
    id: 'Q1_5',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Decision rights that must remain per layer',
    type: 'text',
    required: true,
    tags: ['DECISION_RIGHTS', 'GOVERNANCE']
  },
  {
    id: 'Q1_6',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Rate (1‑5) JD accuracy vs. actual duties',
    type: 'likert',
    required: true,
    tags: ['JOB_DESCRIPTION', 'ACCURACY']
  },
  {
    id: 'Q1_7',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Key‑person dependency risks',
    type: 'text',
    required: true,
    tags: ['RISK', 'DEPENDENCIES']
  },
  {
    id: 'Q1_8',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Numeric: % roles fully remote',
    type: 'numeric',
    required: true,
    tags: ['REMOTE_WORK', 'FLEXIBILITY']
  },
  {
    id: 'Q1_9',
    section: 'Organizational Structure & Role Alignment',
    prompt: 'Succession plans for critical roles',
    type: 'text',
    required: true,
    tags: ['SUCCESSION', 'CONTINUITY']
  },

  // Section 2: Decision‑Making & Governance
  {
    id: 'Q2_1',
    section: 'Decision‑Making & Governance',
    prompt: 'Rate (1‑5) speed of major policy changes',
    type: 'likert',
    required: true,
    tags: ['DECISION_SPEED', 'AGILITY']
  },
  {
    id: 'Q2_2',
    section: 'Decision‑Making & Governance',
    prompt: 'Select‑all approval bodies for new initiatives',
    type: 'multiselect',
    options: ['Board', 'Executive Committee', 'Academic Senate', 'Department Heads', 'Faculty Council', 'Student Government', 'Other'],
    required: true,
    tags: ['APPROVAL_BODIES', 'GOVERNANCE']
  },
  {
    id: 'Q2_3',
    section: 'Decision‑Making & Governance',
    prompt: 'Describe a stalled decision; list layers',
    type: 'text',
    required: true,
    tags: ['BOTTLENECKS', 'LAYERS']
  },
  {
    id: 'Q2_4',
    section: 'Decision‑Making & Governance',
    prompt: 'Financial/opportunity cost of longest delay FY‑24',
    type: 'numeric',
    required: true,
    tags: ['COST_DELAY', 'EFFICIENCY']
  },
  {
    id: 'Q2_5',
    section: 'Decision‑Making & Governance',
    prompt: 'Avg. approvers for capex > $100k',
    type: 'numeric',
    required: true,
    tags: ['APPROVAL_LAYERS', 'CAPEX']
  },
  {
    id: 'Q2_6',
    section: 'Decision‑Making & Governance',
    prompt: 'Rate (1‑5) delegation‑of‑authority matrix clarity',
    type: 'likert',
    required: true,
    tags: ['DELEGATION', 'CLARITY']
  },
  {
    id: 'Q2_7',
    section: 'Decision‑Making & Governance',
    prompt: 'Use of RACI or RAPID frameworks?',
    type: 'text',
    required: false,
    tags: ['FRAMEWORKS', 'METHODOLOGY']
  },
  {
    id: 'Q2_8',
    section: 'Decision‑Making & Governance',
    prompt: 'Median days from proposal to approval',
    type: 'numeric',
    required: true,
    tags: ['APPROVAL_TIME', 'SPEED']
  },

  // Section 3: Process & Workflow Efficiency
  {
    id: 'Q3_1',
    section: 'Process & Workflow Efficiency',
    prompt: 'Map onboarding/admission/order‑to‑cash key steps',
    type: 'text',
    required: true,
    tags: ['PROCESS_MAPPING', 'WORKFLOW']
  },
  {
    id: 'Q3_2',
    section: 'Process & Workflow Efficiency',
    prompt: 'Rate (1‑5) quality of process docs',
    type: 'likert',
    required: true,
    tags: ['DOCUMENTATION', 'QUALITY']
  },
  {
    id: 'Q3_3',
    section: 'Process & Workflow Efficiency',
    prompt: 'List manual data re‑entry tasks > 1×/day',
    type: 'text',
    required: true,
    tags: ['MANUAL_WORK', 'INEFFICIENCY']
  },
  {
    id: 'Q3_4',
    section: 'Process & Workflow Efficiency',
    prompt: 'Workflow variations across sites & reasons',
    type: 'text',
    required: true,
    tags: ['VARIATIONS', 'STANDARDIZATION']
  },
  {
    id: 'Q3_5',
    section: 'Process & Workflow Efficiency',
    prompt: 'Upload U‑06 if available',
    type: 'upload',
    uploadCode: 'U‑06',
    required: false,
    tags: ['PROCESS_MINING', 'BPMN']
  },
  {
    id: 'Q3_6',
    section: 'Process & Workflow Efficiency',
    prompt: 'Cycle‑time variance best vs. worst site (%)',
    type: 'numeric',
    required: true,
    tags: ['VARIANCE', 'PERFORMANCE']
  },
  {
    id: 'Q3_7',
    section: 'Process & Workflow Efficiency',
    prompt: 'Top three pain points reported by staff',
    type: 'text',
    required: true,
    tags: ['PAIN_POINTS', 'STAFF_FEEDBACK']
  },

  // Section 4: Technology & AI Readiness
  {
    id: 'Q4_1',
    section: 'Technology & AI Readiness',
    prompt: 'Select‑all major systems in use',
    type: 'multiselect',
    options: ['ERP', 'CRM', 'LMS', 'SIS', 'EMR', 'HRIS', 'Financial System', 'Document Management', 'Other'],
    required: true,
    tags: ['SYSTEMS', 'TECHNOLOGY']
  },
  {
    id: 'Q4_2',
    section: 'Technology & AI Readiness',
    prompt: 'Rate (1‑5) system interoperability',
    type: 'likert',
    required: true,
    tags: ['INTEROPERABILITY', 'INTEGRATION']
  },
  {
    id: 'Q4_3',
    section: 'Technology & AI Readiness',
    prompt: 'Three tasks ripe for gen‑AI',
    type: 'text',
    required: true,
    tags: ['AI_OPPORTUNITIES', 'AUTOMATION']
  },
  {
    id: 'Q4_4',
    section: 'Technology & AI Readiness',
    prompt: 'Rate (1‑5) openness to AI co‑pilot vs. full automation',
    type: 'likert',
    required: true,
    tags: ['AI_READINESS', 'AUTOMATION']
  },
  {
    id: 'Q4_5',
    section: 'Technology & AI Readiness',
    prompt: 'Datasets off‑limits to external models',
    type: 'text',
    required: true,
    tags: ['DATA_PRIVACY', 'AI_CONSTRAINTS']
  },
  {
    id: 'Q4_6',
    section: 'Technology & AI Readiness',
    prompt: '% software spend on overlapping tools',
    type: 'numeric',
    required: true,
    tags: ['OVERLAP', 'SOFTWARE_SPEND']
  },
  {
    id: 'Q4_7',
    section: 'Technology & AI Readiness',
    prompt: 'Shadow‑IT applications discovered last audit',
    type: 'text',
    required: false,
    tags: ['SHADOW_IT', 'COMPLIANCE']
  },

  // Section 5: Procurement & Spend
  {
    id: 'Q5_1',
    section: 'Procurement & Spend',
    prompt: 'Count overlapping software contracts',
    type: 'numeric',
    required: true,
    tags: ['OVERLAP', 'CONTRACTS']
  },
  {
    id: 'Q5_2',
    section: 'Procurement & Spend',
    prompt: 'Rate (1‑5) central procurement effectiveness',
    type: 'likert',
    required: true,
    tags: ['PROCUREMENT', 'EFFECTIVENESS']
  },
  {
    id: 'Q5_3',
    section: 'Procurement & Spend',
    prompt: 'Upload U‑04',
    type: 'upload',
    uploadCode: 'U‑04',
    required: true,
    tags: ['SYSTEMS_INVENTORY', 'LEI']
  },
  {
    id: 'Q5_4',
    section: 'Procurement & Spend',
    prompt: '% spend under consolidation opportunity',
    type: 'numeric',
    required: true,
    tags: ['CONSOLIDATION', 'SAVINGS']
  },
  {
    id: 'Q5_5',
    section: 'Procurement & Spend',
    prompt: 'Top three vendor lock‑in risks',
    type: 'text',
    required: true,
    tags: ['VENDOR_RISK', 'LOCK_IN']
  },
  {
    id: 'Q5_6',
    section: 'Procurement & Spend',
    prompt: 'Average contract cycle time (days)',
    type: 'numeric',
    required: true,
    tags: ['CONTRACT_SPEED', 'EFFICIENCY']
  },

  // Section 6: Communication & Collaboration
  {
    id: 'Q6_1',
    section: 'Communication & Collaboration',
    prompt: 'Rate (1‑5) comms effectiveness',
    type: 'likert',
    required: true,
    tags: ['COMMUNICATION', 'EFFECTIVENESS']
  },
  {
    id: 'Q6_2',
    section: 'Communication & Collaboration',
    prompt: 'Describe miscommunication incident & impact',
    type: 'text',
    required: true,
    tags: ['MISCOMMUNICATION', 'IMPACT']
  },
  {
    id: 'Q6_3',
    section: 'Communication & Collaboration',
    prompt: 'Rate (1‑5) OKR/KPI transparency',
    type: 'likert',
    required: true,
    tags: ['TRANSPARENCY', 'KPI']
  },
  {
    id: 'Q6_4',
    section: 'Communication & Collaboration',
    prompt: 'Shadow channels in use',
    type: 'text',
    required: false,
    tags: ['SHADOW_CHANNELS', 'COMMUNICATION']
  },
  {
    id: 'Q6_5',
    section: 'Communication & Collaboration',
    prompt: '% workforce active on sanctioned collab platform',
    type: 'numeric',
    required: true,
    tags: ['COLLABORATION', 'ADOPTION']
  },

  // Section 7: Leadership & Culture
  {
    id: 'Q7_1',
    section: 'Leadership & Culture',
    prompt: 'Rate (1‑5) data‑driven leadership',
    type: 'likert',
    required: true,
    tags: ['DATA_DRIVEN', 'LEADERSHIP']
  },
  {
    id: 'Q7_2',
    section: 'Leadership & Culture',
    prompt: 'Describe resistance to change',
    type: 'text',
    required: true,
    tags: ['CHANGE_RESISTANCE', 'CULTURE']
  },
  {
    id: 'Q7_3',
    section: 'Leadership & Culture',
    prompt: 'Incentives aligning/competing with efficiency',
    type: 'text',
    required: true,
    tags: ['INCENTIVES', 'ALIGNMENT']
  },
  {
    id: 'Q7_4',
    section: 'Leadership & Culture',
    prompt: 'Leadership turnover % (24 mos)',
    type: 'numeric',
    required: true,
    tags: ['TURNOVER', 'STABILITY']
  },
  {
    id: 'Q7_5',
    section: 'Leadership & Culture',
    prompt: 'Rate (1‑5) psychological safety',
    type: 'likert',
    required: true,
    tags: ['PSYCHOLOGICAL_SAFETY', 'CULTURE']
  },
  {
    id: 'Q7_6',
    section: 'Leadership & Culture',
    prompt: 'Diversity & inclusion considerations in re‑org',
    type: 'text',
    required: false,
    tags: ['DIVERSITY', 'INCLUSION']
  },

  // Section 8: Data & Metrics
  {
    id: 'Q8_1',
    section: 'Data & Metrics',
    prompt: 'List KPIs at exec vs. unit level',
    type: 'text',
    required: true,
    tags: ['KPI', 'METRICS']
  },
  {
    id: 'Q8_2',
    section: 'Data & Metrics',
    prompt: 'Rate (1‑5) data‑literacy support',
    type: 'likert',
    required: true,
    tags: ['DATA_LITERACY', 'SUPPORT']
  },
  {
    id: 'Q8_3',
    section: 'Data & Metrics',
    prompt: 'Upload U‑07 (optional)',
    type: 'upload',
    uploadCode: 'U‑07',
    required: false,
    tags: ['DATA_GOVERNANCE']
  },
  {
    id: 'Q8_4',
    section: 'Data & Metrics',
    prompt: '% decisions based on dashboards',
    type: 'numeric',
    required: true,
    tags: ['DASHBOARD_USAGE', 'DATA_DRIVEN']
  },
  {
    id: 'Q8_5',
    section: 'Data & Metrics',
    prompt: 'Data gaps hindering predictive analytics',
    type: 'text',
    required: true,
    tags: ['DATA_GAPS', 'PREDICTIVE']
  },
  {
    id: 'Q8_6',
    section: 'Data & Metrics',
    prompt: 'Average data refresh latency (hours)',
    type: 'numeric',
    required: true,
    tags: ['LATENCY', 'REFRESH']
  },

  // Section 9: Financial Health & ROI
  {
    id: 'Q9_1',
    section: 'Financial Health & ROI',
    prompt: 'Upload last 3 audited financials',
    type: 'upload',
    required: true,
    tags: ['FINANCIALS', 'AUDIT']
  },
  {
    id: 'Q9_2',
    section: 'Financial Health & ROI',
    prompt: 'Operating margin %',
    type: 'numeric',
    required: true,
    tags: ['MARGIN', 'PROFITABILITY']
  },
  {
    id: 'Q9_3',
    section: 'Financial Health & ROI',
    prompt: 'Rate (1‑5) cost‑allocation confidence',
    type: 'likert',
    required: true,
    tags: ['COST_ALLOCATION', 'CONFIDENCE']
  },
  {
    id: 'Q9_4',
    section: 'Financial Health & ROI',
    prompt: 'Planned capital projects & funding',
    type: 'text',
    required: true,
    tags: ['CAPEX', 'FUNDING']
  },
  {
    id: 'Q9_5',
    section: 'Financial Health & ROI',
    prompt: 'Debt‑service coverage ratio',
    type: 'numeric',
    required: true,
    tags: ['DEBT_COVERAGE', 'FINANCIAL_HEALTH']
  },

  // Section 10: Change Management & Readiness
  {
    id: 'Q10_1',
    section: 'Change Management & Readiness',
    prompt: 'Rate (1‑5) maturity on ADKAR (or similar)',
    type: 'likert',
    required: true,
    tags: ['CHANGE_MATURITY', 'ADKAR']
  },
  {
    id: 'Q10_2',
    section: 'Change Management & Readiness',
    prompt: '% workforce unionized',
    type: 'numeric',
    required: true,
    tags: ['UNIONIZATION', 'LABOR']
  },
  {
    id: 'Q10_3',
    section: 'Change Management & Readiness',
    prompt: 'Past transformation initiatives & outcomes',
    type: 'text',
    required: true,
    tags: ['TRANSFORMATION', 'HISTORY']
  },
  {
    id: 'Q10_4',
    section: 'Change Management & Readiness',
    prompt: 'Rate (1‑5) leadership capacity to sponsor change',
    type: 'likert',
    required: true,
    tags: ['LEADERSHIP_CAPACITY', 'SPONSORSHIP']
  },
  {
    id: 'Q10_5',
    section: 'Change Management & Readiness',
    prompt: 'Communication strategy for re‑org roll‑out',
    type: 'text',
    required: false,
    tags: ['COMMUNICATION_STRATEGY', 'ROLLOUT']
  },

  // Section 11: Risk & Compliance
  {
    id: 'Q11_1',
    section: 'Risk & Compliance',
    prompt: 'List top regulators',
    type: 'text',
    required: true,
    tags: ['REGULATORS', 'COMPLIANCE']
  },
  {
    id: 'Q11_2',
    section: 'Risk & Compliance',
    prompt: 'Number of findings last audit',
    type: 'numeric',
    required: true,
    tags: ['AUDIT_FINDINGS', 'COMPLIANCE']
  },
  {
    id: 'Q11_3',
    section: 'Risk & Compliance',
    prompt: 'Critical risks to re‑org timeline',
    type: 'text',
    required: true,
    tags: ['TIMELINE_RISKS', 'CRITICAL']
  },
  {
    id: 'Q11_4',
    section: 'Risk & Compliance',
    prompt: 'Rate (1‑5) ERM effectiveness',
    type: 'likert',
    required: true,
    tags: ['ERM', 'RISK_MANAGEMENT']
  },
  {
    id: 'Q11_5',
    section: 'Risk & Compliance',
    prompt: 'Data‑privacy or labor agreements restricting changes',
    type: 'text',
    required: false,
    tags: ['PRIVACY_CONSTRAINTS', 'LABOR_AGREEMENTS']
  }
];

// Vertical-Specific Questions (A-H modules)
export const verticalQuestions: { [key in OrganizationType]: Question[] } = {
  // A. Community Colleges
  community_college: [
    {
      id: 'CC_Q1',
      section: 'Community College Specific',
      prompt: 'Number of unique course prefixes district‑wide',
      type: 'numeric',
      vertical: 'community_college',
      tags: ['COURSE_DIVERSITY', 'COMPLEXITY']
    },
    {
      id: 'CC_Q2',
      section: 'Community College Specific',
      prompt: 'Dual‑credit staffing model; double‑funding risks',
      type: 'text',
      vertical: 'community_college',
      tags: ['DUAL_CREDIT', 'FUNDING_RISK']
    },
    {
      id: 'CC_Q3',
      section: 'Community College Specific',
      prompt: '% courses taught by adjuncts last AY',
      type: 'numeric',
      vertical: 'community_college',
      tags: ['ADJUNCT', 'STAFFING']
    },
    {
      id: 'CC_Q4',
      section: 'Community College Specific',
      prompt: 'Rate (1‑5): Effectiveness of guided‑pathways model',
      type: 'likert',
      vertical: 'community_college',
      tags: ['GUIDED_PATHWAYS', 'EFFECTIVENESS']
    },
    {
      id: 'CC_Q5',
      section: 'Community College Specific',
      prompt: 'Completion barriers unique to adult learners',
      type: 'text',
      vertical: 'community_college',
      tags: ['ADULT_LEARNERS', 'BARRIERS']
    },
    {
      id: 'CC_Q6',
      section: 'Community College Specific',
      prompt: 'Average student‑advisor ratio',
      type: 'numeric',
      vertical: 'community_college',
      tags: ['ADVISOR_RATIO', 'SUPPORT']
    },
    {
      id: 'CC_Q7',
      section: 'Community College Specific',
      prompt: 'Select‑all LMS plugins in use',
      type: 'multiselect',
      options: ['Gradebook', 'Plagiarism Detection', 'Video Conferencing', 'Proctoring', 'Analytics', 'Other'],
      vertical: 'community_college',
      tags: ['LMS', 'PLUGINS']
    },
    {
      id: 'CC_Q8',
      section: 'Community College Specific',
      prompt: 'Upload dual_credit_mous.pdf (MOUs with ISDs)',
      type: 'upload',
      uploadCode: 'CC‑U1',
      vertical: 'community_college',
      tags: ['DUAL_CREDIT', 'PARTNERSHIPS']
    },
    {
      id: 'CC_Q9',
      section: 'Community College Specific',
      prompt: 'Shared‑service centers (IT, HR) success metrics',
      type: 'text',
      vertical: 'community_college',
      tags: ['SHARED_SERVICES', 'METRICS']
    },
    {
      id: 'CC_Q10',
      section: 'Community College Specific',
      prompt: 'Annual state performance‑funding dollars at risk',
      type: 'numeric',
      vertical: 'community_college',
      tags: ['PERFORMANCE_FUNDING', 'RISK']
    }
  ],

  // B. Trade & Technical Schools
  trade_technical: [
    {
      id: 'TS_Q1',
      section: 'Trade & Technical Specific',
      prompt: 'Machine‑to‑student ratio per lab',
      type: 'numeric',
      vertical: 'trade_technical',
      tags: ['EQUIPMENT_RATIO', 'CAPACITY']
    },
    {
      id: 'TS_Q2',
      section: 'Trade & Technical Specific',
      prompt: 'Credentialing bodies & duplicate reports',
      type: 'text',
      vertical: 'trade_technical',
      tags: ['CREDENTIALING', 'REPORTING']
    },
    {
      id: 'TS_Q3',
      section: 'Trade & Technical Specific',
      prompt: 'Placement rate within 90 days post‑grad',
      type: 'numeric',
      vertical: 'trade_technical',
      tags: ['PLACEMENT_RATE', 'OUTCOMES']
    },
    {
      id: 'TS_Q4',
      section: 'Trade & Technical Specific',
      prompt: 'Rate (1‑5): Industry‑advisory board engagement',
      type: 'likert',
      vertical: 'trade_technical',
      tags: ['INDUSTRY_ENGAGEMENT', 'ADVISORY']
    },
    {
      id: 'TS_Q5',
      section: 'Trade & Technical Specific',
      prompt: 'Upload lab_equipment_inventory.csv',
      type: 'upload',
      uploadCode: 'TS‑U1',
      vertical: 'trade_technical',
      tags: ['EQUIPMENT_INVENTORY']
    },
    {
      id: 'TS_Q6',
      section: 'Trade & Technical Specific',
      prompt: 'Safety incident reporting workflow',
      type: 'text',
      vertical: 'trade_technical',
      tags: ['SAFETY', 'REPORTING']
    },
    {
      id: 'TS_Q7',
      section: 'Trade & Technical Specific',
      prompt: 'Apprenticeship employer partners',
      type: 'numeric',
      vertical: 'trade_technical',
      tags: ['APPRENTICESHIP', 'PARTNERSHIPS']
    },
    {
      id: 'TS_Q8',
      section: 'Trade & Technical Specific',
      prompt: 'Rate (1‑5): Digital badging adoption',
      type: 'likert',
      vertical: 'trade_technical',
      tags: ['DIGITAL_BADGES', 'ADOPTION']
    },
    {
      id: 'TS_Q9',
      section: 'Trade & Technical Specific',
      prompt: 'Barriers to scaling simulator technologies',
      type: 'text',
      vertical: 'trade_technical',
      tags: ['SIMULATORS', 'BARRIERS']
    },
    {
      id: 'TS_Q10',
      section: 'Trade & Technical Specific',
      prompt: 'Average tool‑utilization % (runtime vs. capacity)',
      type: 'numeric',
      vertical: 'trade_technical',
      tags: ['TOOL_UTILIZATION', 'EFFICIENCY']
    }
  ],

  // C. Hospitals & Healthcare Systems
  hospital_healthcare: [
    {
      id: 'HC_Q1',
      section: 'Healthcare Systems Specific',
      prompt: 'Bed‑utilization % by facility (12 mo avg)',
      type: 'numeric',
      vertical: 'hospital_healthcare',
      tags: ['BED_UTILIZATION', 'CAPACITY']
    },
    {
      id: 'HC_Q2',
      section: 'Healthcare Systems Specific',
      prompt: 'Departments with separate P&Ls in same facility',
      type: 'text',
      vertical: 'hospital_healthcare',
      tags: ['P_AND_L', 'DEPARTMENTS']
    },
    {
      id: 'HC_Q3',
      section: 'Healthcare Systems Specific',
      prompt: 'Average nurse‑to‑patient ratio by unit',
      type: 'numeric',
      vertical: 'hospital_healthcare',
      tags: ['NURSE_RATIO', 'STAFFING']
    },
    {
      id: 'HC_Q4',
      section: 'Healthcare Systems Specific',
      prompt: 'Rate (1‑5): Success of value‑based‑care contracts',
      type: 'likert',
      vertical: 'hospital_healthcare',
      tags: ['VALUE_BASED_CARE', 'CONTRACTS']
    },
    {
      id: 'HC_Q5',
      section: 'Healthcare Systems Specific',
      prompt: 'Upload quality_scores.xlsx (HAC, readmit)',
      type: 'upload',
      uploadCode: 'HC‑U1',
      vertical: 'hospital_healthcare',
      tags: ['QUALITY_SCORES', 'HAC']
    },
    {
      id: 'HC_Q6',
      section: 'Healthcare Systems Specific',
      prompt: 'AI use in diagnostics (e.g., radiology triage)',
      type: 'text',
      vertical: 'hospital_healthcare',
      tags: ['AI_DIAGNOSTICS', 'RADIOLOGY']
    },
    {
      id: 'HC_Q7',
      section: 'Healthcare Systems Specific',
      prompt: '% clinicians using ambient scribing tools',
      type: 'numeric',
      vertical: 'hospital_healthcare',
      tags: ['AMBIENT_SCRIBING', 'ADOPTION']
    },
    {
      id: 'HC_Q8',
      section: 'Healthcare Systems Specific',
      prompt: 'Rate (1‑5): EMR workflow optimization satisfaction',
      type: 'likert',
      vertical: 'hospital_healthcare',
      tags: ['EMR', 'WORKFLOW']
    },
    {
      id: 'HC_Q9',
      section: 'Healthcare Systems Specific',
      prompt: 'Plans for hospital‑at‑home programs',
      type: 'text',
      vertical: 'hospital_healthcare',
      tags: ['HOSPITAL_AT_HOME', 'PROGRAMS']
    },
    {
      id: 'HC_Q10',
      section: 'Healthcare Systems Specific',
      prompt: 'FY‑24 locum tenens spend',
      type: 'numeric',
      vertical: 'hospital_healthcare',
      tags: ['LOCUM_TENENS', 'SPEND']
    }
  ],

  // D. Public Universities
  public_university: [
    {
      id: 'PU_Q1',
      section: 'Public University Specific',
      prompt: 'Overhead recovery rate (F&A %)',
      type: 'numeric',
      vertical: 'public_university',
      tags: ['OVERHEAD_RECOVERY', 'F_AND_A']
    },
    {
      id: 'PU_Q2',
      section: 'Public University Specific',
      prompt: 'Separately accredited entities',
      type: 'text',
      vertical: 'public_university',
      tags: ['ACCREDITATION', 'ENTITIES']
    },
    {
      id: 'PU_Q3',
      section: 'Public University Specific',
      prompt: 'Average time grant routed PI → submission (days)',
      type: 'numeric',
      vertical: 'public_university',
      tags: ['GRANT_ROUTING', 'RESEARCH']
    },
    {
      id: 'PU_Q4',
      section: 'Public University Specific',
      prompt: 'Upload research_admin_orgchart.pdf',
      type: 'upload',
      uploadCode: 'PU‑U1',
      vertical: 'public_university',
      tags: ['RESEARCH_ADMIN', 'ORGCHART']
    },
    {
      id: 'PU_Q5',
      section: 'Public University Specific',
      prompt: 'Rate (1‑5): Shared‑governance satisfaction',
      type: 'likert',
      vertical: 'public_university',
      tags: ['SHARED_GOVERNANCE', 'SATISFACTION']
    },
    {
      id: 'PU_Q6',
      section: 'Public University Specific',
      prompt: 'Duplicate student‑success initiatives across colleges',
      type: 'text',
      vertical: 'public_university',
      tags: ['STUDENT_SUCCESS', 'DUPLICATES']
    },
    {
      id: 'PU_Q7',
      section: 'Public University Specific',
      prompt: 'Student services budget per FTE',
      type: 'numeric',
      vertical: 'public_university',
      tags: ['STUDENT_SERVICES', 'BUDGET']
    },
    {
      id: 'PU_Q8',
      section: 'Public University Specific',
      prompt: 'Rate (1‑5): Early‑alert system efficacy',
      type: 'likert',
      vertical: 'public_university',
      tags: ['EARLY_ALERT', 'EFFICACY']
    },
    {
      id: 'PU_Q9',
      section: 'Public University Specific',
      prompt: 'Barriers to cross‑college interdisciplinary programs',
      type: 'text',
      vertical: 'public_university',
      tags: ['INTERDISCIPLINARY', 'BARRIERS']
    },
    {
      id: 'PU_Q10',
      section: 'Public University Specific',
      prompt: 'Annual deferred maintenance backlog ($)',
      type: 'numeric',
      vertical: 'public_university',
      tags: ['DEFERRED_MAINTENANCE', 'BACKLOG']
    }
  ],

  // E. Private Universities
  private_university: [
    {
      id: 'PR_Q1',
      section: 'Private University Specific',
      prompt: 'Endowment draw % allocated to ops',
      type: 'numeric',
      vertical: 'private_university',
      tags: ['ENDOWMENT', 'OPERATIONS']
    },
    {
      id: 'PR_Q2',
      section: 'Private University Specific',
      prompt: 'Donor‑restricted positions limiting flexibility',
      type: 'text',
      vertical: 'private_university',
      tags: ['DONOR_RESTRICTIONS', 'FLEXIBILITY']
    },
    {
      id: 'PR_Q3',
      section: 'Private University Specific',
      prompt: 'Aid discount rate (last FY)',
      type: 'numeric',
      vertical: 'private_university',
      tags: ['AID_DISCOUNT', 'FINANCIAL_AID']
    },
    {
      id: 'PR_Q4',
      section: 'Private University Specific',
      prompt: 'Rate (1‑5): Effectiveness of advancement CRM',
      type: 'likert',
      vertical: 'private_university',
      tags: ['ADVANCEMENT', 'CRM']
    },
    {
      id: 'PR_Q5',
      section: 'Private University Specific',
      prompt: 'Upload gift_acceptance_policy.pdf',
      type: 'upload',
      uploadCode: 'PR‑U1',
      vertical: 'private_university',
      tags: ['GIFT_POLICY', 'ADVANCEMENT']
    },
    {
      id: 'PR_Q6',
      section: 'Private University Specific',
      prompt: 'Impact of donor influence on academic decision‑making',
      type: 'text',
      vertical: 'private_university',
      tags: ['DONOR_INFLUENCE', 'ACADEMIC']
    },
    {
      id: 'PR_Q7',
      section: 'Private University Specific',
      prompt: 'Net‑tuition revenue 5‑yr CAGR %',
      type: 'numeric',
      vertical: 'private_university',
      tags: ['NET_TUITION', 'CAGR']
    },
    {
      id: 'PR_Q8',
      section: 'Private University Specific',
      prompt: 'Rate (1‑5): Alumni‑engagement platform ROI',
      type: 'likert',
      vertical: 'private_university',
      tags: ['ALUMNI_ENGAGEMENT', 'ROI']
    },
    {
      id: 'PR_Q9',
      section: 'Private University Specific',
      prompt: 'Plans for scaling online graduate programs',
      type: 'text',
      vertical: 'private_university',
      tags: ['ONLINE_PROGRAMS', 'SCALING']
    },
    {
      id: 'PR_Q10',
      section: 'Private University Specific',
      prompt: 'Investment per FTE in instructional tech last FY',
      type: 'numeric',
      vertical: 'private_university',
      tags: ['INSTRUCTIONAL_TECH', 'INVESTMENT']
    }
  ],

  // F. Nonprofits
  nonprofit: [
    {
      id: 'NP_Q1',
      section: 'Nonprofit Specific',
      prompt: '% budget from multi‑year unrestricted gifts',
      type: 'numeric',
      vertical: 'nonprofit',
      tags: ['UNRESTRICTED_FUNDING', 'BUDGET']
    },
    {
      id: 'NP_Q2',
      section: 'Nonprofit Specific',
      prompt: 'Funder mandates dictating staffing ratios',
      type: 'text',
      vertical: 'nonprofit',
      tags: ['FUNDER_MANDATES', 'STAFFING']
    },
    {
      id: 'NP_Q3',
      section: 'Nonprofit Specific',
      prompt: 'Program vs. admin cost ratio',
      type: 'numeric',
      vertical: 'nonprofit',
      tags: ['PROGRAM_COSTS', 'ADMIN_RATIO']
    },
    {
      id: 'NP_Q4',
      section: 'Nonprofit Specific',
      prompt: 'Rate (1‑5): Logic‑model usage across programs',
      type: 'likert',
      vertical: 'nonprofit',
      tags: ['LOGIC_MODEL', 'PROGRAMS']
    },
    {
      id: 'NP_Q5',
      section: 'Nonprofit Specific',
      prompt: 'Upload latest_form_990.pdf',
      type: 'upload',
      uploadCode: 'NP‑U1',
      vertical: 'nonprofit',
      tags: ['FORM_990', 'TRANSPARENCY']
    },
    {
      id: 'NP_Q6',
      section: 'Nonprofit Specific',
      prompt: 'Volunteer management challenges',
      type: 'text',
      vertical: 'nonprofit',
      tags: ['VOLUNTEER_MANAGEMENT', 'CHALLENGES']
    },
    {
      id: 'NP_Q7',
      section: 'Nonprofit Specific',
      prompt: 'Staff turnover % last 12 mos',
      type: 'numeric',
      vertical: 'nonprofit',
      tags: ['STAFF_TURNOVER', 'RETENTION']
    },
    {
      id: 'NP_Q8',
      section: 'Nonprofit Specific',
      prompt: 'Rate (1‑5): Data quality in outcome tracking',
      type: 'likert',
      vertical: 'nonprofit',
      tags: ['DATA_QUALITY', 'OUTCOMES']
    },
    {
      id: 'NP_Q9',
      section: 'Nonprofit Specific',
      prompt: 'Partnerships causing mission drift',
      type: 'text',
      vertical: 'nonprofit',
      tags: ['MISSION_DRIFT', 'PARTNERSHIPS']
    },
    {
      id: 'NP_Q10',
      section: 'Nonprofit Specific',
      prompt: 'Funding diversification index (Herfindahl)',
      type: 'numeric',
      vertical: 'nonprofit',
      tags: ['FUNDING_DIVERSIFICATION', 'HERFINDAHL']
    }
  ],

  // G. Government Agencies
  government_agency: [
    {
      id: 'GA_Q1',
      section: 'Government Agency Specific',
      prompt: 'Workforce eligible for retirement in 5 yrs %',
      type: 'numeric',
      vertical: 'government_agency',
      tags: ['RETIREMENT_ELIGIBILITY', 'WORKFORCE']
    },
    {
      id: 'GA_Q2',
      section: 'Government Agency Specific',
      prompt: 'Statutory caps on personnel moves',
      type: 'text',
      vertical: 'government_agency',
      tags: ['STATUTORY_CAPS', 'PERSONNEL']
    },
    {
      id: 'GA_Q3',
      section: 'Government Agency Specific',
      prompt: 'Citizen‑facing services fully digital %',
      type: 'numeric',
      vertical: 'government_agency',
      tags: ['DIGITAL_SERVICES', 'CITIZEN_FACING']
    },
    {
      id: 'GA_Q4',
      section: 'Government Agency Specific',
      prompt: 'Rate (1‑5): Inter‑agency data‑sharing maturity',
      type: 'likert',
      vertical: 'government_agency',
      tags: ['DATA_SHARING', 'INTERAGENCY']
    },
    {
      id: 'GA_Q5',
      section: 'Government Agency Specific',
      prompt: 'Upload it_contracts.csv',
      type: 'upload',
      uploadCode: 'GA‑U1',
      vertical: 'government_agency',
      tags: ['IT_CONTRACTS', 'PROCUREMENT']
    },
    {
      id: 'GA_Q6',
      section: 'Government Agency Specific',
      prompt: 'Impact of budget cycle on hiring decisions',
      type: 'text',
      vertical: 'government_agency',
      tags: ['BUDGET_CYCLE', 'HIRING']
    },
    {
      id: 'GA_Q7',
      section: 'Government Agency Specific',
      prompt: 'Average permit turnaround days',
      type: 'numeric',
      vertical: 'government_agency',
      tags: ['PERMIT_TURNAROUND', 'EFFICIENCY']
    },
    {
      id: 'GA_Q8',
      section: 'Government Agency Specific',
      prompt: 'Rate (1‑5): Success of performance management (GPRA)',
      type: 'likert',
      vertical: 'government_agency',
      tags: ['PERFORMANCE_MANAGEMENT', 'GPRA']
    },
    {
      id: 'GA_Q9',
      section: 'Government Agency Specific',
      prompt: 'Cross‑agency program redundancies',
      type: 'text',
      vertical: 'government_agency',
      tags: ['PROGRAM_REDUNDANCIES', 'CROSS_AGENCY']
    },
    {
      id: 'GA_Q10',
      section: 'Government Agency Specific',
      prompt: 'Volume of FOIA requests last FY',
      type: 'numeric',
      vertical: 'government_agency',
      tags: ['FOIA_REQUESTS', 'TRANSPARENCY']
    }
  ],

  // H. Companies & Businesses
  company_business: [
    {
      id: 'CB_Q1',
      section: 'Company & Business Specific',
      prompt: 'Revenue per FTE (3 yrs)',
      type: 'numeric',
      vertical: 'company_business',
      tags: ['REVENUE_PER_FTE', 'PRODUCTIVITY']
    },
    {
      id: 'CB_Q2',
      section: 'Company & Business Specific',
      prompt: 'Gross‑margin erosion triggers for re‑org',
      type: 'text',
      vertical: 'company_business',
      tags: ['MARGIN_EROSION', 'TRIGGERS']
    },
    {
      id: 'CB_Q3',
      section: 'Company & Business Specific',
      prompt: 'Avg. product‑development cycle time (days)',
      type: 'numeric',
      vertical: 'company_business',
      tags: ['PRODUCT_DEVELOPMENT', 'CYCLE_TIME']
    },
    {
      id: 'CB_Q4',
      section: 'Company & Business Specific',
      prompt: 'Rate (1‑5): Effectiveness of agile ceremonies',
      type: 'likert',
      vertical: 'company_business',
      tags: ['AGILE', 'CEREMONIES']
    },
    {
      id: 'CB_Q5',
      section: 'Company & Business Specific',
      prompt: 'Upload vendor_spend_qtr.csv',
      type: 'upload',
      uploadCode: 'CB‑U1',
      vertical: 'company_business',
      tags: ['VENDOR_SPEND', 'PROCUREMENT']
    },
    {
      id: 'CB_Q6',
      section: 'Company & Business Specific',
      prompt: 'Silo‑breaking initiatives & results',
      type: 'text',
      vertical: 'company_business',
      tags: ['SILO_BREAKING', 'INITIATIVES']
    },
    {
      id: 'CB_Q7',
      section: 'Company & Business Specific',
      prompt: '% workforce in customer‑facing roles',
      type: 'numeric',
      vertical: 'company_business',
      tags: ['CUSTOMER_FACING', 'WORKFORCE']
    },
    {
      id: 'CB_Q8',
      section: 'Company & Business Specific',
      prompt: 'Rate (1‑5): Forecast accuracy (last 4 qtrs)',
      type: 'likert',
      vertical: 'company_business',
      tags: ['FORECAST_ACCURACY', 'PLANNING']
    },
    {
      id: 'CB_Q9',
      section: 'Company & Business Specific',
      prompt: 'Digital‑transformation budget and ROI targets',
      type: 'text',
      vertical: 'company_business',
      tags: ['DIGITAL_TRANSFORMATION', 'ROI']
    },
    {
      id: 'CB_Q10',
      section: 'Company & Business Specific',
      prompt: 'ESG compliance costs as % revenue',
      type: 'numeric',
      vertical: 'company_business',
      tags: ['ESG_COMPLIANCE', 'COSTS']
    }
  ]
};

// Combine all questions for export
export const allQuestions = [
  ...algorithmParameters,
  ...universalUploads,
  ...universalQuestions,
  ...Object.values(verticalQuestions).flat()
];

// Export sections for navigation
export const questionSections = [
  'Algorithm Parameters',
  'Universal Data Upload',
  'Organizational Structure & Role Alignment',
  'Decision‑Making & Governance',
  'Process & Workflow Efficiency',
  'Technology & AI Readiness',
  'Procurement & Spend',
  'Communication & Collaboration',
  'Leadership & Culture',
  'Data & Metrics',
  'Financial Health & ROI',
  'Change Management & Readiness',
  'Risk & Compliance',
  'Community College Specific',
  'Trade & Technical Specific',
  'Healthcare Systems Specific',
  'Public University Specific',
  'Private University Specific',
  'Nonprofit Specific',
  'Government Agency Specific',
  'Company & Business Specific'
];

// Upload code reference mapping
export const uploadCodes = {
  'U‑01': 'org_units.csv (required)',
  'U‑02': 'positions.csv (required)',
  'U‑03': 'people.csv (required)',
  'U‑04': 'systems_inventory.xlsx (required)',
  'U‑05': 'strategic_plan.pdf (required)',
  'U‑06': 'bpmn_diagrams.zip (optional)',
  'U‑07': 'data_governance.pdf (optional)',
  'CC‑U1': 'dual_credit_mous.pdf (community colleges)',
  'TS‑U1': 'lab_equipment_inventory.csv (trade & tech)',
  'HC‑U1': 'quality_scores.xlsx (healthcare)',
  'PU‑U1': 'research_admin_orgchart.pdf (public univ.)',
  'PR‑U1': 'gift_acceptance_policy.pdf (private univ.)',
  'NP‑U1': 'latest_form_990.pdf (nonprofits)',
  'GA‑U1': 'it_contracts.csv (government)',
  'CB‑U1': 'vendor_spend_qtr.csv (companies)'
};
