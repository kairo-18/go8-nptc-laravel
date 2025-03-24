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

        if (!$operator  ) {
            return abort(404, 'Company not found');
        }

        return Inertia::render('edit-operator', [
            'operator' => $operator,
            'companies' => VRCompany::all(),
        ]);
    }


}
