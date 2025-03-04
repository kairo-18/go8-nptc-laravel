<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    //
    public function operator(){
        return $this->belongsTo(Operator::class);
    }

    public function driver(){
        return $this->belongsTo(Driver::class);
    }
}
