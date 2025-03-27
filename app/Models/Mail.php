<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Mail extends Model implements HasMedia
{
    protected $fillable = ['sender_id', 'thread_id', 'subject', 'content', 'is_read'];

    use InteractsWithMedia;

    // Define a media collection for attachments
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments')
             ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'application/pdf']); // Allow only images
    }

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class);
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
