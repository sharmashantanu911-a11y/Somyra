export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          is_pro: boolean
          is_max: boolean
          subscription_id: string | null
          subscription_status: string | null
          current_period_end: string | null
          created_at: string
          email: string | null
          plan_id: string | null
        }
        Insert: {
          id: string
          is_pro?: boolean
          is_max?: boolean
          subscription_id?: string | null
          subscription_status?: string | null
          current_period_end?: string | null
          created_at?: string
          email?: string | null
          plan_id?: string | null
        }
        Update: {
          id?: string
          is_pro?: boolean
          is_max?: boolean
          subscription_id?: string | null
          subscription_status?: string | null
          current_period_end?: string | null
          created_at?: string
          email?: string | null
          plan_id?: string | null
        }
      }
      generation_counts: {
        Row: {
          id: string
          user_id: string
          feature: string
          count: number
          period_start: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: string
          count?: number
          period_start: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature?: string
          count?: number
          period_start?: string
          created_at?: string
        }
      }
      voice_profile: {
        Row: {
          id: string
          user_id: string
          post_text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_text?: string
          created_at?: string
        }
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
