<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class Driver extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

    protected $fillable = [
        'operator_id',
        'vr_company_id',
        'MiddleName',
        'vehicle_id',
        'user_id',
        'Status',
        'License',
        'LicenseNumber',
        'Photo',
        'NBI_clearance',
        'Police_clearance',
        'BIR_clearance',
        'NPTC_ID'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($driver) {
            if (!$driver->NPTC_ID) {
                $driver->NPTC_ID = static::generateNPTCId('DR');
            }
        });
    }

    public static function generateNPTCId($prefix)
    {
        $latestDriver = static::where('NPTC_ID', 'LIKE', "$prefix-%")->latest('id')->first();
        $nextNumber = $latestDriver ? ((int)substr($latestDriver->NPTC_ID, 3)) + 1 : 1;
        return $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }

    public function vrCompany()
    {
        return $this->belongsTo(VRCompany::class);
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

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }


}
