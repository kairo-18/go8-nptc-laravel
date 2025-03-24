<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VehicleRentalOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;
use App\Models\VRCompany;

class VRAdminController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'vr_company_id' => 'required|integer|exists:vr_companies,id',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'FirstName' => 'required|string',
            'LastName' => 'required|string',
            'Address' => 'required|string',
            'BirthDate' => 'required|date',
            'ContactNumber' => 'required|string',
        ]);

        // For example January 1 2005 = 01012005
        $formattedBirthDate = date('mdY', strtotime($request->BirthDate));

        //Add Last Name
        $generatedPassword = $request->LastName . $formattedBirthDate;

        // Create the VR Admin user
        $user = User::create([
            'vr_company_id' => $request->vr_company_id,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make('password'),
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'Address' => $request->Address,
            'BirthDate' => $request->BirthDate,
            'ContactNumber' => $request->ContactNumber,
        ]);

        $user->assignRole('VR Admin');


        $vehicleRentalOwner = VehicleRentalOwner::create([
            'user_id' => $user->id,
            'vr_company_id' => $request->vr_company_id,
            'Status' => 'Pending',
        ]);

        event(new Registered($user));
    }

    public function update(Request $request)
    {
        // Log the incoming request data for debugging
        \Log::info('Update Request Data:', $request->all());

        // Validate the `vr_company_id` before using it
        $vrCompanyId = $request->input('vr_company_id');
        if (!$vrCompanyId || !is_numeric($vrCompanyId)) {
            return response()->json(['error' => 'Invalid or missing vr_company_id.'], 400);
        }

        // Find the VR company
        $vrCompany = VRCompany::find((int) $vrCompanyId);
        if (!$vrCompany || !$vrCompany->owner || !$vrCompany->owner->user) {
            return response()->json(['error' => 'VR Admin user not found for the specified company.'], 404);
        }

        // Retrieve the target user
        $targetUser = $vrCompany->owner->user;

        // Validate the request data (now using `$targetUser->id` for unique validation)
        $validated = $request->validate([
            'vr_company_id' => 'sometimes|integer|exists:vr_companies,id',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $targetUser->id,
            'email' => 'sometimes|string|lowercase|email|max:255|unique:users,email,' . $targetUser->id,
            'FirstName' => 'sometimes|string',
            'LastName' => 'sometimes|string',
            'Address' => 'nullable|string|max:255',
            'BirthDate' => 'nullable|date',
            'ContactNumber' => 'sometimes|string|max:255',
        ]);

        // Update the target user's details
        $targetUser->fill($validated);
        $targetUser->save(); // Ensure changes are saved

        \Log::info('Update Complete');
    }

}
