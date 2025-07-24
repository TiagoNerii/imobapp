import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: 'agent' | 'agency';
          photo_url?: string;
          agency_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: 'agent' | 'agency';
          photo_url?: string;
          agency_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          role?: 'agent' | 'agency';
          photo_url?: string;
          agency_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          source: 'manual' | 'whatsapp' | 'referral' | 'website' | 'other';
          status: 'cold' | 'warm' | 'hot';
          agent_id: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          source: 'manual' | 'whatsapp' | 'referral' | 'website' | 'other';
          status: 'cold' | 'warm' | 'hot';
          agent_id: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          source?: 'manual' | 'whatsapp' | 'referral' | 'website' | 'other';
          status?: 'cold' | 'warm' | 'hot';
          agent_id?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          sale_price: number;
          appraisal_value?: number;
          address?: string;
          neighborhood: string;
          city: string;
          state: string;
          bedrooms: number;
          bathrooms: number;
          parking_spaces: number;
          built_area: number;
          total_area: number;
          benefits: string[];
          photos: string[];
          status: 'available' | 'reserved' | 'sold';
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          sale_price: number;
          appraisal_value?: number;
          address?: string;
          neighborhood: string;
          city: string;
          state: string;
          bedrooms: number;
          bathrooms: number;
          parking_spaces: number;
          built_area: number;
          total_area: number;
          benefits: string[];
          photos: string[];
          status: 'available' | 'reserved' | 'sold';
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          sale_price?: number;
          appraisal_value?: number;
          address?: string;
          neighborhood?: string;
          city?: string;
          state?: string;
          bedrooms?: number;
          bathrooms?: number;
          parking_spaces?: number;
          built_area?: number;
          total_area?: number;
          benefits?: string[];
          photos?: string[];
          status?: 'available' | 'reserved' | 'sold';
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const {error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export type Property = Database['public']['Tables']['properties']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];