// Organization Type Selection Component
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Building2, 
  Hospital, 
  University, 
  School, 
  Heart, 
  Building, 
  Briefcase,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { OrganizationType } from '@/data/northpathQuestionBank';
import { useLanguage } from '@/hooks/useLanguage';
import { InstitutionType } from '@/lib/industryLanguageMapping';

interface OrganizationTypeSelectProps {
  onSelect: (type: OrganizationType) => void;
  selectedType?: OrganizationType;
}

// Mapping from OrganizationType to InstitutionType for language system
const organizationTypeToInstitutionType: Record<OrganizationType, InstitutionType> = {
  'community_college': 'community-college',
  'trade_technical': 'corporate', // Uses corporate language for now
  'hospital_healthcare': 'healthcare',
  'public_university': 'public-university',
  'private_university': 'private-university',
  'nonprofit': 'nonprofit',
  'government_agency': 'government',
  'company_business': 'corporate'
};

const organizationTypes = [
  {
    id: 'community_college' as OrganizationType,
    title: 'Community Colleges',
    description: 'Two-year institutions serving local communities with academic and workforce programs',
    icon: GraduationCap,
    examples: 'District colleges, technical colleges, junior colleges',
    color: 'blue'
  },
  {
    id: 'trade_technical' as OrganizationType,
    title: 'Trade & Technical Schools',
    description: 'Specialized institutions focused on hands-on skills and industry certifications',
    icon: Building2,
    examples: 'Trade schools, technical institutes, vocational colleges',
    color: 'orange'
  },
  {
    id: 'hospital_healthcare' as OrganizationType,
    title: 'Hospitals & Healthcare Systems',
    description: 'Healthcare delivery organizations including hospitals, clinics, and health systems',
    icon: Hospital,
    examples: 'Academic medical centers, hospital systems, health networks',
    color: 'red'
  },
  {
    id: 'public_university' as OrganizationType,
    title: 'Public Universities',
    description: 'State-funded four-year institutions with research and teaching missions',
    icon: University,
    examples: 'State universities, research universities, flagship institutions',
    color: 'green'
  },
  {
    id: 'private_university' as OrganizationType,
    title: 'Private Universities',
    description: 'Independent higher education institutions with diverse funding sources',
    icon: School,
    examples: 'Private colleges, liberal arts colleges, research universities',
    color: 'purple'
  },
  {
    id: 'nonprofit' as OrganizationType,
    title: 'Nonprofits',
    description: 'Mission-driven organizations serving public benefit with tax-exempt status',
    icon: Heart,
    examples: 'Foundations, charities, social service organizations',
    color: 'pink'
  },
  {
    id: 'government_agency' as OrganizationType,
    title: 'Government Agencies',
    description: 'Public sector organizations at federal, state, or local levels',
    icon: Building,
    examples: 'Federal agencies, state departments, municipal services',
    color: 'indigo'
  },
  {
    id: 'company_business' as OrganizationType,
    title: 'Companies & Businesses',
    description: 'For-profit organizations across various industries and sectors',
    icon: Briefcase,
    examples: 'Corporations, startups, small businesses, enterprises',
    color: 'gray'
  }
];

const _colorVariants = {
  blue: 'border-np-primary-blue/30 hover:border-np-primary-blue hover:bg-np-primary-blue/5 bg-np-primary-blue/5',
  orange: 'border-np-warning-orange/30 hover:border-np-warning-orange hover:bg-np-warning-orange/5 bg-np-warning-orange/5',
  red: 'border-red-200 hover:border-red-400 hover:bg-red-50 bg-red-25',
  green: 'border-np-success-green/30 hover:border-np-success-green hover:bg-np-success-green/5 bg-np-success-green/5',
  purple: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 bg-purple-25',
  pink: 'border-pink-200 hover:border-pink-400 hover:bg-pink-50 bg-pink-25',
  indigo: 'border-np-bright-blue/30 hover:border-np-bright-blue hover:bg-np-bright-blue/5 bg-np-bright-blue/5',
  gray: 'border-np-light-gray hover:border-np-warm-gray hover:bg-np-light-gray/50 bg-np-light-gray/25'
};

const _selectedVariants = {
  blue: 'border-np-primary-blue bg-np-primary-blue/10 ring-2 ring-np-primary-blue',
  orange: 'border-np-warning-orange bg-np-warning-orange/10 ring-2 ring-np-warning-orange',
  red: 'border-red-500 bg-red-100 ring-2 ring-red-500',
  green: 'border-np-success-green bg-np-success-green/10 ring-2 ring-np-success-green',
  purple: 'border-purple-500 bg-purple-100 ring-2 ring-purple-500',
  pink: 'border-pink-500 bg-pink-100 ring-2 ring-pink-500',
  indigo: 'border-np-bright-blue bg-np-bright-blue/10 ring-2 ring-np-bright-blue',
  gray: 'border-np-warm-gray bg-np-warm-gray/10 ring-2 ring-np-warm-gray'
};

export default function OrganizationTypeSelect({ onSelect, selectedType }: OrganizationTypeSelectProps) {
  const [hoveredType, setHoveredType] = useState<OrganizationType | null>(null);
  const { setInstitutionType, tUI } = useLanguage();

  const handleSelect = (orgType: OrganizationType) => {
    // Set the institution type for language customization
    const institutionType = organizationTypeToInstitutionType[orgType];
    setInstitutionType(institutionType);
    
    // Call the original onSelect handler
    onSelect(orgType);
  };

  return (
    <div className="max-w-6xl mx-auto p-6" role="region" aria-label="Organization Type Selection">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-slate-100" tabIndex={0} aria-label="Select Your Organization Type">
          {tUI('Select Your Organization Type')}
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Choose the category that best describes your organization to receive 
          tailored questions and analysis specific to your sector.
        </p>
        <motion.div 
          className="mt-4 inline-block px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <span className="text-sm text-blue-300 font-medium">
            🔒 All data processed using SOC 2 compliant, AES-256 encrypted systems
          </span>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="listbox" aria-label="Organization Types">
        {organizationTypes.map((orgType, index) => {
          const Icon = orgType.icon;
          const isSelected = selectedType === orgType.id;
          const _isHovered = hoveredType === orgType.id;
          
          return (
            <motion.div
              key={orgType.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 focus-visible:ring-2 focus-visible:ring-purple-400/80 focus-visible:outline-none ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25'
                    : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500/70 hover:bg-slate-700/40'
                }`}
                onMouseEnter={() => setHoveredType(orgType.id)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => handleSelect(orgType.id)}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(orgType.id);
                  }
                }}
              >
                <CardHeader className="text-center pb-2">
                  <motion.div 
                    className="flex justify-center mb-2"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`p-3 rounded-full ${
                      isSelected 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </motion.div>
                  <CardTitle className={`text-lg ${isSelected ? 'text-purple-200' : 'text-slate-100'}`}>
                    {orgType.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className={`text-center mb-3 ${isSelected ? 'text-slate-200' : 'text-slate-300'}`}>
                    {orgType.description}
                  </CardDescription>
                  <div className="text-xs text-slate-400 text-center">
                    <strong>Examples:</strong> {orgType.examples}
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        className="mt-3 text-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                          <CheckCircle className="h-3 w-3" />
                          <span>Selected</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedType && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={() => {
                  // Navigate to the assessment with selected type
                  window.location.href = `/assessment/start?type=${selectedType}`;
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg group"
              >
                {tUI('Continue with')} {organizationTypes.find(t => t.id === selectedType)?.title}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="mt-12 bg-slate-800/30 rounded-lg p-6 border border-slate-600/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center text-slate-100">{tUI('What happens next?')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          {[
            {
              step: "1",
              title: tUI("Universal Assessment"),
              desc: "Complete 11 core sections covering organizational structure, processes, and culture"
            },
            {
              step: "2", 
              title: tUI("Sector-Specific Module"),
              desc: "Answer 10 additional questions tailored to your organization type"
            },
            {
              step: "3",
              title: tUI("AI Analysis"), 
              desc: "Receive DSCH, CRF, and LEI analysis with actionable recommendations"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 border border-purple-500/30"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-purple-300 font-semibold">{item.step}</span>
              </motion.div>
              <p className="text-slate-200">
                <strong>{item.title}:</strong> <span className="text-slate-300">{item.desc}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
