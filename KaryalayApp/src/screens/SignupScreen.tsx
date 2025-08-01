import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import EnhancedButton from '../components/EnhancedButton';
import { AuthService } from '../services/authService';
import { SupabaseService } from '../services/supabaseService';
import { SignupFormData } from '../types';

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        navigation.replace('Home');
      }
    };
    checkUser();
  }, [navigation]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};
    let newPasswordError: string | undefined = undefined;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 6) {
      newPasswordError = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    setPasswordError(newPasswordError);
    return Object.keys(newErrors).length === 0 && !newPasswordError;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Sign up with Supabase
      const supabaseData = await SupabaseService.signUp({
        email: formData.email,
        password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
      });

      await AuthService.signup(formData);
      
      Alert.alert(
        'Success!',
        'Your account has been created successfully. Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Karyalay</Text>
            <Text style={styles.subtitle}>
              Create your account to start booking venues
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputsContainer}>
              <CustomInput
                label="First Name *"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChangeText={(text) => updateFormData('firstName', text)}
                error={errors.firstName}
                autoCapitalize="words"
              />

              <CustomInput
                label="Last Name *"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(text) => updateFormData('lastName', text)}
                error={errors.lastName}
                autoCapitalize="words"
              />

              <CustomInput
                label="Phone Number *"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={(text) => updateFormData('phoneNumber', text)}
                error={errors.phoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <CustomInput
                label="Email (Optional)"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                label="Password *"
                placeholder="Enter a password"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                secureTextEntry
                autoCapitalize="none"
              />
              <View style={styles.buttonContainer}>
                <EnhancedButton
                  title="Create Account"
                  variant="primary"
                  size="large"
                  onPress={handleSignup}
                  loading={loading}
                  disabled={loading}
                  style={styles.signupButton}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 50, // Add extra padding to ensure button is visible
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputsContainer: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 5,
  },
  signupButton: {
    marginTop: 5,
    marginBottom: 5, // Add bottom margin to ensure visibility
    backgroundColor: '#007AFF', // Ensure button is visible
    width: '50%', // Make button full width
    alignSelf: 'center'
  },
});

export default SignupScreen;