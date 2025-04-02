<?php

namespace App\Events;

use App\Models\Mail;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MailReceive implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public Mail $mail;

    /**
     * Create a new event instance.
     */
    public function __construct(Mail $mail)
    {
        $this->mail = $mail;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('thread.'.$this->mail->thread_id),
            new PrivateChannel('user.'.$this->mail->sender_id), // Add sender's channel
            new PrivateChannel('user.'.$this->mail->thread->receiver_id),
        ];
    }

    public function broadcastWith(): array
    {
        $lastMail = $this->mail->thread->mails()
            ->latest()
            ->with(['media', 'sender', 'thread.receiver'])
            ->first();

        // Add preview URLs to each media item
        $lastMail->media->each(function ($media) {
            $media->preview_url = url('/preview-media/'.$media->id);
        });

        return [
            'id' => $this->mail->thread->id,
            'last_mail' => $lastMail,
            'sender' => [
                'id' => $lastMail->sender->id,
                'FirstName' => $lastMail->sender->FirstName,
                'LastName' => $lastMail->sender->LastName,
                'email' => $lastMail->sender->email,
            ],
            'receiver' => [
                'id' => $this->mail->thread->receiver->id,
                'FirstName' => $this->mail->thread->receiver->FirstName,
                'LastName' => $this->mail->thread->receiver->LastName,
                'email' => $this->mail->thread->receiver->email,
            ],
            'created_at' => $this->mail->thread->created_at,
        ];
    }
}
