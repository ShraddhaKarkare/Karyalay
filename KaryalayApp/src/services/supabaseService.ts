import { supabase, Profile, Venue, Booking } from '../config/supabase';

export class SupabaseService {
  // User Profile Methods
  static async createProfile(userData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
  }): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            ...userData,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  }

  static async getProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  static async updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  // Venue Methods
  static async getVenues(): Promise<Venue[]> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting venues:', error);
      return [];
    }
  }

  static async getVenueById(id: string): Promise<Venue | null> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting venue:', error);
      return null;
    }
  }

  // Booking Methods
  static async createBooking(bookingData: {
    venue_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    total_price: number;
    guest_count?: number;
    special_requirements?: string;
  }): Promise<Booking | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            ...bookingData,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  static async getUserBookings(): Promise<Booking[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venues (
            name,
            address,
            city,
            state
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return null;
    }
  }

  // Authentication Methods
  static async signUp(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    phone_number: userData.phone_number,
                }
            }
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async signInWithOtp(email: string) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'karyalay://otp-verification',
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }
}