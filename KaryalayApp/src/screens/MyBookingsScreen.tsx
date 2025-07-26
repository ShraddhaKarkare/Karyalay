import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Booking {
  id: string;
  venueName: string;
  venueLocation: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  guests: number;
}

interface MyBookingsScreenProps {
  navigation: any;
}

const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ navigation }) => {
  // Mock data - in real app, this would come from API
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      venueName: 'Grand Palace Hall',
      venueLocation: 'Mumbai, Maharashtra',
      date: '2024-02-15',
      time: '6:00 PM - 11:00 PM',
      status: 'confirmed',
      price: '₹50,000',
      guests: 200,
    },
    {
      id: '2',
      venueName: 'Modern Conference Center',
      venueLocation: 'Delhi, NCR',
      date: '2024-03-20',
      time: '9:00 AM - 5:00 PM',
      status: 'pending',
      price: '₹25,000',
      guests: 50,
    },
    {
      id: '3',
      venueName: 'Garden Wedding Venue',
      venueLocation: 'Bangalore, Karnataka',
      date: '2024-01-10',
      time: '4:00 PM - 10:00 PM',
      status: 'cancelled',
      price: '₹35,000',
      guests: 150,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderBookingCard = (booking: Booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.venueName}>{booking.venueName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>

      <Text style={styles.venueLocation}>{booking.venueLocation}</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{booking.time}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Guests:</Text>
          <Text style={styles.detailValue}>{booking.guests} people</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>{booking.price}</Text>
        </View>
      </View>

      <View style={styles.bookingActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BookingDetail', { booking })}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>

        {booking.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              // Handle cancellation logic
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start by browsing and booking your first venue!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('VenueList')}
            >
              <Text style={styles.browseButtonText}>Browse Venues</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Bookings</Text>
            <Text style={styles.sectionSubtitle}>
              Manage and track your venue bookings
            </Text>

            <View style={styles.bookingsList}>
              {bookings.map(renderBookingCard)}
            </View>
          </>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  bookingsList: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  venueLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
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
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyBookingsScreen; 