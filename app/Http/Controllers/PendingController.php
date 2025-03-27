<?php

namespace App\Http\Controllers;

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\VRCompany;
use App\Models\Vehicle;
use App\Models\Operator;
use App\Models\VehicleRentalOwner;
use App\Models\VrContacts;
use App\Models\Notes;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Spatie\Browsershot\Browsershot;
use App\Models\Mail;
use App\Models\Thread;

class PendingController extends Controller
{
    public function index()
    {
        // Fetch drivers with media
        $drivers = Driver::with('user')
            ->whereIn('Status', ['Pending', 'For Payment'])
            ->get()
            ->map(function ($driver) {
                $mediaCollections = ['license', 'photo', 'nbi_clearance', 'police_clearance', 'bir_clearance'];

                // Collect media files
                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($driver) {
                    return $driver->getMedia($collection)->map(fn($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-driver-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return array_merge($driver->toArray(), ['media_files' => $mediaFiles]);
            });

        $vrCompanies = VRCompany::whereIn('Status', ['Pending', 'For Payment'])
        ->get()
        ->map(function ($company) {
            $owner = VehicleRentalOwner::where('vr_company_id', $company->id)->with('user')->first();
            $user = $owner ? $owner->user : null;

            $vrContact = VrContacts::where('vr_company_id',$company->id)->first();

            $mediaFiles = $company->media->map(fn($media) => [
                'id' => $media->id,
                'name' => $media->file_name,
                'collection_name' => $media->collection_name,
                'mime_type' => $media->mime_type,
                'url' => route('preview-media', ['mediaId' => $media->id]),
            ])->values();

            return array_merge($company->toArray(), [
                'media_files' => $mediaFiles,
                'owner_details' => $user ? [
                    'id' => $owner->id,
                    'FirstName' => $user->FirstName,
                    'LastName' => $user->LastName,
                    'MiddleName' => $user->MiddleName,
                    'Email' => $user->email,
                    'ContactNumber' => $user->ContactNumber,
                ] : null,
                'contact_details' => $vrContact ? $vrContact->toArray() : null,
            ]);
        });

        $vehicles = Vehicle::whereIn('Status', ['Pending', 'For Payment'])
            ->get()
            ->map(function ($vehicle) {
                $mediaCollections = ['front_image', 'back_image', 'left_side_image', 'right_side_image', 'or_image', 'cr_image', 'id_card_image', 'gps_certificate_image', 'inspection_certificate_image'];

                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($vehicle) {
                    return $vehicle->getMedia($collection)->map(fn($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-vehicle-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return array_merge($vehicle->toArray(), ['media_files' => $mediaFiles]);
            });

            $operators = Operator::with(['user', 'vrCompany'])
            ->whereIn('Status', ['Pending', 'For Payment'])  // Still filtering operators by their own status
            ->get();



        $operators = $operators->map(function ($operator) {
        return array_merge($operator->toArray(), [
            'company_name' => $operator->company->CompanyName ?? null,
        ]);
        });

        return response()->json([
            'drivers' => $drivers,
            'vrCompanies' => $vrCompanies,
            'vehicles' => $vehicles,
            'operators' => $operators,
        ]);
    }
    public function rejection(Request $request)
{
    // Validate the request data
    $validated = $request->validate([
        'id' => 'required|integer',
        'type' => 'required|string|in:driver,vehicle,vr_company,operator',
        'note' => 'required|string|max:255',
        'user_id' => 'required|integer|exists:users,id',
    ]);

    $entity = null;
    $type = $validated['type'];
    $entityId = $validated['id'];

    // Switch case to find the entity by type
    switch ($type) {
        case 'driver':
            $entity = Driver::find($entityId);
            break;

        case 'vehicle':
            $entity = Vehicle::find($entityId);
            break;

        case 'vr_company':
            $entity = VRCompany::find($entityId);
            break;

        case 'operator':
            $entity = Operator::find($entityId);
            break;

        default:
            return response()->json(['error' => 'Invalid entity type'], 400);
    }

    // If entity is not found, return an error message
    if (!$entity) {
        return response()->json(['error' => 'Entity not found'], 404);
    }

    // Set the status to 'Rejected' and save the entity
    $entity->Status = 'Rejected';
    $entity->save();

    // Create the rejection note
    Notes::create([
        'note' => $validated['note'],
        'user_id' => $validated['user_id'],
    ]);

    // Return a success response
    return response()->json(['message' => 'Entity rejected and note created successfully'], 200);
}
public function approval(Request $request)
{
    // Validate the request data
    $validated = $request->validate([
        'id' => 'required|integer',
        'type' => 'required|string|in:driver,vehicle,vr_company,operator',
        'user_id' => 'required|integer|exists:users,id',
    ]);

    $entity = null;
    $type = $validated['type'];
    $entityId = $validated['id'];
    $payload = [];
    $recipientUser = null;

    // Switch case to find the entity by type
    switch ($type) {
        case 'driver':
            $entity = Driver::with(['user', 'vrCompany'])->find($entityId);
            if ($entity) {
                $payload = [
                    'name' => $entity->user->FirstName . ' ' . $entity->user->LastName,
                    'company' => $entity->vrCompany->CompanyName,
                    'date' => now()->format('F d, Y'),
                ];
                $recipientUser = $entity->user;
            }
            break;

        case 'vehicle':
            $entity = Vehicle::with(['operator.vrCompany', 'operator.user'])->find($entityId);
            if ($entity) {
                $payload = [
                    'PlateNumber' => $entity->PlateNumber,
                    'company' => $entity->operator->vrCompany->CompanyName,
                    'date' => now()->format('F d, Y'),
                ];
                $recipientUser = $entity->operator->user;
            }
            break;

        case 'vr_company':
            $entity = VRCompany::with(['owner.user'])->find($entityId);
            if ($entity) {
                $payload = [
                    'CompanyName' => $entity->CompanyName,
                    'Owner' => $entity->owner->user->FirstName . ' ' . $entity->owner->user->LastName,
                    'date' => now()->format('F d, Y'),
                ];
                $recipientUser = $entity->owner->user;
            }
            break;

        case 'operator':
            $entity = Operator::with(['user', 'vrCompany'])->find($entityId);
            if ($entity) {
                $payload = [
                    'name' => $entity->user->FirstName . ' ' . $entity->user->LastName,
                    'company' => $entity->vrCompany->CompanyName,
                    'date' => now()->format('F d, Y'),
                ];
                $recipientUser = $entity->user;
            }
            break;

        default:
            return response()->json(['error' => 'Invalid entity type'], 400);
    }

    // If entity is not found, return an error message
    if (!$entity) {
        return response()->json(['error' => 'Entity not found'], 404);
    }

    // If recipient user is not found
    if (!$recipientUser) {
        return response()->json(['error' => 'Recipient user not found'], 404);
    }

    // Update entity status
    $entity->Status = ($type === 'vehicle') ? 'For Payment' : 'Approved';
    $entity->save();

    try {
        $template = null;
        $certificateName = null;

        switch ($type) {
            case 'operator':
                $template = view('nptc-operator-certificate', ['payload' => $payload])->render();
                $certificateName = 'Operator_Certificate.pdf';
                break;
            case 'vr_company':
                $template = view('nptc-vr-company-certificate', ['payload' => $payload])->render();
                $certificateName = 'VR_Company_Certificate.pdf';
                break;
            case 'driver':
                $template = view('nptc-driver-certificate', ['payload' => $payload])->render();
                $certificateName = 'Driver_Certificate.pdf';
                break;
            case 'vehicle':
                $template = view('nptc-vehicle-certificate', ['payload' => $payload])->render();
                $certificateName = 'Vehicle_Certificate.pdf';
                break;
        }

        // Generate PDF
        $pdfPath = storage_path('app/certificates/' . $entity->id . '_certificate.pdf');
        Browsershot::html($template)
            ->noSandbox()
            ->save($pdfPath);

        $admin = User::find($validated['user_id']);
        if (!$admin) {
            return response()->json(['error' => 'Admin user not found'], 404);
        }

        $subject = match($type) {
            'driver' => 'Driver Certificate Approval',
            'vehicle' => 'Vehicle Certificate Approval',
            'vr_company' => 'VR Company Certificate Approval',
            'operator' => 'Operator Certificate Approval',
            default => 'Certificate Approval'
        };

        // Create or find thread - using firstOrCreate to prevent duplicates
        $thread = Thread::firstOrCreate([
            'sender_id' => $admin->id,
            'receiver_id' => $recipientUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        // Check if this is a new thread
        $isNewThread = !$thread->wasRecentlyCreated;

        // Create the mail message
        $mail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $thread->id,
            'subject' => $subject,
            'content' => "Your {$type} certificate has been approved. Please find the attached certificate.",
            'is_read' => false,
        ]);

        // Attach the PDF to the mail
        $mail->addMedia($pdfPath)
            ->usingFileName($certificateName)
            ->toMediaCollection('attachments');

        // Dispatch events
        MailReceive::dispatch($mail);

        // Only dispatch NewThreadCreated if this is a new thread
        if (!$isNewThread) {
            NewThreadCreated::dispatch($thread, $recipientUser->id);
        }

        return response()->json([
            'message' => 'Entity approved and certificate sent via mail system',
            'thread_id' => $thread->id,
            'is_new_thread' => !$isNewThread
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to process certificate',
            'message' => $e->getMessage()
        ], 500);
    }
}



}
