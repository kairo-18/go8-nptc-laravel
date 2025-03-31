<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Operator extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

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

        return sprintf('OP-%04d', $count);
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

    public function manualPayments()
    {
        return $this->hasMany(ManualPayment::class);
    }
}
