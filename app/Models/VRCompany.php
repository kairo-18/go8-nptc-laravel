<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\VehicleRentalOwner;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class VRCompany extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = "vr_companies";
    protected $fillable = [
        'CompanyName',
        'BusinessPermitNumber',
        'Status',
        'NPTC_ID' // Add this field if it's not already in the migration
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($company) {
            $latestCompany = VRCompany::latest('id')->first();
            $nextNumber = $latestCompany ? ((int)substr($latestCompany->NPTC_ID, 3)) + 1 : 1;
            $company->NPTC_ID = 'VC-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        });
    }

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
