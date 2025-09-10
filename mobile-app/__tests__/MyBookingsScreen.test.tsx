import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyBookingsScreen from '../app/(app)/my-bookings';
import { AuthProvider } from '~/contexts/AuthContext';
import { Dimensions } from 'react-native';

// Mock the hooks and dependencies
jest.mock('../src/hooks/useBookings', () => ({
    useBookings: jest.fn(),
}));

jest.mock('../src/contexts/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
        user: { id: '1', email: 'test@test.com', role: 'CUSTOMER', name: 'Test User' },
        token: 'mock-token',
    }),
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));

jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
}));

// Mock Dimensions for layout testing
const mockDimensions = {
    window: { width: 375, height: 812 }, // iPhone X dimensions
    screen: { width: 375, height: 812 },
};

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Dimensions: {
            ...RN.Dimensions,
            get: jest.fn((dimension) => mockDimensions[dimension]),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        },
    };
});

describe('MyBookingsScreen Layout Test', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        // Mock the useBookings hook
        const { useBookings } = require('../src/hooks/useBookings');
        useBookings.mockReturnValue({
            data: [
                {
                    id: '1',
                    customerId: '1',
                    customer: { id: '1', name: 'Test User', email: 'test@test.com', role: 'CUSTOMER' },
                    serviceType: 'MOBILE',
                    vehicleInfo: '2020 Honda Civic, Blue',
                    address: '123 Main St, Test City',
                    scheduledAt: '2024-03-20T10:00:00Z',
                    status: 'CONFIRMED',
                    price: 35,
                    createdAt: '2024-03-19T10:00:00Z',
                    updatedAt: '2024-03-19T10:00:00Z',
                    notes: 'Please clean the interior thoroughly',
                },
                {
                    id: '2',
                    customerId: '1',
                    customer: { id: '1', name: 'Test User', email: 'test@test.com', role: 'CUSTOMER' },
                    serviceType: 'DROP_OFF',
                    vehicleInfo: '2018 Toyota Camry, White',
                    scheduledAt: '2024-03-21T14:00:00Z',
                    status: 'IN_PROGRESS',
                    price: 25,
                    createdAt: '2024-03-20T10:00:00Z',
                    updatedAt: '2024-03-20T10:00:00Z',
                },
            ],
            isLoading: false,
            error: null,
            refetch: jest.fn(),
            isRefetching: false,
        });
    });

    afterEach(() => {
        queryClient.clear();
        jest.clearAllMocks();
    });

    it('renders correctly with mocked dimensions and displays booking cards', () => {
        const TestWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        );

        const { getByText, getAllByText, getByTestId } = render(
            <TestWrapper>
                <MyBookingsScreen />
            </TestWrapper>
        );

        // Test that booking cards are rendered
        expect(getByText('Mobile Wash')).toBeTruthy();
        expect(getByText('Drop Off')).toBeTruthy();
        expect(getByText('2020 Honda Civic, Blue')).toBeTruthy();
        expect(getByText('2018 Toyota Camry, White')).toBeTruthy();

        // Test that prices are displayed
        expect(getByText('$35')).toBeTruthy();
        expect(getByText('$25')).toBeTruthy();

        // Test that status badges are rendered
        expect(getByText('Confirmed')).toBeTruthy();
        expect(getByText('In progress')).toBeTruthy();

        // Test that address is shown for mobile service
        expect(getByText('123 Main St, Test City')).toBeTruthy();

        // Test that notes are displayed
        expect(getByText('Please clean the interior thoroughly')).toBeTruthy();
    });

    it('handles different screen dimensions correctly', () => {
        // Test with smaller screen (iPhone SE)
        const smallDimensions = {
            window: { width: 320, height: 568 },
            screen: { width: 320, height: 568 },
        };

        (Dimensions.get as jest.Mock).mockImplementation((dimension) => smallDimensions[dimension]);

        const TestWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        );

        const { getByText } = render(
            <TestWrapper>
                <MyBookingsScreen />
            </TestWrapper>
        );

        // Content should still be accessible on smaller screens
        expect(getByText('Mobile Wash')).toBeTruthy();
        expect(getByText('Drop Off')).toBeTruthy();
    });

    it('renders loading state correctly', () => {
        const { useBookings } = require('../src/hooks/useBookings');
        useBookings.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            refetch: jest.fn(),
            isRefetching: false,
        });

        const TestWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        );

        const { getByText } = render(
            <TestWrapper>
                <MyBookingsScreen />
            </TestWrapper>
        );

        expect(getByText('Loading your bookings...')).toBeTruthy();
    });

    it('renders error state with retry button', () => {
        const mockRefetch = jest.fn();
        const { useBookings } = require('../src/hooks/useBookings');
        useBookings.mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Network error'),
            refetch: mockRefetch,
            isRefetching: false,
        });

        const TestWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        );

        const { getByText } = render(
            <TestWrapper>
                <MyBookingsScreen />
            </TestWrapper>
        );

        expect(getByText('Something went wrong')).toBeTruthy();
        expect(getByText('Try Again')).toBeTruthy();
    });

    it('renders empty state when no bookings exist', () => {
        const { useBookings } = require('../src/hooks/useBookings');
        useBookings.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            refetch: jest.fn(),
            isRefetching: false,
        });

        const TestWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        );

        const { getByText } = render(
            <TestWrapper>
                <MyBookingsScreen />
            </TestWrapper>
        );

        expect(getByText('No bookings yet')).toBeTruthy();
        expect(getByText('When you book a wash service, your bookings will appear here.')).toBeTruthy();
    });
});

