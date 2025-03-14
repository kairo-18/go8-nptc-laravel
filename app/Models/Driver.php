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
        'vehicle_id',
        'user_id',
        'Status',
        'License',
        'LicenseNumber',
        'Photo',
        'NBI_clearance',
        'Police_clearance',
        'BIR_clearance',
    ];
    

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class);
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
}
