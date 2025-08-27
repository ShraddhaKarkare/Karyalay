import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SupabaseService } from '../services/supabaseService';
import { Venue } from '../config/supabase';

interface VenueListScreenProps {
  navigation: any;
}


const VenueListScreen: React.FC<VenueListScreenProps> = ({ navigation }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [searchVenue, setSearchVenue] = useState('');

  // Replace the filter function with a search function
  const searchVenues = async () => {
    try {
      setLoading(true);
      const venuesData = await SupabaseService.getVenues({
        city: searchCity.trim(),
        name: searchVenue.trim(),
      });
      // Ensure venuesData is of type Venue[]
      setVenues(venuesData as Venue[]);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load venues:', err);
      setError('Failed to load venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Call searchVenues when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchVenues();
    }, 500); // Debounce search to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [searchCity, searchVenue]);

  const renderVenueCard = (venue: Venue) => (
    <TouchableOpacity
      key={venue.id}
      style={styles.venueCard}
      onPress={() => navigation.navigate('VenueDetail', { venue })}
    >
      <Image source={{ uri: venue.image_url || '' }} style={styles.venueImage} />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueLocation}>
          {venue.address}, {venue.city}, {venue.state}
        </Text>
        <Text style={styles.venueDescription}>{venue.description}</Text>
        <View style={styles.venueDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Capacity:</Text>
            <Text style={styles.detailValue}>{venue.capacity} people</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>₹{venue.price_per_hour}/hr</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Find Karyalay</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter city"
            value={searchCity}
            onChangeText={setSearchCity}
          />
          
          <TextInput
            style={styles.searchInput}
            placeholder="Enter venue name"
            value={searchVenue}
            onChangeText={setSearchVenue}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading venues...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={searchVenues}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : venues.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No venues found for the selected criteria</Text>
          </View>
        ) : (
          <View style={styles.venueList}>
            {venues.map(renderVenueCard)}
          </View>
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,

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
  searchSection: {
    gap: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  dateInput: {
    height: 48,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dateList: {
    maxHeight: 400,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDate: {
    backgroundColor: '#007AFF15',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'white',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 16,
  },
});

export default VenueListScreen;