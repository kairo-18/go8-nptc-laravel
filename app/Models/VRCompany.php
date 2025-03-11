<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\VehicleRentalOwner;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class VRCompany extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

    protected $table =  "vr_companies";
    protected $fillable = [
        'CompanyName',
        'BusinessPermitNumber',
        'Status'
    ];
    //
    //
    public function owner()
    {
        return $this->hasOne(VehicleRentalOwner::class, 'vr_company_id');
    }

    public function operators()
    {
        return $this->hasMany(Operator::class, 'vr_company_id');
    }

    public function contacts()
    {
        return $this->hasMany(VrContacts::class, 'vr_company_id');
    }

    public function driver()
    {
        return $this->hasMany(Driver::class);
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
