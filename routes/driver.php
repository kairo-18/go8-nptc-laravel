<?php
use App\Http\Controllers\DriverController;
use App\Models\Vehicle;
use App\Models\VRCompany;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Driver;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;




Route::post('/drivers', [DriverController::class, 'store'])->name('driver.store');

Route::middleware(['auth', 'role:NPTC Admin|NPTC Super Admin|VR Admin|Operator'])->group(function () {
    Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
});


Route::patch('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');

Route::get('download-driver-media/{mediaId}', [DriverController::class, 'downloadMedia'])
->name('download-driver-media');

Route::get('preview-driver-media/{mediaId}', [DriverController::class, 'previewMedia'])
->name('preview-driver-media');

Route::post('/drivers/{driver}/upload-files', [DriverController::class, 'updateDriverMedia'])->name('driver.upload-files');

Route::delete('/driver/{driver}', [DriverController::class, 'destroy'])
->name('delete-driver');

Route::middleware(['auth'])->get('/driver/trips', [DriverController::class, 'getDriverTrips'])->name('driver.trips');


Route::get('/driver-dashboard', function () {
    return Inertia::render('driver-dashboard');
})->name('driver.dashboard');

Route::patch('driver/updateStatus/{id}', [DriverController::class, 'updateStatus'])->name('driver.updateStatus');

Route::delete('/drivers/{driver}/media', [DriverController::class, 'deleteMedia'])
    ->name('drivers.delete-media');
