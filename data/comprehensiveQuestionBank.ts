export type QuestionType = 'likert' | 'numeric' | 'select' | 'multi-select';
export type InstitutionType = 'community-college' | 'public-university' | 'private-university' | 'healthcare' | 'nonprofit' | 'government' | 'corporate';

export interface Question {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  tags?: ('AI' | 'HO' | 'LEADERSHIP' | 'FINANCE' | 'OPERATIONS')[];
  institutionTypes: InstitutionType[];
  priority?: 'high' | 'medium' | 'low';
  options?: string[]; // For select/multi-select questions
  tooltip?: {
    explanation?: string;
    examples?: string[];
  };
}

// Institution type selection question
export const institutionTypeQuestion: Question = {
  id: 'INST_TYPE',
  section: 'Institution Type',
  prompt: 'What type of institution are you?',
  type: 'select',
  institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
  priority: 'high',
  options: [
    'Community College',
    'Public University/State University',
    'Private University/College',
    'Healthcare Organization/Hospital System',
    'Nonprofit Organization',
    'Government Agency',
    'Corporate/Business Organization'
  ],
  tooltip: {
    explanation: 'Select the organizational type that best describes your institution. This helps customize the assessment questions to your specific context and regulatory environment.',
    examples: [
      'Community College: Two-year institutions focused on local workforce development',
      'Public University: State-funded research universities with diverse programs',
      'Healthcare: Hospitals, health systems, medical centers, or clinics',
      'Nonprofit: Mission-driven organizations exempt from federal income tax'
    ]
  }
};

export const comprehensiveQuestionBank: Question[] = [
  // Institution Type Selection (Always shown first)
  institutionTypeQuestion,

  // ===== GOVERNANCE & LEADERSHIP =====
  { 
    id: 'GL_01', 
    section: 'Governance & Leadership', 
    prompt: 'Our organizational chart is current and accurately reflects reporting lines.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['LEADERSHIP'],
    tooltip: {
      explanation: 'An accurate organizational chart shows clear reporting relationships, spans of control, and authority structures. It should be updated within the last 12 months.',
      examples: [
        'Chart shows direct reporting relationships without gaps or confusion',
        'All positions and departments are represented accurately',
        'Recent restructuring or role changes are reflected',
        'Temporary assignments and acting roles are clearly marked'
      ]
    }
  },
  { 
    id: 'GL_02', 
    section: 'Governance & Leadership', 
    prompt: 'Decision-making authority is clearly defined at each organizational level.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['LEADERSHIP'],
    tooltip: {
      explanation: 'Each role should have clear boundaries for what decisions they can make independently, what requires approval, and what must be escalated to higher levels.',
      examples: [
        'Department heads can approve expenses up to $5,000',
        'Faculty can modify syllabi but need approval for major curriculum changes',
        'Managers have hiring authority for staff positions but not faculty',
        'Emergency procedures specify who can make urgent decisions'
      ]
    }
  },
  { 
    id: 'GL_03', 
    section: 'Governance & Leadership', 
    prompt: 'Cross-functional teams effectively break down organizational silos.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tooltip: {
      explanation: 'Silos occur when departments work in isolation without collaboration. Cross-functional teams bring together people from different areas to work on shared goals and improve communication.',
      examples: [
        'Regular interdepartmental project teams for major initiatives',
        'Joint committees with representatives from multiple divisions',
        'Shared KPIs that require departments to collaborate',
        'Cross-training programs that build understanding across units'
      ]
    }
  },
  { 
    id: 'GL_04', 
    section: 'Governance & Leadership', 
    prompt: 'Leadership regularly reviews performance metrics tied to strategic goals.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    tooltip: {
      explanation: 'Strategic alignment requires measuring what matters. Leadership should have regular review cycles (monthly/quarterly) where they assess progress on key performance indicators linked to organizational objectives.',
      examples: [
        'Monthly dashboard reviews with enrollment, retention, and completion rates',
        'Quarterly budget variance analysis against strategic priorities',
        'Annual strategic plan progress assessments',
        'Weekly safety and quality metrics reviews in healthcare settings'
      ]
    },
    priority: 'high',
    tags: ['LEADERSHIP']
  },
  { 
    id: 'GL_05', 
    section: 'Governance & Leadership', 
    prompt: 'We have a proven change management framework used successfully in recent years.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'GL_06', 
    section: 'Governance & Leadership', 
    prompt: 'Senior leaders have received training on AI implications for policy, ethics, and risk.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI', 'LEADERSHIP']
  },
  { 
    id: 'GL_07', 
    section: 'Governance & Leadership', 
    prompt: 'Board/governing body includes expertise in digital transformation and technology strategy.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government'],
    priority: 'medium',
    tags: ['AI', 'LEADERSHIP']
  },
  { 
    id: 'GL_08', 
    section: 'Governance & Leadership', 
    prompt: 'Leadership development programs exist for mid-level managers.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['LEADERSHIP']
  },
  { 
    id: 'GL_09', 
    section: 'Governance & Leadership', 
    prompt: 'Strategic planning includes environmental scanning and scenario planning.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['LEADERSHIP']
  },
  { 
    id: 'GL_10', 
    section: 'Governance & Leadership', 
    prompt: 'Executive compensation is tied to institutional performance metrics.', 
    type: 'likert',
    institutionTypes: ['public-university', 'private-university', 'healthcare', 'nonprofit', 'corporate'],
    priority: 'medium',
    tags: ['LEADERSHIP', 'FINANCE']
  },

  // ===== ACADEMIC PROGRAMS & CURRICULUM (Higher Ed Only) =====
  { 
    id: 'APC_01', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Program portfolios are reviewed on a fixed cycle using ROI and labor-market data.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'high'
  },
  { 
    id: 'APC_02', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Courses with low enrollment receive systematic intervention or consolidation.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'medium'
  },
  { 
    id: 'APC_03', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Transfer agreements are centrally tracked and actively maintained.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university'],
    priority: 'high'
  },
  { 
    id: 'APC_04', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Faculty have authority to propose stackable credentials aligned with workforce demand.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'medium'
  },
  { 
    id: 'APC_05', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Curriculum mapping uses automated tools for prerequisite checking.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'low',
    tags: ['AI']
  },
  { 
    id: 'APC_06', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Academic integrity processes require human oversight and cannot be fully automated.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'high',
    tags: ['HO']
  },
  { 
    id: 'APC_07', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Joint/co-taught courses are scheduled to minimize duplicate contact hours.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'low'
  },
  { 
    id: 'APC_08', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Program outcomes are linked to student-level data for continuous improvement.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'high'
  },
  { 
    id: 'APC_09', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'AI-assisted curriculum design tools help identify skill gaps and market trends.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'APC_10', 
    section: 'Academic Programs & Curriculum', 
    prompt: 'Micro-credentials and digital badges are integrated into degree pathways.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - TRANSFER & ARTICULATION =====
  { 
    id: 'CC_TR_01', 
    section: 'Transfer & Articulation Services', 
    prompt: 'We maintain articulation agreements with all major 4-year institutions in our region.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_TR_02', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Transfer students receive guaranteed admission pathways to partner universities.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_TR_03', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Transfer advising is provided by specialists trained in university requirements.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_TR_04', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Course equivalency databases are updated annually with receiving institutions.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_TR_05', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Reverse transfer programs allow students to complete associate degrees after transferring.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_TR_06', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Transfer rates are tracked by program and publicly reported annually.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_TR_07', 
    section: 'Transfer & Articulation Services', 
    prompt: 'We offer 2+2 programs with clear pathways to bachelor\'s degree completion.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_TR_08', 
    section: 'Transfer & Articulation Services', 
    prompt: 'Transfer orientation programs prepare students for university-level expectations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - WORKFORCE DEVELOPMENT =====
  { 
    id: 'CC_WD_01', 
    section: 'Workforce Development & Training', 
    prompt: 'Programs are developed in direct partnership with local employers.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_WD_02', 
    section: 'Workforce Development & Training', 
    prompt: 'Industry advisory boards provide regular input on curriculum and skills needs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_WD_03', 
    section: 'Workforce Development & Training', 
    prompt: 'Non-credit workforce training programs generate significant revenue.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_WD_04', 
    section: 'Workforce Development & Training', 
    prompt: 'Apprenticeship programs are integrated with academic credit pathways.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_WD_05', 
    section: 'Workforce Development & Training', 
    prompt: 'Job placement rates for workforce programs exceed 80%.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_WD_06', 
    section: 'Workforce Development & Training', 
    prompt: 'Continuing education programs serve working adults with flexible scheduling.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_WD_07', 
    section: 'Workforce Development & Training', 
    prompt: 'Industry certifications are embedded in academic programs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_WD_08', 
    section: 'Workforce Development & Training', 
    prompt: 'Customized training contracts provide specialized workforce solutions for employers.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_WD_09', 
    section: 'Workforce Development & Training', 
    prompt: 'We track graduate employment outcomes and salary data by program.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_WD_10', 
    section: 'Workforce Development & Training', 
    prompt: 'Workforce development staff maintain active relationships with economic development agencies.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - DUAL ENROLLMENT & HIGH SCHOOL PARTNERSHIPS =====
  { 
    id: 'CC_DE_01', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'Dual enrollment programs are offered at all regional high schools.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DE_02', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'High school teachers are qualified and trained to teach college-level courses.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DE_03', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'Quality assurance ensures dual enrollment courses meet college standards.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DE_04', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'Early college programs allow students to complete associate degrees in high school.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DE_05', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'Dual enrollment students transition seamlessly to full college enrollment.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DE_06', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'Career pathway programs connect middle school through college completion.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DE_07', 
    section: 'Dual Enrollment & K-12 Partnerships', 
    prompt: 'We partner with school districts to align curriculum standards.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - DEVELOPMENTAL EDUCATION =====
  { 
    id: 'CC_DEV_01', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Developmental education redesign has improved completion rates significantly.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DEV_02', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Co-requisite remediation models are used instead of traditional prerequisites.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DEV_03', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Math pathways are aligned with student career goals rather than algebra-focused.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DEV_04', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Multiple measures are used for course placement beyond standardized tests.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_DEV_05', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Accelerated learning programs compress developmental sequences.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DEV_06', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Integrated basic skills instruction occurs within college-level courses.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DEV_07', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Academic support centers provide comprehensive tutoring and learning assistance.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_DEV_08', 
    section: 'Developmental Education & Student Support', 
    prompt: 'Success coaching programs support students with non-academic barriers.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - COMMUNITY ENGAGEMENT =====
  { 
    id: 'CC_CE_01', 
    section: 'Community Engagement & Economic Development', 
    prompt: 'The college serves as a central hub for community economic development.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_CE_02', 
    section: 'Community Engagement & Economic Development', 
    prompt: 'Community education programs serve diverse adult learning needs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_CE_03', 
    section: 'Community Engagement & Economic Development', 
    prompt: 'Small business development centers provide entrepreneurship support.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'low'
  },
  { 
    id: 'CC_CE_04', 
    section: 'Community Engagement & Economic Development', 
    prompt: 'Cultural and athletic programs engage the broader community.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'low'
  },
  { 
    id: 'CC_CE_05', 
    section: 'Community Engagement & Economic Development', 
    prompt: 'Facilities are made available for community events and meetings.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'low'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - ACCESSIBILITY & SUPPORT SERVICES =====
  { 
    id: 'CC_AE_01', 
    section: 'Accessibility & Support Services', 
    prompt: 'Multiple campus locations serve geographically dispersed populations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_AE_02', 
    section: 'Accessibility & Support Services', 
    prompt: 'Flexible scheduling accommodates working adults and parents.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_AE_03', 
    section: 'Accessibility & Support Services', 
    prompt: 'Financial aid processes are streamlined and student-friendly.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_AE_04', 
    section: 'Accessibility & Support Services', 
    prompt: 'Emergency financial assistance helps students overcome crisis situations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_AE_05', 
    section: 'Accessibility & Support Services', 
    prompt: 'Childcare services are available for student parents.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_AE_06', 
    section: 'Accessibility & Support Services', 
    prompt: 'Transportation assistance or solutions are provided for students.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_AE_07', 
    section: 'Accessibility & Support Services', 
    prompt: 'ESL and immigrant services support non-native English speakers.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_AE_08', 
    section: 'Accessibility & Support Services', 
    prompt: 'Veterans services provide comprehensive support for military students.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - TECHNOLOGY & INNOVATION =====
  { 
    id: 'CC_TI_01', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'Online learning platforms support hybrid and distance education effectively.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_TI_02', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'Faculty receive ongoing training in educational technology tools.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_TI_03', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'AI-powered student success tools predict and prevent student dropout.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'CC_TI_04', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'Digital literacy is integrated across all programs and services.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_TI_05', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'Virtual reality and simulation technologies enhance career training.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'low',
    tags: ['AI']
  },
  { 
    id: 'CC_TI_06', 
    section: 'Technology Innovation & Digital Learning', 
    prompt: 'Mobile-first design ensures accessibility across all digital platforms.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== PATIENT/CLIENT CARE (Healthcare Only) =====
  { 
    id: 'PCC_01', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Patient care protocols are standardized across all units and locations.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'high'
  },
  { 
    id: 'PCC_02', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Electronic health records are fully integrated across all departments.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'high'
  },
  { 
    id: 'PCC_03', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Quality metrics are tracked in real-time with automated alerts.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'high',
    tags: ['AI']
  },
  { 
    id: 'PCC_04', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Patient satisfaction scores meet or exceed national benchmarks.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'high'
  },
  { 
    id: 'PCC_05', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Care coordination between departments is seamless and efficient.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'high'
  },
  { 
    id: 'PCC_06', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'AI-powered diagnostic tools are integrated into clinical workflows.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'PCC_07', 
    section: 'Patient Care & Clinical Services', 
    prompt: 'Telehealth services are fully integrated with in-person care.', 
    type: 'likert',
    institutionTypes: ['healthcare'],
    priority: 'medium'
  },

  // ===== PROGRAM DELIVERY (Nonprofit Only) =====
  { 
    id: 'PD_01', 
    section: 'Program Delivery & Services', 
    prompt: 'Program outcomes are measured with standardized metrics across all initiatives.', 
    type: 'likert',
    institutionTypes: ['nonprofit'],
    priority: 'high'
  },
  { 
    id: 'PD_02', 
    section: 'Program Delivery & Services', 
    prompt: 'Client/beneficiary feedback is systematically collected and acted upon.', 
    type: 'likert',
    institutionTypes: ['nonprofit'],
    priority: 'high'
  },
  { 
    id: 'PD_03', 
    section: 'Program Delivery & Services', 
    prompt: 'Program evaluation data informs strategic planning and resource allocation.', 
    type: 'likert',
    institutionTypes: ['nonprofit'],
    priority: 'high'
  },
  { 
    id: 'PD_04', 
    section: 'Program Delivery & Services', 
    prompt: 'Technology is leveraged to increase program reach and efficiency.', 
    type: 'likert',
    institutionTypes: ['nonprofit'],
    priority: 'medium'
  },
  { 
    id: 'PD_05', 
    section: 'Program Delivery & Services', 
    prompt: 'Partnership agreements with other organizations are actively managed.', 
    type: 'likert',
    institutionTypes: ['nonprofit'],
    priority: 'medium'
  },

  // ===== SERVICE DELIVERY (Government Only) =====
  { 
    id: 'SD_01', 
    section: 'Service Delivery & Operations', 
    prompt: 'Citizen/customer service standards are clearly defined and measured.', 
    type: 'likert',
    institutionTypes: ['government'],
    priority: 'high'
  },
  { 
    id: 'SD_02', 
    section: 'Service Delivery & Operations', 
    prompt: 'Digital services are available for most citizen interactions.', 
    type: 'likert',
    institutionTypes: ['government'],
    priority: 'high'
  },
  { 
    id: 'SD_03', 
    section: 'Service Delivery & Operations', 
    prompt: 'Regulatory compliance is automated where possible.', 
    type: 'likert',
    institutionTypes: ['government'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'SD_04', 
    section: 'Service Delivery & Operations', 
    prompt: 'Cross-agency collaboration is facilitated by shared systems.', 
    type: 'likert',
    institutionTypes: ['government'],
    priority: 'medium'
  },
  { 
    id: 'SD_05', 
    section: 'Service Delivery & Operations', 
    prompt: 'Performance transparency is maintained through public dashboards.', 
    type: 'likert',
    institutionTypes: ['government'],
    priority: 'medium'
  },

  // ===== BUSINESS OPERATIONS (Corporate Only) =====
  { 
    id: 'BO_01', 
    section: 'Business Operations & Strategy', 
    prompt: 'Business processes are documented and regularly optimized.', 
    type: 'likert',
    institutionTypes: ['corporate'],
    priority: 'high',
    tags: ['OPERATIONS']
  },
  { 
    id: 'BO_02', 
    section: 'Business Operations & Strategy', 
    prompt: 'Customer relationship management is centralized and data-driven.', 
    type: 'likert',
    institutionTypes: ['corporate'],
    priority: 'high'
  },
  { 
    id: 'BO_03', 
    section: 'Business Operations & Strategy', 
    prompt: 'Supply chain management is optimized with real-time data.', 
    type: 'likert',
    institutionTypes: ['corporate'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'BO_04', 
    section: 'Business Operations & Strategy', 
    prompt: 'Innovation processes are embedded throughout the organization.', 
    type: 'likert',
    institutionTypes: ['corporate'],
    priority: 'medium'
  },
  { 
    id: 'BO_05', 
    section: 'Business Operations & Strategy', 
    prompt: 'Competitive intelligence informs strategic decision-making.', 
    type: 'likert',
    institutionTypes: ['corporate'],
    priority: 'medium'
  },

  // ===== STUDENT/CLIENT SERVICES (Multi-institutional) =====
  { 
    id: 'SCS_01', 
    section: 'Student & Client Services', 
    prompt: 'Every student/client is assigned a dedicated advisor or case manager.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit'],
    priority: 'high'
  },
  { 
    id: 'SCS_02', 
    section: 'Student & Client Services', 
    prompt: 'Early alert systems trigger outreach within 48 hours of risk flags.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit'],
    priority: 'high'
  },
  { 
    id: 'SCS_03', 
    section: 'Student & Client Services', 
    prompt: 'Predictive analytics identify at-risk individuals for proactive intervention.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'SCS_04', 
    section: 'Student & Client Services', 
    prompt: 'Support services capacity meets industry/sector standards.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit'],
    priority: 'high'
  },
  { 
    id: 'SCS_05', 
    section: 'Student & Client Services', 
    prompt: 'AI-powered chatbots handle routine inquiries and appointments.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government'],
    priority: 'medium',
    tags: ['AI']
  },

  // ===== COMMUNITY COLLEGE STUDENT SUCCESS EXPANSION =====
  { 
    id: 'CC_SS_01', 
    section: 'Student Success & Retention', 
    prompt: 'First-year experience programs orient new students to college expectations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SS_02', 
    section: 'Student Success & Retention', 
    prompt: 'Intrusive advising models ensure regular student-advisor contact.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SS_03', 
    section: 'Student Success & Retention', 
    prompt: 'Learning communities connect students with common academic goals.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SS_04', 
    section: 'Student Success & Retention', 
    prompt: 'Peer mentoring programs pair new students with successful upperclassmen.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SS_05', 
    section: 'Student Success & Retention', 
    prompt: 'Student success courses teach study skills and college navigation.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SS_06', 
    section: 'Student Success & Retention', 
    prompt: 'Academic recovery programs help students on academic probation.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SS_07', 
    section: 'Student Success & Retention', 
    prompt: 'Career services are integrated throughout the student experience.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SS_08', 
    section: 'Student Success & Retention', 
    prompt: 'Mental health and wellness services are readily accessible to students.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SS_09', 
    section: 'Student Success & Retention', 
    prompt: 'Student engagement activities build campus community and belonging.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SS_10', 
    section: 'Student Success & Retention', 
    prompt: 'Food security and basic needs support prevents student dropout.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== FINANCE & BUDGET (Universal) =====
  { 
    id: 'FB_01', 
    section: 'Finance & Budget', 
    prompt: 'We use activity-based costing to allocate overhead to operational units.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'FB_02', 
    section: 'Finance & Budget', 
    prompt: 'Budget variance reports are produced within five business days of month-end.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['FINANCE']
  },
  { 
    id: 'FB_03', 
    section: 'Finance & Budget', 
    prompt: 'AP/AR functions use automated invoice processing for majority of transactions.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI', 'FINANCE']
  },
  { 
    id: 'FB_04', 
    section: 'Finance & Budget', 
    prompt: 'Capital projects follow standardized approval processes with ROI thresholds.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['FINANCE']
  },
  { 
    id: 'FB_05', 
    section: 'Finance & Budget', 
    prompt: 'Procurement processes eliminate redundant purchasing across departments.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['FINANCE', 'OPERATIONS']
  },
  { 
    id: 'FB_06', 
    section: 'Finance & Budget', 
    prompt: 'Multi-year financial forecasting is updated at least annually.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['FINANCE']
  },
  { 
    id: 'FB_07', 
    section: 'Finance & Budget', 
    prompt: 'AI-powered spend analysis identifies cost-saving opportunities.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI', 'FINANCE']
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - FINANCIAL SUSTAINABILITY =====
  { 
    id: 'CC_FS_01', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'State funding adequately supports core educational operations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_02', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Tuition and fees remain affordable compared to regional competitors.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_03', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Auxiliary services generate net revenue to support academic programs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_04', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Grant writing and external funding efforts are strategically coordinated.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_05', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Foundation and fundraising activities build sustainable endowment funds.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_06', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Cost per credit hour is tracked and benchmarked against peer institutions.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['FINANCE']
  },
  { 
    id: 'CC_FS_07', 
    section: 'Financial Sustainability & Resource Development', 
    prompt: 'Revenue diversification reduces dependence on any single funding source.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high',
    tags: ['FINANCE']
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - FACULTY & ACADEMIC AFFAIRS =====
  { 
    id: 'CC_FA_01', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Faculty professional development focuses on pedagogical innovation and student success.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_FA_02', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Adjunct faculty receive orientation, training, and ongoing support.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_FA_03', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Class sizes are maintained at levels that support student engagement.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_FA_04', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Faculty load is balanced appropriately between teaching and service responsibilities.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_FA_05', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Academic freedom is protected while maintaining institutional accountability.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_FA_06', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Faculty evaluation processes promote continuous improvement in teaching.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_FA_07', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Sabbatical and professional leave policies support faculty development.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'low'
  },
  { 
    id: 'CC_FA_08', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Faculty governance structures ensure meaningful participation in institutional decisions.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_FA_09', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Curriculum committees ensure academic rigor and relevance across programs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_FA_10', 
    section: 'Faculty & Academic Affairs', 
    prompt: 'Faculty recruitment initiatives promote broad-based hiring and retention practices.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== HUMAN RESOURCES & TALENT MANAGEMENT (Universal) =====
  { 
    id: 'HR_01', 
    section: 'Human Resources & Talent Management', 
    prompt: 'Recruiting and hiring processes are centralized and standardized.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'HR_02', 
    section: 'Human Resources & Talent Management', 
    prompt: 'Performance management systems provide continuous feedback and development.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'HR_03', 
    section: 'Human Resources & Talent Management', 
    prompt: 'Professional development opportunities are systematically tracked and measured.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'HR_04', 
    section: 'Human Resources & Talent Management', 
    prompt: 'Employee onboarding is standardized and includes technology training.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'HR_05', 
    section: 'Human Resources & Talent Management', 
    prompt: 'Succession planning exists for all key leadership positions.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['LEADERSHIP']
  },
  { 
    id: 'HR_06', 
    section: 'Human Resources & Talent Management', 
    prompt: 'AI-powered tools assist in recruitment, screening, and performance analysis.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI']
  },

  // ===== INFORMATION TECHNOLOGY & DIGITAL INFRASTRUCTURE (Universal) =====
  { 
    id: 'IT_01', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'We operate on unified enterprise systems across all locations/departments.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'IT_02', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'System uptime meets or exceeds 99.9% service level agreements.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'IT_03', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'Formal governance processes vet AI implementations for security and ethics.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['AI']
  },
  { 
    id: 'IT_04', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'Cloud-first strategies reduce infrastructure costs and improve scalability.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'IT_05', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'Cybersecurity training is mandatory and regularly updated for all users.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'IT_06', 
    section: 'Information Technology & Digital Infrastructure', 
    prompt: 'Data analytics platforms provide real-time insights for decision-making.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI']
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - ENROLLMENT MANAGEMENT =====
  { 
    id: 'CC_EM_01', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Enrollment targets are set based on capacity, market demand, and strategic goals.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_EM_02', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Marketing strategies effectively reach diverse community populations.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_EM_03', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Admissions processes are streamlined and user-friendly for all student types.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_EM_04', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Registration systems accommodate complex scheduling needs of working adults.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_EM_05', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Waitlist management ensures optimal class fill rates.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_EM_06', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Summer and intersession programming maximizes facility utilization.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_EM_07', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Yield rates for accepted students meet institutional targets.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_EM_08', 
    section: 'Enrollment Management & Marketing', 
    prompt: 'Student information systems integrate seamlessly with state reporting requirements.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - INSTITUTIONAL EFFECTIVENESS =====
  { 
    id: 'CC_IE_01', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Key performance indicators are tracked and reported regularly to all stakeholders.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_02', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Completion rates are analyzed by demographic groups to identify performance gaps.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_03', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Student learning outcomes are assessed systematically across all programs.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_04', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Employment and transfer outcomes are tracked for program evaluation.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_05', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Predictive modeling identifies students at risk of non-completion.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'CC_IE_06', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Benchmarking against peer institutions informs strategic planning.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_IE_07', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Data governance policies ensure accuracy and privacy of student information.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_08', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Strategic planning is data-driven and includes community input.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_09', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Accreditation requirements are continuously monitored and maintained.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_IE_10', 
    section: 'Institutional Effectiveness & Data Analytics', 
    prompt: 'Resource allocation decisions are based on evidence of student success impact.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },

  // ===== COMMUNITY COLLEGE SPECIFIC - CAMPUS SAFETY & OPERATIONS =====
  { 
    id: 'CC_SO_01', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Campus security measures are appropriate for open-access community college environment.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SO_02', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Emergency notification systems reach all students, staff, and faculty effectively.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SO_03', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Title IX and harassment prevention programs are comprehensive and effective.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SO_04', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Parking and transportation options meet the needs of commuter students.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },
  { 
    id: 'CC_SO_05', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Campus facilities are accessible and compliant with ADA requirements.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'high'
  },
  { 
    id: 'CC_SO_06', 
    section: 'Campus Safety & Security Operations', 
    prompt: 'Environmental health and safety protocols are regularly updated and enforced.', 
    type: 'likert',
    institutionTypes: ['community-college'],
    priority: 'medium'
  },

  // ===== FACILITIES & OPERATIONS (Universal) =====
  { 
    id: 'FO_01', 
    section: 'Facilities & Operations', 
    prompt: 'Space utilization studies have been conducted within the last 24 months.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['OPERATIONS']
  },
  { 
    id: 'FO_02', 
    section: 'Facilities & Operations', 
    prompt: 'Preventive maintenance completion rates exceed 90%.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['OPERATIONS']
  },
  { 
    id: 'FO_03', 
    section: 'Facilities & Operations', 
    prompt: 'Smart building systems optimize HVAC, lighting, and energy usage.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['AI', 'OPERATIONS']
  },
  { 
    id: 'FO_04', 
    section: 'Facilities & Operations', 
    prompt: 'Emergency preparedness plans are tested and updated annually.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high',
    tags: ['OPERATIONS']
  },
  { 
    id: 'FO_05', 
    section: 'Facilities & Operations', 
    prompt: 'Sustainability initiatives are integrated into operational planning.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium',
    tags: ['OPERATIONS']
  },

  // ===== RESEARCH & DEVELOPMENT (Higher Ed + Healthcare + Corporate) =====
  { 
    id: 'RD_01', 
    section: 'Research & Development', 
    prompt: 'Research/innovation administration provides comprehensive support.', 
    type: 'likert',
    institutionTypes: ['public-university', 'private-university', 'healthcare', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'RD_02', 
    section: 'Research & Development', 
    prompt: 'AI-powered tools accelerate research and development processes.', 
    type: 'likert',
    institutionTypes: ['public-university', 'private-university', 'healthcare', 'corporate'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'RD_03', 
    section: 'Research & Development', 
    prompt: 'Research compliance and ethics are efficiently managed.', 
    type: 'likert',
    institutionTypes: ['public-university', 'private-university', 'healthcare', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'RD_04', 
    section: 'Research & Development', 
    prompt: 'Innovation metrics track institutional progress and ROI.', 
    type: 'likert',
    institutionTypes: ['public-university', 'private-university', 'healthcare', 'corporate'],
    priority: 'medium'
  },

  // ===== QUALITY ASSURANCE & COMPLIANCE (Universal) =====
  { 
    id: 'QA_01', 
    section: 'Quality Assurance & Compliance', 
    prompt: 'Quality standards are monitored continuously, not just during review cycles.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'QA_02', 
    section: 'Quality Assurance & Compliance', 
    prompt: 'Quality improvement processes are embedded in all operational areas.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'QA_03', 
    section: 'Quality Assurance & Compliance', 
    prompt: 'Evidence collection for compliance/accreditation is automated where possible.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government'],
    priority: 'medium',
    tags: ['AI']
  },
  { 
    id: 'QA_04', 
    section: 'Quality Assurance & Compliance', 
    prompt: 'Risk management frameworks address operational, financial, and reputational risks.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },
  { 
    id: 'QA_05', 
    section: 'Quality Assurance & Compliance', 
    prompt: 'Staff receive regular training on regulatory and compliance requirements.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'high'
  },

  // ===== EXTERNAL RELATIONS & PARTNERSHIPS (Universal) =====
  { 
    id: 'ER_01', 
    section: 'External Relations & Partnerships', 
    prompt: 'Stakeholder engagement strategies are data-driven and targeted.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'ER_02', 
    section: 'External Relations & Partnerships', 
    prompt: 'Partnership agreements are actively managed with regular performance reviews.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'ER_03', 
    section: 'External Relations & Partnerships', 
    prompt: 'Communications and outreach are coordinated centrally to avoid duplication.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'ER_04', 
    section: 'External Relations & Partnerships', 
    prompt: 'Digital platforms enhance stakeholder engagement and communication.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  },
  { 
    id: 'ER_05', 
    section: 'External Relations & Partnerships', 
    prompt: 'Community/stakeholder feedback is systematically collected and analyzed.', 
    type: 'likert',
    institutionTypes: ['community-college', 'public-university', 'private-university', 'healthcare', 'nonprofit', 'government', 'corporate'],
    priority: 'medium'
  }
];

// Helper function to filter questions by institution type
export function getQuestionsForInstitution(institutionType: InstitutionType): Question[] {
  return comprehensiveQuestionBank.filter(question => 
    question.institutionTypes.includes(institutionType)
  );
}

// Helper function to get all unique sections for an institution type
export function getSectionsForInstitution(institutionType: InstitutionType): string[] {
  const questions = getQuestionsForInstitution(institutionType);
  return Array.from(new Set(questions.map(q => q.section)));
}

// Consultancy specialization areas
export const consultancyAreas = {
  'community-college': [
    'Transfer pathway optimization and articulation management',
    'Workforce development and employer partnership strategies',
    'Student success and completion initiatives',
    'Dual enrollment and K-12 partnership expansion',
    'Developmental education redesign and co-requisite models',
    'Community engagement and economic development partnerships',
    'Financial sustainability and revenue diversification',
    'Faculty development and adjunct support programs',
    'Enrollment management and marketing strategies',
    'Institutional effectiveness and data analytics implementation',
    'Campus safety and accessibility compliance',
    'Technology integration and digital learning enhancement'
  ],
  'public-university': [
    'Research enterprise development',
    'State funding optimization',
    'Academic program portfolio management',
    'Technology transfer initiatives',
    'Public accountability systems'
  ],
  'private-university': [
    'Enrollment management strategies',
    'Endowment and fundraising optimization',
    'Brand positioning and marketing',
    'Operational efficiency improvements',
    'Alumni engagement programs'
  ],
  'healthcare': [
    'Clinical workflow optimization',
    'Patient experience enhancement',
    'Regulatory compliance management',
    'Healthcare technology integration',
    'Quality improvement initiatives'
  ],
  'nonprofit': [
    'Program effectiveness measurement',
    'Donor engagement and fundraising',
    'Impact assessment and reporting',
    'Volunteer management systems',
    'Grant management optimization'
  ],
  'government': [
    'Citizen service delivery improvement',
    'Digital transformation initiatives',
    'Performance measurement systems',
    'Regulatory process optimization',
    'Inter-agency collaboration'
  ],
  'corporate': [
    'Operational excellence programs',
    'Digital transformation strategy',
    'Change management initiatives',
    'Performance optimization',
    'Strategic planning and execution'
  ]
};

export default { 
  comprehensiveQuestionBank, 
  institutionTypeQuestion, 
  getQuestionsForInstitution, 
  getSectionsForInstitution,
  consultancyAreas
};
