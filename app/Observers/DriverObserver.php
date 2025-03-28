<?php

namespace App\Observers;

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Models\Driver;
use App\Models\Mail;
use App\Models\Thread;
use App\Models\User;

class DriverObserver
{
    /**
     * Handle the Driver "created" event.
     */
    public function created(Driver $driver): void
    {
        //
    }

    /**
     * Handle the Driver "updated" event.
     */
    public function updated(Driver $driver): void
    {
        $driver->load('user.driver');

        if ($driver->Status == 'For Payment') {

            // Create or find thread - using firstOrCreate to prevent duplicates
            $admin = User::find(1);
            $recipientUser = $driver->user;

            $thread = Thread::firstOrCreate([
                'sender_id' => $admin->id,
                'receiver_id' => $recipientUser->id,
            ], [
                'original_sender_id' => $admin->id,
            ]);

            // Check if this is a new thread
            $isNewThread = ! $thread->wasRecentlyCreated;

            $paymentLink = env('APP_URL').'/manual-payment/driver/'.$recipientUser->id;
            // Create the mail message
            $mail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $thread->id,
                'subject' => 'Mail for Payment Step',
                'content' => "Hello, {$recipientUser->name}. Your driver status has been updated to 'For Payment'. Please proceed to the payment step. <br><br>Please <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>click this link to pay now</a>.",
                'is_read' => false,
            ]);

            // Dispatch events
            MailReceive::dispatch($mail);

            // Only dispatch NewThreadCreated if this is a new thread
            if (! $isNewThread) {
                NewThreadCreated::dispatch($thread, $recipientUser->id);
            }

        }
    }

    /**
     * Handle the Driver "deleted" event.
     */
    public function deleted(Driver $driver): void
    {
        //
    }

    /**
     * Handle the Driver "restored" event.
     */
    public function restored(Driver $driver): void
    {
        //
    }

    /**
     * Handle the Driver "force deleted" event.
     */
    public function forceDeleted(Driver $driver): void
    {
        //
    }
}
