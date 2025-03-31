<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $user = Auth::user();

        // check if user has a role or has the role NPTC Admin
        if ($user->hasRole(['Temp User'])) {
            $request->session()->regenerate();

            return redirect()->route('registration')->withInput(['Registration' => 'Please input your company details']);
        } elseif ($user->hasRole('Temp User Operator')) {
            $request->session()->regenerate();

            return redirect()->route('create-operator.admin')->withInput(['Registration' => 'Please input your operator details']);
        }
        // elseif ($user->hasRole('Driver')) {
        //     if ($user->driver->Status != 'Approved') {
        //         Auth::guard('web')->logout();
        //
        //         return redirect()->route('login');
        //     }
        //     $request->session()->regenerate();
        //
        //     return redirect()->route('driver.dashboard');
        // }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
