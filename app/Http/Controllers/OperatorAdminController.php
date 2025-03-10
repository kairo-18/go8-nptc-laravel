<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Operator;
use App\Models\VRCompany;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Models\Role;
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
            'user.username' => 'required|string|unique:users,username',
            'user.email' => 'required|email|unique:users,email',
            'user.FirstName' => 'required|string',
            'user.LastName' => 'required|string',
            'user.Address' => 'required|string',
            'user.BirthDate' => 'required|date',
            'user.ContactNumber' => 'required|string',
            'user.password' => 'required|string|min:6',

            'operator.vr_company_id' => 'required|exists:vr_companies,id',

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

        // Assign the "Operator" role
        $user->assignRole('Operator');

        // Create the Operator record linked to the User
        $operator = $user->operator()->create([
            'vr_company_id' => $validatedData['operator']['vr_company_id'],
            'user_id' => $user->id,  // <- This was missing
            'Status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Operator created successfully',
            'user' => $user,
            'operator' => $operator,
        ], 201);
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
            'user.username' => 'sometimes|string|unique:users,username,' . $operator->user_id,
            'user.email' => 'sometimes|email|unique:users,email,' . $operator->user_id,
            'user.FirstName' => 'sometimes|string',
            'user.LastName' => 'sometimes|string',
            'user.Address' => 'sometimes|string',
            'user.BirthDate' => 'sometimes|date',
            'user.ContactNumber' => 'sometimes|string',
            'user.password' => 'sometimes|string|min:6',

            'operator.vr_company_id' => 'sometimes|exists:vr_companies,id',
            'operator.Status' => 'sometimes|in:Active,Inactive,Suspended,Banned,Pending,Approved,Rejected',
        ]);




        // Update User Details
        if (isset($validatedData['user'])) {
            $userData = $validatedData['user'];
            if (isset($userData['password'])) {
                $userData['password'] = Hash::make($userData['password']); // Hash password if provided
            }
            $operator->user()->update($userData);
        }

        // Update Operator Details
        if (isset($validatedData['operator'])) {
            $operator->update($validatedData['operator']);
        }

        return response()->json([
            'message' => 'Operator updated successfully',
            'operator' => $operator->load('user', 'vrCompany'), // Ensure latest data is returned
        ]);
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
}
