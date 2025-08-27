import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../config/supabase';

const USER_STORAGE_KEY = '@karyalay_user';

export class AuthService {
  static async setUser(userData: User): Promise<User> {
    try {
      const newUser: User = {
        id: userData.id,
        email: userData.email,
        created_at: userData.created_at,
        last_sign_in_at: userData.last_sign_in_at,
        app_metadata: userData.app_metadata,
        user_metadata: userData.user_metadata,
        ...userData,
      };

      // Store user data locally
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }
} 