// ──────────────────── Wizard Question Types ────────────────────
export type QuestionType = "text" | "number" | "textarea" | "select" | "file";

export interface SelectOption {
  /** actual value submitted */
  value: string;
  /** human‑readable label shown in UI */
  label: string;
}

export interface Question {
  /** unique field identifier (becomes key on RealignmentFormData) */
  id: string;
  label: string;
  type: QuestionType;
  /** only for `select` questions */
  options?: SelectOption[];
}

export interface Pillar {
  /** short machine‑friendly id (also used as step id) */
  id: string;
  /** Section title shown to the user */
  title: string;
  /** ordered list of questions */
  questions: Question[];
}

/** primitive or file value captured for each answer */
export type Scalar = string | number | File | null;

export type RealignmentFormData = {
  /** dynamic keys for every `id` in the questionnaire map to a scalar */
  [key: string]: Scalar;
};

// ──────────────────── Wizard Questionnaire Data ────────────────────
/**
 * Each pillar represents one step of the wizard.  
 * Feel free to expand or reorder later – but make sure every `id`
 * is unique across all pillars and every question’s `id` is unique
 * across the entire questionnaire.
 */
export const questionnaire: Pillar[] = [
  {
    id: "org_info",
    title: "Organization Information",
    questions: [
      {
        id: "orgName",
        label: "Organization name",
        type: "text",
      },
      {
        id: "unitName",
        label: "Unit / Division name (if applicable)",
        type: "text",
      },
      {
        id: "scenario",
        label: "Which best describes your realignment scenario?",
        type: "select",
        options: [
          { value: "growth", label: "Growth / Expansion" },
          { value: "consolidation", label: "Consolidation / Downsizing" },
          { value: "new_unit", label: "Standing‑up a new unit" },
        ],
      },
      {
        id: "notes",
        label: "Anything else we should know at this stage?",
        type: "textarea",
      },
    ],
  },

  {
    id: "student_affairs",
    title: "Student Affairs",
    questions: [
      {
        id: "studentServicesStrengths",
        label: "What are the current strengths of student services?",
        type: "textarea",
      },
      {
        id: "studentServicesChallenges",
        label: "What challenges are you facing in student services?",
        type: "textarea",
      },
    ],
  },

  {
    id: "academic_affairs",
    title: "Academic / Instruction",
    questions: [
      {
        id: "instructionalModalities",
        label: "Which instructional modalities are in scope?",
        type: "select",
        options: [
          { value: "in_person", label: "In‑person" },
          { value: "online", label: "Online / Hybrid" },
          { value: "both", label: "Both in‑person and online" },
        ],
      },
      {
        id: "facultyInvolvement",
        label: "How involved is faculty governance in the redesign?",
        type: "textarea",
      },
    ],
  },

  {
    id: "budget_facilities",
    title: "Budget & Facilities",
    questions: [
      {
        id: "fiscalYearBudget",
        label: "Current fiscal‑year budget (USD)",
        type: "number",
      },
      {
        id: "spaceConstraints",
        label: "Do you have any facility or space constraints?",
        type: "textarea",
      },
    ],
  },
];