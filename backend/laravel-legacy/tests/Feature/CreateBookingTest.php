<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Booking;
use Illuminate\Support\Facades\Queue;
use App\Jobs\LogLegacyWrite;

class CreateBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_booking_successfully()
    {
        Queue::fake();

        $bookingData = [
            'customer_email' => 'test@example.com',
            'service_type' => 'DROP_OFF',
            'vehicle_info' => '2024 Honda Civic - Blue',
            'address' => '123 Main St, City',
            'scheduled_at' => now()->addDay()->toISOString(),
            'notes' => 'Please be gentle with the paint'
        ];

        $response = $this->postJson('/legacy/bookings', $bookingData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'code',
                    'message',
                    'data' => [
                        'id',
                        'customer_email',
                        'service_type',
                        'vehicle_info',
                        'price',
                        'history'
                    ]
                ]);

        $this->assertDatabaseHas('bookings', [
            'customer_email' => 'test@example.com',
            'service_type' => 'DROP_OFF',
            'vehicle_info' => '2024 Honda Civic - Blue'
        ]);

        $this->assertDatabaseHas('booking_history', [
            'status' => 'PENDING',
            'notes' => 'Booking created via legacy API'
        ]);

        Queue::assertPushed(LogLegacyWrite::class);
    }

    public function test_booking_creation_fails_with_invalid_data()
    {
        $invalidData = [
            'customer_email' => 'invalid-email',
            'service_type' => 'INVALID_TYPE',
            'scheduled_at' => 'invalid-date'
        ];

        $response = $this->postJson('/legacy/bookings', $invalidData);

        $response->assertStatus(422)
                ->assertJsonStructure([
                    'code',
                    'message',
                    'details'
                ]);
    }

    public function test_booking_calculates_correct_price()
    {
        $testCases = [
            ['service_type' => 'DROP_OFF', 'expected_price' => 25.00],
            ['service_type' => 'MOBILE', 'expected_price' => 35.00],
            ['service_type' => 'PICKUP_RETURN', 'expected_price' => 45.00],
        ];

        foreach ($testCases as $case) {
            $bookingData = [
                'customer_email' => 'test@example.com',
                'service_type' => $case['service_type'],
                'vehicle_info' => '2024 Honda Civic',
                'scheduled_at' => now()->addDay()->toISOString()
            ];

            $response = $this->postJson('/legacy/bookings', $bookingData);

            $response->assertStatus(201);
            $this->assertEquals($case['expected_price'], $response->json('data.price'));
        }
    }
}
