<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Vehicle extends Model implements HasMedia
{

    use HasFactory,InteractsWithMedia;
    //
    protected $fillable = [
        'operator_id',
        'driver_id',
        'PlateNumber',
        'Model',
        'Brand',
        'SeatNumber',
        'Status',
        'front_image',
        'back_image',
        'left_side_image',
        'right_side_image',
        'or_image',
        'cr_image',
        'id_card_image',
        'gps_certificate_image',
        'inspection_certificate_image',
    ];

    public function operator(){
        return $this->belongsTo(Operator::class);
    }

    public function driver(){
        return $this->belongsTo(Driver::class);
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
