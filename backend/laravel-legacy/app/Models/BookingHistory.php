<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingHistory extends Model
{
    use HasFactory;

    protected $table = 'booking_history';

    protected $fillable = [
        'booking_id',
        'status',
        'notes',
        'timestamp'
    ];

    protected $casts = [
        'timestamp' => 'datetime'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
