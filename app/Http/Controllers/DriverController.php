<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DriverController extends Controller
{
    public function index()
    {
        $driver = Driver::with('user', 'vrCompany','operator')->get();
        return response()->json($driver);
    }
    public function store(Request $request)
    {
        // Validate input fields and file uploads
        $validatedData = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'FirstName' => 'required|string',
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
            'LicenseNumber' => $validatedData['LicenseNumber'] ?? null,
            'Status' => 'Pending',
        ]);
    
        // File uploads
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
    
        return response()->json([
            'message' => 'Driver created successfully',
            'user' => $user,
            'driver' => $driver
        ], 201);
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

    return response()->json([
        'message' => 'Driver updated successfully',
        'driver' => $driver->load('user', 'vrCompany', 'operator'),
    ]);
}


    public function destroy(Driver $driver)
    {
        $driver->delete();

        $driver->user()->delete();

        return response()->json(['message' => 'Driver deleted successfully']);
    }

}
