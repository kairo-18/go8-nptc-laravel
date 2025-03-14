<?php
use App\Http\Controllers\DriverController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Driver;  
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

Route::get('/create-driver', function () {
    return Inertia::render('create-driver',['companies' => \App\Models\VRCompany::all()]);
})->name('create-driver');

Route::post('/drivers', [DriverController::class, 'store'])->name('driver.store');

Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');

Route::get('download-driver-media/{mediaId}', [DriverController::class, 'downloadMedia'])
->name('download-driver-media');

Route::get('preview-driver-media/{mediaId}', [DriverController::class, 'previewMedia'])
->name('preview-driver-media');










