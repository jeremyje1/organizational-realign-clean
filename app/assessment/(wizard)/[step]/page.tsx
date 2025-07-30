// filepath: /app/assessment/(wizard)/[step]/page.tsx
import { AssessmentWizard } from '@/components/wizard/AssessmentWizard';
import { notFound } from 'next/navigation';

const steps = ['org-profile', 'practices', 'readiness'];

export default function WizardStepPage({ params }: { params: { step: string } }) {
  const { step } = params;
  if (!steps.includes(step)) return notFound();
  // TODO: Load questions/content for this step
  return (
    <AssessmentWizard assessmentId={step} onComplete={() => {}} />
  );
}
