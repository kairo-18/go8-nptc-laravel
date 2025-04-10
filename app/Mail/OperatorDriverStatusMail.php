<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OperatorDriverStatusMail extends Mailable
{
    use queueable, serializesmodels;

    /**
     * create a new message instance.
     */
    public $username;

    public $status;

    public $operatorname;

    public $platenumber;

    public function __construct($operatorname, $username, $status, $platenumber)
    {
        $this->username = $username;
        $this->status = $status; // example status, you can set this dynamically
        $this->operatorname = $operatorname; // example operator name, you can set this dynamically
        $this->platenumber = $platenumber; // example plate number, you can set this dynamically
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
            view: 'emails.operator-driver',
            with: [
                'userName' => $this->username,  // pass dynamic data to the view
                'status' => $this->status, // pass the status to the view
                'subject' => 'Status Update Email', // pass the subject to the view
                'operatorName' => $this->operatorname, // pass the operator name to the view
                'PlateNumber' => $this->platenumber, // pass the plate number to the view
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
