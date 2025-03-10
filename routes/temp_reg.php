<?php

use App\Http\Controllers\VRAdminController;
use App\Http\Controllers\VrContactsController;
use App\Http\Controllers\VRCompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use Inertia\Inertia;

Route::post('temp-registration', [RegisteredUserController::class, 'storeTempAcc'])
    ->name('temp-registration');

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

        Route::post('vr-company.store', [VRCompanyController::class, 'store'])->name('vr-company.store');

        Route::post('vr-admins.store', [VRAdminController::class, 'store'])
            ->name('vr-admins.store');

        Route::patch('vr-admins.update', [VRAdminController::class, 'update'])->name('vr-admins.update');
        Route::patch('vr-company.update', [VRCompanyController::class, 'update'])
            ->name('vr-company.update');
        Route::post('vr-company.upload-files', [VRCompanyController::class, 'uploadMedia'])->name('vr-company.upload-files');

        Route::patch('vr-contacts.update', [VrContactsController::class, 'update'])->name('vr-contacts.update');
        Route::patch('vr-contacts.update-multiple', [VrContactsController::class, 'updateMultiple'])->name('vr-contacts.update-multiple');
    }
);

