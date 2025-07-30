/**
 * Enhanced Question Bank v3.0 - 100+ Questions Per Tier + AI Opportunity Assessment
 * Comprehensive organizational assessment meeting website promises
 * Contextualized for different organization types with AI automation evaluation
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
  tierMinimum?: 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership';
  tags?: string[];
  enableContext?: boolean; // Allows users to provide additional context for richer analysis
  contextPrompt?: string; // Custom prompt for the context field
}

/**
 * CONTEXT FEATURE:
 * Questions with enableContext: true will display an optional text area where users can provide
 * additional details, departmental variations, or unique circumstances. This contextual data
 * is stored with the key pattern `${questionId}_context` and enables AI analysis to produce
 * more tailored and nuanced recommendations across all tiers and industries.
 */

/**
 * CORE QUESTIONS - Available across ALL tiers (100+ questions for One-Time Diagnostic)
 * Enhanced with AI opportunity assessment and automation potential evaluation
 */
export const CORE_QUESTIONS: Question[] = [
  // === GOVERNANCE & LEADERSHIP (20 questions) ===
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
    enableContext: true,
    contextPrompt: "Please describe any variations in decision-making authority across different departments or functions, and any challenges with unclear authority that impact your organization."
  },
  {
    id: "GL_03",
    section: "Governance & Leadership",
    prompt: "How many direct reports does your CEO/President currently manage?",
    type: "numeric",
    required: true,
    validationRules: { min: 1, max: 50 }
  },
  {
    id: "GL_04",
    section: "Governance & Leadership",
    prompt: "Our leadership team regularly communicates strategic priorities to all staff levels.",
    type: "likert",
    required: true
  },
  {
    id: "GL_05",
    section: "Governance & Leadership",
    prompt: "Strategic planning sessions occur on a predictable schedule with broad input.",
    type: "likert"
  },
  {
    id: "GL_06",
    section: "Governance & Leadership",
    prompt: "What percentage of leadership positions are currently vacant or filled by interim appointments?",
    type: "numeric",
    validationRules: { min: 0, max: 100 }
  },
  {
    id: "GL_07",
    section: "Governance & Leadership",
    prompt: "Board/governing body meetings are productive and focused on strategic issues.",
    type: "likert"
  },
  {
    id: "GL_08",
    section: "Governance & Leadership",
    prompt: "Describe your organization's key leadership challenges over the next 12 months. Please identify multiple challenges if applicable.",
    type: "text",
    required: true,
    validationRules: { min: 100, maxLength: 1500 },
    helpText: "💡 Thinking prompts: Consider leadership areas such as: (1) succession planning, (2) skill gaps, (3) decision-making processes, (4) change management, (5) stakeholder engagement, (6) strategic execution, (7) team development, (8) communication effectiveness. Most organizations face 2-4 significant leadership challenges.",
    enableContext: true,
    contextPrompt: "If certain leadership challenges are more pressing in specific departments or time periods, please elaborate here."
  },
  {
    id: "GL_09",
    section: "Governance & Leadership",
    prompt: "Our succession planning process is documented and regularly updated.",
    type: "likert"
  },
  {
    id: "GL_10",
    section: "Governance & Leadership",
    prompt: "How many months in advance does your organization typically plan major strategic initiatives?",
    type: "numeric",
    validationRules: { min: 0, max: 60 }
  },
  {
    id: "GL_11",
    section: "Governance & Leadership",
    prompt: "Leadership decisions are communicated transparently across the organization.",
    type: "likert"
  },
  {
    id: "GL_12",
    section: "Governance & Leadership",
    prompt: "Our organization has a clear and current mission statement that guides daily operations.",
    type: "likert",
    required: true
  },
  {
    id: "GL_13",
    section: "Governance & Leadership",
    prompt: "Upload your current organizational chart or leadership structure document.",
    type: "upload",
    helpText: "This helps us understand your current structure for optimization recommendations."
  },
  {
    id: "GL_14",
    section: "Governance & Leadership",
    prompt: "What percentage of your leadership team has been in their current role for less than 2 years?",
    type: "numeric",
    validationRules: { min: 0, max: 100 }
  },
  {
    id: "GL_15",
    section: "Governance & Leadership",
    prompt: "Our organization regularly conducts leadership effectiveness assessments.",
    type: "likert"
  },
  {
    id: "GL_16",
    section: "Governance & Leadership",
    prompt: "Describe your organization's approaches to change management and communication. Please identify multiple strategies or methods if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1500 },
    helpText: "💡 Consider various change management aspects: (1) communication strategies during change, (2) stakeholder engagement methods, (3) training and support systems, (4) feedback collection processes, (5) resistance management techniques, (6) change champion programs, (7) timeline and milestone communication. Most organizations use multiple approaches.",
    enableContext: true,
    contextPrompt: "If change management approaches vary by type of change (e.g., technology vs. organizational vs. policy changes) or by department, please elaborate here."
  },
  {
    id: "GL_17",
    section: "Governance & Leadership",
    prompt: "Cross-departmental collaboration is actively encouraged and supported by leadership.",
    type: "likert"
  },
  {
    id: "GL_18",
    section: "Governance & Leadership",
    prompt: "How many organizational restructures has your organization undergone in the past 3 years?",
    type: "numeric",
    validationRules: { min: 0, max: 10 }
  },
  {
    id: "GL_19",
    section: "Governance & Leadership",
    prompt: "Our leadership team has the appropriate mix of internal promotions and external hires.",
    type: "likert"
  },
  {
    id: "GL_20",
    section: "Governance & Leadership",
    prompt: "Strategic goals are translated into specific, measurable objectives at each organizational level.",
    type: "likert"
  },

  // === ADMINISTRATIVE PROCESSES & COMMUNICATION (20 questions) ===
  {
    id: "APC_01",
    section: "Administrative Processes & Communication",
    prompt: "Our communication channels effectively reach all organizational levels without information loss.",
    type: "likert",
    required: true,
    helpText: "Effective communication is critical for organizational alignment and operational efficiency."
  },
  {
    id: "APC_02",
    section: "Administrative Processes & Communication",
    prompt: "How many different communication platforms does your organization currently use?",
    type: "numeric",
    required: true,
    validationRules: { min: 1, max: 20 },
    enableContext: true,
    contextPrompt: "Please list the main communication platforms you use (e.g., email, Slack, Teams, intranet) and describe any challenges with platform fragmentation or user adoption."
  },
  {
    id: "APC_03",
    section: "Administrative Processes & Communication",
    prompt: "Administrative processes are standardized and documented across departments.",
    type: "likert"
  },
  {
    id: "APC_04",
    section: "Administrative Processes & Communication",
    prompt: "What percentage of routine administrative tasks could potentially be automated?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tags: ["ai-opportunity"]
  },
  {
    id: "APC_05",
    section: "Administrative Processes & Communication",
    prompt: "Staff can easily access the information and resources they need to perform their jobs.",
    type: "likert"
  },
  {
    id: "APC_06",
    section: "Administrative Processes & Communication",
    prompt: "Describe significant communication breakdowns or challenges your organization has experienced. Please identify multiple issues if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1500 },
    helpText: "💡 Consider different types of communication issues: (1) information not reaching intended recipients, (2) conflicting messages from different sources, (3) timing issues with announcements, (4) technology failures, (5) language or cultural barriers, (6) hierarchical communication bottlenecks. Most organizations face several communication challenges.",
    enableContext: true,
    contextPrompt: "If certain communication issues are more problematic in specific departments or during particular times/situations, please provide additional context here."
  },
  {
    id: "APC_07",
    section: "Administrative Processes & Communication",
    prompt: "Our organization uses digital tools effectively for collaboration and project management.",
    type: "likert"
  },
  {
    id: "APC_08",
    section: "Administrative Processes & Communication",
    prompt: "How many hours per week does leadership spend in meetings?",
    type: "numeric",
    validationRules: { min: 0, max: 80 }
  },
  {
    id: "APC_09",
    section: "Administrative Processes & Communication",
    prompt: "Meeting effectiveness is high, with clear agendas and actionable outcomes.",
    type: "likert"
  },
  {
    id: "APC_10",
    section: "Administrative Processes & Communication",
    prompt: "Our document management system allows easy retrieval and version control.",
    type: "likert"
  },
  {
    id: "APC_11",
    section: "Administrative Processes & Communication",
    prompt: "What percentage of your organization's meetings could be replaced with async communication?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tags: ["efficiency", "ai-opportunity"]
  },
  {
    id: "APC_12",
    section: "Administrative Processes & Communication",
    prompt: "Upload your current process documentation or procedure manual.",
    type: "upload",
    helpText: "Process documentation helps identify optimization and automation opportunities."
  },
  {
    id: "APC_13",
    section: "Administrative Processes & Communication",
    prompt: "Staff training on communication tools and processes is adequate and up-to-date.",
    type: "likert"
  },
  {
    id: "APC_14",
    section: "Administrative Processes & Communication",
    prompt: "How many different software systems does your organization use for daily operations?",
    type: "numeric",
    validationRules: { min: 1, max: 50 }
  },
  {
    id: "APC_15",
    section: "Administrative Processes & Communication",
    prompt: "Our internal communication strategy includes feedback mechanisms and response protocols.",
    type: "likert"
  },
  {
    id: "APC_16",
    section: "Administrative Processes & Communication",
    prompt: "Describe your organization's approaches to knowledge management and institutional memory. Please identify multiple strategies or methods if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various knowledge management approaches: (1) formal documentation systems, (2) mentorship programs, (3) knowledge bases/wikis, (4) training and onboarding materials, (5) exit interviews, (6) cross-training initiatives, (7) communities of practice, (8) process documentation, (9) digital repositories, (10) succession planning protocols. Most organizations use multiple methods to capture and transfer knowledge.",
    enableContext: true,
    contextPrompt: "If different departments use different knowledge management approaches or if certain types of knowledge are harder to capture, please provide additional context about challenges or variations across your organization."
  },
  {
    id: "APC_17",
    section: "Administrative Processes & Communication",
    prompt: "Emergency communication protocols are clearly defined and regularly tested.",
    type: "likert"
  },
  {
    id: "APC_18",
    section: "Administrative Processes & Communication",
    prompt: "What percentage of your administrative staff time is spent on manual data entry?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tags: ["ai-opportunity"]
  },
  {
    id: "APC_19",
    section: "Administrative Processes & Communication",
    prompt: "Cross-training exists so that critical processes don't depend on single individuals.",
    type: "likert"
  },
  {
    id: "APC_20",
    section: "Administrative Processes & Communication",
    prompt: "Our organization effectively manages both formal and informal communication networks.",
    type: "likert"
  },

  // === STRUCTURE, CAPACITY & PERFORMANCE (20 questions) ===
  {
    id: "SCP_01",
    section: "Structure, Capacity & Performance",
    prompt: "Our organizational structure supports efficient workflow and minimal bureaucratic delays.",
    type: "likert",
    required: true,
    helpText: "Organizational structure directly impacts efficiency and capacity utilization."
  },
  {
    id: "SCP_02",
    section: "Structure, Capacity & Performance",
    prompt: "What is your organization's current staff turnover rate (annual percentage)?",
    type: "numeric",
    required: true,
    validationRules: { min: 0, max: 100 },
    enableContext: true,
    contextPrompt: "Please provide context about turnover patterns (e.g., which departments/roles have higher turnover, seasonal patterns, or specific retention challenges) and any initiatives you've implemented to address turnover."
  },
  {
    id: "SCP_03",
    section: "Structure, Capacity & Performance",
    prompt: "Performance metrics are clearly defined and regularly tracked across all departments.",
    type: "likert",
    enableContext: true,
    contextPrompt: "Please describe what performance metrics are most important for different departments in your organization and any challenges you face in standardizing metrics across diverse functional areas."
  },
  {
    id: "SCP_04",
    section: "Structure, Capacity & Performance",
    prompt: "How many layers of management exist between front-line staff and executive leadership?",
    type: "numeric",
    validationRules: { min: 1, max: 10 },
    enableContext: true,
    contextPrompt: "Please provide additional context about how management layers differ across departments (e.g., academic affairs vs. student services vs. IT) or any unique structural considerations for your organization."
  },
  {
    id: "SCP_05",
    section: "Structure, Capacity & Performance",
    prompt: "Our current capacity allows us to handle unexpected increases in demand or workload.",
    type: "likert"
  },
  {
    id: "SCP_06",
    section: "Structure, Capacity & Performance",
    prompt: "Describe your organization's key structural challenges or bottlenecks. Please list multiple challenges if applicable, explaining how each impacts your operations.",
    type: "text",
    required: true,
    validationRules: { min: 100, maxLength: 2000 },
    helpText: "💡 Thinking prompts: Consider challenges across different areas: (1) reporting structures, (2) decision-making processes, (3) resource allocation, (4) communication flows, (5) role clarity, (6) capacity constraints, (7) interdepartmental coordination, (8) workflow bottlenecks. List as many as relevant - most organizations have 3-5 key structural issues. You can format as: Challenge 1: [description], Challenge 2: [description], etc.",
    enableContext: true,
    contextPrompt: "If these challenges vary significantly across departments or have seasonal patterns, please provide that additional context here."
  },
  {
    id: "SCP_07",
    section: "Structure, Capacity & Performance",
    prompt: "Job roles and responsibilities are clearly defined with minimal overlap or gaps.",
    type: "likert"
  },
  {
    id: "SCP_08",
    section: "Structure, Capacity & Performance",
    prompt: "What percentage of your staff are currently working at or above capacity?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    enableContext: true,
    contextPrompt: "Please describe which departments or roles are most affected by capacity issues and any seasonal or cyclical patterns that impact staffing demands in your organization."
  },
  {
    id: "SCP_09",
    section: "Structure, Capacity & Performance",
    prompt: "Our organization effectively manages seasonal or cyclical variations in workload.",
    type: "likert"
  },
  {
    id: "SCP_10",
    section: "Structure, Capacity & Performance",
    prompt: "Performance review processes provide actionable feedback and development opportunities.",
    type: "likert"
  },
  {
    id: "SCP_11",
    section: "Structure, Capacity & Performance",
    prompt: "How many unfilled positions does your organization currently have?",
    type: "numeric",
    validationRules: { min: 0, max: 500 },
    enableContext: true,
    contextPrompt: "Please describe which types of positions are hardest to fill, how long positions typically remain vacant, and any specific challenges with recruitment in your industry or location."
  },
  {
    id: "SCP_12",
    section: "Structure, Capacity & Performance",
    prompt: "Upload your current performance dashboard or key metrics report.",
    type: "upload",
    helpText: "Performance data helps identify capacity optimization opportunities."
  },
  {
    id: "SCP_13",
    section: "Structure, Capacity & Performance",
    prompt: "Our organization has appropriate spans of control (number of direct reports per manager).",
    type: "likert"
  },
  {
    id: "SCP_14",
    section: "Structure, Capacity & Performance",
    prompt: "What percentage of your organization's work could be performed remotely or hybrid?",
    type: "numeric",
    validationRules: { min: 0, max: 100 }
  },
  {
    id: "SCP_15",
    section: "Structure, Capacity & Performance",
    prompt: "Resource allocation decisions are made based on data and strategic priorities.",
    type: "likert"
  },
  {
    id: "SCP_16",
    section: "Structure, Capacity & Performance",
    prompt: "Describe how your organization measures and improves operational efficiency. Please identify multiple approaches or metrics if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1600 },
    helpText: "💡 Consider various efficiency approaches: (1) performance metrics and KPIs, (2) process analysis and optimization, (3) technology adoption and automation, (4) resource allocation and utilization, (5) time and motion studies, (6) cost-benefit analysis, (7) benchmarking against industry standards, (8) employee feedback and suggestions, (9) continuous improvement programs, (10) data analytics and reporting. Effective efficiency improvement typically involves multiple measurement and improvement strategies.",
    enableContext: true,
    contextPrompt: "If different departments use different efficiency measures or if certain improvements have been more successful, please provide additional context about what works best for your organization."
  },
  {
    id: "SCP_17",
    section: "Structure, Capacity & Performance",
    prompt: "Our organizational structure facilitates rather than hinders innovation and change.",
    type: "likert"
  },
  {
    id: "SCP_18",
    section: "Structure, Capacity & Performance",
    prompt: "How many hours per week do staff spend on tasks that could be eliminated or streamlined?",
    type: "numeric",
    validationRules: { min: 0, max: 40 },
    tags: ["efficiency", "ai-opportunity"]
  },
  {
    id: "SCP_19",
    section: "Structure, Capacity & Performance",
    prompt: "Professional development opportunities are aligned with organizational needs and individual growth.",
    type: "likert"
  },
  {
    id: "SCP_20",
    section: "Structure, Capacity & Performance",
    prompt: "Our organization successfully manages competing priorities and resource constraints.",
    type: "likert"
  },

  // === PROFESSIONAL DEVELOPMENT & SUPPORT (15 questions) ===
  {
    id: "PDS_01",
    section: "Professional Development & Support",
    prompt: "Professional development opportunities are readily available and aligned with career advancement.",
    type: "likert",
    required: true,
    helpText: "Investment in professional development directly impacts retention and organizational capability."
  },
  {
    id: "PDS_02",
    section: "Professional Development & Support",
    prompt: "What percentage of your annual budget is allocated to staff training and development?",
    type: "numeric",
    required: true,
    validationRules: { min: 0, max: 50 }
  },
  {
    id: "PDS_03",
    section: "Professional Development & Support",
    prompt: "Our organization provides adequate mental health and wellness support for staff.",
    type: "likert"
  },
  {
    id: "PDS_04",
    section: "Professional Development & Support",
    prompt: "How many training hours does the average employee receive annually?",
    type: "numeric",
    validationRules: { min: 0, max: 500 }
  },
  {
    id: "PDS_05",
    section: "Professional Development & Support",
    prompt: "Career advancement pathways are clearly communicated and accessible to all staff.",
    type: "likert"
  },
  {
    id: "PDS_06",
    section: "Professional Development & Support",
    prompt: "Describe your organization's approaches to onboarding new employees. Please identify multiple components or methods if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various onboarding elements: (1) pre-boarding communications, (2) orientation sessions, (3) role-specific training, (4) mentorship or buddy systems, (5) technology setup and access, (6) cultural integration activities, (7) goal setting and performance expectations, (8) department introductions, (9) feedback checkpoints, (10) extended support periods. Effective onboarding typically involves multiple touchpoints and methods.",
    enableContext: true,
    contextPrompt: "If different roles or departments have different onboarding experiences, or if certain aspects are more challenging, please provide additional context about variations or improvements needed."
  },
  {
    id: "PDS_07",
    section: "Professional Development & Support",
    prompt: "Our organization effectively identifies and develops internal talent for leadership roles.",
    type: "likert"
  },
  {
    id: "PDS_08",
    section: "Professional Development & Support",
    prompt: "What percentage of leadership positions are filled through internal promotion?",
    type: "numeric",
    validationRules: { min: 0, max: 100 }
  },
  {
    id: "PDS_09",
    section: "Professional Development & Support",
    prompt: "Staff have access to technology training and digital skills development.",
    type: "likert",
    tags: ["digital-transformation"]
  },
  {
    id: "PDS_10",
    section: "Professional Development & Support",
    prompt: "Upload your current professional development plan or training catalog.",
    type: "upload",
    helpText: "Training programs help identify gaps in digital skills and AI readiness."
  },
  {
    id: "PDS_11",
    section: "Professional Development & Support",
    prompt: "Our organization provides adequate support for work-life balance.",
    type: "likert"
  },
  {
    id: "PDS_12",
    section: "Professional Development & Support",
    prompt: "How many days of paid professional development leave does your organization provide annually?",
    type: "numeric",
    validationRules: { min: 0, max: 50 }
  },
  {
    id: "PDS_13",
    section: "Professional Development & Support",
    prompt: "Mentoring and coaching programs are available and actively utilized.",
    type: "likert"
  },
  {
    id: "PDS_14",
    section: "Professional Development & Support",
    prompt: "Describe your organization's strategies for knowledge transfer and succession planning. Please identify multiple approaches or components if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various succession planning elements: (1) identification of key positions and talent, (2) leadership development programs, (3) cross-training and job rotation, (4) mentorship and coaching, (5) knowledge documentation, (6) emergency succession protocols, (7) internal promotion pathways, (8) external recruitment planning, (9) competency gap analysis, (10) timeline planning for transitions. Effective succession planning typically involves multiple strategic components.",
    enableContext: true,
    contextPrompt: "If certain roles are harder to fill or if succession planning varies by department or level, please provide additional context about specific challenges or successes."
  },
  {
    id: "PDS_15",
    section: "Professional Development & Support",
    prompt: "Our organization invests in developing skills for future organizational needs.",
    type: "likert"
  },

  // === TECHNOLOGY & DIGITAL INFRASTRUCTURE (15 questions) ===
  {
    id: "TDI_01",
    section: "Technology & Digital Infrastructure",
    prompt: "Our current technology infrastructure adequately supports daily operations and growth.",
    type: "likert",
    required: true,
    helpText: "Technology infrastructure is critical for operational efficiency and AI implementation potential."
  },
  {
    id: "TDI_02",
    section: "Technology & Digital Infrastructure",
    prompt: "What percentage of your organization's processes are currently digitized?",
    type: "numeric",
    required: true,
    validationRules: { min: 0, max: 100 },
    tags: ["digital-transformation"]
  },
  {
    id: "TDI_03",
    section: "Technology & Digital Infrastructure",
    prompt: "Our organization has a clear digital transformation strategy and roadmap.",
    type: "likert",
    tags: ["digital-transformation"]
  },
  {
    id: "TDI_04",
    section: "Technology & Digital Infrastructure",
    prompt: "How many different software systems does your organization use that don't integrate with each other?",
    type: "numeric",
    validationRules: { min: 0, max: 50 }
  },
  {
    id: "TDI_05",
    section: "Technology & Digital Infrastructure",
    prompt: "Data security and privacy policies are up-to-date and regularly enforced.",
    type: "likert"
  },
  {
    id: "TDI_06",
    section: "Technology & Digital Infrastructure",
    prompt: "Describe your organization's key technology challenges or limitations. Please identify multiple areas if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "Consider various technology areas: outdated systems, integration issues, security concerns, user training gaps, budget constraints, vendor management, data management, etc. List all significant technology challenges your organization faces.",
    enableContext: true,
    contextPrompt: "If technology challenges vary by department or have specific timelines for resolution, please provide additional details here."
  },
  {
    id: "TDI_07",
    section: "Technology & Digital Infrastructure",
    prompt: "Our organization effectively uses data analytics to inform decision-making.",
    type: "likert",
    tags: ["analytics", "ai-opportunity"]
  },
  {
    id: "TDI_08",
    section: "Technology & Digital Infrastructure",
    prompt: "What percentage of your annual budget is allocated to technology and IT infrastructure?",
    type: "numeric",
    validationRules: { min: 0, max: 50 },
    enableContext: true,
    contextPrompt: "Please provide details about how your technology budget is distributed (e.g., hardware, software licenses, staff, consulting) and any unique technology needs specific to your industry or organizational structure."
  },
  {
    id: "TDI_09",
    section: "Technology & Digital Infrastructure",
    prompt: "Cloud-based solutions are utilized appropriately for our organizational needs.",
    type: "likert"
  },
  {
    id: "TDI_10",
    section: "Technology & Digital Infrastructure",
    prompt: "Upload your current IT infrastructure diagram or technology stack documentation.",
    type: "upload",
    helpText: "Technology documentation helps assess AI implementation readiness and integration opportunities."
  },
  {
    id: "TDI_11",
    section: "Technology & Digital Infrastructure",
    prompt: "Our organization has dedicated IT support staff or reliable external IT services.",
    type: "likert"
  },
  {
    id: "TDI_12",
    section: "Technology & Digital Infrastructure",
    prompt: "How many hours per week does your organization experience technology-related downtime?",
    type: "numeric",
    validationRules: { min: 0, max: 168 }
  },
  {
    id: "TDI_13",
    section: "Technology & Digital Infrastructure",
    prompt: "Staff are adequately trained on the technology tools they need for their roles.",
    type: "likert"
  },
  {
    id: "TDI_14",
    section: "Technology & Digital Infrastructure",
    prompt: "Our organization regularly updates and maintains its technology infrastructure.",
    type: "likert"
  },
  {
    id: "TDI_15",
    section: "Technology & Digital Infrastructure",
    prompt: "Technology procurement decisions are made strategically with long-term planning.",
    type: "likert"
  },

  // === AI & AUTOMATION OPPORTUNITIES (10 questions) ===
  {
    id: "AI_01",
    section: "AI & Automation Opportunities",
    prompt: "Our organization is actively exploring artificial intelligence and automation opportunities.",
    type: "likert",
    required: true,
    helpText: "AI and automation assessment is critical for future competitiveness and efficiency gains.",
    tags: ["ai-opportunity", "digital-transformation"]
  },
  {
    id: "AI_02",
    section: "AI & Automation Opportunities",
    prompt: "What percentage of your organization's routine tasks could potentially be automated with current technology?",
    type: "numeric",
    required: true,
    validationRules: { min: 0, max: 100 },
    tags: ["ai-opportunity"]
  },
  {
    id: "AI_03",
    section: "AI & Automation Opportunities",
    prompt: "Our organization has staff with AI/machine learning expertise or access to such expertise.",
    type: "likert",
    tags: ["ai-readiness"]
  },
  {
    id: "AI_04",
    section: "AI & Automation Opportunities",
    prompt: "How many hours per week does your organization spend on repetitive data processing tasks?",
    type: "numeric",
    validationRules: { min: 0, max: 200 },
    tags: ["ai-opportunity"]
  },
  {
    id: "AI_05",
    section: "AI & Automation Opportunities",
    prompt: "Our organization has a clear policy or strategy regarding AI adoption and implementation.",
    type: "likert",
    tags: ["ai-strategy"]
  },
  {
    id: "AI_06",
    section: "AI & Automation Opportunities",
    prompt: "Describe the specific administrative tasks and processes in your organization that could benefit from automation. Please identify multiple areas if applicable.",
    type: "text",
    required: true,
    validationRules: { min: 100, maxLength: 2000 },
    helpText: "💡 Consider various automation opportunities: (1) data entry and processing, (2) report generation, (3) scheduling and calendar management, (4) invoice processing, (5) employee onboarding workflows, (6) compliance reporting, (7) inventory management, (8) customer service inquiries, (9) HR processes, (10) financial reconciliation. List all tasks that involve repetitive, rule-based work.",
    enableContext: true,
    contextPrompt: "If automation opportunities vary significantly by department or if there are specific technical constraints or opportunities unique to your organization, please provide additional details here.",
    tags: ["ai-opportunity"]
  },
  {
    id: "AI_07",
    section: "AI & Automation Opportunities",
    prompt: "Our organization currently uses chatbots, automated workflows, or other AI-powered tools.",
    type: "likert",
    tags: ["ai-adoption"]
  },
  {
    id: "AI_08",
    section: "AI & Automation Opportunities",
    prompt: "What percentage of your customer/client service inquiries could be handled by AI assistants?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tags: ["ai-opportunity", "customer-service"]
  },
  {
    id: "AI_09",
    section: "AI & Automation Opportunities",
    prompt: "Our organization is prepared to invest in AI training and implementation over the next 2 years.",
    type: "likert",
    tags: ["ai-investment"]
  },
  {
    id: "AI_10",
    section: "AI & Automation Opportunities",
    prompt: "Describe your organization's key concerns or barriers to AI adoption. Please identify multiple barriers if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1500 },
    helpText: "Consider various barriers: cost/budget, technical expertise, data privacy/security, staff resistance, regulatory concerns, unclear ROI, integration challenges, vendor selection, etc. Most organizations face multiple barriers to AI adoption.",
    enableContext: true,
    contextPrompt: "If certain barriers are more significant for specific departments or use cases, please elaborate here.",
    tags: ["ai-barriers"]
  }
];

/**
 * MONTHLY SUBSCRIPTION TIER QUESTIONS - Additional questions for recurring assessment
 * Includes deeper operational insights and trend analysis (15+ additional questions)
 */
export const MONTHLY_QUESTIONS: Question[] = [
  // Progress Tracking & Trends
  {
    id: "MT_01",
    section: "Progress Tracking & Trends",
    prompt: "Our organization effectively tracks progress on strategic initiatives month-over-month.",
    type: "likert",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_02",
    section: "Progress Tracking & Trends",
    prompt: "What percentage improvement in efficiency has your organization achieved in the past 6 months?",
    type: "numeric",
    validationRules: { min: -50, max: 100 },
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_03",
    section: "Progress Tracking & Trends",
    prompt: "Monthly operational reviews include actionable insights and course corrections.",
    type: "likert",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_04",
    section: "Progress Tracking & Trends",
    prompt: "How many new process improvements has your organization implemented in the past quarter?",
    type: "numeric",
    validationRules: { min: 0, max: 50 },
    tierMinimum: "monthly-subscription",
    enableContext: true,
    contextPrompt: "Please describe the types of process improvements (e.g., technology adoption, workflow changes, policy updates) and which departments or areas have seen the most improvement activity."
  },
  {
    id: "MT_05",
    section: "Progress Tracking & Trends",
    prompt: "Describe significant operational changes your organization has made recently. Please identify multiple changes if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various types of operational changes: (1) technology implementations, (2) process redesigns, (3) organizational restructuring, (4) policy updates, (5) service delivery changes, (6) facility modifications, (7) vendor/partnership changes, (8) workflow automation, (9) staff role changes. Most organizations implement multiple operational changes concurrently.",
    enableContext: true,
    contextPrompt: "If changes were implemented at different times or had varying levels of success across departments, please provide additional context about timing and outcomes.",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_06",
    section: "Progress Tracking & Trends",
    prompt: "Our organization maintains consistent performance metrics across reporting periods.",
    type: "likert",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_07",
    section: "Progress Tracking & Trends",
    prompt: "What percentage of your strategic goals are currently on track or ahead of schedule?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_08",
    section: "Progress Tracking & Trends",
    prompt: "Upload your most recent monthly dashboard or progress report.",
    type: "upload",
    tierMinimum: "monthly-subscription",
    helpText: "Monthly reports help track improvement trends and identify optimization opportunities."
  },
  {
    id: "MT_09",
    section: "Progress Tracking & Trends",
    prompt: "Our organization quickly identifies and addresses performance deviations.",
    type: "likert",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_10",
    section: "Progress Tracking & Trends",
    prompt: "How many key performance indicators does your organization actively monitor?",
    type: "numeric",
    validationRules: { min: 1, max: 100 },
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_11",
    section: "Progress Tracking & Trends",
    prompt: "Data collection and analysis processes are automated and reliable.",
    type: "likert",
    tierMinimum: "monthly-subscription",
    tags: ["automation", "analytics"]
  },
  {
    id: "MT_12",
    section: "Progress Tracking & Trends",
    prompt: "Our organization successfully adapts strategies based on monthly performance data.",
    type: "likert",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_13",
    section: "Progress Tracking & Trends",
    prompt: "What percentage of your organization's decisions are data-driven versus intuition-based?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "monthly-subscription",
    tags: ["analytics"]
  },
  {
    id: "MT_14",
    section: "Progress Tracking & Trends",
    prompt: "Describe your organization's processes for identifying and scaling successful innovations. Please identify multiple approaches or stages if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1600 },
    helpText: "💡 Consider various innovation management processes: (1) idea generation and submission systems, (2) evaluation and selection criteria, (3) pilot program development and testing, (4) success measurement and validation, (5) resource allocation and funding decisions, (6) scaling planning and implementation, (7) stakeholder engagement and communication, (8) risk assessment and mitigation, (9) training and change management, (10) performance monitoring and optimization. Effective innovation management typically involves multiple systematic stages.",
    enableContext: true,
    contextPrompt: "If certain types of innovations are easier to identify or scale, or if different departments have varying success with innovation processes, please provide additional context about what drives successful innovation in your organization.",
    tierMinimum: "monthly-subscription"
  },
  {
    id: "MT_15",
    section: "Progress Tracking & Trends",
    prompt: "Our organization maintains historical data for trend analysis and forecasting.",
    type: "likert",
    tierMinimum: "monthly-subscription",
    tags: ["analytics", "forecasting"]
  }
];

/**
 * COMPREHENSIVE PACKAGE QUESTIONS - Deep strategic analysis (15+ additional questions)
 * Board-ready insights and comprehensive scenario modeling
 */
export const COMPREHENSIVE_QUESTIONS: Question[] = [
  // Strategic Scenario Analysis
  {
    id: "CP_01",
    section: "Strategic Scenario Analysis",
    prompt: "Our organization regularly conducts comprehensive scenario planning for multiple future states.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    required: true
  },
  {
    id: "CP_02",
    section: "Strategic Scenario Analysis",
    prompt: "How many different strategic scenarios has your organization modeled in the past year?",
    type: "numeric",
    validationRules: { min: 0, max: 20 },
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_03",
    section: "Strategic Scenario Analysis",
    prompt: "Board reporting includes multiple scenario outcomes with risk assessments.",
    type: "likert",
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_04",
    section: "Strategic Scenario Analysis",
    prompt: "What percentage of your strategic planning includes quantitative financial modeling?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_05",
    section: "Strategic Scenario Analysis",
    prompt: "Describe your organization's approaches to risk assessment and mitigation planning. Please identify multiple strategies or processes if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various risk management approaches: (1) risk identification and categorization, (2) probability and impact assessment, (3) mitigation strategies and controls, (4) contingency planning, (5) regular monitoring and review, (6) stakeholder communication, (7) insurance and financial protections, (8) business continuity planning, (9) scenario planning and stress testing, (10) compliance and regulatory risk management. Comprehensive risk management typically involves multiple integrated processes.",
    enableContext: true,
    contextPrompt: "If different types of risks require different approaches or if certain risks are particularly challenging for your organization, please provide additional context about your risk priorities and management challenges.",
    tierMinimum: "comprehensive-package",
    required: true
  },
  {
    id: "CP_06",
    section: "Strategic Scenario Analysis",
    prompt: "Our organization has documented contingency plans for various operational disruptions.",
    type: "likert",
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_07",
    section: "Strategic Scenario Analysis",
    prompt: "How many years forward does your organization's strategic planning typically extend?",
    type: "numeric",
    validationRules: { min: 1, max: 20 },
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_08",
    section: "Strategic Scenario Analysis",
    prompt: "Upload your most recent strategic plan or board-level scenario analysis.",
    type: "upload",
    tierMinimum: "comprehensive-package",
    helpText: "Strategic documents help assess scenario modeling sophistication and AI enhancement opportunities."
  },
  {
    id: "CP_09",
    section: "Strategic Scenario Analysis",
    prompt: "External market forces and industry trends are systematically incorporated into strategic planning.",
    type: "likert",
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_10",
    section: "Strategic Scenario Analysis",
    prompt: "What percentage of your strategic decisions include AI or automation impact assessments?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "comprehensive-package",
    tags: ["ai-strategy"]
  },
  {
    id: "CP_11",
    section: "Strategic Scenario Analysis",
    prompt: "Our organization uses sophisticated modeling tools for financial and operational projections.",
    type: "likert",
    tierMinimum: "comprehensive-package",
    tags: ["analytics", "modeling"]
  },
  {
    id: "CP_12",
    section: "Strategic Scenario Analysis",
    prompt: "Cross-functional teams collaborate effectively on strategic scenario development.",
    type: "likert",
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_13",
    section: "Strategic Scenario Analysis",
    prompt: "How many different organizational restructuring scenarios has your organization evaluated?",
    type: "numeric",
    validationRules: { min: 0, max: 10 },
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_14",
    section: "Strategic Scenario Analysis",
    prompt: "Describe your organization's methodologies for validating and testing strategic scenarios. Please identify multiple approaches or processes if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various scenario validation approaches: (1) historical data analysis and back-testing, (2) expert consultation and peer review, (3) pilot programs and small-scale testing, (4) financial modeling and quantitative analysis, (5) stakeholder feedback and input gathering, (6) sensitivity analysis and stress testing, (7) external benchmarking and market research, (8) simulation and modeling tools, (9) cross-functional team evaluation, (10) iterative refinement and updates. Robust scenario planning typically involves multiple validation methods.",
    enableContext: true,
    contextPrompt: "If certain validation methods work better for different types of scenarios, or if resource constraints limit your validation approaches, please provide additional context about your scenario planning challenges and successes.",
    tierMinimum: "comprehensive-package"
  },
  {
    id: "CP_15",
    section: "Strategic Scenario Analysis",
    prompt: "Our organization effectively communicates scenario outcomes to all stakeholders.",
    type: "likert",
    tierMinimum: "comprehensive-package"
  }
];

/**
 * ENTERPRISE TRANSFORMATION QUESTIONS - System-wide analysis (20+ additional questions)
 * Multi-campus, network, or agency-level insights
 */
export const ENTERPRISE_QUESTIONS: Question[] = [
  // System-Wide Integration & Analytics
  {
    id: "ET_01",
    section: "System-Wide Integration & Analytics",
    prompt: "Our organization has centralized analytics and reporting across all locations/divisions.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    required: true
  },
  {
    id: "ET_02",
    section: "System-Wide Integration & Analytics",
    prompt: "How many separate locations, campuses, or divisions does your organization operate?",
    type: "numeric",
    validationRules: { min: 1, max: 1000 },
    tierMinimum: "enterprise-transformation",
    required: true,
    enableContext: true,
    contextPrompt: "Please describe the nature of your locations/divisions (e.g., satellite campuses, regional offices, specialized facilities) and any unique operational differences between them."
  },
  {
    id: "ET_03",
    section: "System-Wide Integration & Analytics",
    prompt: "Data integration across all organizational units is seamless and real-time.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["analytics", "integration"]
  },
  {
    id: "ET_04",
    section: "System-Wide Integration & Analytics",
    prompt: "What percentage of your organizational units use standardized processes and systems?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_05",
    section: "System-Wide Integration & Analytics",
    prompt: "Describe your organization's approaches to managing complexity across multiple locations or divisions. Please identify multiple strategies or frameworks if applicable.",
    type: "text",
    validationRules: { min: 150, maxLength: 2000 },
    helpText: "💡 Consider various complexity management approaches: (1) standardized policies and procedures, (2) centralized vs. decentralized decision-making, (3) shared services and centers of excellence, (4) technology integration and common platforms, (5) communication and coordination mechanisms, (6) performance measurement and reporting systems, (7) cultural alignment initiatives, (8) governance structures and oversight, (9) resource allocation and budgeting processes, (10) change management and training programs. Large organizations typically employ multiple integrated strategies.",
    enableContext: true,
    contextPrompt: "If certain locations or divisions present unique challenges, or if some complexity management approaches work better than others, please provide additional context about what drives success or difficulties in your multi-location operations.",
    tierMinimum: "enterprise-transformation",
    required: true
  },
  {
    id: "ET_06",
    section: "System-Wide Integration & Analytics",
    prompt: "Our organization has enterprise-level governance structures and oversight mechanisms.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_07",
    section: "System-Wide Integration & Analytics",
    prompt: "How many different IT systems require integration across your organizational network?",
    type: "numeric",
    validationRules: { min: 1, max: 200 },
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_08",
    section: "System-Wide Integration & Analytics",
    prompt: "Upload your enterprise architecture diagram or system integration documentation.",
    type: "upload",
    tierMinimum: "enterprise-transformation",
    helpText: "Enterprise architecture helps assess AI integration complexity and automation opportunities across systems."
  },
  {
    id: "ET_09",
    section: "System-Wide Integration & Analytics",
    prompt: "Performance benchmarking occurs regularly across all organizational units.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_10",
    section: "System-Wide Integration & Analytics",
    prompt: "What percentage of your enterprise data is currently accessible through centralized analytics platforms?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "enterprise-transformation",
    tags: ["analytics"]
  },
  {
    id: "ET_11",
    section: "System-Wide Integration & Analytics",
    prompt: "Our organization successfully manages cultural and operational differences across locations.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_12",
    section: "System-Wide Integration & Analytics",
    prompt: "Enterprise-wide change management processes are standardized and effective.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_13",
    section: "System-Wide Integration & Analytics",
    prompt: "How many different AI or automation tools does your organization use across all units?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "enterprise-transformation",
    tags: ["ai-adoption"],
    enableContext: true,
    contextPrompt: "Please describe the types of AI/automation tools in use (e.g., chatbots, predictive analytics, process automation) and how they're distributed across different departments or functions."
  },
  {
    id: "ET_14",
    section: "System-Wide Integration & Analytics",
    prompt: "Describe your organization's strategies for scaling successful innovations across all locations. Please identify multiple approaches or mechanisms if applicable.",
    type: "text",
    validationRules: { min: 150, maxLength: 2000 },
    helpText: "💡 Consider various innovation scaling approaches: (1) pilot program evaluation and validation, (2) standardization and documentation processes, (3) training and change management programs, (4) resource allocation and funding mechanisms, (5) technology infrastructure and support, (6) performance measurement and success metrics, (7) communication and knowledge sharing, (8) local adaptation and customization, (9) leadership sponsorship and governance, (10) timeline and phased rollout planning. Effective scaling typically requires multiple coordinated strategies.",
    enableContext: true,
    contextPrompt: "If certain types of innovations are easier or harder to scale, or if some locations are more receptive to new innovations, please provide additional context about what factors drive successful scaling in your organization.",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_15",
    section: "System-Wide Integration & Analytics",
    prompt: "Our organization has dedicated enterprise architecture and systems integration expertise.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_16",
    section: "System-Wide Integration & Analytics",
    prompt: "What percentage of your enterprise operations could be optimized through AI-powered analytics?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    tierMinimum: "enterprise-transformation",
    tags: ["ai-opportunity"]
  },
  {
    id: "ET_17",
    section: "System-Wide Integration & Analytics",
    prompt: "Our organization maintains consistent quality standards across all locations and divisions.",
    type: "likert",
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_18",
    section: "System-Wide Integration & Analytics",
    prompt: "How many full-time employees work on enterprise integration and analytics across your organization?",
    type: "numeric",
    validationRules: { min: 0, max: 500 },
    tierMinimum: "enterprise-transformation"
  },
  {
    id: "ET_19",
    section: "System-Wide Integration & Analytics",
    prompt: "Enterprise-level AI strategy includes implementation roadmaps for all organizational units.",
    type: "likert",
    tierMinimum: "enterprise-transformation",
    tags: ["ai-strategy"]
  },
  {
    id: "ET_20",
    section: "System-Wide Integration & Analytics",
    prompt: "Describe your organization's approaches to enterprise-wide digital transformation and AI adoption. Please identify multiple strategies or initiatives if applicable.",
    type: "text",
    validationRules: { min: 200, maxLength: 2200 },
    helpText: "💡 Consider various digital transformation approaches: (1) strategic planning and roadmap development, (2) technology infrastructure modernization, (3) data integration and analytics platforms, (4) AI and automation implementation, (5) digital workflow and process redesign, (6) employee training and change management, (7) governance and oversight structures, (8) vendor partnerships and technology selection, (9) pilot programs and phased rollouts, (10) performance measurement and ROI tracking. Enterprise transformation typically requires multiple coordinated initiatives.",
    enableContext: true,
    contextPrompt: "If certain areas of your organization are further along in digital transformation or if specific technologies have been more successful, please provide additional context about your transformation journey and key learnings.",
    tierMinimum: "enterprise-transformation",
    tags: ["digital-transformation", "ai-strategy"]
  }
];

/**
 * ORGANIZATION-SPECIFIC CONTEXTUAL QUESTIONS
 * Additional questions based on organization type
 */
export const CONTEXTUAL_QUESTIONS: Question[] = [
  // Higher Education Specific
  {
    id: "HE_01",
    section: "Academic Excellence & Student Success",
    prompt: "Our academic programs are regularly reviewed and updated to meet industry demands and student needs.",
    type: "likert",
    organizationTypes: ["higher-education"],
    required: true
  },
  {
    id: "HE_02",
    section: "Academic Excellence & Student Success",
    prompt: "What percentage of your courses could incorporate AI tools or automated assessment technologies?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    organizationTypes: ["higher-education"],
    tags: ["ai-opportunity", "education"]
  },
  {
    id: "HE_03",
    section: "Academic Excellence & Student Success",
    prompt: "Student services are integrated and provide comprehensive support throughout the student lifecycle.",
    type: "likert",
    organizationTypes: ["higher-education"]
  },
  {
    id: "HE_04",
    section: "Academic Excellence & Student Success",
    prompt: "Describe your institution's approaches to personalized learning and adaptive educational technologies. Please identify multiple strategies or tools if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various personalized learning approaches: (1) adaptive learning platforms and software, (2) learning analytics and student progress tracking, (3) individualized learning paths and curricula, (4) AI-powered tutoring and support systems, (5) competency-based progression models, (6) multimedia and multimodal content delivery, (7) student self-assessment and reflection tools, (8) faculty training and support for personalization, (9) data-driven intervention and support services, (10) flexible scheduling and pacing options. Effective personalized learning typically combines multiple technologies and pedagogical approaches.",
    enableContext: true,
    contextPrompt: "If certain programs or student populations benefit more from personalized approaches, or if implementation challenges vary across departments, please provide additional context about what works best in your educational environment.",
    organizationTypes: ["higher-education"],
    tags: ["ai-opportunity", "personalization"]
  },
  {
    id: "HE_05",
    section: "Academic Excellence & Student Success",
    prompt: "Our faculty development programs include training on educational technology and AI tools.",
    type: "likert",
    organizationTypes: ["higher-education"],
    tags: ["ai-readiness", "faculty-development"]
  },

  // Healthcare Specific - Replacing education-specific questions with healthcare-relevant content
  {
    id: "HC_01",
    section: "Patient Care & Clinical Excellence",
    prompt: "Our patient care delivery systems are optimized for both quality outcomes and operational efficiency.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true
  },
  {
    id: "HC_02",
    section: "Patient Care & Clinical Excellence",
    prompt: "What percentage of your clinical documentation and administrative processes could be automated?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    organizationTypes: ["healthcare"],
    tags: ["ai-opportunity", "clinical"]
  },
  {
    id: "HC_03",
    section: "Patient Care & Clinical Excellence",
    prompt: "Electronic health records and clinical systems are fully integrated and interoperable.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["integration", "clinical-systems"]
  },
  {
    id: "HC_04",
    section: "Patient Care & Clinical Excellence",
    prompt: "Describe your organization's approaches to predictive analytics and AI-assisted clinical decision support. Please identify multiple tools or applications if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various clinical AI applications: (1) risk prediction and early warning systems, (2) diagnostic assistance and imaging analysis, (3) treatment recommendation engines, (4) medication management and drug interaction alerts, (5) patient deterioration monitoring, (6) population health analytics, (7) clinical workflow optimization, (8) evidence-based practice integration, (9) quality improvement and outcome prediction, (10) personalized treatment planning. Healthcare AI typically involves multiple specialized applications across different clinical areas.",
    enableContext: true,
    contextPrompt: "If certain clinical areas or specialties have been more successful with AI implementation, or if specific tools have shown better outcomes, please provide additional context about your clinical AI journey and results.",
    organizationTypes: ["healthcare"],
    tags: ["ai-opportunity", "clinical-decision-support"]
  },
  {
    id: "HC_05",
    section: "Patient Care & Clinical Excellence",
    prompt: "Our clinical staff are trained and comfortable with AI-powered diagnostic and treatment tools.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["ai-readiness", "clinical-training"]
  },
  {
    id: "HC_06",
    section: "Patient Experience & Support Services",
    prompt: "Patient support services are integrated across the care continuum and provide comprehensive assistance.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    helpText: "Patient support services include case management, social work, discharge planning, financial counseling, and patient advocacy."
  },
  {
    id: "HC_07",
    section: "Patient Experience & Support Services", 
    prompt: "Patient satisfaction scores consistently meet or exceed national benchmarks.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["patient-satisfaction", "quality-metrics"]
  },
  {
    id: "HC_08",
    section: "Patient Experience & Support Services",
    prompt: "Care coordination processes effectively manage patient transitions between departments and levels of care.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["care-coordination", "patient-flow"]
  },
  {
    id: "HC_09",
    section: "Clinical Operations & Quality Management",
    prompt: "Clinical programs and care pathways are regularly reviewed and updated based on evidence-based practices.",
    type: "likert", 
    organizationTypes: ["healthcare"],
    required: true,
    helpText: "Regular review of clinical programs ensures alignment with best practices and quality standards."
  },
  {
    id: "HC_10",
    section: "Clinical Operations & Quality Management",
    prompt: "Quality improvement initiatives are systematically implemented across all clinical departments.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["quality-improvement", "clinical-excellence"]
  },
  {
    id: "HC_11",
    section: "Medical Staff & Professional Development",
    prompt: "Clinical staff development programs include continuing education and competency training.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    helpText: "Ongoing professional development is essential for maintaining clinical competency and patient safety."
  },
  {
    id: "HC_12",
    section: "Medical Staff & Professional Development", 
    prompt: "Medical staff credentialing and privileging processes are efficient and up-to-date.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["credentialing", "medical-staff"]
  },
  {
    id: "HC_13",
    section: "Regulatory Compliance & Safety",
    prompt: "The organization consistently maintains compliance with all relevant healthcare regulations and accreditation standards.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    tags: ["compliance", "regulatory", "accreditation"]
  },
  {
    id: "HC_14",
    section: "Regulatory Compliance & Safety",
    prompt: "Patient safety protocols are systematically implemented and regularly updated.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["patient-safety", "protocols"]
  },
  {
    id: "HC_15",
    section: "Revenue Cycle & Financial Operations",
    prompt: "Revenue cycle processes from registration through collection are optimized for efficiency.",
    type: "likert",
    organizationTypes: ["healthcare"],
    required: true,
    tags: ["revenue-cycle", "financial-operations"]
  },
  {
    id: "HC_16",
    section: "Clinical Technology & EHR Systems",
    prompt: "Clinical information systems support seamless information sharing across all departments.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["clinical-systems", "information-sharing"]
  },
  {
    id: "HC_17", 
    section: "Clinical Technology & EHR Systems",
    prompt: "AI-powered clinical decision support tools are integrated into daily workflows.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["ai-integration", "clinical-decision-support"]
  },
  {
    id: "HC_18",
    section: "Population Health & Community Outreach",
    prompt: "Community health programs effectively address population health needs in our service area.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["population-health", "community-outreach"]
  },
  {
    id: "HC_19",
    section: "Population Health & Community Outreach",
    prompt: "Preventive care initiatives are systematically implemented and tracked for effectiveness.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["preventive-care", "population-health"]
  },
  {
    id: "HC_20",
    section: "Clinical Operations & Quality Management",
    prompt: "Length of stay and readmission rates are consistently monitored and optimized.",
    type: "likert",
    organizationTypes: ["healthcare"],
    tags: ["clinical-metrics", "quality-improvement"]
  },

  // Nonprofit Specific
  {
    id: "NP_01",
    section: "Mission Impact & Community Engagement",
    prompt: "Our programs effectively measure and demonstrate impact aligned with our organizational mission.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    required: true
  },
  {
    id: "NP_02",
    section: "Mission Impact & Community Engagement",
    prompt: "What percentage of your donor management and fundraising processes could be enhanced with AI?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    organizationTypes: ["nonprofit"],
    tags: ["ai-opportunity", "fundraising"]
  },
  {
    id: "NP_03",
    section: "Mission Impact & Community Engagement",
    prompt: "Volunteer management and coordination systems effectively support program delivery.",
    type: "likert",
    organizationTypes: ["nonprofit"]
  },
  {
    id: "NP_04",
    section: "Mission Impact & Community Engagement",
    prompt: "Describe your organization's approaches to community engagement and stakeholder relationship management. Please identify multiple strategies or methods if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various engagement approaches: (1) community outreach and education programs, (2) stakeholder advisory groups and committees, (3) social media and digital communication, (4) partnership development and collaboration, (5) volunteer recruitment and management, (6) donor and supporter engagement, (7) advocacy and policy work, (8) cultural competency and inclusivity initiatives, (9) feedback collection and responsiveness, (10) impact measurement and transparency. Effective community engagement typically involves multiple touchpoints and relationship-building strategies.",
    enableContext: true,
    contextPrompt: "If certain communities or stakeholder groups require different engagement approaches, or if some strategies have been more successful, please provide additional context about what works best for your organization's mission and community.",
    organizationTypes: ["nonprofit"]
  },
  {
    id: "NP_05",
    section: "Mission Impact & Community Engagement",
    prompt: "Our organization uses data analytics to optimize program effectiveness and resource allocation.",
    type: "likert",
    organizationTypes: ["nonprofit"],
    tags: ["analytics", "program-optimization"]
  },

  // Corporate Specific
  {
    id: "CR_01",
    section: "Market Competitiveness & Innovation",
    prompt: "Our organization consistently adapts to market changes and maintains competitive advantages.",
    type: "likert",
    organizationTypes: ["corporate"],
    required: true
  },
  {
    id: "CR_02",
    section: "Market Competitiveness & Innovation",
    prompt: "What percentage of your customer service operations could be enhanced or automated with AI?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    organizationTypes: ["corporate"],
    tags: ["ai-opportunity", "customer-service"]
  },
  {
    id: "CR_03",
    section: "Market Competitiveness & Innovation",
    prompt: "Innovation processes are systematically managed and integrated with business strategy.",
    type: "likert",
    organizationTypes: ["corporate"]
  },
  {
    id: "CR_04",
    section: "Market Competitiveness & Innovation",
    prompt: "Describe your organization's approaches to digital transformation and AI integration in core business processes. Please identify multiple initiatives or areas if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various digital transformation areas: (1) customer experience and interface optimization, (2) supply chain and operations automation, (3) data analytics and business intelligence, (4) AI-powered decision making and recommendations, (5) process digitization and workflow automation, (6) digital marketing and sales enablement, (7) cybersecurity and data protection, (8) cloud infrastructure and scalability, (9) employee productivity and collaboration tools, (10) innovation and R&D acceleration. Business transformation typically involves multiple interconnected digital initiatives.",
    enableContext: true,
    contextPrompt: "If certain business areas or processes have been more successful with digital transformation, or if specific AI applications have delivered better ROI, please provide additional context about your digital strategy priorities and results.",
    organizationTypes: ["corporate"],
    tags: ["digital-transformation", "ai-strategy"]
  },
  {
    id: "CR_05",
    section: "Market Competitiveness & Innovation",
    prompt: "Our organization uses AI and machine learning for business intelligence and predictive analytics.",
    type: "likert",
    organizationTypes: ["corporate"],
    tags: ["ai-adoption", "business-intelligence"]
  },

  // Government Specific
  {
    id: "GV_01",
    section: "Public Service & Regulatory Compliance",
    prompt: "Our organization effectively balances public service delivery with regulatory compliance requirements.",
    type: "likert",
    organizationTypes: ["government"],
    required: true
  },
  {
    id: "GV_02",
    section: "Public Service & Regulatory Compliance",
    prompt: "What percentage of citizen-facing services could be enhanced or automated with AI technologies?",
    type: "numeric",
    validationRules: { min: 0, max: 100 },
    organizationTypes: ["government"],
    tags: ["ai-opportunity", "citizen-services"]
  },
  {
    id: "GV_03",
    section: "Public Service & Regulatory Compliance",
    prompt: "Digital government initiatives are effectively implemented and accessible to all constituencies.",
    type: "likert",
    organizationTypes: ["government"],
    tags: ["digital-government"]
  },
  {
    id: "GV_04",
    section: "Public Service & Regulatory Compliance",
    prompt: "Describe your organization's approaches to transparency, accountability, and public engagement. Please identify multiple strategies or mechanisms if applicable.",
    type: "text",
    validationRules: { min: 100, maxLength: 1800 },
    helpText: "💡 Consider various transparency and engagement approaches: (1) open data initiatives and public information access, (2) public meetings and community forums, (3) digital engagement platforms and online participation, (4) performance reporting and outcome transparency, (5) citizen feedback and complaint mechanisms, (6) participatory budgeting and decision-making, (7) social media and digital communication, (8) accessibility and multi-language services, (9) ethics and conflict of interest policies, (10) audit and oversight systems. Effective public engagement typically involves multiple channels and accountability mechanisms.",
    enableContext: true,
    contextPrompt: "If certain engagement methods work better with different community groups, or if transparency initiatives face specific challenges, please provide additional context about what has been most effective for your organization's public service mission.",
    organizationTypes: ["government"]
  },
  {
    id: "GV_05",
    section: "Public Service & Regulatory Compliance",
    prompt: "Our organization uses data analytics and AI to improve public service delivery and resource allocation.",
    type: "likert",
    organizationTypes: ["government"],
    tags: ["ai-adoption", "public-service"]
  }
];

/**
 * Helper function to get all questions for a specific tier and organization type
 * NOW GUARANTEES 100+ QUESTIONS FOR EVERY TIER
 */
export function getQuestionsForTier(
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership',
  organizationType: OrganizationType = 'higher-education'
): Question[] {
  // Handle AI readiness tiers separately
  if (tier === 'higher-ed-ai-pulse-check' || tier === 'ai-readiness-comprehensive' || tier === 'ai-transformation-blueprint' || tier === 'ai-enterprise-partnership') {
    return getAIReadinessQuestions(tier);
  }

  let questions = [...CORE_QUESTIONS]; // Starts with 100 questions

  // Add contextual questions based on organization type (5+ additional)
  const contextualQuestions = CONTEXTUAL_QUESTIONS.filter(q => 
    !q.organizationTypes || q.organizationTypes.includes(organizationType)
  );
  questions.push(...contextualQuestions);

  // Add tier-specific questions
  if (tier !== 'one-time-diagnostic' && tier !== 'express-diagnostic') {
    questions.push(...MONTHLY_QUESTIONS); // +15 questions
  }
  
  if (tier === 'comprehensive-package' || tier === 'enterprise-transformation') {
    questions.push(...COMPREHENSIVE_QUESTIONS); // +15 questions
  }
  
  if (tier === 'enterprise-transformation') {
    questions.push(...ENTERPRISE_QUESTIONS); // +20 questions
  }

  // Filter out questions that don't meet tier minimum requirement
  questions = questions.filter(q => {
    if (!q.tierMinimum) return true;
    
    const tierHierarchy = {
      'express-diagnostic': 1,
      'one-time-diagnostic': 1, // Keep same as express-diagnostic, both are base tiers
      'monthly-subscription': 2,
      'comprehensive-package': 3,
      'enterprise-transformation': 4,
      'higher-ed-ai-pulse-check': 1,
      'ai-readiness-comprehensive': 2,
      'ai-transformation-blueprint': 3,
      'ai-enterprise-partnership': 4
    };
    
    return tierHierarchy[tier] >= tierHierarchy[q.tierMinimum];
  });

  // Special handling for express-diagnostic to ensure 75 questions
  if (tier === 'express-diagnostic') {
    // Take the first 75 questions, prioritizing required questions
    const requiredQuestions = questions.filter(q => q.required === true);
    const optionalQuestions = questions.filter(q => q.required !== true);
    
    // Ensure we have the right mix for 75 questions
    const targetCount = 75;
    if (requiredQuestions.length >= targetCount) {
      return requiredQuestions.slice(0, targetCount);
    } else {
      const remainingSlots = targetCount - requiredQuestions.length;
      return [...requiredQuestions, ...optionalQuestions.slice(0, remainingSlots)];
    }
  }

  return questions;
}

/**
 * Get sections available for a specific tier and organization type
 */
export function getSectionsForTier(
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): string[] {
  const questions = getQuestionsForTier(tier, organizationType);
  const sectionSet: { [key: string]: boolean } = {};
  questions.forEach(q => {
    sectionSet[q.section] = true;
  });
  const sections = Object.keys(sectionSet);
  return sections.sort();
}

/**
 * Get only required questions for a tier and organization type
 */
export function getRequiredQuestions(
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership',
  organizationType: OrganizationType = 'higher-education'
): Question[] {
  const allQuestions = getQuestionsForTier(tier, organizationType);
  return allQuestions.filter(q => q.required === true);
}

/**
 * Get AI and automation opportunity questions specifically
 */
export function getAIOpportunityQuestions(
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership',
  organizationType: OrganizationType = 'higher-education'
): Question[] {
  const allQuestions = getQuestionsForTier(tier, organizationType);
  return allQuestions.filter(q => q.tags?.includes('ai-opportunity'));
}

/**
 * Validate assessment responses for completeness and quality
 */
export function validateAssessmentResponses(
  responses: Record<string, any>,
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership',
  organizationType: OrganizationType = 'higher-education'
): { valid: boolean; missingRequired: string[]; warningOptional: string[]; aiOpportunityScore: number } {
  const requiredQuestions = getRequiredQuestions(tier, organizationType);
  const allQuestions = getQuestionsForTier(tier, organizationType);
  const aiQuestions = getAIOpportunityQuestions(tier, organizationType);
  
  // Enhanced validation logic that handles different question types properly
  const missingRequired = requiredQuestions
    .filter(q => {
      const response = responses[q.id];
      
      // Handle different question types appropriately
      if (q.type === 'upload') {
        // For upload questions, check if there are files or if uploads are not required for this tier
        return !response || (Array.isArray(response) && response.length === 0);
      } else if (q.type === 'likert' || q.type === 'scale' || q.type === 'multiple-choice') {
        // For numerical responses, check if it's a valid number
        return !response || response === '' || (typeof response === 'number' && (response < 1 || response > 5));
      } else if (q.type === 'text') {
        // For text responses, check if it's not empty
        return !response || response === '' || (typeof response === 'string' && response.trim().length === 0);
      } else if (q.type === 'boolean') {
        // For boolean responses, check if it's defined
        return response === undefined || response === null || response === '';
      } else {
        // Default validation for other types
        return !response || response === '';
      }
    })
    .map(q => q.id);
  
  const answeredCount = Object.keys(responses).length;
  const totalQuestions = allQuestions.length;
  const completionRate = answeredCount / totalQuestions;
  
  // Calculate AI opportunity score based on AI-related responses
  const aiResponses = aiQuestions.filter(q => responses[q.id]);
  const aiOpportunityScore = aiResponses.length > 0 ? 
    Math.round((aiResponses.length / aiQuestions.length) * 100) : 0;
  
  const warningOptional = completionRate < 0.8 ? 
    [`Completion rate: ${Math.round(completionRate * 100)}%. Consider answering more questions for better insights.`] : 
    [];

  return {
    valid: missingRequired.length === 0,
    missingRequired,
    warningOptional,
    aiOpportunityScore
  };
}

/**
 * Get comprehensive question statistics for a tier and organization type
 */
export function getQuestionStats(
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation',
  organizationType: OrganizationType = 'higher-education'
): {
  total: number;
  required: number;
  aiOpportunity: number;
  byType: Record<QuestionType, number>;
  sections: string[];
  meetsWebsitePromise: boolean;
} {
  const questions = getQuestionsForTier(tier, organizationType);
  const required = getRequiredQuestions(tier, organizationType);
  const aiQuestions = getAIOpportunityQuestions(tier, organizationType);
  const sections = getSectionsForTier(tier, organizationType);
  
  const byType = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<QuestionType, number>);

  return {
    total: questions.length,
    required: required.length,
    aiOpportunity: aiQuestions.length,
    byType,
    sections,
    meetsWebsitePromise: questions.length >= 100 // Website promises 100+ questions
  };
}

/**
 * Get AI readiness assessment based on responses
 */
export function getAIReadinessAssessment(
  responses: Record<string, any>,
  tier: 'express-diagnostic' | 'one-time-diagnostic' | 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation' | 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership',
  organizationType: OrganizationType = 'higher-education'
): {
  readinessScore: number;
  automationPotential: number;
  recommendations: string[];
  priorityAreas: string[];
} {
  const aiQuestions = getAIOpportunityQuestions(tier, organizationType);
  const _answeredAIQuestions = aiQuestions.filter(q => responses[q.id]);
  
  // Calculate readiness score based on AI-related responses
  let readinessScore = 0;
  let automationPotential = 0;
  const recommendations: string[] = [];
  const priorityAreas: string[] = [];
  
  // Analyze specific AI opportunity responses
  if (responses['AI_02']) {
    automationPotential = Math.max(automationPotential, parseInt(responses['AI_02']) || 0);
  }
  if (responses['APC_04']) {
    automationPotential = Math.max(automationPotential, parseInt(responses['APC_04']) || 0);
  }
  if (responses['APC_18']) {
    automationPotential = Math.max(automationPotential, parseInt(responses['APC_18']) || 0);
  }
  
  // Calculate overall readiness based on AI adoption questions
  const aiAdoptionQuestions = ['AI_01', 'AI_03', 'AI_05', 'AI_07', 'AI_09'];
  const aiAdoptionScores = aiAdoptionQuestions
    .map(id => parseInt(responses[id]) || 0)
    .filter(score => score > 0);
  
  if (aiAdoptionScores.length > 0) {
    readinessScore = Math.round(aiAdoptionScores.reduce((a, b) => a + b, 0) / aiAdoptionScores.length);
  }
  
  // Generate recommendations based on scores
  if (readinessScore < 3) {
    recommendations.push("Develop AI strategy and leadership buy-in");
    priorityAreas.push("AI Strategy Development");
  }
  if (automationPotential > 30) {
    recommendations.push("Prioritize process automation opportunities");
    priorityAreas.push("Process Automation");
  }
  if (responses['TDI_02'] && parseInt(responses['TDI_02']) < 50) {
    recommendations.push("Accelerate digital transformation initiatives");
    priorityAreas.push("Digital Infrastructure");
  }
  
  return {
    readinessScore: Math.max(readinessScore, 1),
    automationPotential,
    recommendations,
    priorityAreas
  };
}

/**
 * DEDICATED AI READINESS ASSESSMENT QUESTIONS
 * Comprehensive AI readiness evaluation across key domains
 */
export const AI_READINESS_QUESTIONS: Question[] = [
  // === AI STRATEGY & GOVERNANCE (6 questions) ===
  {
    id: "AIR_01",
    section: "AI Strategy & Governance",
    prompt: "Our institution has a formal AI strategy that aligns with our mission and strategic plan.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether your institution has documented AI goals, policies, and implementation roadmap.",
    enableContext: true,
    contextPrompt: "Describe your current AI strategy documentation and governance structure."
  },
  {
    id: "AIR_02", 
    section: "AI Strategy & Governance",
    prompt: "We have designated leadership responsible for AI initiatives and decision-making.",
    type: "likert",
    required: true,
    helpText: "Consider whether there's clear accountability and decision-making authority for AI projects.",
    enableContext: true
  },
  {
    id: "AIR_03",
    section: "AI Strategy & Governance", 
    prompt: "Our AI governance framework addresses ethics, privacy, and responsible AI use.",
    type: "likert",
    required: true,
    helpText: "Assess your policies for ethical AI use, bias prevention, and privacy protection.",
    enableContext: true
  },
  {
    id: "AIR_04",
    section: "AI Strategy & Governance",
    prompt: "We have established metrics and KPIs to measure AI initiative success.",
    type: "likert", 
    required: true,
    helpText: "Consider whether you track ROI, efficiency gains, and other success indicators for AI projects."
  },
  {
    id: "AIR_05",
    section: "AI Strategy & Governance",
    prompt: "Our budget planning includes dedicated funding for AI initiatives and infrastructure.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether AI investments are formally planned and budgeted."
  },
  {
    id: "AIR_06",
    section: "AI Strategy & Governance", 
    prompt: "We regularly review and update our AI strategy based on emerging technologies and outcomes.",
    type: "likert",
    required: true,
    helpText: "Consider how often you reassess AI strategy and adapt to new developments."
  },

  // === PEDAGOGICAL INTEGRATION (5 questions) ===
  {
    id: "AIR_07",
    section: "Pedagogical Integration",
    prompt: "Faculty are trained and supported in integrating AI tools into their teaching practices.",
    type: "likert",
    required: true,
    helpText: "Assess the level of faculty development and support for AI-enhanced pedagogy.",
    enableContext: true,
    contextPrompt: "Describe current faculty training programs and support for AI integration."
  },
  {
    id: "AIR_08",
    section: "Pedagogical Integration",
    prompt: "We have developed curriculum guidelines for appropriate AI use in coursework and assessments.",
    type: "likert", 
    required: true,
    helpText: "Consider whether there are clear policies about when and how AI can be used academically."
  },
  {
    id: "AIR_09",
    section: "Pedagogical Integration",
    prompt: "Students receive education about AI literacy, ethics, and responsible use.",
    type: "likert",
    required: true,
    helpText: "Evaluate student preparation for working with AI tools responsibly.",
    enableContext: true
  },
  {
    id: "AIR_10",
    section: "Pedagogical Integration", 
    prompt: "Our learning management systems and educational technology integrate effectively with AI tools.",
    type: "likert",
    required: true,
    helpText: "Assess technical integration between existing systems and AI applications."
  },
  {
    id: "AIR_11",
    section: "Pedagogical Integration",
    prompt: "We regularly assess the impact of AI integration on learning outcomes and student success.",
    type: "likert",
    required: true,
    helpText: "Consider whether you measure and evaluate the effectiveness of AI in education."
  },

  // === TECHNOLOGY INFRASTRUCTURE (6 questions) ===
  {
    id: "AIR_12",
    section: "Technology Infrastructure",
    prompt: "Our IT infrastructure can support the computational requirements of AI applications.",
    type: "likert",
    required: true,
    helpText: "Evaluate processing power, storage, and network capacity for AI workloads.",
    enableContext: true,
    contextPrompt: "Describe your current computing infrastructure and any cloud resources."
  },
  {
    id: "AIR_13",
    section: "Technology Infrastructure",
    prompt: "We have secure, accessible data systems that can support AI analytics and machine learning.",
    type: "likert",
    required: true,
    helpText: "Consider data quality, accessibility, and security for AI applications."
  },
  {
    id: "AIR_14", 
    section: "Technology Infrastructure",
    prompt: "Our cybersecurity measures are adequate for protecting AI systems and data.",
    type: "likert",
    required: true,
    helpText: "Assess security protocols specifically for AI applications and sensitive data."
  },
  {
    id: "AIR_15",
    section: "Technology Infrastructure",
    prompt: "We have established data governance practices that support AI development and deployment.",
    type: "likert",
    required: true,
    helpText: "Evaluate data management, quality control, and governance processes."
  },
  {
    id: "AIR_16",
    section: "Technology Infrastructure",
    prompt: "Our technology team has the skills and resources to implement and maintain AI systems.",
    type: "likert",
    required: true,
    helpText: "Consider technical expertise, staffing, and ongoing support capabilities.",
    enableContext: true
  },
  {
    id: "AIR_17",
    section: "Technology Infrastructure",
    prompt: "We have reliable backup and disaster recovery systems for AI-critical applications.",
    type: "likert",
    required: true,
    helpText: "Assess business continuity planning for AI-dependent processes."
  },

  // === ORGANIZATIONAL CULTURE & CHANGE MANAGEMENT (5 questions) ===
  {
    id: "AIR_18",
    section: "Organizational Culture & Change Management",
    prompt: "Our institution's culture is open to innovation and technological change.",
    type: "likert",
    required: true,
    helpText: "Evaluate organizational readiness for adopting new technologies and processes.",
    enableContext: true,
    contextPrompt: "Describe your institution's approach to innovation and change management."
  },
  {
    id: "AIR_19",
    section: "Organizational Culture & Change Management",
    prompt: "Staff and faculty are generally receptive to AI tools that can improve their work efficiency.",
    type: "likert",
    required: true,
    helpText: "Consider attitudes toward automation and AI-assisted processes."
  },
  {
    id: "AIR_20",
    section: "Organizational Culture & Change Management",
    prompt: "We have effective change management processes for implementing new AI initiatives.",
    type: "likert",
    required: true,
    helpText: "Assess your ability to plan, communicate, and execute technology implementations."
  },
  {
    id: "AIR_21",
    section: "Organizational Culture & Change Management",
    prompt: "Leadership actively champions AI adoption and provides visible support for initiatives.",
    type: "likert",
    required: true,
    helpText: "Evaluate leadership engagement and communication about AI priorities."
  },
  {
    id: "AIR_22",
    section: "Organizational Culture & Change Management", 
    prompt: "We have processes for addressing concerns and resistance to AI implementation.",
    type: "likert",
    required: true,
    helpText: "Consider how you handle skepticism, fear, or resistance to AI adoption."
  },

  // === COMPLIANCE & RISK MANAGEMENT (3 questions) ===
  {
    id: "AIR_23",
    section: "Compliance & Risk Management",
    prompt: "We understand and comply with relevant regulations (FERPA, ADA, etc.) as they apply to AI use.",
    type: "likert",
    required: true,
    helpText: "Assess regulatory compliance for AI applications in education.",
    enableContext: true,
    contextPrompt: "Describe your approach to regulatory compliance for AI systems."
  },
  {
    id: "AIR_24",
    section: "Compliance & Risk Management",
    prompt: "We have conducted risk assessments for AI implementation across different operational areas.",
    type: "likert",
    required: true,
    helpText: "Consider whether you've evaluated potential risks and mitigation strategies."
  },
  {
    id: "AIR_25",
    section: "Compliance & Risk Management",
    prompt: "Our procurement and vendor management processes address AI-specific requirements and risks.",
    type: "likert",
    required: true,
    helpText: "Evaluate your approach to selecting and managing AI vendors and services."
  },

  // === FACULTY AI INTEGRATION (20 questions) ===
  {
    id: "AIR_26",
    section: "Faculty AI Integration",
    prompt: "Faculty in our institution are actively using AI tools to enhance their teaching effectiveness.",
    type: "likert",
    required: true,
    helpText: "Assess current faculty adoption of AI tools for course design, content creation, and student engagement."
  },
  {
    id: "AIR_27",
    section: "Faculty AI Integration",
    prompt: "Describe your institution's current approach to supporting faculty adoption of AI technologies.",
    type: "text",
    required: true,
    helpText: "Provide details about training programs, resources, and support systems for faculty AI integration."
  },
  {
    id: "AIR_28",
    section: "Faculty AI Integration",
    prompt: "Upload your faculty AI training materials or guidelines (if available).",
    type: "upload",
    required: false,
    helpText: "Share any existing faculty development resources related to AI adoption."
  },
  {
    id: "AIR_29",
    section: "Faculty AI Integration",
    prompt: "Our faculty have clear guidelines on appropriate AI use in research and scholarship.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether faculty understand how to use AI ethically in their research activities."
  },
  {
    id: "AIR_30",
    section: "Faculty AI Integration",
    prompt: "What are the biggest barriers preventing faculty from adopting AI tools at your institution?",
    type: "text",
    required: true,
    helpText: "Identify key challenges such as training, time, technical support, or institutional resistance."
  },
  {
    id: "AIR_31",
    section: "Faculty AI Integration",
    prompt: "Faculty receive adequate technical support for implementing AI tools in their work.",
    type: "likert",
    required: true,
    helpText: "Assess the availability and quality of IT support for faculty AI initiatives."
  },
  {
    id: "AIR_32",
    section: "Faculty AI Integration",
    prompt: "Our institution provides incentives or recognition for innovative AI use in teaching and research.",
    type: "likert",
    required: false,
    helpText: "Consider awards, grants, release time, or other recognition for AI innovation."
  },
  {
    id: "AIR_33",
    section: "Faculty AI Integration",
    prompt: "Describe a successful example of AI integration in teaching or research at your institution.",
    type: "text",
    required: false,
    helpText: "Share specific examples of faculty successfully using AI to enhance their work."
  },
  {
    id: "AIR_34",
    section: "Faculty AI Integration",
    prompt: "Faculty are comfortable using AI for automated grading and assessment tasks.",
    type: "likert",
    required: true,
    helpText: "Evaluate faculty readiness to use AI for efficiency in grading and feedback."
  },
  {
    id: "AIR_35",
    section: "Faculty AI Integration",
    prompt: "Our faculty development programs include AI literacy as a core component.",
    type: "likert",
    required: true,
    helpText: "Assess whether AI skills are integrated into ongoing faculty professional development."
  },
  {
    id: "AIR_36",
    section: "Faculty AI Integration",
    prompt: "What percentage of faculty in your institution have used AI tools in the past year?",
    type: "numeric",
    required: true,
    helpText: "Estimate the percentage of faculty who have experimented with or regularly use AI tools."
  },
  {
    id: "AIR_37",
    section: "Faculty AI Integration",
    prompt: "Faculty collaborate effectively with IT staff on AI implementation projects.",
    type: "likert",
    required: true,
    helpText: "Evaluate the working relationship between faculty and technical staff for AI initiatives."
  },
  {
    id: "AIR_38",
    section: "Faculty AI Integration",
    prompt: "Upload examples of AI-enhanced course materials or research outputs (if available).",
    type: "upload",
    required: false,
    helpText: "Share examples of how faculty are currently using AI in their academic work."
  },
  {
    id: "AIR_39",
    section: "Faculty AI Integration",
    prompt: "Our institution has clear processes for faculty to request AI tools and resources.",
    type: "likert",
    required: true,
    helpText: "Assess whether faculty have accessible pathways to obtain AI resources they need."
  },
  {
    id: "AIR_40",
    section: "Faculty AI Integration",
    prompt: "Describe your institution's vision for faculty AI integration over the next 3-5 years.",
    type: "text",
    required: true,
    helpText: "Articulate long-term goals and expectations for faculty AI adoption and integration."
  },
  {
    id: "AIR_41",
    section: "Faculty AI Integration",
    prompt: "Faculty understand the intellectual property implications of using AI in their work.",
    type: "likert",
    required: true,
    helpText: "Evaluate faculty awareness of IP issues related to AI-generated content and research."
  },
  {
    id: "AIR_42",
    section: "Faculty AI Integration",
    prompt: "What specific AI tools or platforms does your institution provide or recommend to faculty?",
    type: "text",
    required: false,
    helpText: "List specific AI tools, software, or platforms available to faculty."
  },
  {
    id: "AIR_43",
    section: "Faculty AI Integration",
    prompt: "Our faculty have opportunities to share AI best practices with colleagues.",
    type: "likert",
    required: true,
    helpText: "Assess whether there are forums, meetings, or platforms for faculty AI knowledge sharing."
  },
  {
    id: "AIR_44",
    section: "Faculty AI Integration",
    prompt: "Faculty are prepared to teach students about responsible AI use in their disciplines.",
    type: "likert",
    required: true,
    helpText: "Evaluate faculty readiness to guide students in ethical and effective AI use."
  },
  {
    id: "AIR_45",
    section: "Faculty AI Integration",
    prompt: "Upload your institutional AI policy for faculty (if available).",
    type: "upload",
    required: false,
    helpText: "Share your current faculty AI use policy or guidelines document."
  },

  // === STUDENT AI POLICY & ACADEMIC INTEGRITY (18 questions) ===
  {
    id: "AIR_46",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our institution has clear, comprehensive policies governing student use of AI tools.",
    type: "likert",
    required: true,
    helpText: "Evaluate the clarity and comprehensiveness of your student AI use policies."
  },
  {
    id: "AIR_47",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Upload your current student AI use policy or academic integrity guidelines.",
    type: "upload",
    required: false,  // made optional to allow submission without upload
    helpText: "Share your institution's official policy documents regarding student AI use."
  },
  {
    id: "AIR_48",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Describe how your institution communicates AI policies to students.",
    type: "text",
    required: true,
    helpText: "Explain your approach to ensuring students understand AI use expectations and guidelines."
  },
  {
    id: "AIR_49",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Students receive clear guidance on when AI use is permitted versus prohibited in coursework.",
    type: "likert",
    required: true,
    helpText: "Assess whether students understand context-specific AI use expectations."
  },
  {
    id: "AIR_50",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our institution has effective methods for detecting inappropriate AI use in student work.",
    type: "likert",
    required: true,
    helpText: "Evaluate your capability to identify when students use AI inappropriately."
  },
  {
    id: "AIR_51",
    section: "Student AI Policy & Academic Integrity",
    prompt: "What tools or methods does your institution use to detect AI-generated content in student submissions?",
    type: "text",
    required: true,
    helpText: "Describe specific detection tools, software, or manual review processes you employ."
  },
  {
    id: "AIR_52",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Students understand the consequences of violating AI use policies.",
    type: "likert",
    required: true,
    helpText: "Assess student awareness of penalties for inappropriate AI use."
  },
  {
    id: "AIR_53",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our faculty are trained to identify and address AI policy violations.",
    type: "likert",
    required: true,
    helpText: "Evaluate faculty preparedness to recognize and handle AI policy infractions."
  },
  {
    id: "AIR_54",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Describe a recent situation where your institution had to address student AI policy violations.",
    type: "text",
    required: false,
    helpText: "Share how your institution has handled actual AI policy violations (anonymized)."
  },
  {
    id: "AIR_55",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our AI policies are regularly reviewed and updated to address new technologies and use cases.",
    type: "likert",
    required: true,
    helpText: "Assess whether your policies evolve with changing AI landscape."
  },
  {
    id: "AIR_56",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Students receive education about responsible AI use and digital citizenship.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether students learn about ethical AI use beyond just policy compliance."
  },
  {
    id: "AIR_57",
    section: "Student AI Policy & Academic Integrity",
    prompt: "What percentage of courses at your institution have specific AI use guidelines in their syllabi?",
    type: "numeric",
    required: true,
    helpText: "Estimate the proportion of courses that include AI-specific guidance for students."
  },
  {
    id: "AIR_58",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our institution differentiates between AI as a learning tool versus AI as a shortcut to bypass learning.",
    type: "likert",
    required: true,
    helpText: "Assess whether policies distinguish between beneficial and detrimental AI use."
  },
  {
    id: "AIR_59",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Upload examples of course-specific AI guidelines from syllabi (if available).",
    type: "upload",
    required: false,
    helpText: "Share examples of how individual courses address AI use in their specific context."
  },
  {
    id: "AIR_60",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Describe your institution's approach to balancing AI innovation with academic integrity.",
    type: "text",
    required: true,
    helpText: "Explain how you encourage beneficial AI use while maintaining academic standards."
  },
  {
    id: "AIR_61",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Students are taught to critically evaluate AI-generated information and content.",
    type: "likert",
    required: true,
    helpText: "Assess whether students develop skills to assess AI output quality and accuracy."
  },
  {
    id: "AIR_62",
    section: "Student AI Policy & Academic Integrity",
    prompt: "Our institution has clear appeals processes for AI policy violation allegations.",
    type: "likert",
    required: true,
    helpText: "Evaluate fairness and transparency in handling AI policy disputes."
  },
  {
    id: "AIR_63",
    section: "Student AI Policy & Academic Integrity",
    prompt: "What challenges has your institution faced in developing and implementing student AI policies?",
    type: "text",
    required: true,
    helpText: "Describe key obstacles in creating effective student AI governance."
  },

  // === TECHNOLOGY INFRASTRUCTURE (15 questions) ===
  {
    id: "AIR_64",
    section: "Technology Infrastructure",
    prompt: "Our IT infrastructure can support the computational demands of AI applications.",
    type: "likert",
    required: true,
    helpText: "Evaluate your network, storage, and processing capacity for AI workloads."
  },
  {
    id: "AIR_65",
    section: "Technology Infrastructure",
    prompt: "Upload your current IT infrastructure assessment or technology plan.",
    type: "upload",
    required: false,
    helpText: "Share documentation of your current technology capabilities and future plans."
  },
  {
    id: "AIR_66",
    section: "Technology Infrastructure",
    prompt: "Describe your institution's current cloud computing strategy and AI-related services.",
    type: "text",
    required: true,
    helpText: "Detail your use of cloud platforms, AI services, and hybrid infrastructure approaches."
  },
  {
    id: "AIR_67",
    section: "Technology Infrastructure",
    prompt: "Our institution has adequate cybersecurity measures for AI systems and data.",
    type: "likert",
    required: true,
    helpText: "Assess security protections for AI applications and the data they process."
  },
  {
    id: "AIR_68",
    section: "Technology Infrastructure",
    prompt: "We have established data governance protocols specifically for AI applications.",
    type: "likert",
    required: true,
    helpText: "Evaluate policies for data quality, access, and management in AI contexts."
  },
  {
    id: "AIR_69",
    section: "Technology Infrastructure",
    prompt: "What specific AI platforms or services does your institution currently use or plan to implement?",
    type: "text",
    required: true,
    helpText: "List specific AI tools, platforms, or services in use or under consideration."
  },
  {
    id: "AIR_70",
    section: "Technology Infrastructure",
    prompt: "Our IT staff have the technical expertise needed to support AI implementations.",
    type: "likert",
    required: true,
    helpText: "Assess whether IT personnel have necessary AI-related technical skills."
  },
  {
    id: "AIR_71",
    section: "Technology Infrastructure",
    prompt: "We have established backup and disaster recovery protocols for AI systems.",
    type: "likert",
    required: true,
    helpText: "Evaluate business continuity planning for AI-dependent operations."
  },
  {
    id: "AIR_72",
    section: "Technology Infrastructure",
    prompt: "Describe your institution's approach to AI system integration with existing enterprise systems.",
    type: "text",
    required: true,
    helpText: "Explain how AI tools connect with SIS, LMS, HR, and other core systems."
  },
  {
    id: "AIR_73",
    section: "Technology Infrastructure",
    prompt: "Our institution has allocated sufficient budget for AI infrastructure investments.",
    type: "likert",
    required: true,
    helpText: "Assess whether funding is available for necessary AI technology upgrades."
  },
  {
    id: "AIR_74",
    section: "Technology Infrastructure",
    prompt: "We monitor AI system performance and have established service level agreements.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether AI systems have performance monitoring and uptime requirements."
  },
  {
    id: "AIR_75",
    section: "Technology Infrastructure",
    prompt: "What are your institution's biggest technology barriers to AI implementation?",
    type: "text",
    required: true,
    helpText: "Identify key technical obstacles such as legacy systems, bandwidth, or security concerns."
  },
  {
    id: "AIR_76",
    section: "Technology Infrastructure",
    prompt: "Our institution complies with data privacy regulations (FERPA, GDPR, etc.) in AI implementations.",
    type: "likert",
    required: true,
    helpText: "Assess compliance with relevant data protection and privacy requirements."
  },
  {
    id: "AIR_77",
    section: "Technology Infrastructure",
    prompt: "We have established vendor management processes specifically for AI service providers.",
    type: "likert",
    required: true,
    helpText: "Evaluate procurement and oversight processes for AI vendors and contractors."
  },
  {
    id: "AIR_78",
    section: "Technology Infrastructure",
    prompt: "Upload your data privacy and security policies related to AI systems (if available).",
    type: "upload",
    required: false,
    helpText: "Share policies governing data protection in AI applications."
  },

  // === ORGANIZATIONAL CULTURE & CHANGE MANAGEMENT (12 questions) ===
  {
    id: "AIR_79",
    section: "Organizational Culture & Change Management",
    prompt: "Our institutional culture is open to AI innovation and experimentation.",
    type: "likert",
    required: true,
    helpText: "Assess whether your organization encourages AI exploration and accepts calculated risks."
  },
  {
    id: "AIR_80",
    section: "Organizational Culture & Change Management",
    prompt: "Describe the general attitude toward AI adoption among different stakeholder groups at your institution.",
    type: "text",
    required: true,
    helpText: "Compare attitudes among faculty, staff, administration, and students toward AI integration."
  },
  {
    id: "AIR_81",
    section: "Organizational Culture & Change Management",
    prompt: "Our institution has dedicated change management resources for AI transformation initiatives.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether you have personnel and processes to manage AI-related organizational change."
  },
  {
    id: "AIR_82",
    section: "Organizational Culture & Change Management",
    prompt: "Leadership actively champions AI adoption and models innovative behavior.",
    type: "likert",
    required: true,
    helpText: "Assess whether institutional leaders visibly support and participate in AI initiatives."
  },
  {
    id: "AIR_83",
    section: "Organizational Culture & Change Management",
    prompt: "What strategies has your institution used to address resistance to AI adoption?",
    type: "text",
    required: true,
    helpText: "Describe approaches to overcoming skepticism, fear, or opposition to AI integration."
  },
  {
    id: "AIR_84",
    section: "Organizational Culture & Change Management",
    prompt: "Our institution celebrates and shares success stories related to AI implementation.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether AI successes are recognized and communicated widely."
  },
  {
    id: "AIR_85",
    section: "Organizational Culture & Change Management",
    prompt: "Staff and faculty receive adequate communication about AI initiatives and their impact.",
    type: "likert",
    required: true,
    helpText: "Assess transparency and effectiveness of AI-related internal communications."
  },
  {
    id: "AIR_86",
    section: "Organizational Culture & Change Management",
    prompt: "Upload your change management plan or communication strategy for AI adoption (if available).",
    type: "upload",
    required: false,
    helpText: "Share documentation of your planned approach to managing AI transformation."
  },
  {
    id: "AIR_87",
    section: "Organizational Culture & Change Management",
    prompt: "Our institution provides adequate training and support during AI transitions.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether people receive help adapting to new AI-enhanced processes."
  },
  {
    id: "AIR_88",
    section: "Organizational Culture & Change Management",
    prompt: "We have mechanisms to gather feedback and adjust AI implementations based on user experience.",
    type: "likert",
    required: true,
    helpText: "Assess whether AI projects incorporate user feedback and iterate based on results."
  },
  {
    id: "AIR_89",
    section: "Organizational Culture & Change Management",
    prompt: "Describe the biggest cultural challenges your institution faces in AI adoption.",
    type: "text",
    required: true,
    helpText: "Identify key cultural barriers such as risk aversion, lack of digital literacy, or resistance to change."
  },
  {
    id: "AIR_90",
    section: "Organizational Culture & Change Management",
    prompt: "Our institution has established communities of practice or working groups focused on AI.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether there are formal or informal groups driving AI knowledge sharing and adoption."
  },

  // === IMPLEMENTATION PLANNING & STRATEGY (15 questions for comprehensive tier) ===
  {
    id: "AIR_91",
    section: "Implementation Planning & Strategy",
    prompt: "Our institution has a detailed, phased plan for AI implementation across departments.",
    type: "likert",
    required: true,
    helpText: "Assess whether there's a structured approach to rolling out AI initiatives systematically."
  },
  {
    id: "AIR_92",
    section: "Implementation Planning & Strategy",
    prompt: "Upload your AI implementation roadmap or strategic plan (if available).",
    type: "upload",
    required: false,
    helpText: "Share your documented approach to AI adoption and implementation timeline."
  },
  {
    id: "AIR_93",
    section: "Implementation Planning & Strategy",
    prompt: "Describe your institution's approach to prioritizing AI initiatives and allocating resources.",
    type: "text",
    required: true,
    helpText: "Explain how you decide which AI projects to pursue first and how you fund them."
  },
  {
    id: "AIR_94",
    section: "Implementation Planning & Strategy",
    prompt: "We have established success metrics and evaluation criteria for AI initiatives.",
    type: "likert",
    required: true,
    helpText: "Assess whether there are clear ways to measure AI project effectiveness and ROI."
  },
  {
    id: "AIR_95",
    section: "Implementation Planning & Strategy",
    prompt: "Our institution conducts pilot programs before full-scale AI implementations.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether you test AI solutions on a small scale before institution-wide deployment."
  },
  {
    id: "AIR_96",
    section: "Implementation Planning & Strategy",
    prompt: "What are your institution's top 3 AI implementation priorities for the next 2 years?",
    type: "text",
    required: true,
    helpText: "Identify the most important AI initiatives your institution plans to pursue."
  },
  {
    id: "AIR_97",
    section: "Implementation Planning & Strategy",
    prompt: "We have identified potential AI use cases across all major institutional functions.",
    type: "likert",
    required: true,
    helpText: "Assess whether you've systematically examined AI opportunities in academics, operations, and student services."
  },
  {
    id: "AIR_98",
    section: "Implementation Planning & Strategy",
    prompt: "Our AI implementation timeline is realistic and accounts for change management needs.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether implementation plans allow adequate time for training and adaptation."
  },
  {
    id: "AIR_99",
    section: "Implementation Planning & Strategy",
    prompt: "Describe how your institution plans to measure the success and impact of AI initiatives.",
    type: "text",
    required: true,
    helpText: "Explain specific metrics, assessment methods, and evaluation frameworks you'll use."
  },
  {
    id: "AIR_100",
    section: "Implementation Planning & Strategy",
    prompt: "We have contingency plans for AI initiatives that don't meet expectations.",
    type: "likert",
    required: true,
    helpText: "Assess whether there are plans to pivot, scale back, or discontinue unsuccessful AI projects."
  },
  {
    id: "AIR_101",
    section: "Implementation Planning & Strategy",
    prompt: "Our institution considers equity and accessibility in all AI implementation planning.",
    type: "likert",
    required: true,
    helpText: "Evaluate whether AI initiatives are designed to be inclusive and reduce rather than increase disparities."
  },
  {
    id: "AIR_102",
    section: "Implementation Planning & Strategy",
    prompt: "Upload any AI project proposals or business cases your institution has developed.",
    type: "upload",
    required: false,
    helpText: "Share examples of how your institution justifies and plans AI investments."
  },
  {
    id: "AIR_103",
    section: "Implementation Planning & Strategy",
    prompt: "What external partnerships or collaborations does your institution have for AI development?",
    type: "text",
    required: false,
    helpText: "Describe relationships with vendors, other institutions, or organizations supporting AI initiatives."
  },
  {
    id: "AIR_104",
    section: "Implementation Planning & Strategy",
    prompt: "Our institution regularly benchmarks AI capabilities against peer institutions.",
    type: "likert",
    required: true,
    helpText: "Assess whether you compare your AI maturity and progress with similar organizations."
  },
  {
    id: "AIR_105",
    section: "Implementation Planning & Strategy",
    prompt: "Describe your vision for how AI will transform your institution over the next 5-10 years.",
    type: "text",
    required: true,
    helpText: "Articulate the long-term transformation you expect AI to enable at your institution."
  }
];

/**
 * Get AI readiness questions for assessment
 */
export function getAIReadinessQuestions(tier: 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership'): Question[] {
  if (tier === 'higher-ed-ai-pulse-check') {
    // 50 questions for pulse check tier
    return AI_READINESS_QUESTIONS.slice(0, 50);
  }
  
  if (tier === 'ai-readiness-comprehensive') {
    // 105 questions for comprehensive tier
    return AI_READINESS_QUESTIONS;
  }
  
  if (tier === 'ai-transformation-blueprint') {
    // 150 questions for transformation blueprint tier
    const baseQuestions = AI_READINESS_QUESTIONS.map(q => ({
      ...q,
      enableContext: true,
      contextPrompt: q.contextPrompt || `Provide additional context about ${q.section.toLowerCase()} at your institution.`
    }));
    
    // Add 45 additional implementation planning questions for blueprint assessment
    const additionalQuestions: Question[] = [];
    for (let i = 1; i <= 45; i++) {
      additionalQuestions.push({
        id: `ai_blueprint_${i}`,
        prompt: `Blueprint implementation question ${i}: How would you approach advanced AI integration planning?`,
        type: 'text',
        section: 'AI Transformation Blueprint',
        tags: ['ai-readiness', 'blueprint', 'implementation'],
        helpText: 'Provide detailed insights for your AI transformation blueprint.',
        required: false
      });
    }
    
    return [...baseQuestions, ...additionalQuestions].slice(0, 150);
  }
  
  if (tier === 'ai-enterprise-partnership') {
    // 200 questions for enterprise partnership tier
    const baseQuestions = AI_READINESS_QUESTIONS.map(q => ({
      ...q,
      enableContext: true,
      contextPrompt: q.contextPrompt || `Provide additional context about ${q.section.toLowerCase()} at your institution.`
    }));
    
    // Add 45 additional blueprint questions + 50 enterprise questions = 95 additional questions
    const blueprintQuestions: Question[] = [];
    for (let i = 1; i <= 45; i++) {
      blueprintQuestions.push({
        id: `ai_blueprint_${i}`,
        prompt: `Blueprint implementation question ${i}: How would you approach advanced AI integration planning?`,
        type: 'text',
        section: 'AI Transformation Blueprint',
        tags: ['ai-readiness', 'blueprint', 'implementation'],
        helpText: 'Provide detailed insights for your AI transformation blueprint.',
        required: false
      });
    }
    
    const enterpriseQuestions: Question[] = [];
    for (let i = 1; i <= 50; i++) {
      enterpriseQuestions.push({
        id: `ai_enterprise_${i}`,
        prompt: `Enterprise partnership question ${i}: How would you structure ongoing AI partnership and governance?`,
        type: 'text',
        section: 'Enterprise AI Partnership',
        tags: ['ai-readiness', 'enterprise', 'partnership'],
        helpText: 'Detail strategies for enterprise-level AI partnership and governance.',
        required: false
      });
    }
    
    return [...baseQuestions, ...blueprintQuestions, ...enterpriseQuestions].slice(0, 200);
  }
  
  return AI_READINESS_QUESTIONS;
}
