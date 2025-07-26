import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/config/supabase';

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (url.includes('signup-confirm')) {
        // Extract the tokens from the URL
        const params = new URLSearchParams(url.split('#')[1]);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          // Set the session
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (!error) {
            // Navigate to home or show success message
            navigation.replace('Home');
          }
        }
      }
    };

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (url) handleDeepLink(url);
    });

    // Handle deep links when app is opened from killed state
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
