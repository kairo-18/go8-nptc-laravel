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
        return $this->hasMany(Operator::class);
    }

    public function contacts()
    {
        return $this->hasOne(VrContacts::class);
    }

    public function driver()
    {
        return $this->hasMany(Driver::class);
    }

}
