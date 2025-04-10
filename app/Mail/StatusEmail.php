<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class statusemail extends mailable
{
    use queueable, serializesmodels;

    /**
     * create a new message instance.
     */
    public $username;

    public $status;

    public function __construct($username, $status)
    {
        $this->username = $username;
        $this->status = $status; // example status, you can set this dynamically
    }

    /**
     * get the message envelope.
     */
    public function envelope(): envelope
    {
        return new envelope(
            subject: 'status update email',
        );
    }

    /**
     * get the message content definition.
     */
    public function content(): content
    {
        return new content(
            view: 'emails.test',
            with: [
                'username' => $this->username,  // pass dynamic data to the view
                'status' => $this->status, // pass the status to the view
                'subject' => 'Status Update Email', // pass the subject to the view
            ]
        );
    }

    /**
     * get the attachments for the message.
     *
     * @return array<int, \illuminate\mail\mailables\attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
