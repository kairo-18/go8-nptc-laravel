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
        'status',
        'NPTC_ID' 
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($trip) {
            if (!$trip->NPTC_ID) {
                $trip->NPTC_ID = static::generateNPTCId('TX');
            }
        });
    }

    public static function generateNPTCId($prefix)
    {
        $latestTrip = static::where('NPTC_ID', 'LIKE', "$prefix-%")->latest('id')->first();
        $nextNumber = $latestTrip ? ((int)substr($latestTrip->nptc_ID, 3)) + 1 : 1;
        return $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

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
