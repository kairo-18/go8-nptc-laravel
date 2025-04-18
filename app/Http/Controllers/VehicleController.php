<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\Driver;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $vehiclesQuery = Vehicle::with(['operator.user', 'driver.user']);

        if ($request->has('id')) {
            $vehiclesQuery->where('id', $request->input('id'));
        }

        $vehicles = $vehiclesQuery->get()->map(function ($vehicle) {
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

            return [
                'NPTC_ID' => $vehicle->NPTC_ID,
                'id' => $vehicle->id,
                'PlateNumber' => $vehicle->PlateNumber,
                'Model' => $vehicle->Model,
                'Brand' => $vehicle->Brand,
                'SeatNumber' => $vehicle->SeatNumber,
                'Status' => $vehicle->Status,
                'operator' => $vehicle->operator ? [
                    'id' => $vehicle->operator->id,
                    'FirstName' => $vehicle->operator->user->FirstName ?? 'N/A',
                    'LastName' => $vehicle->operator->user->LastName ?? 'N/A',
                ] : null,
                'driver' => $vehicle->driver ? [
                    'id' => $vehicle->driver->id,
                    'FirstName' => $vehicle->driver->user->FirstName ?? 'N/A',
                    'LastName' => $vehicle->driver->user->LastName ?? 'N/A',
                    'LicenseNumber' => $vehicle->driver->LicenseNumber ?? 'N/A',
                ] : null,
                'media_files' => $mediaFiles,
            ];
        });

        return Inertia::render('vehicles', [
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'operator_id' => 'required|exists:operators,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'PlateNumber' => 'required|string|unique:vehicles,PlateNumber',
            'Model' => 'required|string',
            'Brand' => 'required|string',
            'SeatNumber' => 'required|integer',
            'Status' => 'sometimes|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For VR Approval, For NPTC Approval',
            'front_image' => 'nullable|file|mimes:jpg,png',
            'back_image' => 'nullable|file|mimes:jpg,png',
            'left_side_image' => 'nullable|file|mimes:jpg,png',
            'right_side_image' => 'nullable|file|mimes:jpg,png',
            'or_image' => 'nullable|file|mimes:jpg,png,pdf',
            'cr_image' => 'nullable|file|mimes:jpg,png,pdf',
            'id_card_image' => 'nullable|file|mimes:jpg,png',
            'gps_certificate_image' => 'nullable|file|mimes:jpg,png,pdf',
            'inspection_certificate_image' => 'nullable|file|mimes:jpg,png,pdf',
        ]);

        if (! $request->has('Status') || $request->Status == '') {
            $validatedData['Status'] = 'For VR Approval';
        }
        $vehicle = Vehicle::create($validatedData);

        $this->handleFileUpload($request, $vehicle);

    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validatedData = $request->validate([
            'operator_id' => 'sometimes|exists:operators,id',
            'driver_id' => 'sometimes|exists:drivers,id',
            'PlateNumber' => 'sometimes|string|unique:vehicles,PlateNumber,'.$vehicle->id,
            'Model' => 'sometimes|string',
            'Brand' => 'sometimes|string',
            'SeatNumber' => 'sometimes|integer',
            'Status' => 'sometimes|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected',

        ]);

        $vehicle->update($validatedData);
        $this->handleFileUpload($request, $vehicle);

        return response()->json(['message' => 'Vehicle updated successfully', 'vehicle' => $vehicle]);
    }

    public function updateVehicleMedia(Request $request, Vehicle $vehicle)
    {

        // Validate request
        $request->validate([
            'front_image' => 'nullable|file|mimes:jpg,png',
            'back_image' => 'nullable|file|mimes:jpg,png',
            'left_side_image' => 'nullable|file|mimes:jpg,png',
            'right_side_image' => 'nullable|file|mimes:jpg,png',
            'or_image' => 'nullable|file|mimes:jpg,png,pdf',
            'cr_image' => 'nullable|file|mimes:jpg,png,pdf',
            'id_card_image' => 'nullable|file|mimes:jpg,png',
            'gps_certificate_image' => 'nullable|file|mimes:jpg,png,pdf',
            'inspection_certificate_image' => 'nullable|file|mimes:jpg,png,pdf',
        ]);

        // File collections mapping
        $files = [
            'front_image' => 'front_image',
            'back_image' => 'back_image',
            'left_side_image' => 'left_side_image',
            'right_side_image' => 'right_side_image',
            'or_image' => 'or_image',
            'cr_image' => 'cr_image',
            'id_card_image' => 'id_card_image',
            'gps_certificate_image' => 'gps_certificate_image',
            'inspection_certificate_image' => 'inspection_certificate_image',
        ];

        foreach ($files as $fileKey => $collection) {
            if ($request->hasFile($fileKey)) {

                // Clear existing media for this collection
                $vehicle->clearMediaCollection($collection);

                // Upload new file to the private media collection
                $mediaItem = $vehicle->addMediaFromRequest($fileKey)->toMediaCollection($collection, 'private');

            }
        }

    }

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

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    private function handleFileUpload(Request $request, Vehicle $vehicle)
    {
        $imageFields = [
            'front_image' => 'front_image',
            'back_image' => 'back_image',
            'left_side_image' => 'left_side_image',
            'right_side_image' => 'right_side_image',
            'or_image' => 'or_image',
            'cr_image' => 'cr_image',
            'id_card_image' => 'id_card_image',
            'gps_certificate_image' => 'gps_certificate_image',
            'inspection_certificate_image' => 'inspection_certificate_image',
        ];

        foreach ($imageFields as $field => $collection) {
            if ($request->hasFile($field)) {
                $vehicle->addMediaFromRequest($field)->toMediaCollection($collection, 'private');
            }
        }
    }

    public function deleteMedia(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'media_id' => 'required|exists:media,id',
        ]);

        $media = Media::findOrFail($request->media_id);

        // Verify the media belongs to this vehicle
        if ($media->model_id != $vehicle->id) {
            abort(403, 'Unauthorized action.');
        }

        $media->delete();
    }

    public function updateStatus(Request $request, $id)
    {

        $vehicle = Vehicle::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For Payment,For NPTC Approval, For VR Approval',
        ]);

        $vehicle->Status = $request->status;
        $vehicle->save();

        \Log::info('Operator status updated', ['id' => $vehicle->id, 'status' => $vehicle->Status]);

        return response()->json(['message' => 'Status updated successfully'], 200);
    }

    public function swapDriverForVehicle(Vehicle $vehicle, Request $request)
    {
        $request->validate([
            'newId' => 'required|exists:drivers,id'
        ]);

        try {
            $newDriverId = $request->newId;

            // If selecting the same driver, do nothing
            if ($vehicle->driver_id == $newDriverId) {
                return response()->json([
                    'message' => 'This driver is already assigned to the vehicle.'
                ], 422);
            }

            // Start transaction for data consistency
            \DB::transaction(function () use ($vehicle, $newDriverId) {
                // 1. Remove current driver assignment from vehicle (if any)
                if ($vehicle->driver_id) {
                    $currentDriver = Driver::find($vehicle->driver_id);
                    if ($currentDriver) {
                        $currentDriver->vehicle_id = null;
                        $currentDriver->save();
                    }
                }

                // 3. Assign the new driver to the vehicle
                $vehicle->driver_id = $newDriverId;
                $vehicle->save();
            });

            return response()->json([
                'message' => 'Driver swapped successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error swapping driver: ' . $e->getMessage()
            ], 500);
        }
    }
}
