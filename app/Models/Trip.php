<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'pickupAddress',
        'dropoffAddress',
        'pickupDate',
        'dropoffDate',
        'tripType',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function passengers()
    {
        return $this->hasMany(Passenger::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
