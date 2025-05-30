<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Passenger;
use App\Models\Trip;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
                    return $driver->getMedia($collection)->map(fn ($media) => [
                        'id' => $media->id,
                        'name' => $media->file_name,
                        'collection_name' => $media->collection_name,
                        'mime_type' => $media->mime_type,
                        'url' => route('preview-driver-media', ['mediaId' => $media->id]),
                    ]);
                })->values();

                return [
                    'NPTC_ID' => $driver->NPTC_ID,
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
            'MiddleName' => 'nullable|string',
            'LastName' => 'required|string',
            'Address' => 'required|string',
            'BirthDate' => 'required|date',
            'ContactNumber' => 'required|string',
            'password' => 'required|string|min:6',

            'operator_id' => 'required|exists:operators,id',
            'vr_company_id' => 'required|exists:vr_companies,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'LicenseNumber' => 'nullable|string|unique:drivers,LicenseNumber',

            'License' => 'nullable|file|mimes:pdf,jpg,png',
            'Photo' => 'nullable|file|mimes:jpg,png',
            'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png',
        ]);

        // Create the user
        $user = User::create([
            'username' => $validatedData['username'],
            'email' => $validatedData['email'],
            'FirstName' => $validatedData['FirstName'],
            'MiddleName' => $validatedData['MiddleName'],
            'LastName' => $validatedData['LastName'],
            'Address' => $validatedData['Address'],
            'BirthDate' => $validatedData['BirthDate'],
            'ContactNumber' => $validatedData['ContactNumber'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $user->assignRole('Driver');
        $status = '';

        $user1 = auth()->user();

        if ($user1->hasRole('Operator')) {
            $status = 'For VR Approval';
        } elseif ($user1->hasRole('VR Admin')) {
            $status = 'For NPTC Approval';
        } elseif ($user1->hasRole(['NPTC Admin', 'NPTC Super Admin'])) {
            $status = 'For Payment';
        } else {
            return response()->json(['error' => 'Invalid Role'], 403);
        }

        $driver = $user->driver()->create([
            'operator_id' => $validatedData['operator_id'],
            'vr_company_id' => $validatedData['vr_company_id'],
            'vehicle_id' => $validatedData['vehicle_id'] ?? null,
            'LicenseNumber' => $validatedData['LicenseNumber'] ?? null,
            'Status' => $status,
        ]);

        if (! empty($validatedData['vehicle_id'])) {
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

    }

    public function updateDriverMedia(Request $request, Driver $driver)
    {

        // Validate request
        $request->validate([

            'License' => 'nullable|file|mimes:pdf,jpg,png',
            'Photo' => 'nullable|file|mimes:jpg,png',
            'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png',
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

        if (! file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->file($filePath, ['Content-Type' => $mimeType]);
    }

    public function show(Driver $driver)
    {
        return response()->json($driver->load('user', 'vrCompany', 'operator'));
    }

    public function update(Request $request, Driver $driver)
    {
        $validatedData = $request->validate([
            'username' => 'sometimes|string|unique:users,username,'.$driver->user_id,
            'email' => 'sometimes|email|unique:users,email,'.$driver->user_id,
            'FirstName' => 'sometimes|string',
            'MiddleName' => 'sometimes|string',
            'LastName' => 'sometimes|string',
            'Address' => 'sometimes|string',
            'BirthDate' => 'sometimes|date',
            'ContactNumber' => 'sometimes|string',
            'password' => 'nullable|string|min:6',

            'operator_id' => 'sometimes|exists:operators,id',
            'vr_company_id' => 'sometimes|exists:vr_companies,id',
            'Status' => 'sometimes|in:Pending,Approved,Rejected',
            'LicenseNumber' => 'sometimes|string|unique:drivers,LicenseNumber,'.$driver->id,

            'License' => 'nullable|file|mimes:pdf,jpg,png',
            'Photo' => 'nullable|file|mimes:jpg,png',
            'NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'Police_clearance' => 'nullable|file|mimes:pdf,jpg,png',
            'BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png',
        ]);

        // Update User Details
        $driver->user->update([
            'username' => $validatedData['username'] ?? $driver->user->username,
            'email' => $validatedData['email'] ?? $driver->user->email,
            'FirstName' => $validatedData['FirstName'] ?? $driver->user->FirstName,
            'MiddleName' => $validatedData['MiddleName'] ?? $driver->user->MiddleName,
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

            if (! $driver) {
                return response()->json(['error' => 'Driver record not found'], 404);
            }

            $now = now();

            $earliestTrip = Trip::where('driver_id', $driver->id)
                ->where('pickupDate', '>=', $now)
                ->where('status', '!=', 'Done')
                ->orderBy('pickupDate', 'asc')
                ->orderBy('created_at', 'asc')
                ->first();

            if (! $earliestTrip) {
                return response()->json(['error' => 'No upcoming trips found'], 404);
            }

            // Fetch all passengers for the selected trip
            $passengers = Passenger::where('trip_id', $earliestTrip->id)->get();

            // Fetch vehicle details
            $vehicle = Vehicle::where('id', $earliestTrip->vehicle_id)->first();

            return response()->json([
                'trip' => $earliestTrip,
                'vehicle' => $vehicle ? [
                    'Model' => $vehicle->Model,
                    'PlateNumber' => $vehicle->PlateNumber,
                ] : null,
                'passengers' => $passengers,
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
            'status' => 'required|string|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For Payment,For NPTC Approval, For VR Approval',
        ]);

        $driver->Status = $request->status;
        $driver->save();

        \Log::info('Operator status updated', ['id' => $driver->id, 'status' => $driver->Status]);

        return response()->json(['message' => 'Status updated successfully'], 200);
    }

    public function swapVehicleForDriver(Driver $driver, Request $request)
    {
        $request->validate([
            'newId' => 'required|exists:vehicles,id'
        ]);

        try {
            $newVehicleId = $request->newId;

            // If selecting the same vehicle, do nothing
            if ($driver->vehicle_id == $newVehicleId) {
                return response()->json([
                    'message' => 'This vehicle is already assigned to the driver.'
                ], 422);
            }

            // Start transaction for data consistency
            \DB::transaction(function () use ($driver, $newVehicleId) {
                $newVehicle = Vehicle::findOrFail($newVehicleId);
                $currentVehicle = $driver->vehicle_id ? Vehicle::find($driver->vehicle_id) : null;

                // 1. Get the current driver of the new vehicle (if any)
                $currentDriverOfNewVehicle = $newVehicle->driver_id
                    ? Driver::find($newVehicle->driver_id)
                    : null;

                // 2. Get the current vehicle of our driver (if any)
                $currentVehicleOfDriver = $driver->vehicle_id
                    ? Vehicle::find($driver->vehicle_id)
                    : null;

                // 3. Perform the swap:
                // - Assign new vehicle to our driver
                $driver->vehicle_id = $newVehicle->id;
                $driver->save();

                // - Assign our driver to the new vehicle
                $newVehicle->driver_id = $driver->id;
                $newVehicle->save();

                // 4. Handle the previous relationships:
                // - If new vehicle had a driver before, assign them to our driver's old vehicle
                if ($currentDriverOfNewVehicle && $currentVehicleOfDriver) {
                    $currentDriverOfNewVehicle->vehicle_id = $currentVehicleOfDriver->id;
                    $currentDriverOfNewVehicle->save();

                    $currentVehicleOfDriver->driver_id = $currentDriverOfNewVehicle->id;
                    $currentVehicleOfDriver->save();
                }
                // - If new vehicle had a driver but our driver had no vehicle
                elseif ($currentDriverOfNewVehicle) {
                    $currentDriverOfNewVehicle->vehicle_id = null;
                    $currentDriverOfNewVehicle->save();
                }
                // - If our driver had a vehicle but new vehicle had no driver
                elseif ($currentVehicleOfDriver) {
                    $currentVehicleOfDriver->driver_id = null;
                    $currentVehicleOfDriver->save();
                }
            });

            return response()->json([
                'message' => 'Vehicle swapped successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error swapping vehicle: ' . $e->getMessage()
            ], 500);
        }
    }
}
