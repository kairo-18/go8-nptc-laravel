<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class NptcAdminController extends Controller
{
    /**
     * Update the NPTC Admin.
     *
     * @param Request $request
     * @return void
     */
    //update nptc admin

    public function updateNPTCAdmin(Request $request): void
    {
        $user = User::findOrFail($request->id);

        // Validate the request data
        $validated = $request->validate([
            'FirstName' => 'sometimes|string|max:255',
            'LastName' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $request->id,
            'Address' => 'nullable|string|max:255',
            'BirthDate' => 'nullable|date',
            'ContactNumber' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|lowercase|email|max:255|unique:users,email,' . $request->id,
            'password' => 'nullable|confirmed|min:8',
        ]);

        // Update only the provided fields
        $user->fill($validated);

        // Reset email verification if email is changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Hash the password if it is provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
    }

    public function createNPTCAdmin(Request $request)
    {
        $request->validate([
            'FirstName' => 'required|string|max:255',
            'LastName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'Address' => 'nullable|string|max:255',
            'BirthDate' => 'nullable|date',
            'ContactNumber' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'username' => $request->username,
            'Address' => $request->Address,
            'BirthDate' => $request->BirthDate,
            'ContactNumber' => $request->ContactNumber,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('NPTC Admin');
        event(new Registered($user));

    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        \Log::info($request);

        $user = User::findOrFail($request->id);
        $user->delete();


    }
}
