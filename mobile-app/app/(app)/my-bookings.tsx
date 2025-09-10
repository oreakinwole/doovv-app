import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useBookings } from '~/hooks/useBookings';
import { Booking } from '~/types';
import { format } from 'date-fns';

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const statusIcons = {
    PENDING: 'time-outline',
    CONFIRMED: 'checkmark-circle-outline',
    IN_PROGRESS: 'car-outline',
    COMPLETED: 'checkmark-done-outline',
    CANCELLED: 'close-circle-outline',
};

const serviceTypeLabels = {
    DROP_OFF: 'Drop Off',
    MOBILE: 'Mobile Wash',
    PICKUP_RETURN: 'Pickup & Return',
};

function BookingCard({ booking }: { booking: Booking }) {
    const statusColor = statusColors[booking.status] || 'bg-gray-100 text-gray-800';
    const statusIcon = statusIcons[booking.status] || 'help-outline';

    return (
        <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>
                        {serviceTypeLabels[booking.serviceType]}
                    </Text>
                    <Text style={tw`text-gray-600 mt-1`}>{booking.vehicleInfo}</Text>
                </View>
                <View style={tw`px-3 py-1 rounded-full ${statusColor}`}>
                    <View style={tw`flex-row items-center`}>
                        <Ionicons name={statusIcon as any} size={14} color="currentColor" style={tw`mr-1`} />
                        <Text style={tw`text-sm font-medium capitalize`}>
                            {booking.status.toLowerCase().replace('_', ' ')}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={tw`flex-row items-center mb-2`}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={tw`text-gray-600 ml-2`}>
                    {format(new Date(booking.scheduledAt), 'MMM dd, yyyy \'at\' h:mm a')}
                </Text>
            </View>

            {booking.address && (
                <View style={tw`flex-row items-center mb-2`}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={tw`text-gray-600 ml-2 flex-1`}>{booking.address}</Text>
                </View>
            )}

            <View style={tw`flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100`}>
                <Text style={tw`text-lg font-bold text-green-600`}>
                    ${booking.price}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                    Created {format(new Date(booking.createdAt), 'MMM dd')}
                </Text>
            </View>

            {booking.notes && (
                <View style={tw`mt-3 p-3 bg-gray-50 rounded`}>
                    <Text style={tw`text-sm text-gray-700`}>
                        <Text style={tw`font-medium`}>Notes: </Text>
                        {booking.notes}
                    </Text>
                </View>
            )}
        </View>
    );
}

function LoadingState() {
    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={tw`text-gray-600 mt-4`}>Loading your bookings...</Text>
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
                Unable to load your bookings. Please check your connection and try again.
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
            <Ionicons name="car-outline" size={64} color="#9CA3AF" />
            <Text style={tw`text-xl font-semibold text-gray-800 mt-4 text-center`}>
                No bookings yet
            </Text>
            <Text style={tw`text-gray-600 mt-2 text-center`}>
                When you book a wash service, your bookings will appear here.
            </Text>
        </View>
    );
}

export default function MyBookingsScreen() {
    const { data: bookings, isLoading, error, refetch, isRefetching } = useBookings();

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (!bookings || bookings.length === 0) return <EmptyState />;

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookingCard booking={item} />}
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