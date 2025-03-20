<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
                return $vehicle->getMedia($collection)->map(fn($media) => [
                    'id' => $media->id,
                    'name' => $media->file_name,
                    'collection_name' => $media->collection_name,
                    'mime_type' => $media->mime_type,
                    'url' => route('preview-vehicle-media', ['mediaId' => $media->id]),
                ]);
            })->values();

            return [
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
                    'LicenseNumber'=>$vehicle->driver->LicenseNumber?? 'N/A',
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
            'Status' => 'required|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected',
            'front_image' => 'nullable|file|mimes:jpg,png|max:2048',
            'back_image' => 'nullable|file|mimes:jpg,png|max:2048',
            'left_side_image' => 'nullable|file|mimes:jpg,png|max:2048',
            'right_side_image' => 'nullable|file|mimes:jpg,png|max:2048',
            'or_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
            'cr_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
            'id_card_image' => 'nullable|file|mimes:jpg,png|max:2048',
            'gps_certificate_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
            'inspection_certificate_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        $vehicle = Vehicle::create($validatedData);

        $this->handleFileUpload($request, $vehicle);

        
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validatedData = $request->validate([
            'operator_id' => 'sometimes|exists:operators,id',
            'driver_id' => 'sometimes|exists:drivers,id',
            'PlateNumber' => 'sometimes|string|unique:vehicles,PlateNumber,' . $vehicle->id,
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
        'front_image' => 'nullable|file|mimes:jpg,png|max:2048',
        'back_image' => 'nullable|file|mimes:jpg,png|max:2048',
        'left_side_image' => 'nullable|file|mimes:jpg,png|max:2048',
        'right_side_image' => 'nullable|file|mimes:jpg,png|max:2048',
        'or_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        'cr_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        'id_card_image' => 'nullable|file|mimes:jpg,png|max:2048',
        'gps_certificate_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        'inspection_certificate_image' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
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

    if (!file_exists($filePath)) {
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


}
