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
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'FirstName' => 'required|string',
            'LastName' => 'required|string',
            'Address' => 'required|string',
            'BirthDate' => 'required|date',
            'ContactNumber' => 'required|string',
        ]);

        $formattedBirthDate = date('mdY', strtotime($request->BirthDate));

        $generatedPassword = $request->LastName . $formattedBirthDate;

        // Create the VR Admin user
        $user = User::create([
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

        event(new Registered($user));

        return response()->json([
            'message' => 'VR Admin user created successfully!',
            'user' => $user,
            'generated_password' => $generatedPassword, 
        ], 201);
    }
}
