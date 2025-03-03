<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VrContacts extends Model
{
    protected $fillable = [
        'vr_company_id',
        'email',
        'ContactNumber',
        'LastName',
        'FirstName',
        'MiddleName',
        'Position',
    ];
    //
    public function vehicleRentalCompany(){
        $this->belongsTo(VRCompany::class, 'vehicle_rental_owner_id', 'id');
    }
}
