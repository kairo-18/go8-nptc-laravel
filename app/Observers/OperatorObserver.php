<?php

namespace App\Observers;

use App\Events\MailReceive;
use Illuminate\Support\Facades\File;
use App\Events\NewThreadCreated;
use App\Mail\StatusEmail;
use App\Models\Mail;
use App\Models\Operator;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Support\Facades\Mail as IlluminateMail;
use Spatie\Browsershot\Browsershot;

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

        if($operator->Status === 'For Vehicle Registration'){
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

            $mail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $thread->id,
                'subject' => 'Mail for Driver and Vehicle Registration',
                'content' =>  'Please Register your vehicle and driver',
                'is_read' => false,
            ]);

            // Dispatch events
            MailReceive::dispatch($mail);
        }

        if($operator->Status === 'For Final Submission'){
            $ownerAddress = $operator->vrCompany->owner->Address ?? 'No address submitted';
            $companyLogo = $operator->vrCompany->getFirstMedia('brand_logo');
            $ownerContact = $operator->vrCompany->owner->user->ContactNumber ?? 'No contact number submitted';
            $BusinessPermitNumber = $operator->vrCompany->BusinessPermitNumber ?? 'No business permit number submitted';

            $vehicle = $operator->vehicles->first();

            $payload = [
                'operator_name' => $operator->user->FirstName.' '.$operator->user->LastName,
                'owner_name' => $operator->vrCompany->owner->user->FirstName.' '.$operator->vrCompany->owner->user->LastName,
                'company' => $operator->vrCompany->CompanyName,
                'owner_address' => $ownerAddress,
                'company_logo' => $companyLogo?->getUrl(),
                'owner_contact' => $ownerContact,
                'business_permit_number' => $BusinessPermitNumber,
                'vehicle_make' => $vehicle->Model ?? '',
                'vehicle_body' => 'Van',
                'vehicle_year' => '2022',
                'vehicle_chassis_number' => 'JN1TC2E26Z0082026',
                'vehicle_engine_number'=> 'YD25109055B',
                'vehicle_plate_number' => $vehicle->PlateNumber ?? 'No plate number submitted',
                'vehicle_color' => 'White',
                'date' => now()->format('F d, Y'),
            ];


            $template = view('management-agreement-form', [
                    'payload' => $payload,
            ])->render();
            $directory = storage_path('app/certificates');

            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true); // recursive = true
            }

            $fileName = 'Management-Agreement-Form.pdf';
            $pdfPath = storage_path('app/certificates/'.$operator->id.'-'. $fileName .'.pdf');

            Browsershot::html($template)
                ->noSandbox()
                ->showBackground()
                ->setOption('args', ['--no-sandbox', '--disable-setuid-sandbox'])
                ->waitUntilNetworkIdle()
                ->save($pdfPath);

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

            $uploadManagementFormLink = env('APP_URL').'/management-form-upload/operator/'.$operator->id;
            // Create the mail message
            $mail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $thread->id,
                'subject' => 'Mail for Management Form Upload',
                'content' => "Hello, {$recipientUser->name}. Your operator status has been updated to 'For Final Submission'. Please proceed to the uploading step. " . "<br><br>Please <a href='{$uploadManagementFormLink}' style='color: #2563eb; text-decoration: underline;'>click this link to upload your form now so you can be approved.</a>. <br><br> This is your management form please print and sign it then upload.",
                'is_read' => false,
            ]);


            $mail->addMedia($pdfPath)
                ->usingFileName($fileName)
                ->toMediaCollection('attachments');

            // Dispatch events
            MailReceive::dispatch($mail);

            // Only dispatch NewThreadCreated if this is a new thread
            if (! $isNewThread) {
                NewThreadCreated::dispatch($thread, $recipientUser->id);
            }


        }

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
