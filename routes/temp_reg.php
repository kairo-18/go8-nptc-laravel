<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NptcAdminController;
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
        }
    );