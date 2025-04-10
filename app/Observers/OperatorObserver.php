<?php

namespace App\Observers;

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Mail\StatusEmail;
use App\Models\Mail;
use App\Models\Operator;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Support\Facades\Mail as IlluminateMail;

class OperatorObserver
{
    /**
     * Handle the Operator "created" event.
     */
    public function created(Operator $operator): void
    {
        //
    }

    /**
     * Handle the Operator "updated" event.
     */
    public function updated(Operator $operator): void
    {
        $operator->load('user.operator', 'user');

        if ($operator->isDirty('Status')) {
            $email = $operator->user->email;
            $userName = $operator->user->FirstName.' '.$operator->user->LastName.' ';

            IlluminateMail::to($email)->send(new StatusEmail($userName, $operator->Status));
        }

        if ($operator->Status == 'For Payment') {

            // Create or find thread - using firstOrCreate to prevent duplicates
            $admin = User::find(1);
            $recipientUser = $operator->user;

            $thread = Thread::firstOrCreate([
                'sender_id' => $admin->id,
                'receiver_id' => $recipientUser->id,
            ], [
                'original_sender_id' => $admin->id,
            ]);

            // Check if this is a new thread
            $isNewThread = ! $thread->wasRecentlyCreated;

            $paymentLink = env('APP_URL').'/manual-payment/operator/'.$operator->id;
            // Create the mail message
            $mail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $thread->id,
                'subject' => 'Mail for Payment Step',
                'content' => "Hello, {$recipientUser->name}. Your operator status has been updated to 'For Payment'. Please proceed to the payment step. Contact Number: ".$operator->vrCompany->owner->user->ContactNumber.' Name: '.$operator->vrCompany->owner->user->FirstName.' '.$operator->vrCompany->owner->user->LastName.' '."<br><br>Please <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>click this link to pay now</a>.",
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
     * Handle the Operator "deleted" event.
     */
    public function deleted(Operator $operator): void
    {
        //
    }

    /**
     * Handle the Operator "restored" event.
     */
    public function restored(Operator $operator): void
    {
        //
    }

    /**
     * Handle the Operator "force deleted" event.
     */
    public function forceDeleted(Operator $operator): void
    {
        //
    }
}
