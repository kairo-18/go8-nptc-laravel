<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin', [
            'companies' => \App\Models\VRCompany::all(),
        ]);
    })->name('create-vr-admin');

    Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
        Route::get('create-vr-company-page', function () {
            return Inertia::render('create-vr-company', [
                'users' => \App\Models\User::role('VR Admin')->get(),
            ]);
        })->name('create-vr-company-page');

        Route::get('create-vr-admin', function () {
            return Inertia::render('create-vr-admin', [
                'companies' => \App\Models\VRCompany::all(),
            ]);
        })->name('create-vr-admin');

    });

});
