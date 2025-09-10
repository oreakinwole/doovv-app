<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Booking;
use App\Models\BookingHistory;

class BookingHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_retrieve_booking_history()
    {
        $booking = Booking::factory()->create([
            'customer_email' => 'test@example.com',
            'service_type' => 'DROP_OFF',
            'status' => 'COMPLETED'
        ]);

        BookingHistory::factory()->create([
            'booking_id' => $booking->id,
            'status' => 'COMPLETED',
            'notes' => 'Service completed successfully'
        ]);

        $response = $this->getJson('/legacy/bookings/history');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'code',
                    'message',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'customer_email',
                                'service_type',
                                'status',
                                'history' => [
                                    '*' => [
                                        'status',
                                        'notes',
                                        'timestamp'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
    }

    public function test_can_filter_history_by_customer_email()
    {
        Booking::factory()->create(['customer_email' => 'customer1@example.com']);
        Booking::factory()->create(['customer_email' => 'customer2@example.com']);

        $response = $this->getJson('/legacy/bookings/history?customer_email=customer1@example.com');

        $response->assertStatus(200);
        $bookings = $response->json('data.data');

        foreach ($bookings as $booking) {
            $this->assertEquals('customer1@example.com', $booking['customer_email']);
        }
    }
}
