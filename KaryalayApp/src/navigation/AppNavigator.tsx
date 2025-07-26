import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import VenueListScreen from '../screens/VenueListScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import ButtonDemoScreen from '../screens/ButtonDemoScreen';
import OtpSignInScreen from '../screens/OtpSignInScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import { AuthService } from '../services/authService';
import { User } from '../types';

export type RootStackParamList = {
  Signup: undefined;
  Home: undefined;
  OtpSignIn: undefined;
  OtpVerification: { email: string };
  VenueList: undefined;
  MyBookings: undefined;
  VenueDetail: { venue: any };
  BookingDetail: { booking: any };
  ButtonDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // You could show a splash screen here
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={user ? "Home" : "OtpSignIn"}
        >
          <Stack.Screen name="OtpSignIn" component={OtpSignInScreen} />
          <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="VenueList" component={VenueListScreen} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
          <Stack.Screen name="ButtonDemo" component={ButtonDemoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;