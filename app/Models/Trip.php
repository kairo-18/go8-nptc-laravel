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
        $latestTrip = static::whereRaw("LOWER(\"NPTC_ID\") LIKE LOWER(?)", ["$prefix-%"])
                            ->orderByDesc('id') 
                            ->first();
    
        if ($latestTrip) {
            // Extract numeric part dynamically
            preg_match('/\d+$/', $latestTrip->NPTC_ID, $matches);
            $nextNumber = isset($matches[0]) ? ((int)$matches[0]) + 1 : 1;
        } else {
            $nextNumber = 1;
        }
    
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
