import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useBookings, useUpdateBookingStatus } from '~/hooks/useBookings';
import { Booking } from '~/types';
import { format } from 'date-fns';
import { useAuth } from '~/contexts/AuthContext';

const statusColors = {
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
};

const statusActions = {
    CONFIRMED: { next: 'IN_PROGRESS', label: 'Start Washing', icon: 'play-outline' },
    IN_PROGRESS: { next: 'COMPLETED', label: 'Mark Complete', icon: 'checkmark-outline' },
};

function MyJobCard({ booking, onUpdateStatus }: { booking: Booking; onUpdateStatus: (id: string, status: string) => void }) {
    const statusColor = statusColors[booking.status] || 'bg-gray-100 text-gray-800';
    const action = statusActions[booking.status];

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
                <View style={tw`px-3 py-1 rounded-full ${statusColor}`}>
                    <Text style={tw`text-sm font-medium capitalize`}>
                        {booking.status.toLowerCase().replace('_', ' ')}
                    </Text>
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
                {action && (
                    <TouchableOpacity
                        style={tw`bg-blue-600 px-4 py-2 rounded-lg flex-row items-center`}
                        onPress={() => onUpdateStatus(booking.id, action.next)}
                    >
                        <Ionicons name={action.icon as any} size={16} color="white" style={tw`mr-2`} />
                        <Text style={tw`text-white font-semibold`}>{action.label}</Text>
                    </TouchableOpacity>
                )}
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

export default function MyJobsScreen() {
    const { user } = useAuth();
    const { data: bookings, isLoading, error, refetch, isRefetching } = useBookings();
    const updateStatus = useUpdateBookingStatus();

    const myJobs = bookings?.filter(booking =>
        booking.washerId === user?.id ||
        (booking.status !== 'PENDING' && booking.status !== 'CANCELLED')
    ) || [];

    const handleUpdateStatus = (bookingId: string, newStatus: string) => {
        const statusLabels = {
            IN_PROGRESS: 'start this job',
            COMPLETED: 'mark this job as complete'
        };

        Alert.alert(
            'Update Status',
            `Are you sure you want to ${statusLabels[newStatus] || 'update this job'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        updateStatus.mutate({
                            id: bookingId,
                            data: { status: newStatus as any }
                        });
                    }
                }
            ]
        );
    };

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (myJobs.length === 0) {
        return (
            <View style={tw`flex-1 justify-center items-center px-6`}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#9CA3AF" />
                <Text style={tw`text-xl font-semibold text-gray-800 mt-4 text-center`}>
                    No active jobs
                </Text>
                <Text style={tw`text-gray-600 mt-2 text-center`}>
                    Accept jobs from the Available Jobs tab to see them here.
                </Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <FlatList
                data={myJobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MyJobCard booking={item} onUpdateStatus={handleUpdateStatus} />
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