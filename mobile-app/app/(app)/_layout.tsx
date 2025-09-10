import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/contexts/AuthContext';
import { TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function AppLayout() {
    const { user, logout } = useAuth();
    const isCustomer = user?.role === 'CUSTOMER';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                headerStyle: tw`bg-white`,
                headerTitleStyle: tw`font-semibold`,
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={tw`mr-4`}>
                        <Ionicons name="log-out-outline" size={24} color="#6B7280" />
                    </TouchableOpacity>
                ),
            }}
        >
            {isCustomer ? (
                <>
                    <Tabs.Screen
                        name="create-booking"
                        options={{
                            title: 'Book Service',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="add-circle-outline" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="my-bookings"
                        options={{
                            title: 'My Bookings',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="list-outline" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            ) : (
                <>
                    <Tabs.Screen
                        name="available-jobs"
                        options={{
                            title: 'Available Jobs',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="briefcase-outline" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="my-jobs"
                        options={{
                            title: 'My Jobs',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="checkmark-circle-outline" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            )}
        </Tabs>
    );
}