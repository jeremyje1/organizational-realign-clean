/* types/types.ts  – Single source of shared types */

/* ───── Roles ───── */
export type RoleTag = 'critical' | 'nice-to-have' | 'optional';

export interface Role {
  id:   string;
  name: string;
  tag:  RoleTag;
}

/* ───── Survey questions ───── */
export interface BaseQuestion {
  id:          string;
  prompt:      string;
  required?:   boolean;
  placeholder?: string;
  /** Legacy keys supported for backward‑compat */
  label?: string;
  text?:  string;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
}

export interface SelectQuestion extends BaseQuestion {
  type:    'select';
  options: string[];
}

export type Question = TextQuestion | SelectQuestion;

/* ───── Pillar grouping ───── */
export interface Pillar {
  id:        string;
  title?:    string;
  /** Legacy fallback heading */
  name?:     string;
  questions: Question[];
}