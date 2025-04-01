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
            return redirect()->route('login')->withErrors(['email' => 'Your account is banned.']);
        }
    
        // Handle suspended status with a timer
        if (in_array('Suspended', $statuses)) {
            $suspensionEndTime = cache()->rememberForever('suspension_'.$user->id, function () {
                return now()->addMinutes(5);
            });
        
            $remainingTime = now()->diffInSeconds($suspensionEndTime, false); 
        
            if ($remainingTime > 0) { 
                $formattedTime = gmdate("i:s", $remainingTime); 
        
                Auth::guard('web')->logout();
                return redirect()->route('login')->withErrors([
                    'email' => "Your account is suspended. Try again in $formattedTime minutes."
                ]);
            }
        
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
        
            cache()->forget('suspension_'.$user->id); 
        }

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
