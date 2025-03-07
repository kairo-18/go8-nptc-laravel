<?php

use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\VRCompanyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('nptc-admins', function () {
        return Inertia::render('nptc-admins', [
            'users' => \App\Models\User::role('NPTC Admin')->get()
        ]);
    })->name('nptc-admins');
    Route::get('pending', function () {
        return Inertia::render('pending');
         })->name('pending');

    Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
        ->name('create-nptc-admin');

    Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
        ->name('update-nptc-admin');

    Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
        ->name('delete-nptc-admin');

        Route::get('vr-registration', function () {
            return Inertia::render('vr-registration');
            })->name('vr-registration');

});

Route::group(
    ['middleware' => ['role:Temp User|NPTC Admin|NPTC Super Admin']], function () {
        Route::get(
            'registration', function () {
                return Inertia::render(
                    'registration', [
                    'companies' => \App\Models\VRCompany::all(),
                    ]
                );
            }
        )->name('registration');
    }
);
