<?php
use App\Http\Controllers\DriverController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/create-driver', function () {
    return Inertia::render('create-driver',['companies' => \App\Models\VRCompany::all()]);
})->name('create-driver');

Route::post('/drivers', [DriverController::class, 'store'])->name('driver.store');

use App\Models\Driver;

Route::get('/drivers', function () {
    return Inertia::render('drivers', [
        'drivers' => Driver::with(['user', 'operator.user', 'vrCompany']) // Load related models
            ->get()
            ->map(function ($driver) {
                return [
                    'id' => $driver->id,
                    'FirstName' => $driver->user->FirstName,
                    'LastName' => $driver->user->LastName,
                    'username' => $driver->user->username,
                    'email' => $driver->user->email,
                    'ContactNumber' => $driver->user->ContactNumber,
                    'LicenseNumber' => $driver->LicenseNumber,
                    'Status' => $driver->Status,
                    'operator' => $driver->operator ? [
                        'id' => $driver->operator->id,
                        'FirstName' => $driver->operator->user->FirstName ?? 'N/A', // Access operator's user FirstName
                        'LastName' => $driver->operator->user->LastName ?? 'N/A', // Access operator's user LastName
                    ] : null,
                    'vrCompany' => $driver->vrCompany ? [
                        'id' => $driver->vrCompany->id,
                        'CompanyName' => $driver->vrCompany->CompanyName ?? 'N/A',
                    ] : null,
                ];
            })
    ]);
})->name('drivers.index');





