import { useEffect, useState } from 'react';
import { 
  Question as NorthpathQuestion, 
  OrganizationType,
  allQuestions
} from '@/data/northpathQuestionBank';

// Adapt the comprehensive question structure to match the existing interface
export type Question = {
  id: string;
  text: string;
  area: string;
  type: "likert" | "select" | "multi-select" | "number" | "text" | "upload";
  options?: string[];
  conditional?: { dependsOn: string; value: string };
  tooltip?: {
    explanation?: string;
    examples?: string[];
  };
};

function adaptQuestion(q: NorthpathQuestion): Question {
  return {
    id: q.id,
    text: q.prompt,
    area: q.section,
    type: q.type === 'numeric' ? 'number' : q.type === 'multiselect' ? 'multi-select' : q.type,
    options: q.options
  };
}

export function useQuestions(organizationType?: OrganizationType) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useQuestions effect triggered with organizationType:', organizationType);
    
    if (organizationType) {
      // Filter questions for specific organization type
      const filteredQuestions = allQuestions.filter(q => 
        !q.vertical || q.vertical === organizationType
      );
      const adaptedQuestions = filteredQuestions.map(adaptQuestion);
      
      console.log('Filtered questions for', organizationType, ':', filteredQuestions.length);
      console.log('Adapted questions:', adaptedQuestions.length);
      
      setQuestions(adaptedQuestions);
    } else {
      // Show organization selection questions
      const orgSelectionQuestions = allQuestions.filter(q => 
        q.section === 'Organization Type' || q.id.startsWith('P_')
      );
      const adaptedQuestions = orgSelectionQuestions.map(adaptQuestion);
      console.log('Showing organization selection questions:', adaptedQuestions);
      setQuestions(adaptedQuestions);
    }
    setLoading(false);
  }, [organizationType]);

  return { questions, loading };
}