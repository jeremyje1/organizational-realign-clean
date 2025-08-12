"use client";
import React from 'react';
import QuickWinsAssessmentEnhanced from './QuickWinsAssessmentEnhanced';
import { QuickWinsResult } from '@/data/quickWinsQuestions';

export interface QuickWinsAssessmentProps { onComplete?: (results: QuickWinsResult[]) => void; onUpgrade?: () => void }

export default function QuickWinsAssessment(props: QuickWinsAssessmentProps) {
  return <QuickWinsAssessmentEnhanced onComplete={props.onComplete} onUpgrade={props.onUpgrade} />;
}
