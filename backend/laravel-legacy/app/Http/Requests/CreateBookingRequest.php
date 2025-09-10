<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateBookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'customer_email' => 'required|email|max:255',
            'service_type' => 'required|in:DROP_OFF,MOBILE,PICKUP_RETURN',
            'vehicle_info' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:1000'
        ];
    }

    public function messages()
    {
        return [
            'customer_email.required' => 'Email address is required',
            'customer_email.email' => 'Please provide a valid email address',
            'service_type.required' => 'Service type is required',
            'service_type.in' => 'Invalid service type selected',
            'vehicle_info.required' => 'Vehicle information is required',
            'scheduled_at.required' => 'Scheduled date and time is required',
            'scheduled_at.after' => 'Scheduled time must be in the future'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'code' => 422,
            'message' => 'Validation failed',
            'details' => $validator->errors()
        ], 422));
    }
}
