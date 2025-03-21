<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\VRCompany;
use App\Models\Vehicle;
use App\Models\Operator;
use App\Models\VehicleRentalOwner;
use App\Models\VrContacts;
use App\Models\Notes;

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
            ->whereIn('vr_company_id', VRCompany::whereIn('Status', ['Pending', 'For Payment'])->pluck('id'))
            ->whereIn('Status', ['Pending', 'For Payment']) 
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


}
