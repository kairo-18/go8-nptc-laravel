<?php

use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/unit-registration', function () {
    $latestVehicle = \App\Models\Vehicle::latest()->with('operator.user', 'operator.vrCompany')->first();
    $companies = \App\Models\VRCompany::all();
    $operators = \App\Models\Operator::with('user')->get();

    return Inertia::render('unit-registration', [
        'latestVehicle' => $latestVehicle ?: null,
        'operator' => $latestVehicle?->operator ?: null,
        'company' => $latestVehicle?->operator?->vrCompany ?: null,
        'companies' => $companies ?: null,
        'operators' => $operators,
    ]);
})->name('unit-registration');

Route::resource('vehicles', VehicleController::class);

Route::get('preview-vehicle-media/{mediaId}', [VehicleController::class, 'previewMedia'])
    ->name('preview-vehicle-media');

Route::post('/vehicles/{vehicle}/upload-files', [VehicleController::class, 'updateVehicleMedia'])->name('vehicle.upload-files');

Route::delete('/vehicles/{vehicle}/media', [VehicleController::class, 'deleteMedia'])
    ->name('vehicles.delete-media');

Route::patch('vehicle/updateStatus/{id}', [VehicleController::class, 'updateStatus'])->name('vehicle.updateStatus');
