'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  CheckCircle, 
  CheckCircle2,
  Clock, 
  Users, 
  Brain, 
  Target, 
  FileText,
  Settings,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Building2,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import OrganizationTypeSelect from '@/components/OrganizationTypeSelect';
import { OrganizationType } from '@/data/northpathQuestionBank';

interface AssessmentInfo {
  id: string;
  tier: string;
  status: string;
  instructions: string[];
}

function AssessmentStartContent() {
  const [assessment, setAssessment] = useState<AssessmentInfo | null>(null);
  const [selectedOrgType, setSelectedOrgType] = useState<OrganizationType | null>(null);
  const [showTypeSelection, setShowTypeSelection] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const orgType = searchParams.get('type') as OrganizationType;

  // Check authorization on mount
  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // First try to check session storage
        let authorized = null;
        
        try {
          authorized = sessionStorage.getItem('assessment_authorized');
          console.log('Authorization check from sessionStorage:', authorized);
        } catch (storageError) {
          console.warn('SessionStorage not available:', storageError);
        }
        
        if (authorized === 'true') {
          console.log('User is authorized via sessionStorage');
          setIsAuthorized(true);
          setCheckingAuth(false);
          return;
        }
        
        // Check if this is localhost (development)
        const isDevelopment = (typeof window !== 'undefined' && 
                              window.location.hostname === 'localhost' ||
                              window.location.hostname.includes('localhost'));
        if (!isDevelopment) {
          router.push('/assessment/secure-access');
        } else {
          // Allow access in development even if there's an error
          setIsAuthorized(true);
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error('Authorization check error:', error);
        // Check if this is localhost (development)
        const isDevelopment = (typeof window !== 'undefined' && 
                              window.location.hostname === 'localhost' ||
                              window.location.hostname.includes('localhost'));
        if (!isDevelopment) {
          router.push('/assessment/secure-access');
        } else {
          // Allow access in development even if there's an error
          setIsAuthorized(true);
          setCheckingAuth(false);
        }
      }
    };

    // Add a small delay to ensure browser APIs are available
    const timer = setTimeout(checkAuthorization, 300);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!isAuthorized || checkingAuth) return;
    
    // If org type is provided in URL, set it immediately
    if (orgType) {
      setSelectedOrgType(orgType);
      setShowTypeSelection(false);
    }

    if (sessionId) {
      fetchAssessment(sessionId);
    } else {
      // Set default assessment info
      setAssessment({
        id: 'northpath',
        tier: 'COMPREHENSIVE',
        status: 'active',
        instructions: [
          "Complete the NorthPath Organizational Realignment & Optimization Suite",
          "Answer universal questions plus your sector-specific module", 
          "Upload required data files (org charts, financials, system inventories)",
          "The comprehensive assessment typically takes 2-3 hours to complete",
          "You can save your progress and return to complete it later",
          "Receive DSCH, CRF, and LEI analysis with actionable recommendations"
        ]
      });
    }
  }, [sessionId, orgType, isAuthorized, checkingAuth]);

  // Failsafe timeout to prevent indefinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (checkingAuth) {
        console.log('Authorization check timeout, redirecting to secure access...');
        setCheckingAuth(false);
        setIsAuthorized(false);
        
        // Redirect to secure access on timeout
        try {
          router.push('/assessment/secure-access');
        } catch (error) {
          console.error('Redirect error:', error);
          // Fallback redirect
          if (typeof window !== 'undefined') {
            window.location.href = '/assessment/secure-access';
          }
        }
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [checkingAuth, router]);

  const fetchAssessment = async (sessionId: string) => {
    try {
      // This would typically fetch assessment data from your API
      // For now, return mock data based on session
      setAssessment({
        id: sessionId,
        tier: 'COMPREHENSIVE',
        status: 'active',
        instructions: [
          "Complete the comprehensive organizational assessment survey",
          "Answer all questions honestly and thoroughly for accurate results",
          "The assessment typically takes 45-90 minutes to complete",
          "You can save your progress and return to complete it later",
          "Once submitted, AI analysis will generate your professional report",
        ]
      });
    } catch (error) {
      console.error('Error fetching assessment:', error);
    }
  };

  // Show auth loading state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-12 text-center max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6">
            <LoadingSpinner size="lg" variant="gradient" />
          </div>
          <motion.h2 
            className="text-2xl font-semibold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Setting Up Your Assessment
          </motion.h2>
          <motion.p 
            className="text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Preparing your personalized organizational evaluation...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const getInstructionsByTier = (tier: string) => {
    const baseInstructions = [
      "Complete the comprehensive organizational assessment survey",
      "Answer all questions honestly and thoroughly for accurate results",
      "The assessment typically takes 45-90 minutes to complete",
      "You can save your progress and return to complete it later",
      "Once submitted, AI analysis will generate your professional report",
    ];

    const tierSpecificInstructions = {
      BASIC: [
        "Access to basic organizational assessment questions",
        "Receive a summary report with key insights",
      ],
      INDIVIDUAL: [],
      TEAM: [
        "Invite team members to collaborate on sections relevant to their areas",
        "Coordinate with your team to ensure comprehensive coverage",
        "Use the discussion features to align on responses",
      ],
      ENTERPRISE: [
        "Invite unlimited team members and external consultants",
        "Upload organizational charts and supporting documents",
        "Access premium analytics and custom recommendations",
        "Schedule your included 2-hour strategy consultation after completion",
      ],
    };

    return [...baseInstructions, ...(tierSpecificInstructions[tier as keyof typeof tierSpecificInstructions] || [])];
  };

  const handleOrganizationTypeSelect = (type: OrganizationType) => {
    setSelectedOrgType(type);
    setShowTypeSelection(false);
  };

  // Show organization type selection screen first
  if (showTypeSelection && !selectedOrgType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            >
              <Building2 className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Select Your Organization Type
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 max-w-3xl mx-auto text-center leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Choose the option that best describes your organization to receive customized assessment questions 
              and sector-specific insights tailored to your industry.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <OrganizationTypeSelect onSelect={handleOrganizationTypeSelect} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Safety check - should not happen with new logic
  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  const getAssessmentAreas = (orgType: OrganizationType | null) => {
    const universalAreas = [
      { name: 'Organizational Structure', icon: Target },
      { name: 'Role Definition & Redundancy', icon: Users },
      { name: 'Decision-Making Processes', icon: Settings },
      { name: 'Technology Integration', icon: Zap },
      { name: 'Financial Operations', icon: TrendingUp },
      { name: 'AI Automation Opportunities', icon: Brain },
      { name: 'Cost-Saving Recommendations', icon: Lightbulb }
    ];

    const specificAreas = {
      'community_college': [
        { name: 'Curriculum Planning', icon: FileText },
        { name: 'Course Scheduling', icon: Clock },
        { name: 'Student Services', icon: Shield },
        { name: 'Faculty Relations', icon: Users },
        { name: 'Dual Enrollment Programs', icon: Target }
      ],
      'public_university': [
        { name: 'Academic Programs', icon: FileText },
        { name: 'Research Administration', icon: Brain },
        { name: 'Student Affairs', icon: Shield },
        { name: 'Faculty Governance', icon: Users },
        { name: 'Grant Management', icon: TrendingUp }
      ],
      'private_university': [
        { name: 'Academic Excellence', icon: FileText },
        { name: 'Enrollment Management', icon: Clock },
        { name: 'Alumni Relations', icon: Users },
        { name: 'Advancement Operations', icon: TrendingUp },
        { name: 'Campus Life Programs', icon: Shield }
      ],
      'hospital_healthcare': [
        { name: 'Patient Care Operations', icon: Shield },
        { name: 'Clinical Workflows', icon: FileText },
        { name: 'Medical Staff Relations', icon: Users },
        { name: 'Quality & Safety Programs', icon: Target },
        { name: 'Regulatory Compliance', icon: Settings }
      ],
      'nonprofit': [
        { name: 'Program Delivery', icon: FileText },
        { name: 'Donor Relations', icon: Users },
        { name: 'Community Outreach', icon: Target },
        { name: 'Volunteer Management', icon: Shield },
        { name: 'Grant Administration', icon: TrendingUp }
      ],
      'government_agency': [
        { name: 'Public Service Delivery', icon: Shield },
        { name: 'Regulatory Processes', icon: FileText },
        { name: 'Citizen Engagement', icon: Users },
        { name: 'Policy Implementation', icon: Settings },
        { name: 'Interagency Coordination', icon: Target }
      ],
      'company_business': [
        { name: 'Product Development', icon: Brain },
        { name: 'Customer Relations', icon: Users },
        { name: 'Sales Operations', icon: TrendingUp },
        { name: 'Supply Chain Management', icon: Settings },
        { name: 'Market Strategy', icon: Target }
      ],
      'trade_technical': [
        { name: 'Skills Training Programs', icon: FileText },
        { name: 'Industry Partnerships', icon: Users },
        { name: 'Equipment Management', icon: Settings },
        { name: 'Safety Protocols', icon: Shield },
        { name: 'Certification Processes', icon: Target }
      ]
    };

    const orgSpecific = specificAreas[orgType as keyof typeof specificAreas] || [];
    return [...universalAreas, ...orgSpecific];
  };

  const getBenefitsByOrgType = (orgType: OrganizationType | null) => {
    const universalBenefits = [
      "Comprehensive organizational analysis report",
      "DSCH algorithm optimization recommendations", 
      "CRF (Cost Reduction Framework) analysis",
      "LEI (License Efficiency Index) assessment"
    ];

    const universalBenefits2 = [
      "AI-powered improvement roadmap",
      "ROI projections and cost-saving estimates",
      "Implementation timeline and milestones",
      "Risk assessment and mitigation strategies"
    ];

    const specificBenefits = {
      'community_college': {
        column1: [
          "Academic program optimization",
          "Student success pathway analysis",
          "Community partnership enhancement",
          "Transfer process streamlining"
        ],
        column2: [
          "Workforce development alignment",
          "Faculty resource optimization",
          "Student support service improvements",
          "Enrollment management strategies"
        ]
      },
      'public_university': {
        column1: [
          "Academic excellence framework",
          "Research administration optimization",
          "Student affairs enhancement",
          "Faculty governance improvements"
        ],
        column2: [
          "Grant management efficiency",
          "Alumni engagement strategies",
          "Campus operations optimization",
          "Public service mission alignment"
        ]
      },
      'private_university': {
        column1: [
          "Academic program differentiation",
          "Enrollment management optimization",
          "Alumni relations enhancement",
          "Advancement operations improvement"
        ],
        column2: [
          "Student experience optimization",
          "Faculty development strategies",
          "Campus life enhancement",
          "Financial sustainability planning"
        ]
      },
      'hospital_healthcare': {
        column1: [
          "Patient care workflow optimization",
          "Clinical efficiency recommendations",
          "Regulatory compliance assessment",
          "Quality metrics improvement plan"
        ],
        column2: [
          "Medical staff productivity analysis",
          "Healthcare technology integration roadmap",
          "Patient satisfaction enhancement strategies",
          "Cost reduction in clinical operations"
        ]
      },
      'nonprofit': {
        column1: [
          "Program delivery optimization",
          "Donor engagement strategy recommendations",
          "Community impact measurement framework",
          "Grant management efficiency analysis"
        ],
        column2: [
          "Volunteer coordination improvements",
          "Fundraising process optimization",
          "Mission alignment assessment",
          "Resource allocation recommendations"
        ]
      },
      'government_agency': {
        column1: [
          "Public service delivery optimization",
          "Citizen engagement enhancement strategies",
          "Regulatory process streamlining",
          "Interagency coordination improvements"
        ],
        column2: [
          "Policy implementation efficiency analysis",
          "Digital transformation roadmap",
          "Public accountability framework",
          "Resource optimization recommendations"
        ]
      },
      'company_business': {
        column1: [
          "Business process optimization",
          "Customer experience enhancement",
          "Sales pipeline efficiency analysis",
          "Market positioning strategies"
        ],
        column2: [
          "Product development streamlining",
          "Supply chain optimization",
          "Competitive advantage identification",
          "Revenue growth recommendations"
        ]
      },
      'trade_technical': {
        column1: [
          "Skills training program optimization",
          "Industry partnership enhancement",
          "Equipment utilization analysis",
          "Safety protocol improvements"
        ],
        column2: [
          "Certification process streamlining",
          "Workforce development strategies",
          "Training outcome improvements",
          "Industry alignment recommendations"
        ]
      }
    };

    const orgSpecific = specificBenefits[orgType as keyof typeof specificBenefits];
    
    if (orgSpecific) {
      return {
        column1: [...universalBenefits.slice(0, 2), ...orgSpecific.column1.slice(0, 2)],
        column2: [...universalBenefits2.slice(0, 2), ...orgSpecific.column2.slice(0, 2)]
      };
    }
    
    return {
      column1: universalBenefits,
      column2: universalBenefits2
    };
  };

  const benefits = getBenefitsByOrgType(selectedOrgType);
  const assessmentAreas = getAssessmentAreas(selectedOrgType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Begin Assessment
            </motion.h1>
            
            <motion.p 
              className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Begin your <span className="text-white font-semibold">organizational realignment assessment</span> to identify improvement opportunities and drive strategic transformation.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Main Content Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Getting Started Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Getting Started</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed">
                Welcome to your Organizational Realignment Assessment. This comprehensive evaluation 
                will analyze your organization&apos;s structure, identify inefficiencies, and provide 
                AI-powered recommendations for improvement.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  What You&apos;ll Complete
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getInstructionsByTier(assessment.tier).map((instruction, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-white/70 rounded-lg border border-blue-200/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-white">{index + 1}</span>
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Areas */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Assessment Areas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.name}
                    className="group p-4 bg-white/70 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm group-hover:text-slate-900 transition-colors">
                        {area.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">What You&apos;ll Receive</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {benefits.column1.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-4">
                {benefits.column2.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div> 

          {/* Action Section */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => {
                  const assessmentUrl = selectedOrgType 
                    ? `/assessment/tier-based?tier=one-time-diagnostic&orgType=${selectedOrgType}&sessionId=${sessionId || 'default'}`
                    : '/assessment/tier-based?tier=one-time-diagnostic';
                  window.location.href = assessmentUrl;
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <PlayCircle className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                Begin Assessment Now
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            {assessment.tier !== 'INDIVIDUAL' && assessment.tier !== 'BASIC' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Button
                  onClick={() => window.location.href = '/assessment/team'}
                  variant="outline"
                  className="bg-white/50 hover:bg-white/70 text-slate-700 border-slate-300 hover:border-slate-400 px-6 py-3 rounded-xl group"
                >
                  <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Manage Team Access
                </Button>
              </motion.div>
            )}

            <motion.div 
              className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>SOC 2 compliant • AES-256 encrypted • GDPR ready</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-white/50 backdrop-blur-sm border-t border-slate-200 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span>Organizational Realignment Tool v1.0 © {new Date().getFullYear()} NorthPath Strategies</span>
          <span className="mx-2">|</span>
          <a href="mailto:feedback@northpathstrategies.org" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
            Send Feedback
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function AssessmentStartPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AssessmentStartContent />
    </Suspense>
  );
}