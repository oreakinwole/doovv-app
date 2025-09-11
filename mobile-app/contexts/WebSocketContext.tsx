import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import Toast from 'react-native-toast-message';

interface WebSocketContextType {
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { user, token } = useAuth();
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isConnectedRef = useRef(false);

    const connect = () => {
        if (!token || !user) return;

        try {
            const wsUrl = `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:9060'}?token=${token}`;
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected');
                isConnectedRef.current = true;

                // Clear any pending reconnect attempts
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    handleWebSocketMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket disconnected');
                isConnectedRef.current = false;

                // Attempt to reconnect after 3 seconds
                if (token && user) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                isConnectedRef.current = false;
            };

        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    };

    const handleWebSocketMessage = (message: any) => {
        switch (message.type) {
            case 'new-booking':
                if (user?.role === 'WASHER') {
                    queryClient.invalidateQueries({ queryKey: ['bookings'] });
                    Toast.show({
                        type: 'info',
                        text1: 'New Job Available',
                        text2: `${message.data.serviceType} - $${message.data.price}`,
                    });
                }
                break;

            case 'booking-updated':
                queryClient.invalidateQueries({ queryKey: ['bookings'] });

                if (user?.role === 'CUSTOMER' && message.data.customerId === user.id) {
                    const statusMessages = {
                        CONFIRMED: 'Your booking has been confirmed',
                        IN_PROGRESS: 'Your car wash is in progress',
                        COMPLETED: 'Your car wash is complete!',
                        CANCELLED: 'Your booking has been cancelled',
                    };

                    const statusMessage = statusMessages[message.data.status];
                    if (statusMessage) {
                        Toast.show({
                            type: message.data.status === 'COMPLETED' ? 'success' : 'info',
                            text1: 'Booking Update',
                            text2: statusMessage,
                        });
                    }
                }
                break;

            case 'job-assigned':
                if (user?.role === 'WASHER' && message.data.washerId === user.id) {
                    queryClient.invalidateQueries({ queryKey: ['bookings'] });
                    Toast.show({
                        type: 'success',
                        text1: 'Job Assigned',
                        text2: 'You have been assigned a new job',
                    });
                }
                break;

            default:
                console.log('Unknown message type:', message.type);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        isConnectedRef.current = false;
    };

    useEffect(() => {
        if (token && user) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [token, user]);

    return (
        <WebSocketContext.Provider value={{ isConnected: isConnectedRef.current }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}

