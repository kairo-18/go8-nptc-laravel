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
    public function index() //Response
    {
        $vehicles = Vehicle::with('operator', 'driver')->get();
        return response()->json(['vehicles' => $vehicles]);
        // return Inertia::render('vehicles', [
        //     'vehicles' => $vehicles,
        // ]);
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
    \Log::info('Uploading media files for vehicle', ['vehicle_id' => $vehicle->id, 'request_data' => $request->all()]);

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
            \Log::info("Uploading new file for: {$fileKey}");

            // Clear existing media for this collection
            $vehicle->clearMediaCollection($collection);

            // Upload new file to the private media collection
            $mediaItem = $vehicle->addMediaFromRequest($fileKey)->toMediaCollection($collection, 'private');

            \Log::info("Uploaded file for {$fileKey}: {$mediaItem->file_name}");
        }
    }

    return response()->json(['Success' => "Media files updated for vehicle ID {$vehicle->id}"], 200);
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
