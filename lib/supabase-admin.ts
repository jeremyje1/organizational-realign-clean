// types/supabase.ts
// 👉 Temporary minimal database typings.
//    Replace with the full schema by running:
//    npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Minimal placeholder so TypeScript stops complaining
// until we generate the real schema typings.
export interface Database {
  // add real tables here when generated
  public: Record<string, never>;
}