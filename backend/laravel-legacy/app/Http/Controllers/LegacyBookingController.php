<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingHistory;
use App\Http\Requests\CreateBookingRequest;
use App\Jobs\LogLegacyWrite;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LegacyBookingController extends Controller
{
    public function history(Request $request): JsonResponse
    {
        try {
            $query = Booking::with('history')
                ->orderBy('created_at', 'desc');

            if ($request->has('customer_email')) {
                $query->where('customer_email', $request->customer_email);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $bookings = $query->paginate(20);

            return response()->json([
                'code' => 200,
                'message' => 'Booking history retrieved successfully',
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Failed to retrieve booking history',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(CreateBookingRequest $request): JsonResponse
    {
        try {
            $price = $this->calculatePrice($request->service_type);

            $booking = Booking::create([
                'customer_email' => $request->customer_email,
                'service_type' => $request->service_type,
                'vehicle_info' => $request->vehicle_info,
                'address' => $request->address,
                'scheduled_at' => $request->scheduled_at,
                'notes' => $request->notes,
                'price' => $price
            ]);

            BookingHistory::create([
                'booking_id' => $booking->id,
                'status' => 'PENDING',
                'notes' => 'Booking created via legacy API'
            ]);

            LogLegacyWrite::dispatch($booking, 'created');

            return response()->json([
                'code' => 201,
                'message' => 'Booking created successfully',
                'data' => $booking->load('history')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Failed to create booking',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function calculatePrice(string $serviceType): float
    {
        $prices = [
            'DROP_OFF' => 25.00,
            'MOBILE' => 35.00,
            'PICKUP_RETURN' => 45.00
        ];

        return $prices[$serviceType] ?? 25.00;
    }
}
