<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VrCompanyEmail extends Mailable
{
    use queueable, serializesmodels;

    /**
     * create a new message instance.
     */
    public $username;

    public $status;

    public $companyName;

    public function __construct($companyName, $username, $status)
    {
        $this->username = $username;
        $this->status = $status; // example status, you can set this dynamically
        $this->companyName = $companyName; // example operator name, you can set this dynamically
    }

    /**
     * get the message envelope.
     */
    public function envelope(): envelope
    {
        return new envelope(
            subject: 'Status Update Email',
        );
    }

    /**
     * get the message content definition.
     */
    public function content(): content
    {
        return new content(
            view: 'emails.vr-company',
            with: [
                'userName' => $this->username,  // pass dynamic data to the view
                'status' => $this->status, // pass the status to the view
                'subject' => 'Status Update Email', // pass the subject to the view
                'CompanyName' => $this->companyName, // pass the operator name to the view
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
