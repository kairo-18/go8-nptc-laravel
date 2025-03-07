<?php

use App\Http\Controllers\VRAdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin', [
            'companies' => \App\Models\VRCompany::all(),
        ]);
    })->name('create-vr-admin');

 Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('vr-owner', function () {
       return Inertia::render('records', [
          'users' => \App\Models\User::role('VR Admin')->get(),
             'operators' => \App\Models\User::role('Operator')
                    ->join('operators', 'users.id', '=', 'operators.user_id')
                    ->get(['users.id', 'users.FirstName', 'users.LastName', 'operators.vr_company_id'])
                    ->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
                'drivers' => \App\Models\User::role('Driver')
                    ->join('drivers', 'users.id', '=', 'drivers.user_id')
                    ->get(['users.id', 'users.FirstName', 'users.LastName', 'drivers.operator_id'])
                    ->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
                'vehicles' => \App\Models\Vehicle::all()
                    ->makeHidden(['created_at', 'updated_at', 'operator'])
                    ->map(function ($vehicle) {
                        $vehicle->operator_id = $vehicle->operator->id;
                        return $vehicle;
                    }),
                'companies' => \App\Models\VRCompany::all()->makeHidden(['created_at', 'updated_at']),
                'companiesWithMedia' => \App\Models\VRCompany::with(['owner.user'])->get()->each(function ($company) {
                    $company->media_files = $company->getMedia();
                }),
            ]);
        })->name('vr-owner');
    });

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-company-page', function () {
        return Inertia::render('create-vr-company', [
            'users' => \App\Models\User::role('VR Admin')->get()
        ]);
    })->name('create-vr-company-page');

    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin', [
            'companies' => \App\Models\VRCompany::all()
        ]);
    })->name('create-vr-admin');

    Route::post('vr-admins.store', [VRAdminController::class, 'store'])
        ->name('vr-admins.store');
    });

});
