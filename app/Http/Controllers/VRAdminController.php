<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VehicleRentalOwner;
use App\Models\VRCompany;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        // Add Last Name
        $generatedPassword = $request->LastName.$formattedBirthDate;

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

        $vrCompanyId = $request->input('vr_company_id');

        // If vr_company_id is missing but BusinessPermitNumber is provided, find the vr_company_id
        if (!$vrCompanyId && $request->has('BusinessPermitNumber')) {
            $vrCompany = VRCompany::where('BusinessPermitNumber', $request->input('BusinessPermitNumber'))->first();
            \Log::info('VR Company Found:', ['vrCompany' => $vrCompany]);

            if ($vrCompany) {
                $vrCompanyId = (int) $vrCompany->id;
            } else {
                return response()->json(['error' => 'VR Company not found for the provided Business Permit Number.'], 404);
            }
        }

        // Validate the vr_company_id
        if (! $vrCompanyId || ! is_numeric($vrCompanyId)) {
            return response()->json(['error' => 'Invalid or missing vr_company_id.'], 400);
        }

        // Find the VR company
        $vrCompany = VRCompany::find($vrCompanyId);
        if (!$vrCompany) {
            return response()->json(['error' => 'VR Company not found.'], 404);
        }

        // Check if the company has an admin
        $targetUser = $vrCompany->owner->user ?? null;

        // If no admin exists, create a new admin based on the provided data
        if (!$targetUser) {
            \Log::info('No VR Admin found, creating new admin.');

            $validatedAdminData = $request->validate([
                'username' => 'required|string|max:255|unique:users,username',
                'email' => 'required|string|lowercase|email|max:255|unique:users,email',
                'FirstName' => 'required|string',
                'LastName' => 'required|string',
                'Address' => 'nullable|string|max:255',
                'BirthDate' => 'nullable|date',
                'ContactNumber' => 'nullable|string|max:255',
            ]);

            // Create new user (admin)
            $newAdmin = User::create([
                'username' => $validatedAdminData['username'],
                'email' => $validatedAdminData['email'],
                'password' => Hash::make('password'),
                'FirstName' => $validatedAdminData['FirstName'],
                'LastName' => $validatedAdminData['LastName'],
                'Address' => $validatedAdminData['Address'] ?? null,
                'BirthDate' => $validatedAdminData['BirthDate'] ?? null,
                'ContactNumber' => $validatedAdminData['ContactNumber'] ?? null,
                'role' => 'admin', // Assuming role is stored as a column
            ]);

            $newAdmin->assignRole('VR Admin');

            // Assign the new admin to the VR company
            $vrCompany->owner()->updateOrCreate([], ['user_id' => $newAdmin->id]);

            \Log::info('New admin created:', ['admin' => $newAdmin]);

            return;
        }

        // Validate and update the existing admin
        $validated = $request->validate([
            'username' => 'sometimes|string|max:255|unique:users,username,'.$targetUser->id,
            'email' => 'sometimes|string|lowercase|email|max:255|unique:users,email,'.$targetUser->id,
            'FirstName' => 'sometimes|string',
            'LastName' => 'sometimes|string',
            'Address' => 'nullable|string|max:255',
            'BirthDate' => 'nullable|date',
            'ContactNumber' => 'sometimes|string|max:255',
        ]);

        // Update the existing admin
        $targetUser->fill($validated);
        $targetUser->save();

        \Log::info('Existing admin updated.');
    }
}
