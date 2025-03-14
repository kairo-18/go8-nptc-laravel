<?php

use App\Http\Controllers\VRCompanyController;
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

    Route::get('/vr-company/edit/{id}', [VRCompanyController::class, 'editView'])->name('company.edit');

    //route for edit function in the controller vrcompany
    Route::patch('vr-company/edit', [VRCompanyController::class, 'edit'])->name('company.update');

    Route::patch('vr-company/updateStatus/{id}', [VRCompanyController::class, 'updateStatus'])->name('vr-company.updateStatus');

});
