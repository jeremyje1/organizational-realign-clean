/**
 * Industry-Specific Language Mapping System
 * 
 * This module provides dynamic language translation based on institution type,
 * converting generic organizational terms to industry-appropriate terminology.
 * 
 * @module @/lib/industryLanguageMapping
 */

export type InstitutionType = 'community-college' | 'public-university' | 'private-university' | 'healthcare' | 'nonprofit' | 'government' | 'corporate';

// Core language mappings for different industries
export const INDUSTRY_LANGUAGE_MAP: Record<InstitutionType, Record<string, string>> = {
  'community-college': {
    // People & Roles
    'student': 'student',
    'students': 'students',
    'clients': 'students',
    'customers': 'students',
    'employees': 'faculty and staff',
    'staff': 'faculty and staff',
    'workers': 'faculty and staff',
    'management': 'administration',
    'executives': 'senior administrators',
    'leadership': 'academic leadership',
    'supervisors': 'department chairs',
    'managers': 'directors and chairs',
    'team leads': 'program coordinators',
    
    // Operations & Processes
    'curriculum': 'curriculum',
    'enrollment': 'enrollment',
    'operations': 'academic operations',
    'business processes': 'academic processes',
    'workflow': 'academic workflow',
    'service delivery': 'educational delivery',
    'customer service': 'student services',
    'quality assurance': 'academic quality assurance',
    'performance metrics': 'student success metrics',
    'productivity': 'educational effectiveness',
    'efficiency': 'instructional efficiency',
    'outcomes': 'student outcomes',
    'deliverables': 'learning outcomes',
    'projects': 'academic initiatives',
    
    // Financial & Resources
    'revenue': 'funding',
    'profit': 'surplus',
    'sales': 'enrollment',
    'market share': 'enrollment share',
    'cost centers': 'academic departments',
    'budget allocation': 'educational funding allocation',
    'return on investment': 'educational return on investment',
    
    // Structure & Organization
    'departments': 'academic departments',
    'divisions': 'academic divisions',
    'business units': 'instructional units',
    'teams': 'academic teams',
    'branches': 'campus locations',
    'subsidiaries': 'satellite campuses',
    'corporate': 'institutional',
    'enterprise': 'college-wide',
    
    // Technology & Systems
    'business systems': 'academic systems',
    'enterprise software': 'institutional software',
    'customer relationship management': 'student information system',
    'CRM': 'SIS',
    'business intelligence': 'institutional effectiveness',
    'supply chain': 'academic pipeline',
    
    // Strategy & Planning
    'business strategy': 'academic strategy',
    'market analysis': 'enrollment analysis',
    'competitive advantage': 'educational advantage',
    'business development': 'program development',
    'strategic initiatives': 'academic initiatives',
    'market research': 'student needs assessment',
    
    // Communication & Relations
    'customer communications': 'student communications',
    'stakeholder engagement': 'community engagement',
    'vendor relations': 'partner relations',
    'client satisfaction': 'student satisfaction',
    'customer experience': 'student experience',
    'brand management': 'institutional reputation'
  },

  'public-university': {
    // People & Roles
    'clients': 'students',
    'customers': 'students',
    'employees': 'faculty, staff, and researchers',
    'management': 'administration',
    'executives': 'senior administrators',
    'leadership': 'academic and research leadership',
    'supervisors': 'department chairs and deans',
    'managers': 'directors and associate deans',
    
    // Operations & Processes
    'operations': 'academic and research operations',
    'business processes': 'academic and administrative processes',
    'service delivery': 'educational and research delivery',
    'customer service': 'student and research services',
    'quality assurance': 'academic quality and research integrity',
    'performance metrics': 'academic and research metrics',
    'productivity': 'research productivity and educational effectiveness',
    'outcomes': 'student and research outcomes',
    'deliverables': 'research deliverables and learning outcomes',
    
    // Financial & Resources
    'revenue': 'funding and grants',
    'profit': 'surplus',
    'sales': 'enrollment and research funding',
    'market share': 'enrollment and research competitiveness',
    'cost centers': 'academic departments and research centers',
    'return on investment': 'educational and research return on investment',
    
    // Structure & Organization
    'departments': 'academic departments',
    'divisions': 'colleges and schools',
    'business units': 'academic and research units',
    'teams': 'research teams and academic committees',
    'branches': 'campus locations and research facilities',
    'corporate': 'institutional',
    'enterprise': 'university-wide',
    
    // Technology & Systems
    'business systems': 'academic and research systems',
    'enterprise software': 'institutional software',
    'customer relationship management': 'student and research information systems',
    'business intelligence': 'institutional research and effectiveness',
    'supply chain': 'research pipeline and academic pathways',
    
    // Strategy & Planning
    'business strategy': 'academic and research strategy',
    'market analysis': 'enrollment and research competitiveness analysis',
    'competitive advantage': 'academic and research excellence',
    'business development': 'program and research development',
    'strategic initiatives': 'academic and research initiatives',
    'market research': 'student and stakeholder needs assessment'
  },

  'private-university': {
    // People & Roles
    'clients': 'students',
    'customers': 'students and alumni',
    'employees': 'faculty and staff',
    'management': 'administration',
    'executives': 'senior administrators',
    'leadership': 'academic leadership and board',
    'supervisors': 'department chairs and deans',
    
    // Operations & Processes
    'operations': 'academic operations',
    'business processes': 'academic and administrative processes',
    'service delivery': 'educational delivery',
    'customer service': 'student services',
    'quality assurance': 'academic excellence',
    'performance metrics': 'student success and institutional metrics',
    'productivity': 'educational effectiveness',
    'outcomes': 'student and alumni outcomes',
    
    // Financial & Resources
    'revenue': 'tuition, donations, and endowment income',
    'profit': 'surplus',
    'sales': 'enrollment and fundraising',
    'market share': 'market position',
    'cost centers': 'academic departments',
    'return on investment': 'educational return on investment',
    
    // Structure & Organization
    'departments': 'academic departments',
    'divisions': 'schools and colleges',
    'business units': 'academic units',
    'teams': 'academic teams and committees',
    'branches': 'campus locations',
    'corporate': 'institutional',
    'enterprise': 'university-wide',
    
    // Strategy & Planning
    'business strategy': 'institutional strategy',
    'market analysis': 'competitive positioning analysis',
    'competitive advantage': 'educational distinction',
    'business development': 'program development and advancement',
    'strategic initiatives': 'institutional initiatives'
  },

  'healthcare': {
    // People & Roles
    'student': 'patient',
    'clients': 'patients',
    'customers': 'patients and families',
    'employees': 'healthcare professionals and staff',
    'staff': 'clinical and administrative staff',
    'management': 'healthcare administration',
    'executives': 'senior healthcare executives',
    'leadership': 'clinical and administrative leadership',
    'supervisors': 'charge nurses and department managers',
    'managers': 'department managers and medical directors',
    'team leads': 'charge nurses and unit coordinators',
    
    // Operations & Processes
    'curriculum': 'treatment protocols',
    'enrollment': 'patient registration',
    'operations': 'clinical operations',
    'business processes': 'clinical and administrative processes',
    'workflow': 'clinical workflow',
    'service delivery': 'patient care delivery',
    'customer service': 'patient services',
    'quality assurance': 'quality of care and patient safety',
    'performance metrics': 'patient outcomes and safety metrics',
    'productivity': 'clinical productivity',
    'efficiency': 'clinical efficiency',
    'outcomes': 'patient outcomes',
    'deliverables': 'patient care deliverables',
    'projects': 'quality improvement initiatives',
    
    // Financial & Resources
    'revenue': 'patient revenue and reimbursements',
    'profit': 'operating margin',
    'sales': 'patient volume',
    'market share': 'patient market share',
    'cost centers': 'clinical departments',
    'budget allocation': 'clinical resource allocation',
    'return on investment': 'clinical return on investment',
    
    // Structure & Organization
    'departments': 'clinical departments',
    'divisions': 'service lines',
    'business units': 'clinical units',
    'teams': 'care teams',
    'branches': 'facilities and clinics',
    'subsidiaries': 'affiliated facilities',
    'corporate': 'health system',
    'enterprise': 'health system-wide',
    
    // Technology & Systems
    'business systems': 'clinical systems',
    'enterprise software': 'healthcare information systems',
    'customer relationship management': 'patient relationship management',
    'CRM': 'EMR/EHR',
    'business intelligence': 'clinical intelligence',
    'supply chain': 'medical supply chain',
    
    // Strategy & Planning
    'business strategy': 'clinical strategy',
    'market analysis': 'patient population analysis',
    'competitive advantage': 'clinical excellence',
    'business development': 'service line development',
    'strategic initiatives': 'quality improvement initiatives',
    'market research': 'patient needs assessment',
    
    // Communication & Relations
    'customer communications': 'patient communications',
    'stakeholder engagement': 'community health engagement',
    'vendor relations': 'supplier relations',
    'client satisfaction': 'patient satisfaction',
    'customer experience': 'patient experience',
    'brand management': 'health system reputation'
  },

  'nonprofit': {
    // People & Roles
    'student': 'client',
    'clients': 'beneficiaries and clients',
    'customers': 'program participants',
    'employees': 'staff and volunteers',
    'staff': 'program staff',
    'management': 'program management',
    'executives': 'executive leadership',
    'leadership': 'organizational leadership',
    'supervisors': 'program coordinators',
    'managers': 'program managers',
    'team leads': 'team coordinators',
    
    // Operations & Processes
    'curriculum': 'program design',
    'enrollment': 'client intake',
    'operations': 'program operations',
    'business processes': 'program and administrative processes',
    'workflow': 'program workflow',
    'service delivery': 'program delivery',
    'customer service': 'participant services',
    'quality assurance': 'program quality and impact',
    'performance metrics': 'program impact metrics',
    'productivity': 'program effectiveness',
    'efficiency': 'operational efficiency',
    'outcomes': 'program outcomes and impact',
    'deliverables': 'program deliverables',
    'projects': 'program initiatives',
    
    // Financial & Resources
    'revenue': 'funding and donations',
    'profit': 'surplus',
    'sales': 'fundraising',
    'market share': 'mission impact',
    'cost centers': 'program departments',
    'budget allocation': 'program funding allocation',
    'return on investment': 'social return on investment',
    
    // Structure & Organization
    'departments': 'program departments',
    'divisions': 'program areas',
    'business units': 'program units',
    'teams': 'program teams',
    'branches': 'program locations',
    'subsidiaries': 'affiliated organizations',
    'corporate': 'organizational',
    'enterprise': 'organization-wide',
    
    // Technology & Systems
    'business systems': 'program management systems',
    'enterprise software': 'nonprofit management software',
    'customer relationship management': 'donor and participant management',
    'CRM': 'DMS (Donor Management System)',
    'business intelligence': 'program analytics',
    'supply chain': 'resource pipeline',
    
    // Strategy & Planning
    'business strategy': 'organizational strategy',
    'market analysis': 'community needs analysis',
    'competitive advantage': 'mission advantage',
    'business development': 'program development',
    'strategic initiatives': 'organizational initiatives',
    'market research': 'community needs assessment',
    
    // Communication & Relations
    'customer communications': 'stakeholder communications',
    'stakeholder engagement': 'community engagement',
    'vendor relations': 'partner relations',
    'client satisfaction': 'participant satisfaction',
    'customer experience': 'participant experience',
    'brand management': 'mission visibility'
  },

  'government': {
    // People & Roles
    'student': 'citizen',
    'clients': 'citizens and constituents',
    'customers': 'citizens',
    'employees': 'public servants and staff',
    'staff': 'government employees',
    'management': 'public administration',
    'executives': 'senior administrators',
    'leadership': 'agency leadership',
    'supervisors': 'division managers',
    'managers': 'program managers',
    'team leads': 'team supervisors',
    
    // Operations & Processes
    'curriculum': 'service protocols',
    'enrollment': 'citizen registration',
    'operations': 'government operations',
    'business processes': 'administrative processes',
    'workflow': 'administrative workflow',
    'service delivery': 'public service delivery',
    'customer service': 'citizen services',
    'quality assurance': 'service quality and compliance',
    'performance metrics': 'public service metrics',
    'productivity': 'operational effectiveness',
    'efficiency': 'administrative efficiency',
    'outcomes': 'public outcomes',
    'deliverables': 'service deliverables',
    'projects': 'public initiatives',
    
    // Financial & Resources
    'revenue': 'budget and appropriations',
    'profit': 'surplus',
    'sales': 'service provision',
    'market share': 'service coverage',
    'cost centers': 'program areas',
    'budget allocation': 'appropriations allocation',
    'return on investment': 'public return on investment',
    
    // Structure & Organization
    'departments': 'government departments',
    'divisions': 'agency divisions',
    'business units': 'government units',
    'teams': 'working groups',
    'branches': 'regional offices',
    'subsidiaries': 'affiliated agencies',
    'corporate': 'governmental',
    'enterprise': 'agency-wide',
    
    // Technology & Systems
    'business systems': 'government systems',
    'enterprise software': 'government information systems',
    'customer relationship management': 'citizen relationship management',
    'CRM': 'CRM (Citizen Relationship Management)',
    'business intelligence': 'government analytics',
    'supply chain': 'procurement chain',
    
    // Strategy & Planning
    'business strategy': 'policy strategy',
    'market analysis': 'public needs analysis',
    'competitive advantage': 'service excellence',
    'business development': 'program development',
    'strategic initiatives': 'policy initiatives',
    'market research': 'public needs assessment',
    
    // Communication & Relations
    'customer communications': 'citizen communications',
    'stakeholder engagement': 'public engagement',
    'vendor relations': 'contractor relations',
    'client satisfaction': 'citizen satisfaction',
    'customer experience': 'citizen experience',
    'brand management': 'public trust'
  },

  'corporate': {
    // Corporate uses standard business terminology but still needs specific mappings for education terms
    'student': 'employee',
    'curriculum': 'training programs',
    'enrollment': 'onboarding',
    'clients': 'clients',
    'customers': 'customers',
    'employees': 'employees',
    'staff': 'staff',
    'management': 'management',
    'executives': 'executives',
    'leadership': 'leadership',
    'supervisors': 'supervisors',
    'managers': 'managers',
    'team leads': 'team leads',
    'operations': 'operations',
    'business processes': 'business processes',
    'workflow': 'workflow',
    'service delivery': 'service delivery',
    'customer service': 'customer service',
    'quality assurance': 'quality assurance',
    'performance metrics': 'performance metrics',
    'productivity': 'productivity',
    'efficiency': 'efficiency',
    'outcomes': 'outcomes',
    'deliverables': 'deliverables',
    'projects': 'projects',
    'revenue': 'revenue',
    'profit': 'profit',
    'sales': 'sales',
    'market share': 'market share',
    'business units': 'business units',
    'cost centers': 'cost centers',
    'departments': 'departments',
    'divisions': 'divisions',
    'teams': 'teams',
    'branches': 'branches',
    'subsidiaries': 'subsidiaries',
    'corporate': 'corporate',
    'enterprise': 'enterprise'
  }
};

// Section name mappings by industry
export const SECTION_NAME_MAP: Record<InstitutionType, Record<string, string>> = {
  'community-college': {
    'Student Experience': 'Student Experience',
    'Business Operations & Strategy': 'Academic Operations & Strategy',
    'Customer Service': 'Student Services',
    'Sales & Marketing': 'Enrollment Management & Marketing',
    'Human Resources & Talent Management': 'Faculty & Staff Management',
    'Finance & Budget': 'Finance & Budget',
    'Information Technology & Digital Infrastructure': 'Information Technology & Digital Infrastructure',
    'Quality Assurance & Compliance': 'Academic Quality & Compliance',
    'External Relations & Partnerships': 'Community Relations & Partnerships',
    'Student & Client Services': 'Student Services',
    'Research & Development': 'Curriculum Development',
    'Facilities & Operations': 'Campus Facilities & Operations'
  },
  
  'public-university': {
    'Business Operations & Strategy': 'Academic & Research Operations',
    'Customer Service': 'Student & Research Services',
    'Sales & Marketing': 'Enrollment & Research Development',
    'Human Resources & Talent Management': 'Faculty & Staff Management',
    'Finance & Budget': 'Finance & Budget',
    'Information Technology & Digital Infrastructure': 'Information Technology & Digital Infrastructure',
    'Quality Assurance & Compliance': 'Academic Quality & Research Integrity',
    'External Relations & Partnerships': 'External Relations & Partnerships',
    'Student & Client Services': 'Student & Research Services',
    'Research & Development': 'Research & Development',
    'Facilities & Operations': 'Campus Facilities & Operations'
  },
  
  'private-university': {
    'Business Operations & Strategy': 'Institutional Operations & Strategy',
    'Customer Service': 'Student Services',
    'Sales & Marketing': 'Enrollment Management & Advancement',
    'Human Resources & Talent Management': 'Faculty & Staff Management',
    'Finance & Budget': 'Finance & Budget',
    'Information Technology & Digital Infrastructure': 'Information Technology & Digital Infrastructure',
    'Quality Assurance & Compliance': 'Academic Excellence & Compliance',
    'External Relations & Partnerships': 'Alumni Relations & Partnerships',
    'Student & Client Services': 'Student Services',
    'Research & Development': 'Academic Innovation',
    'Facilities & Operations': 'Campus Facilities & Operations'
  },
  
  'healthcare': {
    'Student Experience': 'Patient Care Experience',
    'Business Operations & Strategy': 'Clinical Operations & Strategy',
    'Customer Service': 'Patient Services',
    'Sales & Marketing': 'Patient Engagement & Community Outreach',
    'Human Resources & Talent Management': 'Healthcare Workforce Management',
    'Finance & Budget': 'Finance & Revenue Cycle',
    'Information Technology & Digital Infrastructure': 'Health Information Technology',
    'Quality Assurance & Compliance': 'Patient Safety & Quality',
    'External Relations & Partnerships': 'Community Health Partnerships',
    'Student & Client Services': 'Patient & Family Services',
    'Research & Development': 'Clinical Research & Innovation',
    'Facilities & Operations': 'Facilities & Clinical Operations'
  },
  
  'nonprofit': {
    'Student Experience': 'Client Experience',
    'Business Operations & Strategy': 'Program Operations & Strategy',
    'Customer Service': 'Participant Services',
    'Sales & Marketing': 'Outreach & Communications',
    'Human Resources & Talent Management': 'Staff & Volunteer Management',
    'Finance & Budget': 'Finance & Resource Development',
    'Information Technology & Digital Infrastructure': 'Information Technology & Digital Infrastructure',
    'Quality Assurance & Compliance': 'Program Quality & Compliance',
    'External Relations & Partnerships': 'Community Partnerships',
    'Student & Client Services': 'Participant Services',
    'Research & Development': 'Program Development & Innovation',
    'Facilities & Operations': 'Facilities & Operations'
  },
  
  'government': {
    'Student Experience': 'Citizen Services',
    'Business Operations & Strategy': 'Government Operations & Policy',
    'Customer Service': 'Citizen Services',
    'Sales & Marketing': 'Public Communications & Outreach',
    'Human Resources & Talent Management': 'Public Workforce Management',
    'Finance & Budget': 'Public Finance & Budget',
    'Information Technology & Digital Infrastructure': 'Government Information Technology',
    'Quality Assurance & Compliance': 'Service Quality & Regulatory Compliance',
    'External Relations & Partnerships': 'Intergovernmental Relations',
    'Student & Client Services': 'Citizen Services',
    'Research & Development': 'Policy Research & Development',
    'Facilities & Operations': 'Government Facilities & Operations'
  },
  
  'corporate': {
    // Corporate uses standard business terminology
    'Student Experience': 'Employee Experience',
    'Business Operations & Strategy': 'Business Operations & Strategy',
    'Customer Service': 'Customer Service',
    'Sales & Marketing': 'Sales & Marketing',
    'Human Resources & Talent Management': 'Human Resources & Talent Management',
    'Finance & Budget': 'Finance & Budget',
    'Information Technology & Digital Infrastructure': 'Information Technology & Digital Infrastructure',
    'Quality Assurance & Compliance': 'Quality Assurance & Compliance',
    'External Relations & Partnerships': 'External Relations & Partnerships',
    'Student & Client Services': 'Customer Services',
    'Research & Development': 'Research & Development',
    'Facilities & Operations': 'Facilities & Operations'
  }
};

// UI element mappings by industry
export const UI_ELEMENT_MAP: Record<InstitutionType, Record<string, string>> = {
  'community-college': {
    'Assessment': 'Academic Assessment',
    'Organization Assessment': 'College Assessment',
    'Business Assessment': 'Institutional Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin College Assessment',
    'Dashboard': 'College Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Institutional Reports',
    'Analytics': 'Academic Analytics',
    'Performance': 'Educational Performance',
    'Metrics': 'Student Success Metrics',
    'KPIs': 'Key Educational Indicators',
    'ROI': 'Educational ROI',
    'Efficiency': 'Instructional Efficiency',
    'Optimization': 'Academic Optimization'
  },
  
  'public-university': {
    'Assessment': 'University Assessment',
    'Organization Assessment': 'University Assessment',
    'Business Assessment': 'Institutional Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin University Assessment',
    'Dashboard': 'University Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Institutional Reports',
    'Analytics': 'Institutional Analytics',
    'Performance': 'Academic & Research Performance',
    'Metrics': 'Institutional Metrics',
    'KPIs': 'Key Performance Indicators',
    'ROI': 'Educational & Research ROI',
    'Efficiency': 'Operational Efficiency',
    'Optimization': 'Institutional Optimization'
  },
  
  'private-university': {
    'Assessment': 'University Assessment',
    'Organization Assessment': 'University Assessment',
    'Business Assessment': 'Institutional Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin University Assessment',
    'Dashboard': 'University Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Institutional Reports',
    'Analytics': 'Institutional Analytics',
    'Performance': 'Academic Performance',
    'Metrics': 'Educational Metrics',
    'KPIs': 'Key Educational Indicators',
    'ROI': 'Educational ROI',
    'Efficiency': 'Educational Efficiency',
    'Optimization': 'Academic Optimization'
  },
  
  'healthcare': {
    'Assessment': 'Healthcare Assessment',
    'Organization Assessment': 'Healthcare System Assessment',
    'Business Assessment': 'Healthcare Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin Healthcare Assessment',
    'Dashboard': 'Healthcare Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Healthcare Reports',
    'Analytics': 'Healthcare Analytics',
    'Performance': 'Clinical Performance',
    'Metrics': 'Patient Care Metrics',
    'KPIs': 'Key Clinical Indicators',
    'ROI': 'Clinical ROI',
    'Efficiency': 'Clinical Efficiency',
    'Optimization': 'Care Optimization'
  },
  
  'nonprofit': {
    'Assessment': 'Organization Assessment',
    'Organization Assessment': 'Nonprofit Assessment',
    'Business Assessment': 'Organizational Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin Organizational Assessment',
    'Dashboard': 'Organization Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Impact Reports',
    'Analytics': 'Program Analytics',
    'Performance': 'Program Performance',
    'Metrics': 'Impact Metrics',
    'KPIs': 'Key Impact Indicators',
    'ROI': 'Social ROI',
    'Efficiency': 'Program Efficiency',
    'Optimization': 'Mission Optimization'
  },
  
  'government': {
    'Assessment': 'Agency Assessment',
    'Organization Assessment': 'Government Assessment',
    'Business Assessment': 'Agency Assessment',
    'Get Started': 'Begin Assessment',
    'Start Assessment': 'Begin Agency Assessment',
    'Dashboard': 'Agency Dashboard',
    'Results': 'Assessment Results',
    'Reports': 'Government Reports',
    'Analytics': 'Public Service Analytics',
    'Performance': 'Public Service Performance',
    'Metrics': 'Service Metrics',
    'KPIs': 'Key Service Indicators',
    'ROI': 'Public ROI',
    'Efficiency': 'Administrative Efficiency',
    'Optimization': 'Service Optimization'
  },
  
  'corporate': {
    // Corporate uses standard business terminology
    'Assessment': 'Assessment',
    'Organization Assessment': 'Business Assessment',
    'Business Assessment': 'Business Assessment',
    'Get Started': 'Get Started',
    'Start Assessment': 'Start Assessment',
    'Dashboard': 'Dashboard',
    'Results': 'Results',
    'Reports': 'Reports',
    'Analytics': 'Analytics',
    'Performance': 'Performance',
    'Metrics': 'Metrics',
    'KPIs': 'KPIs',
    'ROI': 'ROI',
    'Efficiency': 'Efficiency',
    'Optimization': 'Optimization'
  }
};

/**
 * Translates a text string based on the selected institution type
 */
export function translateText(text: string, institutionType: InstitutionType): string {
  if (!text) {
    return text;
  }

  const languageMap = INDUSTRY_LANGUAGE_MAP[institutionType];
  if (!languageMap) {
    return text;
  }

  let translatedText = text;
  
  // Sort keys by length (longest first) to handle multi-word phrases properly
  const sortedKeys = Object.keys(languageMap).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const replacement = languageMap[key];
    // Use case-insensitive replacement with word boundaries
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translatedText = translatedText.replace(regex, replacement);
  }
  
  return translatedText;
}

/**
 * Translates a section name based on the selected institution type
 */
export function translateSectionName(sectionName: string, institutionType: InstitutionType): string {
  if (!sectionName) {
    return sectionName;
  }

  const sectionMap = SECTION_NAME_MAP[institutionType];
  return sectionMap?.[sectionName] || sectionName;
}

/**
 * Translates UI elements based on the selected institution type
 */
export function translateUIElement(element: string, institutionType: InstitutionType): string {
  if (!element || institutionType === 'corporate') {
    return element;
  }

  const uiMap = UI_ELEMENT_MAP[institutionType];
  return uiMap?.[element] || element;
}

/**
 * Gets industry-specific context for tooltips and help text
 */
export function getIndustryContext(institutionType: InstitutionType): {
  primaryFocus: string;
  stakeholders: string;
  successMetrics: string;
  keyMetrics: string[];
} {
  const contexts = {
    'community-college': {
      primaryFocus: 'Student success, workforce development, and community engagement',
      stakeholders: 'Students, faculty, staff, local employers, and community members',
      successMetrics: 'Completion rates, job placement, transfer success, and community impact',
      keyMetrics: ['completion', 'transfer', 'workforce development', 'dual enrollment', 'community engagement']
    },
    'public-university': {
      primaryFocus: 'Education, research, and public service',
      stakeholders: 'Students, faculty, researchers, staff, state government, and the public',
      successMetrics: 'Academic achievement, research output, graduation rates, and public impact',
      keyMetrics: ['research', 'academic excellence', 'public service', 'state accountability', 'knowledge creation']
    },
    'private-university': {
      primaryFocus: 'Educational excellence and institutional sustainability',
      stakeholders: 'Students, faculty, staff, alumni, donors, and the board of trustees',
      successMetrics: 'Academic quality, student satisfaction, alumni success, and financial health',
      keyMetrics: ['academic excellence', 'alumni engagement', 'endowment', 'institutional reputation', 'student experience']
    },
    'healthcare': {
      primaryFocus: 'patient outcomes',
      stakeholders: 'Patients, families, healthcare professionals, and the community',
      successMetrics: 'Patient outcomes, safety scores, satisfaction, and quality indicators',
      keyMetrics: ['patient satisfaction', 'patient safety', 'quality of care', 'clinical outcomes', 'patient experience']
    },
    'nonprofit': {
      primaryFocus: 'Mission fulfillment and community impact',
      stakeholders: 'Program participants, donors, volunteers, staff, and the community',
      successMetrics: 'Program outcomes, impact measurement, donor satisfaction, and mission alignment',
      keyMetrics: ['social impact', 'mission alignment', 'program effectiveness', 'community benefit', 'stakeholder engagement']
    },
    'government': {
      primaryFocus: 'Public service delivery and civic responsibility',
      stakeholders: 'Citizens, taxpayers, elected officials, and other government agencies',
      successMetrics: 'Service quality, citizen satisfaction, efficiency, and public accountability',
      keyMetrics: ['public service', 'citizen satisfaction', 'accountability', 'transparency', 'regulatory compliance']
    },
    'corporate': {
      primaryFocus: 'Business performance and stakeholder value',
      stakeholders: 'Customers, employees, shareholders, and business partners',
      successMetrics: 'Revenue, profitability, market share, and customer satisfaction',
      keyMetrics: ['profitability', 'market share', 'competitive advantage', 'customer satisfaction', 'operational efficiency']
    }
  };

  return contexts[institutionType];
}

/**
 * Gets institution-specific report headers and labels
 */
export function getReportLabels(institutionType: InstitutionType): Record<string, string> {
  const labels = {
    'community-college': {
      'Executive Summary': 'College Assessment Summary',
      'Recommendations': 'Academic Improvement Recommendations',
      'Implementation Plan': 'Educational Enhancement Plan',
      'Success Metrics': 'Student Success Metrics',
      'Cost Analysis': 'Educational Investment Analysis',
      'Risk Assessment': 'Academic Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Educational Resources Required'
    },
    'public-university': {
      'Executive Summary': 'University Assessment Summary',
      'Recommendations': 'Institutional Improvement Recommendations',
      'Implementation Plan': 'Academic and Research Enhancement Plan',
      'Success Metrics': 'Institutional Success Metrics',
      'Cost Analysis': 'Educational Investment Analysis',
      'Risk Assessment': 'Institutional Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Institutional Resources Required'
    },
    'private-university': {
      'Executive Summary': 'University Assessment Summary',
      'Recommendations': 'Institutional Excellence Recommendations',
      'Implementation Plan': 'Academic Enhancement Plan',
      'Success Metrics': 'Educational Success Metrics',
      'Cost Analysis': 'Educational Investment Analysis',
      'Risk Assessment': 'Institutional Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Educational Resources Required'
    },
    'healthcare': {
      'Executive Summary': 'Healthcare Assessment Summary',
      'Recommendations': 'Clinical Improvement Recommendations',
      'Implementation Plan': 'Care Enhancement Plan',
      'Success Metrics': 'Patient Care Metrics',
      'Cost Analysis': 'Healthcare Investment Analysis',
      'Risk Assessment': 'Clinical Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Healthcare Resources Required'
    },
    'nonprofit': {
      'Executive Summary': 'Organization Assessment Summary',
      'Recommendations': 'Program Improvement Recommendations',
      'Implementation Plan': 'Mission Enhancement Plan',
      'Success Metrics': 'Impact Metrics',
      'Cost Analysis': 'Program Investment Analysis',
      'Risk Assessment': 'Organizational Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Program Resources Required'
    },
    'government': {
      'Executive Summary': 'Agency Assessment Summary',
      'Recommendations': 'Service Improvement Recommendations',
      'Implementation Plan': 'Public Service Enhancement Plan',
      'Success Metrics': 'Service Delivery Metrics',
      'Cost Analysis': 'Public Investment Analysis',
      'Risk Assessment': 'Administrative Risk Assessment',
      'Timeline': 'Implementation Timeline',
      'Resources Required': 'Public Resources Required'
    },
    'corporate': {
      'Executive Summary': 'Executive Summary',
      'Recommendations': 'Business Recommendations',
      'Implementation Plan': 'Implementation Plan',
      'Success Metrics': 'Success Metrics',
      'Cost Analysis': 'Cost Analysis',
      'Risk Assessment': 'Risk Assessment',
      'Timeline': 'Timeline',
      'Resources Required': 'Resources Required'
    }
  };

  return labels[institutionType];
}
