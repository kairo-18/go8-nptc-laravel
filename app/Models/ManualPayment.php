<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ManualPayment extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        "operator_id",
        "AccountName",
        "ModePayment",
        "Receipt",
        "ReferenceNumber",
        "AccountNumber",
        "Notes",
        "Amount"
    ];

    public function getMediaUrlsAttribute()
    {
        return $this->getMedia()->map(function ($media) {
            return [
                'id' => $media->id,
                'name' => $media->name,
                'mime_type' => $media->mime_type,
                'url' => $media->getUrl(),
            ];
        });
    }

    public function operator()
    {
        return $this->hasMany(Operator::class);
    }


}
