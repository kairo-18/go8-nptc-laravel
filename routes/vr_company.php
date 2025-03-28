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

    Route::get('/vr-company/edit/{id}', [VRCompanyController::class, 'editView'])->name('company.edit');

    // route for edit function in the controller vrcompany
    Route::patch('vr-company/edit', [VRCompanyController::class, 'edit'])->name('company.update');

    Route::patch('vr-company/updateStatus/{id}', [VRCompanyController::class, 'updateStatus'])->name('vr-company.updateStatus');

    Route::delete('/vr-company/delete-media/{media}', [VRCompanyController::class, 'deleteMedia']);

});
