/**
 * types/supabase.ts
 * Tipos generados de Supabase
 *
 * En producción, estos se generan automáticamente con:
 * npx supabase gen types typescript --project-id xxxxx > types/supabase.ts
 *
 * Por ahora, es una versión simplificada para que el proyecto compile.
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          birthdate: string | null;
          role: 'client' | 'admin';
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          birthdate?: string | null;
          role?: 'client' | 'admin';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          birthdate?: string | null;
          role?: 'client' | 'admin';
          created_at?: string;
          updated_at?: string | null;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          last_payment: string | null;
          next_payment: string | null;
          status: 'pending_activation' | 'active';
          activated_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          last_payment?: string | null;
          next_payment?: string | null;
          status?: 'pending_activation' | 'active';
          activated_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          last_payment?: string | null;
          next_payment?: string | null;
          status?: 'pending_activation' | 'active';
          activated_at?: string | null;
          updated_at?: string;
        };
      };
      notification_logs: {
        Row: {
          id: string;
          user_id: string;
          sent_at: string;
          type: 'auto' | 'manual';
          status: 'sent' | 'failed';
          message_sid: string | null;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          sent_at?: string;
          type: 'auto' | 'manual';
          status: 'sent' | 'failed';
          message_sid?: string | null;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          sent_at?: string;
          type?: 'auto' | 'manual';
          status?: 'sent' | 'failed';
          message_sid?: string | null;
          error_message?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};