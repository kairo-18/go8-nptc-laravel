<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createNPTCAdmin(Request $request)
    {
        $request->validate([
            'FirstName' => 'required|string|max:255',
            'LastName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'Address' => 'nullable|string|max:255',
            'Birthdate' => 'nullable|date',
            'ContactNumber' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'username' => $request->username,
            'Address' => $request->Address,
            'Birthdate' => $request->Birthdate,
            'ContactNumber' => $request->ContactNumber,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('NPTC Admin');
        event(new Registered($user));

    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'FirstName' => 'required|string|max:255',
            'LastName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'Address' => 'nullable|string|max:255',
            'Birthdate' => 'nullable|date',
            'ContactNumber' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'username' => $request->username,
            'Address' => $request->Address,
            'Birthdate' => $request->Birthdate,
            'ContactNumber' => $request->ContactNumber,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        return to_route('home');
    }
}
