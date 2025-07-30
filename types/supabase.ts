export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          id: string
          question: string
          survey_id: string
          value_int: number | null
          value_text: string | null
        }
        Insert: {
          id?: string
          question: string
          survey_id: string
          value_int?: number | null
          value_text?: string | null
        }
        Update: {
          id?: string
          question?: string
          survey_id?: string
          value_int?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_answers_survey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          budget: number
          created_at: string | null
          deleted_at: string | null
          depth_mode: string
          headcount: number
          id: string
          name: string
          org_type: string | null
          owner_user_id: string
          slug: string
        }
        Insert: {
          budget: number
          created_at?: string | null
          deleted_at?: string | null
          depth_mode: string
          headcount: number
          id?: string
          name: string
          org_type?: string | null
          owner_user_id: string
          slug: string
        }
        Update: {
          budget?: number
          created_at?: string | null
          deleted_at?: string | null
          depth_mode?: string
          headcount?: number
          id?: string
          name?: string
          org_type?: string | null
          owner_user_id?: string
          slug?: string
        }
        Relationships: []
      }
      Organization: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          ownerId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          ownerId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          ownerId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Organization_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          id: string
          prompt: string | null
          section: string
          tags: string[] | null
          type: string | null
        }
        Insert: {
          id: string
          prompt?: string | null
          section: string
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          id?: string
          prompt?: string | null
          section?: string
          tags?: string[] | null
          type?: string | null
        }
        Relationships: []
      }
      realignments: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          org_type: string | null
          roles: Json | null
          user_email: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          org_type?: string | null
          roles?: Json | null
          user_email?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          org_type?: string | null
          roles?: Json | null
          user_email?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          department: string | null
          id: string
          institution_id: string | null
          name: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          id?: string
          institution_id?: string | null
          name: string
          tag: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          id?: string
          institution_id?: string | null
          name?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          answer_numeric: number | null
          answer_text: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          institution_id: string | null
          question_id: string
        }
        Insert: {
          answer_numeric?: number | null
          answer_text?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          institution_id?: string | null
          question_id: string
        }
        Update: {
          answer_numeric?: number | null
          answer_text?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          institution_id?: string | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      User: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
