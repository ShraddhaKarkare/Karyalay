import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  getDay,
  addDays
} from 'date-fns';
import { VenueAvailability } from '../types';
import { SupabaseService } from '../services/supabaseService';

interface VenueAvailabilityScreenProps {
  navigation: any;
  route: {
    params: {
      venueId: string;
    };
  };
}

// Add new type to track booking status
type BookingStatus = 'available' | 'partiallyBooked' | 'fullyBooked';

const VenueAvailabilityScreen: React.FC<VenueAvailabilityScreenProps> = ({ navigation, route }) => {
    const { venueId } = route.params;
    const [venueAvailability, setVenueAvailability] = useState<VenueAvailability[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    useEffect(() => {
        fetchBookings();
    }, [venueId, currentDate]); // Add currentDate as dependency

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const startDate = startOfMonth(currentDate);
            const endDate = endOfMonth(currentDate);

            // Convert dates to ISO string format
            const startISO = startDate.toISOString();
            const endISO = endDate.toISOString();

            const venueAvailability = await SupabaseService.getVenueBookings(
                venueId,
                startISO,
                endISO
            );

            setVenueAvailability(venueAvailability || []);
            setError(null);
        } catch (err: any) {
        console.error('Failed to load bookings:', err);
        setError('Failed to load venue availability. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    const createCalendarDays = () => {
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = endOfMonth(currentDate);
        
        // Get the day index of the first day (0-6, 0 = Sunday)
        const startWeekday = getDay(firstDayOfMonth);
        
        // Create array for empty spaces before first day
        const emptyDays = Array(startWeekday).fill(null);
        
        // Get all days of the month
        const monthDays = eachDayOfInterval({
            start: firstDayOfMonth,
            end: lastDayOfMonth,
        });
        
        // Combine empty days and month days
        return [...emptyDays, ...monthDays];
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Replace existing isDateBooked with getDateStatus
    const getDateStatus = (date: Date): BookingStatus => {
        // Start of the day being checked
        const checkDate = new Date(date.setHours(0, 0, 0, 0));

        const bookingStatus = venueAvailability.reduce((status: BookingStatus, booking) => {
            const bookingStart = new Date(booking.startDate);
            bookingStart.setHours(0, 0, 0, 0);
            
            const bookingEnd = new Date(booking.endDate);
            bookingEnd.setHours(0, 0, 0, 0);

            // Check if the date falls within the booking period
            const isWithinBooking = checkDate >= bookingStart && checkDate <= bookingEnd;

            if (isWithinBooking) {
                // If it's the end date, check the end time
                if (checkDate.getTime() === bookingEnd.getTime()) {
                    const [hours] = booking.endTime.split(':').map(Number);
                    return hours <= 16 ? 'partiallyBooked' : 'fullyBooked';
                }
                return 'fullyBooked';
            }

            return status;
        }, 'available');

        return bookingStatus;
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
        setSelectedDate(null); // Clear selected date when changing months
    };
    const previousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
        setSelectedDate(null); // Clear selected date when changing months
    };

    return (
        <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability Calendar</Text>
      </View>

      <ScrollView style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={previousMonth}>
            <Text style={styles.monthButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentDate, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={nextMonth}>
            <Text style={styles.monthButton}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendar}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading availability...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.weekDays}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <Text key={day} style={styles.weekDay}>{day}</Text>
                        ))}
                      </View>
                      <View style={styles.days}>
                        {createCalendarDays().map((date, index) => (
                            <View
                                key={date ? date.toISOString() : `empty-${index}`}
                                style={[
                                    styles.day,
                                    !date && styles.emptyDay,
                                    date && getDateStatus(date) === 'fullyBooked' && styles.bookedDay,
                                    date && getDateStatus(date) === 'partiallyBooked' && styles.partiallyBookedDay
                                ]}
                            >
                                {date && (
                                    <TouchableOpacity
                                        style={styles.dayButton}
                                        onPress={() => setSelectedDate(date)}
                                    >
                                        <Text style={[
                                            styles.dayText,
                                            getDateStatus(date) === 'fullyBooked' && styles.bookedDayText,
                                            getDateStatus(date) === 'partiallyBooked' && styles.partiallyBookedDayText,
                                            selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDayText
                                        ]}>
                                            {format(date, 'd')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                      </View>
                </>
            )}
        </View>

        <View style={styles.statusSection}>
          {selectedDate ? (
            <>
              <Text style={styles.selectedDateText}>
                {format(selectedDate, 'MMMM d, yyyy')}
              </Text>
              <View style={[
                styles.statusIndicator,
                getDateStatus(selectedDate) === 'fullyBooked' ? styles.bookedIndicator :
                getDateStatus(selectedDate) === 'partiallyBooked' ? styles.partiallyBookedIndicator :
                styles.availableIndicator
              ]}>
                <Text style={styles.statusText}>
                  {getDateStatus(selectedDate) === 'fullyBooked' ? 'Fully Booked' :
                   getDateStatus(selectedDate) === 'partiallyBooked' ? 'Available after 4 PM' :
                   'Available'}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.selectPrompt}>Select a date to check availability</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthButton: {
    fontSize: 24,
    color: '#007AFF',
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: '600',
    color: '#666',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  bookedDay: {
    backgroundColor: '#ffebee',
  },
  bookedDayText: {
    color: '#d32f2f',
  },
  partiallyBookedDay: {
    // Dark purple background for partially booked days
    backgroundColor: '#E6E6FA', // Light purple
  },
  partiallyBookedDayText: {
    color: '#673ab7', // Dark purple
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  dayButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100, // Add minimum height
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 12,
    width: '100%', // Make indicator full width
    alignItems: 'center',
  },
  bookedIndicator: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  partiallyBookedIndicator: {
    backgroundColor: '#E6E6FA', // Light purple
    borderWidth: 1,
    borderColor: '#D1C4E9', // Light purple border
  },
  availableIndicator: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectPrompt: {
    fontSize: 16,
    color: '#666',
  },
  selectedDayText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Add underline to show it's selected
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default VenueAvailabilityScreen;