<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\CreateBookingRequest;
use Illuminate\Support\Facades\Validator;

class CreateBookingRequestTest extends TestCase
{
    public function test_valid_booking_request()
    {
        $request = new CreateBookingRequest();
        $rules = $request->rules();

        $data = [
            'customer_email' => 'test@example.com',
            'service_type' => 'DROP_OFF',
            'vehicle_info' => '2024 Honda Civic',
            'scheduled_at' => now()->addDay()->toISOString(),
            'notes' => 'Please be careful'
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->passes());
    }

    public function test_invalid_email_fails_validation()
    {
        $request = new CreateBookingRequest();
        $rules = $request->rules();

        $data = [
            'customer_email' => 'invalid-email',
            'service_type' => 'DROP_OFF',
            'vehicle_info' => '2024 Honda Civic',
            'scheduled_at' => now()->addDay()->toISOString()
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('customer_email', $validator->errors()->toArray());
    }

    public function test_past_date_fails_validation()
    {
        $request = new CreateBookingRequest();
        $rules = $request->rules();

        $data = [
            'customer_email' => 'test@example.com',
            'service_type' => 'DROP_OFF',
            'vehicle_info' => '2024 Honda Civic',
            'scheduled_at' => now()->subDay()->toISOString()
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('scheduled_at', $validator->errors()->toArray());
    }
}
