import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthContext';

export default function AppIndex() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'CUSTOMER') {
            router.replace('/(app)/create-booking');
        } else {
            router.replace('/(app)/available-jobs');
        }
    }, [user]);

    return null;
}