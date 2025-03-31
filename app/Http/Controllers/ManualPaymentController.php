<?php

namespace App\Http\Controllers;


use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Models\Driver;
use App\Models\ManualPayment;
use App\Models\Operator;
use App\Models\Vehicle;
use App\Models\User;
use App\Models\Notes;
use App\Models\Mail;
use App\Models\Thread;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ManualPaymentController extends Controller
{
    public function show($operatorId)
    {
        // Fetch the vehicle with "For Payment" status
        $vehicle = Vehicle::where('operator_id', $operatorId)
            ->where('Status', 'For Payment')
            ->first();
    
        // Fetch drivers under the same vehicle that are also "For Payment"
        $driverCount = $vehicle
            ? Driver::where('operator_id', $operatorId)
                ->where('vehicle_id', $vehicle->id)
                ->where('Status', 'For Payment')
                ->count()
            : 0;
    
        // Calculate total amount based on the presence of "For Payment" drivers and vehicle
        $totalAmount = ($driverCount === 0 && !$vehicle)
            ? 6000
            : ($driverCount * 5000) + ($vehicle ? 10000 : 0);
    
        return Inertia::render('Manual-Payment', [
            'operatorId' => $operatorId,
            'totalAmount' => $totalAmount,
            'vehicle' => $vehicle,
        ]);
    }
    
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'operator_id' => 'required|exists:operators,id',
            'AccountName' => 'required|string',
            'ModePayment' => 'required|string',
            'Receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf',
            'ReferenceNumber' => 'nullable|string',
            'AccountNumber' => 'nullable|string',
            'Notes' => 'nullable|string',
            'Amount' => 'nullable|string',
        ]);

        $validatedData['Status'] = 'Pending';

        $manualPayment = ManualPayment::create($validatedData);

        if ($request->hasFile('Receipt')) {
            $media = $manualPayment->addMediaFromRequest('Receipt')->toMediaCollection('receipt', 'private');
            $manualPayment->update(['Receipt' => $media->getPath()]);
        }
        
        return response()->json([
            'message' => 'Payment recorded successfully',
            'manual_payment' => $manualPayment,
        ]);
    }

    public function rejectBilling(Request $request, Driver $driver): void 
{
    // Validate the request to ensure the note is provided
    $validated = $request->validate([
        'note' => 'nullable|string', // Ensure the note is a string and not empty
    ]);

    // Load the operator for the driver
    $driver->load('operator');

    // Ensure the driver has an associated operator
    $operator = $driver->operator; 
    if (!$operator) {
        return; 
    }
    $admin = User::find(1);

    // The payment link for the operator
    $paymentLink = env('APP_URL').'/manual-payment/operator/'.$operator->id;

    // Find the manual payment entry for this operator
    $manualPayment = ManualPayment::where('operator_id', $operator->id)
                                  ->first();

    // If a manual payment exists, update its status to 'Rejected'
    if ($manualPayment) {
        $manualPayment->Status = 'Rejected';  // Update the status to 'Rejected'
        $manualPayment->save(); // Save the updated status
    }

    // // Create the note for the operator (Note is related to operator's user_id)
    // $note = new Notes([
    //     'user_id' => $operator->user_id,  // Relating the note to the operator's user
    //     'content' => $validated['note'],  // Note content from the request
    // ]);
    // $note->save(); // Save the note to the database

    // Send rejection email notifications to all drivers with the same vehicle
    $drivers = Driver::where('vehicle_id', $driver->vehicle_id)->get();
    foreach ($drivers as $driver) {
        $recipientUser = $driver->user;
        $rejectionMessage = "Your application has been rejected. Please contact the operator for further instructions.";

        // Create a thread for the driver
        $driverThread = Thread::firstOrCreate([
            'sender_id' => $admin->id,  // Assuming admin has ID 1
            'receiver_id' => $recipientUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        // Create a mail notification for the driver
        $driverMail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $driverThread->id,
            'subject' => 'Application Rejection Notice',
            'content' => "Hello, {$recipientUser->FirstName}. {$rejectionMessage}",
            'is_read' => false,
        ]);

        // Dispatch the email notification to the driver
        MailReceive::dispatch($driverMail);

        // Dispatch the creation of a new thread if it was not recently created
        if (!$driverThread->wasRecentlyCreated) {
            NewThreadCreated::dispatch($driverThread, $recipientUser->id);
        }
    }

    // Send email to the operator about the rejected application and payment link
    $operatorUser = $operator->user;
    $operatorThread = Thread::firstOrCreate([
        'sender_id' => $admin->id ,  // Assuming admin has ID 1
        'receiver_id' => $operatorUser->id,
    ], [
        'original_sender_id' => $admin->id ,
    ]);

    // Include the note content in the email body
    $operatorMail = Mail::create([
        'sender_id' => $admin->id ,
        'thread_id' => $operatorThread->id,
        'subject' => 'Driver Application Rejection',
        'content' => "Hello, {$operatorUser->FirstName}. Your driver has had their application rejected. Please review and follow the necessary steps for further actions.<br><br>Note: sira ang note<br><br>Here is the payment link: <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>Click here to proceed</a>.",
        'is_read' => false,
    ]);

    // Dispatch the email notification to the operator
    MailReceive::dispatch($operatorMail);

    // Dispatch the creation of a new thread if it was not recently created
    if (!$operatorThread->wasRecentlyCreated) {
        NewThreadCreated::dispatch($operatorThread, $operatorUser->id);
    }
}


}
