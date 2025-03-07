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
            'user.username' => 'required|string|unique:users,username',
            'user.email' => 'required|email|unique:users,email',
            'user.FirstName' => 'required|string',
            'user.LastName' => 'required|string',
            'user.Address' => 'required|string',
            'user.BirthDate' => 'required|date',
            'user.ContactNumber' => 'required|string',
            'user.password' => 'required|string|min:6',

            'driver.operator_id' => 'required|exists:operators,id',
            'driver.vr_company_id' => 'required|exists:vr_companies,id',
            'driver.vehicle_id' => 'nullable|exists:vehicles,id',
            'driver.LicenseNumber' => 'nullable|string|unique:drivers,LicenseNumber',
            
            'driver.License' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'driver.Photo' => 'nullable|file|mimes:jpg,png|max:1024',
            'driver.NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'driver.Police_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'driver.BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // Create the user
        $user = User::create([
            'username' => $validatedData['user']['username'],
            'email' => $validatedData['user']['email'],
            'FirstName' => $validatedData['user']['FirstName'],
            'LastName' => $validatedData['user']['LastName'],
            'Address' => $validatedData['user']['Address'],
            'BirthDate' => $validatedData['user']['BirthDate'],
            'ContactNumber' => $validatedData['user']['ContactNumber'],
            'password' => Hash::make($validatedData['user']['password']),
        ]);

        $user->assignRole('Driver');

        $driver = $user->driver()->create([
            'operator_id' => $validatedData['driver']['operator_id'],
            'vr_company_id' => $validatedData['driver']['vr_company_id'],
            'LicenseNumber' => $validatedData['driver']['LicenseNumber']??null,
            'Status' => 'Pending',
        ]);

        // File uploads
        if ($request->hasFile('driver.License')) {
            $driver->addMediaFromRequest('driver.License')->toMediaCollection('license', 'private');
        }
        if ($request->hasFile('driver.Photo')) {
            $driver->addMediaFromRequest('driver.Photo')->toMediaCollection('photo', 'private');
        }
        if ($request->hasFile('driver.NBI_clearance')) {
            $driver->addMediaFromRequest('driver.NBI_clearance')->toMediaCollection('nbi_clearance', 'private');
        }

        return response()->json(['message' => 'Driver created successfully', 'user' => $user,'driver' => $driver], 201);
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
        'user.username' => 'sometimes|string|unique:users,username,' . $driver->user_id,
        'user.email' => 'sometimes|email|unique:users,email,' . $driver->user_id,
        'user.FirstName' => 'sometimes|string',
        'user.LastName' => 'sometimes|string',
        'user.Address' => 'sometimes|string',
        'user.BirthDate' => 'sometimes|date',
        'user.ContactNumber' => 'sometimes|string',
        'user.password' => 'nullable|string|min:6',

        'driver.operator_id' => 'sometimes|exists:operators,id',
        'driver.vr_company_id' => 'sometimes|exists:vr_companies,id',
        'driver.Status' => 'sometimes|in:Pending,Approved,Rejected',
        'driver.LicenseNumber' => 'sometimes|string|unique:drivers,LicenseNumber,' . $driver->id,

        // File validations
        'driver.License' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'driver.Photo' => 'nullable|file|mimes:jpg,png|max:2048',
        'driver.NBI_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'driver.Police_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'driver.BIR_clearance' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
    ]);

    // Update user details if provided
    if (isset($validatedData['user'])) {
        $driver->user->update([
            'username' => $validatedData['user']['username'] ?? $driver->user->username,
            'email' => $validatedData['user']['email'] ?? $driver->user->email,
            'FirstName' => $validatedData['user']['FirstName'] ?? $driver->user->FirstName,
            'LastName' => $validatedData['user']['LastName'] ?? $driver->user->LastName,
            'Address' => $validatedData['user']['Address'] ?? $driver->user->Address,
            'BirthDate' => $validatedData['user']['BirthDate'] ?? $driver->user->BirthDate,
            'ContactNumber' => $validatedData['user']['ContactNumber'] ?? $driver->user->ContactNumber,
            'password' => isset($validatedData['user']['password']) 
                ? Hash::make($validatedData['user']['password']) 
                : $driver->user->password,
        ]);
    }

    // Update driver details
    $driver->update([
        'LicenseNumber' => $validatedData['driver']['LicenseNumber'] ?? $driver->LicenseNumber,
        'operator_id' => $validatedData['driver']['operator_id'] ?? $driver->operator_id,
        'vr_company_id' => $validatedData['driver']['vr_company_id'] ?? $driver->vr_company_id,
        'Status' => $validatedData['driver']['Status'] ?? $driver->Status,
    ]);

    // Handle file uploads
    if ($request->hasFile('driver.License')) {
        $driver->addMediaFromRequest('driver.License')->toMediaCollection('license', 'private');
    }
    if ($request->hasFile('driver.Photo')) {
        $driver->addMediaFromRequest('driver.Photo')->toMediaCollection('photo', 'private');
    }
    if ($request->hasFile('driver.NBI_clearance')) {
        $driver->addMediaFromRequest('driver.NBI_clearance')->toMediaCollection('nbi_clearance', 'private');
    }
    if ($request->hasFile('driver.Police_clearance')) {
        $driver->addMediaFromRequest('driver.Police_clearance')->toMediaCollection('nbi_clearance', 'private');
    }
    if ($request->hasFile('driver.BIR_clearance')) {
        $driver->addMediaFromRequest('driver.BIR_clearance')->toMediaCollection('nbi_clearance', 'private');
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
