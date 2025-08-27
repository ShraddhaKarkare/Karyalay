import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { Venue } from '../config/supabase';

interface VenueDetailScreenProps {
  navigation: any;
  route: {
    params: {
      venue: Venue;
    };
  };
}

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ navigation, route }) => {
  const { venue } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: venue.image_url }} style={styles.venueImage} />
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.venueLocation}>{venue.address}</Text>
          
          <Text style={styles.description}>{venue.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Capacity</Text>
              <Text style={styles.detailValue}>{venue.capacity} people</Text>
            </View>
          </View>

          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              <Text style={styles.amenityItem}>• Parking Available</Text>
              <Text style={styles.amenityItem}>• Catering Services</Text>
              <Text style={styles.amenityItem}>• Audio/Visual Equipment</Text>
              <Text style={styles.amenityItem}>• Air Conditioning</Text>
              <Text style={styles.amenityItem}>• Wi-Fi Access</Text>
            </View>
          </View>
          <View style={styles.viewAvailabilityContainer}>
            <CustomButton title='View Availability' onPress={() => navigation.navigate('Availability', { venueId: venue.id })} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  venueImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  venueName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  venueLocation: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amenitiesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bookingContainer: {
    marginBottom: 20,
  },
  bookButton: {
    marginBottom: 0,
  },
  viewAvailabilityContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
});

export default VenueDetailScreen;