<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;

class LogLegacyWrite implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $booking;
    public $action;

    public function __construct(Booking $booking, string $action)
    {
        $this->booking = $booking;
        $this->action = $action;
    }

    public function handle()
    {
        Log::info('Legacy booking operation', [
            'action' => $this->action,
            'booking_id' => $this->booking->id,
            'customer_email' => $this->booking->customer_email,
            'service_type' => $this->booking->service_type,
            'timestamp' => now()
        ]);

        // Additional legacy system integrations could go here
        // e.g., sync to external CRM, send webhooks, etc.
    }

    public function failed(\Throwable $exception)
    {
        Log::error('Legacy write job failed', [
            'booking_id' => $this->booking->id,
            'error' => $exception->getMessage()
        ]);
    }
}
