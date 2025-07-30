export type QuestionType = 'likert' | 'numeric';
export interface Question {
  id: string;
  section: string;
  prompt: string;
  type: QuestionType;
  tags?: ('AI' | 'HO' | 'REORG' | 'COST' | 'EFFICIENCY')[];
}

export const questionBank: Question[] = [
  // Governance & Leadership - Expanded
  { id: 'GL_01', section: 'Governance & Leadership', prompt: `Our current organizational chart is less than 12 months old and accurately reflects reporting lines.`, type: 'likert' },
  { id: 'GL_02', section: 'Governance & Leadership', prompt: `Decision‑making authority is clearly defined and understood at each tier.`, type: 'likert', tags: ['REORG'] },
  { id: 'GL_03', section: 'Governance & Leadership', prompt: `Cross‑functional steering committees effectively break down silos.`, type: 'likert', tags: ['REORG', 'EFFICIENCY'] },
  { id: 'GL_04', section: 'Governance & Leadership', prompt: `Executive leadership routinely reviews KPIs tied to strategic goals.`, type: 'likert' },
  { id: 'GL_05', section: 'Governance & Leadership', prompt: `We have a change‑management framework that has been used successfully in the past three years.`, type: 'likert' },
  { id: 'GL_06', section: 'Governance & Leadership', prompt: `Senior leaders have received training on AI implications for policy, ethics, and risk.`, type: 'likert', tags: ['AI'] },
  { id: 'GL_07', section: 'Governance & Leadership', prompt: `Board governance structures include expertise in digital transformation and AI strategy.`, type: 'likert', tags: ['AI'] },
  { id: 'GL_08', section: 'Governance & Leadership', prompt: `Leadership development programs are in place for mid-level managers.`, type: 'likert' },
  { id: 'GL_09', section: 'Governance & Leadership', prompt: `Strategic planning cycles include environmental scanning and scenario planning.`, type: 'likert' },
  { id: 'GL_10', section: 'Governance & Leadership', prompt: `Executive compensation is tied to institutional performance metrics.`, type: 'likert' },
  { id: 'GL_11', section: 'Governance & Leadership', prompt: `Crisis management protocols are documented and tested annually.`, type: 'likert' },
  { id: 'GL_12', section: 'Governance & Leadership', prompt: `Board meetings utilize data dashboards for decision-making.`, type: 'likert' },
  { id: 'GL_13', section: 'Governance & Leadership', prompt: `Succession planning exists for all C-suite positions.`, type: 'likert' },
  { id: 'GL_14', section: 'Governance & Leadership', prompt: `Leadership communication reaches all stakeholders through multiple channels.`, type: 'likert' },
  { id: 'GL_15', section: 'Governance & Leadership', prompt: `Decision-making processes include student and faculty voice mechanisms.`, type: 'likert' },

  // Academic Programs & Curriculum - Expanded
  { id: 'APC_01', section: 'Academic Programs & Curriculum', prompt: `Program portfolios are reviewed on a fixed cycle (e.g., every 3 years) using ROI and labor‑market data.`, type: 'likert' },
  { id: 'APC_02', section: 'Academic Programs & Curriculum', prompt: `Courses with <60 % fill rate receive systematic intervention (consolidation, modality shift, etc.).`, type: 'likert' },
  { id: 'APC_03', section: 'Academic Programs & Curriculum', prompt: `Articulation agreements are centrally tracked and actively maintained.`, type: 'likert' },
  { id: 'APC_04', section: 'Academic Programs & Curriculum', prompt: `Faculty have authority to propose stackable credentials aligned with workforce demand.`, type: 'likert' },
  { id: 'APC_05', section: 'Academic Programs & Curriculum', prompt: `Curriculum mapping or prerequisite checking uses automated tools.`, type: 'likert', tags: ['AI'] },
  { id: 'APC_06', section: 'Academic Programs & Curriculum', prompt: `Academic integrity reviews (e.g., plagiarism hearings) must remain human‑led.`, type: 'likert', tags: ['HO'] },
  { id: 'APC_07', section: 'Academic Programs & Curriculum', prompt: `Joint/co‑taught courses are scheduled to minimize duplicate contact hours.`, type: 'likert' },
  { id: 'APC_08', section: 'Academic Programs & Curriculum', prompt: `Program outcomes are linked to student‑level data for continuous improvement.`, type: 'likert' },
  { id: 'APC_09', section: 'Academic Programs & Curriculum', prompt: `AI-assisted curriculum design tools help identify skill gaps and market trends.`, type: 'likert', tags: ['AI'] },
  { id: 'APC_10', section: 'Academic Programs & Curriculum', prompt: `Micro-credentials and digital badges are integrated into degree pathways.`, type: 'likert' },
  { id: 'APC_11', section: 'Academic Programs & Curriculum', prompt: `Program launch decisions include competitive analysis and market saturation data.`, type: 'likert' },
  { id: 'APC_12', section: 'Academic Programs & Curriculum', prompt: `Cross-disciplinary programs are supported by dedicated coordination staff.`, type: 'likert' },
  { id: 'APC_13', section: 'Academic Programs & Curriculum', prompt: `Industry partnerships inform curriculum development in professional programs.`, type: 'likert' },
  { id: 'APC_14', section: 'Academic Programs & Curriculum', prompt: `Online and hybrid program quality is assessed using specialized rubrics.`, type: 'likert' },
  { id: 'APC_15', section: 'Academic Programs & Curriculum', prompt: `Program elimination decisions follow documented sunset procedures.`, type: 'likert' },
  { id: 'APC_16', section: 'Academic Programs & Curriculum', prompt: `Competency-based education models are piloted or implemented.`, type: 'likert' },
  { id: 'APC_17', section: 'Academic Programs & Curriculum', prompt: `Prior learning assessment processes are standardized and efficient.`, type: 'likert' },
  { id: 'APC_18', section: 'Academic Programs & Curriculum', prompt: `General education requirements are aligned across all programs.`, type: 'likert' },

  // Faculty & Instructional Support - Expanded
  { id: 'FIS_01', section: 'Faculty & Instructional Support', prompt: `Average full‑time faculty workload (teaching, service, scholarship) is measured and benchmarked.`, type: 'likert' },
  { id: 'FIS_02', section: 'Faculty & Instructional Support', prompt: `Part‑time / adjunct hiring follows a standardized onboarding and evaluation process.`, type: 'likert' },
  { id: 'FIS_03', section: 'Faculty & Instructional Support', prompt: `Faculty development funds are allocated using transparent criteria.`, type: 'likert' },
  { id: 'FIS_04', section: 'Faculty & Instructional Support', prompt: `Grading or formative feedback solutions (e‑g., AI writing evaluators) are piloted or in use.`, type: 'likert', tags: ['AI'] },
  { id: 'FIS_05', section: 'Faculty & Instructional Support', prompt: `Classroom technology support requests are resolved within service‑level targets.`, type: 'likert' },
  { id: 'FIS_06', section: 'Faculty & Instructional Support', prompt: `Redundant instructional design roles exist across departments.`, type: 'likert' },
  { id: 'FIS_07', section: 'Faculty & Instructional Support', prompt: `Union or shared‑governance agreements are considered in workload redesign.`, type: 'likert' },
  { id: 'FIS_08', section: 'Faculty & Instructional Support', prompt: `Faculty‑to‑advisor ratio for capstone/thesis projects is sustainable.`, type: 'likert' },
  { id: 'FIS_09', section: 'Faculty & Instructional Support', prompt: `AI tutoring and teaching assistants supplement faculty instruction.`, type: 'likert', tags: ['AI'] },
  { id: 'FIS_10', section: 'Faculty & Instructional Support', prompt: `Faculty sabbatical programs are funded and strategically aligned.`, type: 'likert' },
  { id: 'FIS_11', section: 'Faculty & Instructional Support', prompt: `Teaching loads are balanced across modalities (online, hybrid, face-to-face).`, type: 'likert' },
  { id: 'FIS_12', section: 'Faculty & Instructional Support', prompt: `Faculty evaluation includes student success outcomes, not just satisfaction scores.`, type: 'likert' },
  { id: 'FIS_13', section: 'Faculty & Instructional Support', prompt: `Professional development for AI literacy is mandatory for all faculty.`, type: 'likert', tags: ['AI'] },
  { id: 'FIS_14', section: 'Faculty & Instructional Support', prompt: `Tenure and promotion criteria reflect changing institutional priorities.`, type: 'likert' },
  { id: 'FIS_15', section: 'Faculty & Instructional Support', prompt: `Faculty scheduling optimization tools reduce conflicts and gaps.`, type: 'likert', tags: ['AI'] },
  { id: 'FIS_16', section: 'Faculty & Instructional Support', prompt: `Research support services are centralized and accessible to all faculty.`, type: 'likert' },
  { id: 'FIS_17', section: 'Faculty & Instructional Support', prompt: `Faculty workload distribution considers expertise and student demand.`, type: 'likert' },

  // Enrollment Management & Admissions - Expanded
  { id: 'EMA_01', section: 'Enrollment Management & Admissions', prompt: `The CRM contains a single source of truth for prospect data.`, type: 'likert' },
  { id: 'EMA_02', section: 'Enrollment Management & Admissions', prompt: `Yield models are updated at least annually with predictive analytics.`, type: 'likert' },
  { id: 'EMA_03', section: 'Enrollment Management & Admissions', prompt: `Application processing time from submission to decision (in days).`, type: 'numeric' },
  { id: 'EMA_04', section: 'Enrollment Management & Admissions', prompt: `Chatbots or virtual assistants handle >30 % of initial applicant inquiries.`, type: 'likert', tags: ['AI'] },
  { id: 'EMA_05', section: 'Enrollment Management & Admissions', prompt: `Transfer credit evaluations are completed before orientation.`, type: 'likert' },
  { id: 'EMA_06', section: 'Enrollment Management & Admissions', prompt: `Dual‑credit or early‑college partnerships are centrally coordinated.`, type: 'likert' },
  { id: 'EMA_07', section: 'Enrollment Management & Admissions', prompt: `Scholarship awarding is integrated with net‑tuition revenue modeling.`, type: 'likert' },
  { id: 'EMA_08', section: 'Enrollment Management & Admissions', prompt: `Cross‑training exists between admissions and financial‑aid counselors.`, type: 'likert' },
  { id: 'EMA_09', section: 'Enrollment Management & Admissions', prompt: `The college has a formal stop‑out re‑engagement campaign.`, type: 'likert' },
  { id: 'EMA_10', section: 'Enrollment Management & Admissions', prompt: `AI-powered application review assists in holistic admissions decisions.`, type: 'likert', tags: ['AI'] },
  { id: 'EMA_11', section: 'Enrollment Management & Admissions', prompt: `Enrollment forecasting models incorporate demographic and economic trends.`, type: 'likert' },
  { id: 'EMA_12', section: 'Enrollment Management & Admissions', prompt: `Virtual tour and information session attendance is tracked and followed up.`, type: 'likert' },
  { id: 'EMA_13', section: 'Enrollment Management & Admissions', prompt: `Admissions counselor territories are optimized using geographic and demographic data.`, type: 'likert' },
  { id: 'EMA_14', section: 'Enrollment Management & Admissions', prompt: `Test-optional or test-flexible policies are supported by alternative assessment tools.`, type: 'likert' },
  { id: 'EMA_15', section: 'Enrollment Management & Admissions', prompt: `Financial aid packaging is personalized based on student profile and likelihood to enroll.`, type: 'likert', tags: ['AI'] },
  { id: 'EMA_16', section: 'Enrollment Management & Admissions', prompt: `Summer melt prevention programs are data-driven and targeted.`, type: 'likert' },

  // Student Affairs & Success Services - Expanded
  { id: 'SAS_01', section: 'Student Affairs & Success Services', prompt: `Every student is assigned a professional advisor or success coach.`, type: 'likert' },
  { id: 'SAS_02', section: 'Student Affairs & Success Services', prompt: `Early‑alert systems trigger outreach within 48 hours of risk flags.`, type: 'likert' },
  { id: 'SAS_03', section: 'Student Affairs & Success Services', prompt: `Behavioral‑pattern analytics predict semester‑to‑semester persistence.`, type: 'likert', tags: ['AI'] },
  { id: 'SAS_04', section: 'Student Affairs & Success Services', prompt: `Mental‑health counseling capacity meets national staffing ratios.`, type: 'likert' },
  { id: 'SAS_05', section: 'Student Affairs & Success Services', prompt: `Redundant tutoring centers exist across separate campuses or divisions.`, type: 'likert' },
  { id: 'SAS_06', section: 'Student Affairs & Success Services', prompt: `Co‑curricular engagement data feed into student success dashboards.`, type: 'likert' },
  { id: 'SAS_07', section: 'Student Affairs & Success Services', prompt: `Student conduct hearings require in‑person deliberation.`, type: 'likert', tags: ['HO'] },
  { id: 'SAS_08', section: 'Student Affairs & Success Services', prompt: `Wrap‑around services (food pantry, housing referrals) are integrated in one‑stop model.`, type: 'likert' },
  { id: 'SAS_09', section: 'Student Affairs & Success Services', prompt: `AI-powered career counseling tools match students with internships and jobs.`, type: 'likert', tags: ['AI'] },
  { id: 'SAS_10', section: 'Student Affairs & Success Services', prompt: `Peer mentoring programs are structured and outcomes are measured.`, type: 'likert' },
  { id: 'SAS_11', section: 'Student Affairs & Success Services', prompt: `Student success interventions are personalized based on predictive analytics.`, type: 'likert', tags: ['AI'] },
  { id: 'SAS_12', section: 'Student Affairs & Success Services', prompt: `Disability services are integrated with academic support and technology.`, type: 'likert' },
  { id: 'SAS_13', section: 'Student Affairs & Success Services', prompt: `Student engagement surveys inform program improvements and resource allocation.`, type: 'likert' },
  { id: 'SAS_14', section: 'Student Affairs & Success Services', prompt: `Crisis intervention protocols are clearly defined and staff are trained.`, type: 'likert' },
  { id: 'SAS_15', section: 'Student Affairs & Success Services', prompt: `Academic recovery programs support students on probation or suspension.`, type: 'likert' },
  { id: 'SAS_16', section: 'Student Affairs & Success Services', prompt: `Student organizations receive systematic leadership development support.`, type: 'likert' },

  // Finance, Budget & Procurement - Expanded
  { id: 'FBP_01', section: 'Finance, Budget & Procurement', prompt: `We use activity‑based costing to allocate overhead to academic units.`, type: 'likert', tags: ['COST'] },
  { id: 'FBP_02', section: 'Finance, Budget & Procurement', prompt: `Budget variance reports are produced within five business days of month‑end close.`, type: 'likert' },
  { id: 'FBP_03', section: 'Finance, Budget & Procurement', prompt: `AP/AR functions use invoice‑processing automation (>50 % of transactions).`, type: 'likert', tags: ['AI'] },
  { id: 'FBP_04', section: 'Finance, Budget & Procurement', prompt: `Capital projects follow a standardized gating process with ROI thresholds.`, type: 'likert' },
  { id: 'FBP_05', section: 'Finance, Budget & Procurement', prompt: `Redundant purchasing agreements exist across departments.`, type: 'likert', tags: ['COST', 'EFFICIENCY'] },
  { id: 'FBP_06', section: 'Finance, Budget & Procurement', prompt: `The institution has a rolling multi‑year financial forecast.`, type: 'likert' },
  { id: 'FBP_07', section: 'Finance, Budget & Procurement', prompt: `P‑card usage and policy compliance are actively monitored.`, type: 'likert' },
  { id: 'FBP_08', section: 'Finance, Budget & Procurement', prompt: `Grant post‑award management is centralized.`, type: 'likert' },
  { id: 'FBP_09', section: 'Finance, Budget & Procurement', prompt: `AI-powered spend analysis identifies cost-saving opportunities.`, type: 'likert', tags: ['AI'] },
  { id: 'FBP_10', section: 'Finance, Budget & Procurement', prompt: `Zero-based budgeting principles are applied to non-personnel expenses.`, type: 'likert' },
  { id: 'FBP_11', section: 'Finance, Budget & Procurement', prompt: `Contract management systems track renewals and compliance requirements.`, type: 'likert' },
  { id: 'FBP_12', section: 'Finance, Budget & Procurement', prompt: `Treasury management optimizes cash flow and investment returns.`, type: 'likert' },
  { id: 'FBP_13', section: 'Finance, Budget & Procurement', prompt: `Risk management frameworks address financial, operational, and reputational risks.`, type: 'likert' },
  { id: 'FBP_14', section: 'Finance, Budget & Procurement', prompt: `Budget allocation models reward efficiency and effectiveness metrics.`, type: 'likert' },
  { id: 'FBP_15', section: 'Finance, Budget & Procurement', prompt: `Financial aid leveraging strategies optimize net tuition revenue.`, type: 'likert' },
  { id: 'FBP_16', section: 'Finance, Budget & Procurement', prompt: `Estimated annual cost savings potential from identified inefficiencies (in thousands).`, type: 'numeric', tags: ['COST', 'EFFICIENCY'] },
  { id: 'FBP_17', section: 'Finance, Budget & Procurement', prompt: `ROI percentage for the last major organizational restructuring initiative.`, type: 'numeric', tags: ['REORG', 'COST'] },
  { id: 'FBP_18', section: 'Finance, Budget & Procurement', prompt: `Number of months to break-even on typical process improvement investments.`, type: 'numeric', tags: ['EFFICIENCY', 'COST'] },

  // ADVANCED AI INTEGRATION QUESTIONS FOR COMPREHENSIVE ANALYSIS
  // AI Governance & Strategy
  { id: 'AI_GOV_01', section: 'AI Governance & Strategy', prompt: `The organization has a dedicated AI ethics committee or governance board.`, type: 'likert', tags: ['AI'] },
  { id: 'AI_GOV_02', section: 'AI Governance & Strategy', prompt: `AI implementation decisions include bias, fairness, and transparency assessments.`, type: 'likert', tags: ['AI'] },
  { id: 'AI_GOV_03', section: 'AI Governance & Strategy', prompt: `Vendor AI solutions undergo security and compliance vetting before deployment.`, type: 'likert', tags: ['AI'] },
  { id: 'AI_GOV_04', section: 'AI Governance & Strategy', prompt: `Staff understand when and how AI tools can be used in their roles.`, type: 'likert', tags: ['AI'] },

  // AI-Powered Process Optimization
  { id: 'AI_PROC_01', section: 'AI-Powered Process Optimization', prompt: `Workflow optimization uses AI to identify bottlenecks and inefficiencies.`, type: 'likert', tags: ['AI', 'EFFICIENCY'] },
  { id: 'AI_PROC_02', section: 'AI-Powered Process Optimization', prompt: `Predictive analytics forecast resource needs and capacity planning.`, type: 'likert', tags: ['AI', 'REORG'] },
  { id: 'AI_PROC_03', section: 'AI-Powered Process Optimization', prompt: `Natural language processing automates document review and classification.`, type: 'likert', tags: ['AI', 'EFFICIENCY'] },
  { id: 'AI_PROC_04', section: 'AI-Powered Process Optimization', prompt: `Machine learning algorithms optimize scheduling and resource allocation.`, type: 'likert', tags: ['AI', 'EFFICIENCY'] },

  // AI-Enhanced Decision Making
  { id: 'AI_DEC_01', section: 'AI-Enhanced Decision Making', prompt: `Executive dashboards include AI-generated insights and recommendations.`, type: 'likert', tags: ['AI'] },
  { id: 'AI_DEC_02', section: 'AI-Enhanced Decision Making', prompt: `Reorganization scenarios are modeled using AI simulation tools.`, type: 'likert', tags: ['AI', 'REORG'] },
  { id: 'AI_DEC_03', section: 'AI-Enhanced Decision Making', prompt: `Cost-benefit analysis incorporates AI-powered financial modeling.`, type: 'likert', tags: ['AI', 'COST'] },
  { id: 'AI_DEC_04', section: 'AI-Enhanced Decision Making', prompt: `Performance improvement opportunities are identified through AI pattern recognition.`, type: 'likert', tags: ['AI', 'EFFICIENCY'] },

  // AI Integration Metrics
  { id: 'AI_MET_01', section: 'AI Integration Metrics', prompt: `Percentage of routine administrative tasks automated through AI solutions.`, type: 'numeric', tags: ['AI', 'EFFICIENCY'] },
  { id: 'AI_MET_02', section: 'AI Integration Metrics', prompt: `Number of AI-powered tools currently in production use.`, type: 'numeric', tags: ['AI'] },
  { id: 'AI_MET_03', section: 'AI Integration Metrics', prompt: `Annual budget allocation for AI initiatives as percentage of total IT budget.`, type: 'numeric', tags: ['AI', 'COST'] },
  { id: 'AI_MET_04', section: 'AI Integration Metrics', prompt: `Measured productivity improvement percentage from implemented AI solutions.`, type: 'numeric', tags: ['AI', 'EFFICIENCY'] },

  // COMPREHENSIVE REORGANIZATION ANALYSIS QUESTIONS
  // Organizational Network Analysis
  { id: 'ONA_01', section: 'Organizational Network Analysis', prompt: `Communication patterns between departments are mapped and analyzed regularly.`, type: 'likert', tags: ['REORG'] },
  { id: 'ONA_02', section: 'Organizational Network Analysis', prompt: `Collaboration frequency and effectiveness between teams is quantitatively measured.`, type: 'likert', tags: ['REORG', 'EFFICIENCY'] },
  { id: 'ONA_03', section: 'Organizational Network Analysis', prompt: `Informal leadership and influence networks are identified and leveraged.`, type: 'likert', tags: ['REORG'] },
  { id: 'ONA_04', section: 'Organizational Network Analysis', prompt: `Information flow analysis reveals communication bottlenecks and gaps.`, type: 'likert', tags: ['REORG', 'EFFICIENCY'] },

  // Strategic Reorganization Planning
  { id: 'SRP_01', section: 'Strategic Reorganization Planning', prompt: `Reorganization initiatives are tied to specific strategic objectives and KPIs.`, type: 'likert', tags: ['REORG'] },
  { id: 'SRP_02', section: 'Strategic Reorganization Planning', prompt: `Alternative organizational structures are systematically evaluated before changes.`, type: 'likert', tags: ['REORG'] },
  { id: 'SRP_03', section: 'Strategic Reorganization Planning', prompt: `Stakeholder impact assessment is conducted for all major structural changes.`, type: 'likert', tags: ['REORG'] },
  { id: 'SRP_04', section: 'Strategic Reorganization Planning', prompt: `Post-reorganization success metrics are defined before implementation.`, type: 'likert', tags: ['REORG'] },

  // Advanced Cost-Benefit Analysis
  { id: 'ACBA_01', section: 'Advanced Cost-Benefit Analysis', prompt: `Total cost of ownership is calculated for all major organizational changes.`, type: 'likert', tags: ['COST', 'REORG'] },
  { id: 'ACBA_02', section: 'Advanced Cost-Benefit Analysis', prompt: `Hidden costs of reorganization (training, transition, productivity loss) are quantified.`, type: 'likert', tags: ['COST', 'REORG'] },
  { id: 'ACBA_03', section: 'Advanced Cost-Benefit Analysis', prompt: `Cost-per-outcome metrics are established for different reorganization scenarios.`, type: 'likert', tags: ['COST', 'REORG'] },
  { id: 'ACBA_04', section: 'Advanced Cost-Benefit Analysis', prompt: `Break-even analysis determines optimal timing for organizational changes.`, type: 'likert', tags: ['COST', 'REORG'] },

  // Reorganization Impact Metrics
  { id: 'RIM_01', section: 'Reorganization Impact Metrics', prompt: `Number of organizational restructures implemented in the last 5 years.`, type: 'numeric', tags: ['REORG'] },
  { id: 'RIM_02', section: 'Reorganization Impact Metrics', prompt: `Average time (in months) from reorganization planning to full implementation.`, type: 'numeric', tags: ['REORG'] },
  { id: 'RIM_03', section: 'Reorganization Impact Metrics', prompt: `Percentage improvement in operational efficiency following last major reorganization.`, type: 'numeric', tags: ['REORG', 'EFFICIENCY'] },
  { id: 'RIM_04', section: 'Reorganization Impact Metrics', prompt: `Cost reduction percentage achieved through organizational restructuring initiatives.`, type: 'numeric', tags: ['REORG', 'COST'] },
];