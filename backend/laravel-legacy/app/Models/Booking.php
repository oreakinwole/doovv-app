<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_email',
        'service_type',
        'vehicle_info',
        'address',
        'scheduled_at',
        'status',
        'notes',
        'price'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'price' => 'decimal:2'
    ];

    public function history()
    {
        return $this->hasMany(BookingHistory::class);
    }
}
