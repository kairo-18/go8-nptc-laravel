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
    $driver->load('user.driver', 'operator');
    
    if ($driver->Status == 'For Payment') {
        $admin = User::find(1);
        $operator = $driver->operator; 
        
        if (!$operator) {
            return; 
        }
        
        $operatorUser = $operator->user;
        $paymentLink = env('APP_URL').'/manual-payment/operator/'.$operator->id;

        // Get all drivers with the same vehicle
        $drivers = Driver::where('vehicle_id', $driver->vehicle_id)->get();

        foreach ($drivers as $driver) {
            $recipientUser = $driver->user;

            // Create a thread for each driver
            $driverThread = Thread::firstOrCreate([
                'sender_id' => $admin->id,
                'receiver_id' => $recipientUser->id,
            ], [
                'original_sender_id' => $admin->id,
            ]);

            $driverMail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $driverThread->id, 
                'subject' => 'Application Payment Notice',
                'content' => "Hello, {$recipientUser->FirstName}. Your application is now prompted for payment. Please contact your operator for further instructions.",
                'is_read' => false,
            ]);

            // Dispatch the driver's email
            MailReceive::dispatch($driverMail);

            // Check if the thread was already created for this driver
            if (!$driverThread->wasRecentlyCreated) {
                NewThreadCreated::dispatch($driverThread, $recipientUser->id);
            }
        }

        // Create a thread for the operator
        $operatorThread = Thread::firstOrCreate([
            'sender_id' => $admin->id,
            'receiver_id' => $operatorUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        $operatorMail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $operatorThread->id, 
            'subject' => 'Driver Payment Required',
            'content' => "Hello, {$operatorUser->FirstName}. Your driver has been prompted for payment. Please provide the necessary instructions.<br><br>Here is the payment link: <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>Click here to proceed</a>.",
            'is_read' => false,
        ]);

        // Dispatch the operator's email
        MailReceive::dispatch($operatorMail);

        // Check if the thread was already created for this operator
        if (!$operatorThread->wasRecentlyCreated) {
            NewThreadCreated::dispatch($operatorThread, $operatorUser->id);
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
