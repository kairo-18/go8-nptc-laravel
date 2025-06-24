<?php

namespace App\Http\Controllers;

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Models\Driver;
use App\Models\Mail;
use App\Models\ManualPayment;
use App\Models\Notes;
use App\Models\Operator;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vehicle;
use app\Models\VehicleRentalOwner;
use app\Models\VRCompany;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $totalAmount = ($driverCount === 0 && ! $vehicle)
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

    return back()->with([
     'success' => true,
     'message' => 'Payment recorded successfully'
     ]);
}

    public function rejectBilling(Request $request, $id): void
{
    // Validate the request to ensure the note is provided
    $validated = $request->validate([
        'note' => 'required|string',
    ]);

    $admin = User::find(1); // replace with auth()->user() later

    // First try to find a Driver
    $driver = Driver::find($id);
    
    if ($driver) {
        // Handle driver rejection
        $driver->load('operator');
        $operator = $driver->operator;

        if (!$operator) {
            return;
        }

        $paymentLink = env('APP_URL').'/manual-payment/operator/'.$operator->id;

        // Update manual payment status if exists
        $manualPayment = ManualPayment::where('operator_id', $operator->id)->first();
        if ($manualPayment) {
            $manualPayment->Status = 'Rejected';
            $manualPayment->save();
        }

        // Notify all drivers with the same vehicle
        $drivers = Driver::where('vehicle_id', $driver->vehicle_id)->get();
        foreach ($drivers as $driver) {
            $recipientUser = $driver->user;
            $rejectionMessage = 'Your application has been rejected. Please contact the operator for further instructions.';

            $driverThread = Thread::firstOrCreate([
                'sender_id' => $admin->id,
                'receiver_id' => $recipientUser->id,
            ], [
                'original_sender_id' => $admin->id,
            ]);

            $driverMail = Mail::create([
                'sender_id' => $admin->id,
                'thread_id' => $driverThread->id,
                'subject' => 'Application Rejection Notice',
                'content' => "Hello, {$recipientUser->FirstName}. {$rejectionMessage}",
                'is_read' => false,
            ]);

            MailReceive::dispatch($driverMail);

            if (!$driverThread->wasRecentlyCreated) {
                NewThreadCreated::dispatch($driverThread, $recipientUser->id);
            }
        }

        // Notify operator
        $operatorUser = $operator->user;
        $operatorThread = Thread::firstOrCreate([
            'sender_id' => $admin->id,
            'receiver_id' => $operatorUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        $operatorMail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $operatorThread->id,
            'subject' => 'Driver Application Rejection',
            'content' => "Hello, {$operatorUser->FirstName}. Your driver has had their application rejected. Please review and follow the necessary steps for further actions.<br><br>Note: ".($validated['note'] ?? 'No additional notes provided.')." <br><br>Here is the payment link: <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>Click here to proceed</a>.",
            'is_read' => false,
        ]);

        MailReceive::dispatch($operatorMail);

        if (!$operatorThread->wasRecentlyCreated) {
            NewThreadCreated::dispatch($operatorThread, $operatorUser->id);
        }
    } 
    // If not a Driver, try to find an Operator
    else {
        $operator = Operator::find($id);
        
        if (!$operator) {
            throw new \InvalidArgumentException('No Driver or Operator found with the given ID');
        }

        // OPERATOR REJECTION LOGIC
        $paymentLink = env('APP_URL').'/manual-payment/operator/'.$operator->id;

        // Update manual payment status if exists
        $manualPayment = ManualPayment::where('operator_id', $operator->id)->first();
        if ($manualPayment) {
            $manualPayment->Status = 'Rejected';
            $manualPayment->save();
        }

        // Notify operator
        $operatorUser = $operator->user;
        $operatorThread = Thread::firstOrCreate([
            'sender_id' => $admin->id,
            'receiver_id' => $operatorUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        $operatorMail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $operatorThread->id,
            'subject' => 'Operator Billing Rejection',
            'content' => "Hello, {$operatorUser->FirstName}. Your operator billing has been rejected. Please review and follow the necessary steps for further actions.<br><br>Note: ".($validated['note'] ?? 'No additional notes provided.')." <br><br>Here is the payment link: <a href='{$paymentLink}' style='color: #2563eb; text-decoration: underline;'>Click here to proceed</a>.",
            'is_read' => false,
        ]);

        MailReceive::dispatch($operatorMail);

        if (!$operatorThread->wasRecentlyCreated) {
            NewThreadCreated::dispatch($operatorThread, $operatorUser->id);
        }

        // NEW: Notify VRCompany if operator belongs to one (ONLY IN OPERATOR REJECTION CASE)
        if ($operator->vr_company_id) {
            $vrOwner = VehicleRentalOwner::where('vr_company_id', $operator->vr_company_id)
                ->with('user')
                ->first();
            
            if ($vrOwner && $vrOwner->user) {
                $vrThread = Thread::firstOrCreate([
                    'sender_id' => $admin->id,
                    'receiver_id' => $vrOwner->user->id,
                ], [
                    'original_sender_id' => $admin->id,
                ]);

                $vrMail = Mail::create([
                    'sender_id' => $admin->id,
                    'thread_id' => $vrThread->id,
                    'subject' => 'Operator Billing Rejection Notice',
                    'content' => "Hello, {$vrOwner->user->FirstName}. An operator under your VRCompany has had their billing rejected.<br><br>Operator: {$operatorUser->FirstName} {$operatorUser->LastName}<br>Note: ".($validated['note'] ?? 'No additional notes provided.')." ",
                    'is_read' => false,
                ]);

                MailReceive::dispatch($vrMail);

                if (!$vrThread->wasRecentlyCreated) {
                    NewThreadCreated::dispatch($vrThread, $vrOwner->user->id);
         }
    }
}
 }
}
}
