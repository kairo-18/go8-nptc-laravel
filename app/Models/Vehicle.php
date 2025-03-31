<?php

namespace App\Models;

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Vehicle extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'operator_id',
        'driver_id',
        'PlateNumber',
        'Model',
        'Brand',
        'SeatNumber',
        'Status',
        'front_image',
        'back_image',
        'left_side_image',
        'right_side_image',
        'or_image',
        'cr_image',
        'id_card_image',
        'gps_certificate_image',
        'inspection_certificate_image',
        'NPTC_ID',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vehicle) {
            if (! $vehicle->NPTC_ID) {
                $vehicle->NPTC_ID = static::generateUniqueNPTCId('UN');
            }
        });
    }

    public static function generateUniqueNPTCId($prefix)
    {
        $nextNumber = 1;

        do {
            $nptcId = $prefix.'-'.str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
            $exists = static::where('NPTC_ID', $nptcId)->exists();
            $nextNumber++;
        } while ($exists);

        return $nptcId;
    }

    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function getMediaUrlsAttribute()
    {
        return $this->media->map(function ($media) {
            return [
                'id' => $media->id,
                'name' => $media->name,
                'mime_type' => $media->mime_type,
                'url' => $media->getUrl(),
            ];
        });
    }

    public function manualPayments()
    {
        return $this->hasMany(ManualPayment::class);
    }
}
