
// src/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { CreateBookingDto, UpdateBookingStatusDto } from '../types';
import Toast from 'react-native-toast-message';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useBookingHistory() {
  return useQuery({
    queryKey: ['bookings', 'history'],
    queryFn: bookingsApi.getHistory,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Toast.show({
        type: 'success',
        text1: 'Booking created',
        text2: 'Your booking has been submitted successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Booking failed',
        text2: 'Please try again',
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingStatusDto }) =>
      bookingsApi.updateStatus(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      const previousBookings = queryClient.getQueryData(['bookings']);
      
      queryClient.setQueryData(['bookings'], (old: any) =>
        old?.map((booking: any) =>
          booking.id === id ? { ...booking, status: data.status } : booking
        )
      );

      return { previousBookings };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['bookings'], context?.previousBookings);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: 'Could not update booking status',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}