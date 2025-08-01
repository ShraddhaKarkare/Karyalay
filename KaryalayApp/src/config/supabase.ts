import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://kqkpfqkeyjjxwhtaghtz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxa3BmcWtleWpqeHdodGFnaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTk0MDgsImV4cCI6MjA2OTA5NTQwOH0.AsnRs53fkao5jx8ScFAbbo452sUlWZN087EgXWkNu7Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { 
    storage: AsyncStorage,
    persistSession: true, 
    autoRefreshToken: true,
    detectSessionInUrl: false, // Disable URL detection for deep linking)
  }
});

// Database types
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  price_per_hour: number;
  price_per_day?: number;
  image_url?: string;
  amenities?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  venue_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_count?: number;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
} 