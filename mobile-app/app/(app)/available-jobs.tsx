import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useBookings, useUpdateBookingStatus } from '~/hooks/useBookings';
import { Booking } from '~/types';
import { format } from 'date-fns';

const serviceTypeLabels = {
    DROP_OFF: 'Drop Off',
    MOBILE: 'Mobile Wash',
    PICKUP_RETURN: 'Pickup & Return',
};

function JobCard({ booking, onAccept }: { booking: Booking; onAccept: (id: string) => void }) {
    return (
        <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>
                        {serviceTypeLabels[booking.serviceType]}
                    </Text>
                    <Text style={tw`text-gray-600 mt-1`}>{booking.vehicleInfo}</Text>
                    <Text style={tw`text-sm text-gray-500 mt-1`}>
                        Customer: {booking.customer.name}
                    </Text>
                </View>
                <View style={tw`px-3 py-1 rounded-full bg-yellow-100`}>
                    <Text style={tw`text-yellow-800 text-sm font-medium`}>Available</Text>
                </View>
            </View>

            <View style={tw`flex-row items-center mb-2`}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={tw`text-gray-600 ml-2`}>
                    {format(new Date(booking.scheduledAt), 'MMM dd, yyyy \'at\' h:mm a')}
                </Text>
            </View>

            {booking.address && (
                <View style={tw`flex-row items-start mb-2`}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" style={tw`mt-0.5`} />
                    <Text style={tw`text-gray-600 ml-2 flex-1`}>{booking.address}</Text>
                </View>
            )}

            <View style={tw`flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100`}>
                <Text style={tw`text-lg font-bold text-green-600`}>
                    ${booking.price}
                </Text>
                <TouchableOpacity
                    style={tw`bg-blue-600 px-4 py-2 rounded-lg`}
                    onPress={() => onAccept(booking.id)}
                >
                    <Text style={tw`text-white font-semibold`}>Accept Job</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function LoadingState() {
    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={tw`text-gray-600 mt-4`}>Loading available jobs...</Text>
        </View>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <View style={tw`flex-1 justify-center items-center px-6`}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text style={tw`text-xl font-semibold text-gray-800 mt-4 text-center`}>
                Something went wrong
            </Text>
            <Text style={tw`text-gray-600 mt-2 text-center`}>
                Unable to load available jobs. Please try again.
            </Text>
            <TouchableOpacity
                style={tw`bg-blue-600 px-6 py-3 rounded-lg mt-6`}
                onPress={onRetry}
            >
                <Text style={tw`text-white font-semibold`}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={tw`flex-1 justify-center items-center px-6`}>
            <Ionicons name="briefcase-outline" size={64} color="#9CA3AF" />
            <Text style={tw`text-xl font-semibold text-gray-800 mt-4 text-center`}>
                No available jobs
            </Text>
            <Text style={tw`text-gray-600 mt-2 text-center`}>
                Check back later for new washing opportunities.
            </Text>
        </View>
    );
}

export default function AvailableJobsScreen() {
    const { data: bookings, isLoading, error, refetch, isRefetching } = useBookings();
    const updateStatus = useUpdateBookingStatus();

    const availableJobs = bookings?.filter(booking => booking.status === 'PENDING') || [];

    const handleAcceptJob = (bookingId: string) => {
        Alert.alert(
            'Accept Job',
            'Are you sure you want to accept this job?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        updateStatus.mutate({
                            id: bookingId,
                            data: { status: 'CONFIRMED' }
                        });
                    }
                }
            ]
        );
    };

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (availableJobs.length === 0) return <EmptyState />;

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <FlatList
                data={availableJobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobCard booking={item} onAccept={handleAcceptJob} />
                )}
                contentContainerStyle={tw`p-4`}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor="#3B82F6"
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

