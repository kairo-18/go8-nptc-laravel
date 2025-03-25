<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Operator;
use App\Models\VRCompany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class OperatorAdminController extends Controller
{
    public function index()
    {
        $operators = Operator::with('user', 'vrCompany')->get();
        return response()->json($operators);
    }

    /**
     * Store a newly created operator.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'FirstName' => 'required|string',
            'LastName' => 'required|string',
            'Address' => 'required|string',
            'BirthDate' => 'required|date',
            'ContactNumber' => 'required|string',
            'password' => 'required|string|min:6',
            'vr_company_id' => 'required|exists:vr_companies,id',
            'Status' => 'nullable|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For Payment',
            
            'photo' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'valid_id_front' => 'nullable|file|mimes:jpg,png|max:1024',
            'valid_id_back' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
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
            'Status' => $validatedData['Status'],
        ]);

        $user->assignRole('Operator');


        // Create the Operator record linked to the User
        $operator = $user->operator()->create([
            'vr_company_id' => $validatedData['vr_company_id'],
            'user_id' => $user->id,
            'Status' => Auth::user()->hasRole('NPTC Super Admin') ? 'Approved' : 'Pending',
        ]);

        if ($request->hasFile('photo')) {
            $media = $operator->addMediaFromRequest('photo')->toMediaCollection('photo', 'private');
            $operator->update(['photo' => $media->getPath()]); // Store file path in the "License" column
        }
        if ($request->hasFile('valid_id_front')) {
            $media = $operator->addMediaFromRequest('valid_id_front')->toMediaCollection('valid_id_front', 'private');
            $operator->update(['valid_id_front' => $media->getPath()]);
        }
        if ($request->hasFile('valid_id_back')) {
            $media = $operator->addMediaFromRequest('valid_id_back')->toMediaCollection('valid_id_back', 'private');
            $operator->update(['valid_id_back' => $media->getPath()]);
        }
        if(Auth::user()->hasRole('Temp User Operator')){
            //logout the user
            Auth::logout();
            return Redirect::route('login');
        }

        return redirect()->route('create-operator.admin')->with('success', 'Operator created successfully!');
    }
    
    /**
     * Display a specific operator.
     */
    public function show(Operator $operator)
    {
        return response()->json($operator->load('user', 'vrCompany'));
    }

    /**
     * Update an operator.
     */
    public function update(Request $request, Operator $operator)
{

    $validatedData = $request->validate([
        'username' => 'sometimes|string|unique:users,username,' . $operator->user->id,
        'email' => 'sometimes|email|unique:users,email,' . $operator->user->id,
        'FirstName' => 'sometimes|string',
        'LastName' => 'sometimes|string',
        'Address' => 'sometimes|string',
        'BirthDate' => 'sometimes|date',
        'ContactNumber' => 'sometimes|string',
        'password' => 'sometimes|string|min:6',

        'vr_company_id' => 'sometimes|exists:vr_companies,id',
        'Status' => 'sometimes|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected',
    ]);



    // Update User Details
    $userData = array_intersect_key($validatedData, array_flip([
        'username', 'email', 'FirstName', 'LastName', 'Address', 'BirthDate', 'ContactNumber', 'password'
    ]));

    if (isset($userData['password'])) {
        $userData['password'] = Hash::make($userData['password']); // Hash password if provided
    }

    $operator->user()->update($userData);

    // Update Operator Details
    $operatorData = array_intersect_key($validatedData, array_flip([
        'vr_company_id', 'Status'
    ]));

    $operator->update($operatorData);

    return response()->json([
        'message' => 'Operator updated successfully',
        'operator' => $operator->load('user', 'vrCompany'), // Ensure latest data is returned
    ]);
}

public function updateOperatorMedia(Request $request, Operator $operator){

    // Validate request
    $request->validate([

        'photo' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        'valid_id_front' => 'nullable|file|mimes:jpg,png|max:2048',
        'valid_id_back' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
    ]);

    // File collections mapping
    $files = [
        'photo' => 'photo',
        'valid_id_front' => 'valid_id_front',
        'valid_id_back' => 'valid_id_back',

    ];

    foreach ($files as $fileKey => $collection) {
        if ($request->hasFile($fileKey)) {
            \Log::info("Uploading new file for: {$fileKey}");

            // Clear existing media for this collection
            $operator->clearMediaCollection($collection);

            // Upload new file to the private media collection
            $mediaItem = $operator->addMediaFromRequest($fileKey)->toMediaCollection($collection, 'private');

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
    


    /**
     * Remove an operator.
     */
    public function destroy(Operator $operator)
{
    if ($operator->user) {
        $operator->user->delete();
    }

    $operator->delete();

    return response()->json(['message' => 'Operator and associated user deleted successfully']);
}

    public function updateStatus(Request $request, $id)
    {

        $operator = Operator::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected,For Payment',
        ]);

        $operator->Status = $request->status;
        $operator->save();


        \Log::info('Operator status updated', ['id' => $operator->id, 'status' => $operator->Status]);

        return response()->json(['message' => 'Status updated successfully'], 200);
    }

    public function editView($id)
    {
        $operator = Operator::with('user')->find($id);
    
        if (!$operator) {
            return abort(404, 'Operator not found');
        }
    
        // Media collections for operator
        $mediaCollections = ['photo', 'valid_id_front', 'valid_id_back'];
    
        // Process media files
        $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($operator) {
            return $operator->getMedia($collection)->map(fn($media) => [
                'id' => $media->id,
                'name' => $media->file_name,
                'collection_name' => $media->collection_name,
                'mime_type' => $media->mime_type,
                'url' => route('preview-operator-media', ['mediaId' => $media->id]),
            ]);
        })->values();
    
        return Inertia::render('edit-operator', [
            'operator' => $operator,
            'mediaFiles' => $mediaFiles,
            'companies' => VRCompany::all(),
        ]);
    }

}
