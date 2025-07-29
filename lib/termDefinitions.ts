/**
 * Technical term definitions for NorthPath assessment tooltips
 */

export const TERM_DEFINITIONS: Record<string, string> = {
  // Algorithm Terms
  'DSCH': 'Dynamic Span-of-Control Heuristic - NorthPath\'s proprietary algorithm that analyzes optimal reporting structures and organizational hierarchies',
  'SPAN_CONTROL': 'The number of direct reports a manager supervises. Optimal spans vary by role complexity and industry.',
  'CRF': 'Cultural Resilience Factor - Measures an organization\'s ability to maintain culture and performance during structural changes',
  'ROI': 'Return on Investment - Financial metric measuring efficiency of organizational changes relative to costs',
  'COST_SAVINGS': 'Quantified financial benefits from organizational optimization, typically measured over 3-year periods',
  'RISK_TOLERANCE': 'Organization\'s willingness to accept uncertainty in pursuit of optimization goals',

  // Organizational Terms
  'KPI': 'Key Performance Indicators - Quantifiable metrics used to evaluate organizational success and performance',
  'OKR': 'Objectives and Key Results - Goal-setting framework that defines objectives and tracks key results',
  'RACI': 'Responsible, Accountable, Consulted, Informed - Matrix defining roles and responsibilities in decision-making',
  'RAPID': 'Recommend, Agree, Perform, Input, Decide - Framework for clarifying decision-making roles',
  'ERM': 'Enterprise Risk Management - Comprehensive approach to identifying and managing organizational risks',
  'ADKAR': 'Awareness, Desire, Knowledge, Ability, Reinforcement - Change management methodology',

  // Technology Terms
  'ERP': 'Enterprise Resource Planning - Integrated software system managing business processes',
  'CRM': 'Customer Relationship Management - System for managing customer interactions and data',
  'LMS': 'Learning Management System - Platform for delivering and managing educational content',
  'SIS': 'Student Information System - Database for managing student academic records and enrollment',
  'EMR': 'Electronic Medical Record - Digital version of patient charts and medical history',
  'HRIS': 'Human Resources Information System - Software for managing employee data and HR processes',
  'API': 'Application Programming Interface - Set of protocols for building software applications',

  // Financial Terms
  'CAPEX': 'Capital Expenditures - Funds used to acquire, upgrade, or maintain physical assets',
  'OPEX': 'Operating Expenses - Ongoing costs for running business operations',
  'NPV': 'Net Present Value - Current value of future cash flows minus initial investment',
  'IRR': 'Internal Rate of Return - Discount rate making NPV of cash flows equal to zero',
  'TCO': 'Total Cost of Ownership - Complete cost of acquiring and operating technology over its lifetime',
  'BUDGET_VARIANCE': 'Difference between planned and actual financial performance',
  'COST_CENTER': 'Department or unit for which costs are tracked and managed separately',
  'EFFICIENCY_RATIO': 'Measure of how well resources are used to generate outputs',

  // Healthcare Terms
  'HCAHPS': 'Hospital Consumer Assessment of Healthcare Providers and Systems - Patient satisfaction survey',
  'HAC': 'Hospital-Acquired Conditions - Medical conditions developed during hospital stay',
  'NPS': 'Net Promoter Score - Metric measuring customer/patient loyalty and satisfaction',

  // Education Terms
  'FTE': 'Full-Time Equivalent - Standardized measure of employee workload or student enrollment',
  'FERPA': 'Family Educational Rights and Privacy Act - Federal law protecting student education records',
  'AY': 'Academic Year - Annual period during which academic courses are conducted',
  'ISD': 'Independent School District - Local administrative unit managing public schools',
  'MOU': 'Memorandum of Understanding - Formal agreement outlining terms of cooperation',

  // Governance Terms
  'BOT': 'Board of Trustees - Governing body with fiduciary responsibility for institution',
  'SHARED_GOVERNANCE': 'Collaborative decision-making involving faculty, staff, and administration',
  'DELEGATION': 'Transfer of authority and responsibility from higher to lower organizational levels',

  // Process Terms
  'WORKFLOW': 'Sequence of industrial, administrative, or other processes through which work passes',
  'SOP': 'Standard Operating Procedure - Documented process for routine operations',
  'BOTTLENECKS': 'Points of congestion in a system that limit overall capacity or throughput',
  'AUTOMATION': 'Use of technology to perform tasks with minimal human intervention',

  // Quality Terms
  'QA': 'Quality Assurance - Systematic process of determining whether products meet specified requirements',
  'SLA': 'Service Level Agreement - Contract defining minimum performance standards for services',
  'COMPLIANCE': 'Adherence to laws, regulations, standards, and organizational policies',

  // Data Terms
  'DASHBOARD': 'Visual interface displaying key metrics and performance indicators in real-time',
  'ANALYTICS': 'Systematic analysis of data to discover patterns and insights',
  'DATA_GOVERNANCE': 'Management of data availability, usability, integrity, and security',
  'KPI_TRANSPARENCY': 'Open access to and visibility of key performance indicators across the organization',
  'BENCHMARK': 'Standard or reference point used for comparison in performance measurement'
};

/**
 * Function to automatically detect and wrap technical terms with tooltips
 */
export function wrapTermsWithTooltips(text: string): string {
  let wrappedText = text;
  
  // Common patterns for technical terms
  const patterns = [
    /\bDSCH\b/g,
    /\bspan[- ]of[- ]control\b/gi,
    /\bCRF\b/g,
    /\bROI\b/g,
    /\bKPI\b/g,
    /\bOKR\b/g,
    /\bERM\b/g,
    /\bADKAR\b/g,
    /\bRCI\b/g,
    /\bRAPID\b/g,
    /\bFTE\b/g,
    /\bERP\b/g,
    /\bCRM\b/g,
    /\bLMS\b/g,
    /\bSIS\b/g,
    /\bEMR\b/g,
    /\bHRIS\b/g,
    /\bHCAHPS\b/g,
    /\bNPS\b/g,
    /\bAPI\b/g
  ];

  return wrappedText;
}

/**
 * Get definition for a term (case-insensitive)
 */
export function getTermDefinition(term: string): string | undefined {
  const normalizedTerm = term.toUpperCase().replace(/[^A-Z]/g, '');
  return TERM_DEFINITIONS[normalizedTerm];
}
