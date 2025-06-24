<?php

namespace App\Http\Controllers;

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Mail\RejectionEmail;
use App\Models\Driver;
use App\Models\Mail;
use App\Models\ManualPayment;
use App\Models\Notes;
use App\Models\Operator;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleRentalOwner;
use App\Models\VRCompany;
use App\Models\VrContacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail as IlluminateMail;
use Spatie\Browsershot\Browsershot;

class PendingController extends Controller
{
    public function index()
    {
        $statusValues = [];
        if (Auth::user()->hasRole(['NPTC Admin', 'NPTC Super Admin'])) {
            $statusValues = ['For NPTC Approval'];
        } elseif (Auth::user()->hasRole('VR Admin')) {
            $statusValues = ['For VR Approval', 'For Final Submission'];
        }

        // Fetch drivers with media
        $drivers = Driver::with('user')
            ->whereIn('Status', $statusValues)
            ->get()
            ->map(function ($driver) {
                $mediaCollections = ['license', 'photo', 'nbi_clearance', 'police_clearance', 'bir_clearance'];

                // Collect media files
                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($driver) {
                    return $driver->getMedia($collection)->map(fn ($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-driver-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return array_merge($driver->toArray(), ['media_files' => $mediaFiles]);
            });

        $vrCompanies = VRCompany::whereIn('Status', ['Pending'])
            ->get()
            ->map(function ($company) {
                $owner = VehicleRentalOwner::where('vr_company_id', $company->id)->with('user')->first();
                $user = $owner ? $owner->user : null;

                $vrContact = VrContacts::where('vr_company_id', $company->id)->first();

                $mediaFiles = $company->media->map(fn ($media) => [
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

        $vehicles = Vehicle::whereIn('Status', $statusValues)
            ->with(['operator.vrCompany', 'operator.user']) // Keep existing relations
            ->get()
            ->map(function ($vehicle) {
                $mediaCollections = ['front_image', 'back_image', 'left_side_image', 'right_side_image', 'or_image', 'cr_image', 'id_card_image', 'gps_certificate_image', 'inspection_certificate_image'];

                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($vehicle) {
                    return $vehicle->getMedia($collection)->map(fn ($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-vehicle-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                // Fetch drivers manually (WITHOUT modifying relationships)
                $drivers = Driver::where('vehicle_id', $vehicle->id)->with('user')->get();

                return array_merge($vehicle->toArray(), [
                    'media_files' => $mediaFiles,
                    'drivers' => $drivers->map(function ($driver) {
                        // Media collections for drivers
                        $driverMediaCollections = ['license', 'photo', 'nbi_clearance', 'police_clearance', 'bir_clearance'];

                        $driverMediaFiles = collect($driverMediaCollections)->flatMap(function ($collection) use ($driver) {
                            return $driver->getMedia($collection)->map(fn ($media) => [
                                'id' => $media->id,
                                'name' => $media->file_name,
                                'collection_name' => $media->collection_name,
                                'mime_type' => $media->mime_type,
                                'url' => route('preview-driver-media', ['mediaId' => $media->id]),
                            ]);
                        })->values();

                        return array_merge($driver->toArray(), [
                            'user_details' => $driver->user ? [
                                'id' => $driver->user->id,
                                'FirstName' => $driver->user->FirstName,
                                'LastName' => $driver->user->LastName,
                                'MiddleName' => $driver->user->MiddleName,
                                'Email' => $driver->user->email,
                                'ContactNumber' => $driver->user->ContactNumber,
                            ] : null,
                            'media_files' => $driverMediaFiles, // Add media files to the driver
                        ]);
                    }),
                ]);
            });

        $mediaCollections = ['photo', 'valid_id_front', 'valid_id_back', 'signed_management_agreement']; // you can add more collections here later if needed

        $finalSubmissionOperators = Operator::with(['user', 'vrCompany', 'media'])
            ->where('Status', 'For Final Submission')
            ->get()
            ->filter(function ($operator) {
                return $operator->hasMedia('signed_management_agreement');
            });

        $vrApprovalOperators = Operator::with(['user', 'vrCompany', 'media'])
            ->where('Status', 'For VR Approval')
            ->get();

        $operators = $finalSubmissionOperators
            ->merge($vrApprovalOperators)
            ->map(function ($operator) use ($mediaCollections) {
                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($operator) {
                    return $operator->getMedia($collection)->map(fn ($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-operator-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return array_merge($operator->toArray(), [
                    'company_name' => $operator->company->CompanyName ?? null,
                    'media_files' => $mediaFiles,
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
                $entity = Vehicle::with(['operator.user'])->find($entityId);
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
        if (! $entity) {
            return response()->json(['error' => 'Entity not found'], 404);
        }

        // Set the status to 'Rejected' and save the entity
        $entity->Status = 'Rejected';
        $entity->save();

        if ($type === 'vehicle') {
            $drivers = Driver::where('vehicle_id', $entity->id)->get();
            foreach ($drivers as $driver) {
                $driver->Status = 'Rejected';
                $driver->save();
            }
        }

        // mail to user rejection and notes
        $email = null;
        if ($type === 'vr_company') {
            $email = $entity->owner->user->email;
            $userName = $entity->owner->user->FirstName.' '.$entity->owner->user->LastName.' ';
        } else {
            $email = $entity->user->email;
            $userName = $entity->user->FirstName.' '.$entity->user->LastName.' ';
        }

        IlluminateMail::to($email)->send(new RejectionEmail($userName, $validated['note'], $type));

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
            'status' => 'sometimes|string',
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
                        'name' => $entity->user->FirstName.' '.$entity->user->LastName,
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

                    // Fetch all drivers separately since the relation was incorrect
                    $drivers = Driver::where('vehicle_id', $entity->id)->get();

                    if ($drivers->isNotEmpty()) {
                        foreach ($drivers as $driver) {
                            if ($driver->Status === 'For VR Approval') {
                                $driver->Status = 'For NPTC Approval';
                            } else {
                                $driver->Status = 'For Payment';
                            }
                            $driver->save(); // Save each driver individually
                        }
                    }
                }
                break;

            case 'vr_company':
                $entity = VRCompany::with(['owner.user'])->find($entityId);
                if ($entity) {
                    $payload = [
                        'CompanyName' => $entity->CompanyName,
                        'Owner' => $entity->owner->user->FirstName.' '.$entity->owner->user->LastName,
                        'date' => now()->format('F d, Y'),
                    ];
                    $recipientUser = $entity->owner->user;
                }
                break;

            case 'operator':
                $entity = Operator::with(['user', 'vrCompany'])->find($entityId);
                if ($entity) {
                    $payload = [
                        'name' => $entity->user->FirstName.' '.$entity->user->LastName,
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
        if (! $entity) {
            return response()->json(['error' => 'Entity not found'], 404);
        }

        // If recipient user is not found
        if (! $recipientUser) {
            return response()->json(['error' => 'Recipient user not found'], 404);
        }

        // Update entity status
        if (isset($validated['status'])) {
            $entity->Status = $validated['status'];
        } else {
            if ($entity->Status === 'For VR Approval') {
                $entity->Status = 'For NPTC Approval';
            } else {
                $entity->Status = ($type === 'vehicle') ? 'For Payment' : 'Approved';
            }
        }
        $entity->save();

        return response()->json(['message' => 'Entity approved successfully'], 200);
    }

    public function approveAndSendDocuments(Request $request)
    {

        // Validate the request data
        $validated = $request->validate([
            'id' => 'required|integer',
            'type' => 'required|string|in:driver,vehicle,vr_company,operator',
            'user_id' => 'required|integer|exists:users,id',
            'paymentId' => 'sometimes|integer|exists:manual_payments,id',
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
                        'name' => $entity->user->FirstName.' '.$entity->user->LastName,
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
                $entity = VRCompany::with(['owner.user', 'owner'])->find($entityId);
                if ($entity) {
                    $payload = [
                        'CompanyName' => $entity->CompanyName,
                        'Owner' => $entity->owner->user->FirstName.' '.$entity->owner->user->LastName,
                        'date' => now()->format('F d, Y'),
                    ];
                    $recipientUser = $entity->owner->user;

                    $entity->owner->Status = 'Approved';
                    $entity->owner->save();
                }
                break;

            case 'operator':
                $entity = Operator::with(['user', 'vrCompany', 'drivers'])->find($entityId);
                $adminId = $entity->vrCompany->owner->user->id;
                $admin = User::find($adminId);
                if ($entity) {
                    if($entity === 'For Final Submission'){
                        //Change the status to Approved
                        $operator = Operator::find($entity->id);
                        $operator->Status = "Approved";
                        $operator->save();

                    } else if ($entity->Status === 'For Vehicle Registration') {
                        // If operator is already approved, process the drivers
                        $processedDrivers = [];
                        if ($entity->drivers->isNotEmpty()) {
                            foreach ($entity->drivers as $driver) {

                                if ($driver->Status === 'For Payment') {
                                    // Update driver status directly in DB
                                    DB::table('drivers')
                                        ->where('id', $driver->id)
                                        ->update(['Status' => 'Approved']);

                                    // Update vehicle status if exists
                                    if ($driver->vehicle_id) {
                                        DB::table('vehicles')
                                            ->where('id', $driver->vehicle_id)
                                            ->update(['Status' => 'Approved']);
                                    }

                                    // Reload the driver with relationships
                                    $updatedDriver = Driver::with(['user', 'vrCompany', 'vehicle', 'operator'])->find($driver->id);
                                    $vehicle = Vehicle::find($driver->vehicle_id);

                                    $operator = Operator::find($entity->id);
                                    $operator->Status = 'For Final Submission';
                                    $operator->save();


                                    if (isset($validated['paymentId'])) {

                                        $manualPayment = ManualPayment::find($validated['paymentId']);

                                        if (! $manualPayment) {
                                            return response()->json(['error' => 'Manual payment not found'], 404);
                                        }

                                        $manualPayment->Status = 'Approved';
                                        $manualPayment->save();

                                    }


                                    $payload = [
                                        'name' => $updatedDriver->user->FirstName.' '.$updatedDriver->user->LastName,
                                        'company' => $entity->vrCompany->CompanyName,
                                        'vehicle' => $vehicle->PlateNumber ?? '',
                                        'model' => $vehicle->Model ?? '',
                                        'date' => now()->format('F d, Y'),
                                    ];

                                    // Send certificate for each driver
                                    $this->sendCertificateMail(
                                        'driver',
                                        $payload,
                                        $admin,
                                        $updatedDriver->user,
                                        $updatedDriver->id
                                    );

                                    // send to operator
                                    $this->sendCertificateMail(
                                        'driver',
                                        $payload,
                                        $admin,
                                        $updatedDriver->operator->user,
                                        $entity->id
                                    );

                                    $processedDrivers[] = $updatedDriver->id;


                                }
                            }
                        }

                    } else {
                        // Update operator status directly in DB

                            $operator = Operator::find($entity->id);

                        if($operator->Status === "For Payment"){
                            $operator->Status = 'For Vehicle Registration';
                            $operator->save();
                        }else if($operator->Status === "For Vehicle Registration") {
                            $operator->Status = 'For Final Submission';
                            $operator->save();
                        }


                        if (isset($validated['paymentId'])) {

                            $manualPayment = ManualPayment::find($validated['paymentId']);

                            if (! $manualPayment) {
                                return response()->json(['error' => 'Manual payment not found'], 404);
                            }

                            $manualPayment->Status = 'Approved';
                            $manualPayment->save();

                        }

                        // $payload = [
                        //     'name' => $entity->user->FirstName.' '.$entity->user->LastName,
                        //     'company' => $entity->vrCompany->CompanyName,
                        //     'date' => now()->format('F d, Y'),
                        // ];
                        //
                        // // Call the mail sending function for operator
                        // $result = $this->sendCertificateMail(
                        //     'operator',
                        //     $payload,
                        //     $admin,
                        //     $entity->user,
                        //     $entity->id
                        // );

                    }

                    $recipientUser = $entity->user;
                }
                break;

            default:
                return response()->json(['error' => 'Invalid entity type'], 400);
        }

        // If entity is not found, return an error message
        if (! $entity) {
            return response()->json(['error' => 'Entity not found'], 404);
        }

        // If recipient user is not found
        if (! $recipientUser) {
            return response()->json(['error' => 'Recipient user not found'], 404);
        }

        if($type !== 'operator'){

            $entity->Status = 'Approved';
            $entity->save();

            if (isset($validated['paymentId'])) {

                $manualPayment = ManualPayment::find($validated['paymentId']);

                if (! $manualPayment) {
                    return response()->json(['error' => 'Manual payment not found'], 404);
                }

                $manualPayment->Status = 'Approved';
                $manualPayment->save();

            }

            // Send certificate mail
            try {
                $admin = User::find($validated['user_id']);
                if (! $admin) {
                    return response()->json(['error' => 'Admin user not found'], 404);
                }

                // Call the separated mail sending function
                $result = $this->sendCertificateMail(
                    type: $type,
                    payload: $payload,
                    admin: $admin,
                    recipientUser: $recipientUser,
                    entityId: $entity->id
                );

                return response()->json([
                    'message' => 'Entity approved and certificate sent via mail system',
                    'thread_id' => $result['thread_id'],
                    'is_new_thread' => $result['is_new_thread'],
                ], 200);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Failed to process certificate',
                    'message' => $e->getMessage(),
                ], 500);
            }
    }
    }

    /**
     * Send certificate mail with PDF attachment
     *
     * @param  string  $type  The entity type (driver, vehicle, vr_company, operator)
     * @param  array  $payload  The data for the certificate template
     * @param  User  $admin  The admin user who is approving
     * @param  User  $recipientUser  The user receiving the certificate
     * @param  int  $entityId  The ID of the entity being approved
     * @return array Result containing thread_id and is_new_thread
     *
     * @throws \Exception
     */
    protected function sendCertificateMail(string $type, array $payload, User $admin, User $recipientUser, int $entityId): array
    {
        $template = null;
        $certificateName = null;

        // Convert images to base64
        $logoPath = public_path('assets/NPTC_Logo.png');
        $bgPath = public_path('bg-cert.png');

        $logoImage = 'data:image/png;base64,'.base64_encode(file_get_contents($logoPath));
        $bgImage = 'data:image/png;base64,'.base64_encode(file_get_contents($bgPath));

        // Determine template and certificate name based on type
        switch ($type) {
            case 'operator':
                $template = view('nptc-operator-certificate', [
                    'payload' => $payload,
                    'logoImage' => $logoImage,
                    'bgImage' => $bgImage,
                ])->render();
                $certificateName = 'Operator_Certificate.pdf';
                break;
            case 'vr_company':
                $template = view('nptc-vr-company-certificate', [
                    'payload' => $payload,
                    'logoImage' => $logoImage,
                    'bgImage' => $bgImage,
                ])->render();
                $certificateName = 'VR_Company_Certificate.pdf';
                break;
            case 'driver':
                $template = view('nptc-driver-certificate', [
                    'payload' => $payload,
                    'logoImage' => $logoImage,
                    'bgImage' => $bgImage,
                ])->render();
                $certificateName = 'Driver_Certificate.pdf';
                break;
            case 'vehicle':
                $template = view('nptc-vehicle-certificate', [
                    'payload' => $payload,
                    'logoImage' => $logoImage,
                    'bgImage' => $bgImage,
                ])->render();
                $certificateName = 'Vehicle_Certificate.pdf';
                break;
        }

        // Generate PDF
        $pdfPath = storage_path('app/certificates/'.$entityId.'_certificate.pdf');

        Browsershot::html($template)
            ->noSandbox()
            ->showBackground()
            ->setOption('args', ['--no-sandbox', '--disable-setuid-sandbox'])
            ->waitUntilNetworkIdle()
            ->save($pdfPath);

        // Rest of your method remains the same...
        $subject = match ($type) {
            'driver' => 'Driver Certificate Approval',
            'vehicle' => 'Vehicle Certificate Approval',
            'vr_company' => 'VR Company Certificate Approval',
            'operator' => 'Operator Certificate Approval',
            default => 'Certificate Approval'
        };

        $thread = Thread::firstOrCreate([
            'sender_id' => $admin->id,
            'receiver_id' => $recipientUser->id,
        ], [
            'original_sender_id' => $admin->id,
        ]);

        $isNewThread = ! $thread->wasRecentlyCreated;

        $mail = Mail::create([
            'sender_id' => $admin->id,
            'thread_id' => $thread->id,
            'subject' => $subject,
            'content' => "Your {$type} certificate has been approved. Please find the attached certificate.",
            'is_read' => false,
        ]);

        $mail->addMedia($pdfPath)
            ->usingFileName($certificateName)
            ->toMediaCollection('attachments');

        MailReceive::dispatch($mail);

        if (! $isNewThread) {
            NewThreadCreated::dispatch($thread, $recipientUser->id);
        }

        return [
            'thread_id' => $thread->id,
            'is_new_thread' => ! $isNewThread,
        ];
    }
}
