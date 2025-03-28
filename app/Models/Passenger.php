<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    protected $fillable = [
        'trip_id',
        'FirstName',
        'LastName',
        'ContactNumber',
        'Address',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    //
}
