// lib/storage.ts
import { Role } from '@/types/types';

export const saveSurveyData = async (data: unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('survey', JSON.stringify(data));
  }
};

export const loadSurveyData = async () => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('survey');
    return raw ? JSON.parse(raw) : null;
  }
  return null;
};

export const saveRoleData = async (roles: Role[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
};