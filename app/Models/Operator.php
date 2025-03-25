<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Operator extends Model
{
    protected $fillable = [
        'vr_company_id',
        'user_id',
        'Status',
        'NPTC_ID', // Make it fillable
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($operator) {
            $operator->NPTC_ID = Operator::generateNPTCId();
        });
    }

    public static function generateNPTCId()
    {
        $count = self::where('NPTC_ID', 'LIKE', 'OP-%')->count() + 1;
        return sprintf("OP-%04d", $count);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vrCompany()
    {
        return $this->belongsTo(VRCompany::class, 'vr_company_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class);
    }
}
