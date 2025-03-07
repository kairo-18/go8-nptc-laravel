<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Driver extends Model
{

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
}
