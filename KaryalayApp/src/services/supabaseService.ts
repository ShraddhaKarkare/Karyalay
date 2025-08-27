import { supabase, Profile, Venue, Booking } from '../config/supabase';
import { VenueAvailability } from '../types';
import { AuthService } from './authService';

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
  static async getVenues(filters: { 
    city?: string; 
    name?: string; 
  }): Promise<Venue[]> {
    try {
      let query = supabase
        .from('venues')
        .select(`
          id,
          name,
          address,
          city,
          state,
          capacity,
          price_per_hour,
          price_per_day,
          image_url,
          amenities,
          is_available,
          description,
          created_at,
          updated_at
        `);

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
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
  static async getVenueBookings(
        venueId: string, 
        start_date: string, 
        end_date: string
  ): Promise<VenueAvailability[]> {
    try {
      
      const { data, error } = await supabase
        .from('bookings')
        .select('start_date, end_date, start_time, end_time, status')
        .eq('venue_id', venueId)
        .gte('start_date', start_date)
        .lte('end_date', end_date)
        .order('start_date', { ascending: true });

      if (error) throw error;

      console.log('Venue bookings:', data);

      return data?.map(booking => ({
        startDate: booking.start_date,
        endDate: booking.end_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        status: booking.status
      })) as VenueAvailability[] || [];
    } catch (error) {
      console.error('Error getting venue bookings:', error);
      return [];
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

  static async verifyOtp(email: string, otp: string) {
    // TODO: Implement OTP verification logic with Supabase 
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (error) throw error;

    if(session?.user) {
      await AuthService.setUser(session.user);
    }
    return session;
  }
}