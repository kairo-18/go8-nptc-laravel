<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Operator extends Model
{
    protected $fillable = [
        'vr_company_id',
        'user_id',
        'Status'
    ];
    //
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function vrCompany(){
        return $this->belongsTo(VRCompany::class, 'vr_company_id');
    }

    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }

    public function drivers(){
        return $this->hasMany(Driver::class);
    }
}
