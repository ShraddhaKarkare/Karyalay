import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: string;
  rating: number;
  image: string;
  description: string;
}

interface VenueListScreenProps {
  navigation: any;
}

const VenueListScreen: React.FC<VenueListScreenProps> = ({ navigation }) => {
  // Mock data - in real app, this would come from API
  const [venues] = useState<Venue[]>([
    {
      id: '1',
      name: 'Grand Palace Hall',
      location: 'Mumbai, Maharashtra',
      capacity: 500,
      price: '₹50,000',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Grand+Palace',
      description: 'Elegant palace-style venue perfect for weddings and corporate events.',
    },
    {
      id: '2',
      name: 'Modern Conference Center',
      location: 'Delhi, NCR',
      capacity: 200,
      price: '₹25,000',
      rating: 4.2,
      image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=Conference+Center',
      description: 'State-of-the-art conference facility with modern amenities.',
    },
    {
      id: '3',
      name: 'Garden Wedding Venue',
      location: 'Bangalore, Karnataka',
      capacity: 300,
      price: '₹35,000',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Garden+Venue',
      description: 'Beautiful outdoor garden venue surrounded by nature.',
    },
    {
      id: '4',
      name: 'Luxury Banquet Hall',
      location: 'Chennai, Tamil Nadu',
      capacity: 400,
      price: '₹45,000',
      rating: 4.3,
      image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Luxury+Banquet',
      description: 'Premium banquet hall with luxury amenities and catering services.',
    },
  ]);

  const renderVenueCard = (venue: Venue) => (
    <TouchableOpacity
      key={venue.id}
      style={styles.venueCard}
      onPress={() => navigation.navigate('VenueDetail', { venue })}
    >
      <Image source={{ uri: venue.image }} style={styles.venueImage} />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueLocation}>{venue.location}</Text>
        <Text style={styles.venueDescription}>{venue.description}</Text>
        
        <View style={styles.venueDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Capacity:</Text>
            <Text style={styles.detailValue}>{venue.capacity} people</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>{venue.price}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating:</Text>
            <Text style={styles.detailValue}>⭐ {venue.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Venues</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Available Venues</Text>
        <Text style={styles.sectionSubtitle}>
          Find the perfect venue for your event
        </Text>

        <View style={styles.venueList}>
          {venues.map(renderVenueCard)}
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  venueList: {
    gap: 20,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  venueInfo: {
    padding: 20,
  },
  venueName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  venueDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  venueDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
});

export default VenueListScreen; 