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

        $statuses = [];

        if ($user->driver) {
            $statuses[] = $user->driver->Status;
        }

        if ($user->operator()->exists()) {
            $statuses = array_merge($statuses, $user->operator->pluck('Status')->toArray());
        }

        if ($user->vrOwner) {
            $statuses[] = $user->vrOwner->Status;
        }

        // Prevent login if any related model has 'Banned' Status
        if (in_array('Banned', $statuses)) {
            Auth::guard('web')->logout();

            \DB::table('login_attempts')->insert([
                'user_id' => $user->id,
                'status' => 'Banned',
                'attempted_at' => now(),
            ]);

            return redirect()->route('login')->withErrors(['email' => 'Your account is banned.']);
        }

        // Prevent login if the user is suspended
        if (in_array('Suspended', $statuses)) {
            // Get the last suspension attempt time
            $lastSuspendedAttempt = \DB::table('login_attempts')
                ->where('user_id', $user->id)
                ->where('status', 'Suspended')
                ->latest('attempted_at')
                ->first();

            $suspensionEndTime = $lastSuspendedAttempt
                ? \Carbon\Carbon::parse($lastSuspendedAttempt->attempted_at)->addMinutes(5)
                : now()->addMinutes(5);

            $remainingTime = now()->diffInSeconds($suspensionEndTime, false);

            if ($remainingTime > 0) {
                $formattedTime = gmdate('i:s', $remainingTime);

                // Log the failed suspended login attempt
                \DB::table('login_attempts')->insert([
                    'user_id' => $user->id,
                    'status' => 'Suspended Attempt',
                    'attempted_at' => now(),
                ]);

                Auth::guard('web')->logout();

                return redirect()->route('login')->withErrors([
                    'email' => "Your account is suspended. Try again in $formattedTime minutes.",
                ]);
            }

            // Once suspension expires, update status to Approved
            if ($user->driver()->exists()) {
                $user->driver->update(['Status' => 'Approved']);
            }

            if ($user->operator()->exists()) {
                foreach ($user->operator as $operator) {
                    $operator->update(['Status' => 'Approved']);
                }
            }

            if ($user->vrOwner()->exists()) {
                foreach ($user->vrOwner as $vrOwner) {
                    $vrOwner->update(['Status' => 'Approved']);
                }
            }
        }

        // Log the successful login
        \DB::table('login_attempts')->insert([
            'user_id' => $user->id,
            'status' => 'Success',
            'attempted_at' => now(),
        ]);

        // comment out nalang before tom
        // if (!in_array('Approved', $statuses)) {
        //     Auth::guard('web')->logout();
        //     return redirect()->route('login')->withErrors([
        //         'email' => 'Your account is not approved yet. Please contact support.'
        //     ]);
        // }

        // check if user has a role or has the role NPTC Admin
        if ($user->hasRole(['Temp User'])) {
            $request->session()->regenerate();

            return redirect()->route('registration')->withInput(['Registration' => 'Please input your company details']);
        } elseif ($user->hasRole('Temp User Operator')) {
            $request->session()->regenerate();

            return redirect()->route('create-operator.admin')->withInput(['Registration' => 'Please input your operator details']);
        } elseif ($user->hasRole('Driver')) {
            if ($user->driver->Status != 'Approved') {
                Auth::guard('web')->logout();

                return redirect()->route('login')->withErrors([
                    'email' => 'Your driver account is not approved yet. Please talk to your operator.',
                ]);
            }
            $request->session()->regenerate();

            return redirect()->route('driver.dashboard');
        } elseif ($user->hasRole('VR Admin')) {
    if ($user->vrOwner->Status != 'Approved') {
        $request->session()->regenerate();
        return redirect()->route('mails');
    } else {
        $request->session()->regenerate();
        return redirect()->intended(route('vr-admin.dashboard', absolute: false));
    }
}

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
