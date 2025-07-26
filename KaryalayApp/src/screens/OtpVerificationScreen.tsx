import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { SupabaseService } from '../services/supabaseService';

interface OtpVerificationScreenProps {
  route: { params: { email: string } };
  navigation: any;
}

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({ 
  route,
  navigation 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = route.params;

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      await SupabaseService.verifyOtp(email, otp);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to {email}
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Verification Code"
              placeholder="Enter verification code"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />

            <CustomButton
              title="Verify"
              onPress={handleVerifyOtp}
              loading={loading}
              disabled={loading}
              style={styles.verifyButton}
            />

            <CustomButton
              title="Resend Code"
              onPress={() => SupabaseService.signInWithOtp(email)}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  verifyButton: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default OtpVerificationScreen;