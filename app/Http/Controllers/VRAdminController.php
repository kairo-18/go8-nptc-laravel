<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VehicleRentalOwner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;

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
            'password' => Hash::make($generatedPassword),
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
        ]);

        event(new Registered($user));
    }
}
