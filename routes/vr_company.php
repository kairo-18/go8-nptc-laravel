<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-company-page', function () {
        return Inertia::render('create-vr-company', [
            'users' => \App\Models\User::role('VR Admin')->get(),
        ]);
    })->name('create-vr-company-page');

    Route::get('download-media/{mediaId}', [VRCompanyController::class, 'downloadMedia'])
        ->name('download-media');

    Route::get('preview-media/{mediaId}', [VRCompanyController::class, 'previewMedia'])
        ->name('preview-media');

    Route::post('vr-company.store', [VRCompanyController::class, 'store'])->name('vr-company.store');
});
