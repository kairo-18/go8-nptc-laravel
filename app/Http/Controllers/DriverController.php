<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Trip;
use App\Models\Passenger;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;


class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $driversQuery = Driver::with(['user', 'operator.user', 'vrCompany']);

        // If an ID is provided in the query, filter by that ID
        if ($request->has('id')) {
            $driversQuery->where('id', $request->input('id'));
        }

        // Get the drivers
        $drivers = $driversQuery->get()
            ->map(function ($driver) {
                $mediaCollections = ['license', 'photo', 'nbi_clearance', 'police_clearance', 'bir_clearance'];

                // Flatten media collections into a single array
                $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($driver) {
                    return $driver->getMedia($collection)->map(fn($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-driver-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return [
                    'NPTC_ID'=>$driver->NPTC_ID,
                    'id' => $driver->id,
                    'FirstName' => $driver->user->FirstName,
                    'MiddleName' => $driver->user->MiddleName,
                    'LastName' => $driver->user->LastName,
                    'username' => $driver->user->username,
                    'Address' => $driver->user->Address,
                    'BirthDate' => $driver->user->BirthDate,
                    'email' => $driver->user->email,
                    'ContactNumber' => $driver->user->ContactNumber,
                    'password' => $driver->user->password,
                    'LicenseNumber' => $driver->LicenseNumber,
                    'Status' => $driver->Status,
                    'operator' => $driver->operator ? [
                        'id' => $driver->operator->id,
                        'FirstName' => $driver->operator->user->FirstName ?? 'N/A',
                        'LastName' => $driver->operator->user->LastName ?? 'N/A',
                    ] : null,
                    'vrCompany' => $driver->vrCompany ? [
                        'id' => $driver->vrCompany->id,
                        'CompanyName' => $driver->vrCompany->CompanyName ?? 'N/A',
                    ] : null,
                    'media_files' => $mediaFiles,
                ];
            });

        return Inertia::render('drivers', [
            'drivers' => $drivers,
        ]);
    }


    public function store(Request $request)
    {
        // Validate input fields and file uploads
        $validatedData = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'FirstName' => 'required|string',
            'MiddleName'=>'required|string',
            'LastName' => 'required|string',
            'Address' => 'required|string',
            'BirthDate' => 'required|date',
            'ContactNumber' => 'required|string',
            'password' => 'required|string|min:6',

            'operator_id' => 'required|exists:operators,id',
            'vr_company_id' => 'required|exists:vr_companies,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'LicenseNumber' => 'nullable|string|unique:drivers,LicenseNumber',

            'License' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'Photo' => 'nullable|file|mimes:jpg,png|max:1024',
            'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // Create the user
        $user = User::create([
            'username' => $validatedData['username'],
            'email' => $validatedData['email'],
            'FirstName' => $validatedData['FirstName'],
            'MiddleName'=>$validatedData['MiddleName'],
            'LastName' => $validatedData['LastName'],
            'Address' => $validatedData['Address'],
            'BirthDate' => $validatedData['BirthDate'],
            'ContactNumber' => $validatedData['ContactNumber'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $user->assignRole('Driver');

        $driver = $user->driver()->create([
            'operator_id' => $validatedData['operator_id'],
            'vr_company_id' => $validatedData['vr_company_id'],
            'vehicle_id' => $validatedData['vehicle_id'] ?? null,
            'LicenseNumber' => $validatedData['LicenseNumber'] ?? null,
            'Status' => 'Pending',
        ]);


        if (!empty($validatedData['vehicle_id'])) {
            Vehicle::where('id', $validatedData['vehicle_id'])->update(['driver_id' => $driver->id]);
        }


        // File uploads and storing the path under "license"
        if ($request->hasFile('License')) {
            $media = $driver->addMediaFromRequest('License')->toMediaCollection('license', 'private');
            $driver->update(['License' => $media->getPath()]); // Store file path in the "License" column
        }
        if ($request->hasFile('Photo')) {
            $media = $driver->addMediaFromRequest('Photo')->toMediaCollection('photo', 'private');
            $driver->update(['Photo' => $media->getPath()]);
        }
        if ($request->hasFile('NBI_clearance')) {
            $media = $driver->addMediaFromRequest('NBI_clearance')->toMediaCollection('nbi_clearance', 'private');
            $driver->update(['NBI_clearance' => $media->getPath()]);
        }
        if ($request->hasFile('Police_clearance')) {
            $media = $driver->addMediaFromRequest('Police_clearance')->toMediaCollection('police_clearance', 'private');
            $driver->update(['Police_clearance' => $media->getPath()]);
        }
        if ($request->hasFile('BIR_clearance')) {
            $media = $driver->addMediaFromRequest('BIR_clearance')->toMediaCollection('bir_clearance', 'private');
            $driver->update(['BIR_clearance' => $media->getPath()]);
        }

        return response()->json([
            'message' => 'Driver created successfully',
            'user' => $user,
            'driver' => $driver
        ], 201);
    }

    public function updateDriverMedia(Request $request, Driver $driver){

        // Validate request
        $request->validate([

            'License' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'Photo' => 'nullable|file|mimes:jpg,png|max:2048',
            'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // File collections mapping
        $files = [
            'License' => 'license',
            'Photo' => 'photo',
            'NBI_clearance' => 'nbi_clearance',
            'Police_clearance' => 'police_clearance',
            'BIR_clearance' => 'bir_clearance',

        ];

        foreach ($files as $fileKey => $collection) {
            if ($request->hasFile($fileKey)) {
                \Log::info("Uploading new file for: {$fileKey}");

                // Clear existing media for this collection
                $driver->clearMediaCollection($collection);

                // Upload new file to the private media collection
                $mediaItem = $driver->addMediaFromRequest($fileKey)->toMediaCollection($collection, 'private');

                \Log::info("Uploaded file for {$fileKey}: {$mediaItem->file_name}");
            }
        }

    }


    public function downloadMedia($mediaId)
    {
        $media = Media::findOrFail($mediaId);
        return response()->download($media->getPath(), $media->file_name);
    }

    /**
     * Preview a media file in the browser.
     */
    public function previewMedia($mediaId)
    {
        $media = Media::findOrFail($mediaId);
        $filePath = $media->getPath();
        $mimeType = $media->mime_type;

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->file($filePath, ['Content-Type' => $mimeType]);
    }


    public function show(Driver $driver)
    {
        return response()->json($driver->load('user', 'vrCompany','operator'));
    }

    public function update(Request $request, Driver $driver)
{
    $validatedData = $request->validate([
        'username' => 'sometimes|string|unique:users,username,' . $driver->user_id,
        'email' => 'sometimes|email|unique:users,email,' . $driver->user_id,
        'FirstName' => 'sometimes|string',
        'MiddleName'=>'sometimes|string',
        'LastName' => 'sometimes|string',
        'Address' => 'sometimes|string',
        'BirthDate' => 'sometimes|date',
        'ContactNumber' => 'sometimes|string',
        'password' => 'nullable|string|min:6',

        'operator_id' => 'sometimes|exists:operators,id',
        'vr_company_id' => 'sometimes|exists:vr_companies,id',
        'Status' => 'sometimes|in:Pending,Approved,Rejected',
        'LicenseNumber' => 'sometimes|string|unique:drivers,LicenseNumber,' . $driver->id,

        'License' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'Photo' => 'nullable|file|mimes:jpg,png|max:2048',
        'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
    ]);

    // Update User Details
    $driver->user->update([
        'username' => $validatedData['username'] ?? $driver->user->username,
        'email' => $validatedData['email'] ?? $driver->user->email,
        'FirstName' => $validatedData['FirstName'] ?? $driver->user->FirstName,
        'MiddleName' =>$validatedData['MiddleName']?? $driver->user->MiddleName,
        'LastName' => $validatedData['LastName'] ?? $driver->user->LastName,
        'Address' => $validatedData['Address'] ?? $driver->user->Address,
        'BirthDate' => $validatedData['BirthDate'] ?? $driver->user->BirthDate,
        'ContactNumber' => $validatedData['ContactNumber'] ?? $driver->user->ContactNumber,
        'password' => isset($validatedData['password'])
            ? Hash::make($validatedData['password'])
            : $driver->user->password,
    ]);

    // Update Driver Details
    $driver->update([
        'LicenseNumber' => $validatedData['LicenseNumber'] ?? $driver->LicenseNumber,
        'operator_id' => $validatedData['operator_id'] ?? $driver->operator_id,
        'vr_company_id' => $validatedData['vr_company_id'] ?? $driver->vr_company_id,
        'Status' => $validatedData['Status'] ?? $driver->Status,
    ]);

    // Handle File Uploads
    if ($request->hasFile('License')) {
        $driver->addMediaFromRequest('License')->toMediaCollection('license', 'private');
    }
    if ($request->hasFile('Photo')) {
        $driver->addMediaFromRequest('Photo')->toMediaCollection('photo', 'private');
    }
    if ($request->hasFile('NBI_clearance')) {
        $driver->addMediaFromRequest('NBI_clearance')->toMediaCollection('nbi_clearance', 'private');
    }
    if ($request->hasFile('Police_clearance')) {
        $driver->addMediaFromRequest('Police_clearance')->toMediaCollection('police_clearance', 'private');
    }
    if ($request->hasFile('BIR_clearance')) {
        $driver->addMediaFromRequest('BIR_clearance')->toMediaCollection('bir_clearance', 'private');
    }


}


    public function destroy(Driver $driver)
    {
        $driver->delete();

        $driver->user()->delete();

        return response()->json(['message' => 'Driver deleted successfully']);
    }

    public function getDriverTrips()
    {
        $user = auth()->user();

        if ($user->hasRole('Driver')) {
            // Find the driver record for the authenticated user
            $driver = Driver::where('user_id', $user->id)->first();

            if (!$driver) {
                return response()->json(['error' => 'Driver record not found'], 404);
            }

            $now = now();

            $earliestTrip = Trip::where('driver_id', $driver->id)
                ->where('pickupDate', '>=', $now)
                ->where('status', '!=', 'Done')
                ->orderBy('pickupDate', 'asc')
                ->orderBy('created_at', 'asc')
                ->first();

            if (!$earliestTrip) {
                return response()->json(['error' => 'No upcoming trips found'], 404);
            }

            // Fetch all passengers for the selected trip
            $passengers = Passenger::where('trip_id', $earliestTrip->id)->get();

            return response()->json([
                'trip' => $earliestTrip,
                'passengers' => $passengers
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }




    public function deleteMedia(Request $request, Driver $driver)
    {
        $request->validate([
            'media_id' => 'required|exists:media,id',
        ]);

        $media = Media::findOrFail($request->media_id);

        // Verify the media belongs to this vehicle
        if ($media->model_id != $driver->id) {
            abort(403, 'Unauthorized action.');
        }

        $media->delete();
    }

    public function updateStatus(Request $request, $id)
    {

        $driver = Driver::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For Payment',
        ]);

        $driver->Status = $request->status;
        $driver->save();


        \Log::info('Operator status updated', ['id' => $driver->id, 'status' => $driver->Status]);

        return response()->json(['message' => 'Status updated successfully'], 200);
    }

}
