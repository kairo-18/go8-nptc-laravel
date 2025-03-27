<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Thread;

class NewThreadCreated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $thread;
    public $recipientId;

    /**
     * Create a new event instance.
     */
    public function __construct(Thread $thread, int $recipientId)
    {
        $this->thread = $thread->load([
            'mails.media', // Load media with mails
            'receiver',
            'sender'
        ]);

        // Add preview URLs to each media item
        $this->thread->mails->each(function ($mail) {
            $mail->media->each(function ($media) {
                $media->preview_url = url('/preview-media/' . $media->id);
            });
        });

        $this->recipientId = $recipientId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel("user.{$this->thread->sender_id}"),
            new PrivateChannel("user.{$this->recipientId}"),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'thread' => $this->thread,
        ];
    }
}
