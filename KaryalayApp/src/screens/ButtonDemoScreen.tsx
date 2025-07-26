import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnhancedButton from '../components/EnhancedButton';

interface ButtonDemoScreenProps {
  navigation: any;
}

const ButtonDemoScreen: React.FC<ButtonDemoScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Button Styles</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Choose Your Button Style</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Primary Buttons</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Primary"
              variant="primary"
              size="medium"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
            <EnhancedButton
              title="Large Primary"
              variant="primary"
              size="large"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Outline Buttons</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Outline"
              variant="outline"
              size="medium"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
            <EnhancedButton
              title="Large Outline"
              variant="outline"
              size="large"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Rounded Buttons</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Rounded"
              variant="primary"
              size="medium"
              style={[styles.buttonSpacing, { borderRadius: 25 }] as any}
              onPress={() => {}}
            />
            <EnhancedButton
              title="Pill"
              variant="gradient"
              size="medium"
              style={[styles.buttonSpacing, { borderRadius: 50 }] as any}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Gradient Buttons</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Gradient"
              variant="gradient"
              size="medium"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
            <EnhancedButton
              title="Large Gradient"
              variant="gradient"
              size="large"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Secondary Buttons</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Secondary"
              variant="secondary"
              size="medium"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
            <EnhancedButton
              title="Small Secondary"
              variant="secondary"
              size="small"
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Loading States</Text>
          <View style={styles.buttonRow}>
            <EnhancedButton
              title="Loading..."
              variant="primary"
              size="medium"
              loading={true}
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
            <EnhancedButton
              title="Loading Outline"
              variant="outline"
              size="medium"
              loading={true}
              onPress={() => {}}
              style={styles.buttonSpacing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Recommended for Signup</Text>
          <View style={styles.recommendedSection}>
            <EnhancedButton
              title="Create Account"
              variant="primary"
              size="large"
              onPress={() => navigation.navigate('Signup')}
              style={styles.fullWidthButton}
            />
            <Text style={styles.recommendationText}>
              This is the recommended style for your signup button
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    marginBottom: 12,
    minWidth: 120,
  },
  recommendedSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 16,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ButtonDemoScreen; 