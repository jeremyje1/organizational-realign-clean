import { useState, useMemo } from 'react';
import { useQuestions } from './useQuestions';
import { supabase } from '@/lib/supabase-browser';
import { OrganizationType } from '@/data/northpathQuestionBank';

export function useSurvey(userId: string | null) {
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<OrganizationType | undefined>();
  const { questions, loading } = useQuestions(selectedInstitutionType);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  console.log('useSurvey state:', {
    selectedInstitutionType,
    questionsLength: questions?.length,
    loading,
    sectionIdx,
    userId
  });

  const sections = useMemo(
    () => Array.from(new Set(questions?.map(q => q.area))),
    [questions]
  );
  const currentSection = sections[sectionIdx] ?? '';

  const sectionQuestions = useMemo(
    () => questions?.filter(q => q.area === currentSection) ?? [],
    [questions, currentSection]
  );

  console.log('Computed values:', {
    sections,
    currentSection,
    sectionQuestionsLength: sectionQuestions.length
  });

  async function saveAnswer(qId: string, value: number | null, text = '') {
    console.log('saveAnswer called:', { qId, value, text, userId });
    setSaveError(null);
    
    // Handle institution type selection
    if (qId === 'INST_TYPE' && text) {
      const institutionTypeMap: Record<string, OrganizationType> = {
        'Community College': 'community_college',
        'Trade & Technical School': 'trade_technical',
        'Hospital & Healthcare System': 'hospital_healthcare',
        'Public University': 'public_university',
        'Private University': 'private_university',
        'Nonprofit Organization': 'nonprofit',
        'Government Agency': 'government_agency',
        'Company & Business': 'company_business'
      };
      
      const mappedType = institutionTypeMap[text];
      console.log('Setting institution type:', { text, mappedType });
      if (mappedType) {
        setSelectedInstitutionType(mappedType);
        // Reset to first section when institution type is selected
        setSectionIdx(0);
      }
    }
    
    // Save to database if user is authenticated
    if (userId) {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured - skipping database save');
          return;
        }

        // Get user's institution
        const { data: institutions, error: instError } = await supabase
          .from('institutions')
          .select('id')
          .eq('owner_user_id', userId)
          .limit(1);

        if (instError) {
          console.error('Error fetching institution:', instError);
          setSaveError('Failed to fetch institution');
          return;
        }

        let institutionId = institutions?.[0]?.id;
        
        // Create institution if it doesn't exist
        if (!institutionId) {
          const { data: newInst, error: createError } = await supabase
            .from('institutions')
            .insert({
              owner_user_id: userId,
              name: 'My Institution',
              slug: `inst-${userId}`,
              org_type: selectedInstitutionType || 'community-college',
              headcount: 1000,
              budget: 5000000,
              depth_mode: 'basic'
            })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating institution:', createError);
            setSaveError('Failed to create institution');
            return;
          }
          
          institutionId = newInst.id;
        }

        // Save the survey response
        const { error: saveResponseError } = await supabase
          .from('survey_responses')
          .upsert({
            institution_id: institutionId,
            question_id: qId,
            answer_numeric: value,
            answer_text: text || null
          }, {
            onConflict: 'institution_id,question_id'
          });

        if (saveResponseError) {
          console.error('Error saving survey response:', saveResponseError);
          setSaveError('Failed to save response');
        } else {
          console.log('Successfully saved response to database');
        }
        
      } catch (error) {
        console.error('Unexpected error saving answer:', error);
        setSaveError('Unexpected error occurred');
      }
    } else {
      console.log('No userId provided, skipping database save');
    }
  }

  return {
    loading,
    section: currentSection,
    sectionQuestions,
    sectionIdx,
    sections,
    selectedInstitutionType,
    setSelectedInstitutionType,
    next: () => setSectionIdx(i => i + 1),
    setSectionIdx,
    saveAnswer,
    saveError
  };
}
