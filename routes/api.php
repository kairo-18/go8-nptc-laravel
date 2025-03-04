<?php

use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\OperatorAdminController;
use App\Http\Controllers\VRAdminController;
use App\Http\Controllers\VrContactsController;
use App\Http\Controllers\VRCompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\Auth\RegisteredUserController;
use function Pest\Laravel\json;

Route::get('/user', function () {
    return response()->json("HELLO WORLD");
});

//Route For Temporary registration page
Route::post('temp-registration', [RegisteredUserController::class, 'storeTempAcc'])
    ->name('temp-registaration');

// Default API response
Route::get('/', function () {
    return response()->json(['message' => 'API is working'], 200);
});

// NPTC Admin API Routes
Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
    ->name('create-nptc-admin');

Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
    ->name('update-nptc-admin');

Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
    ->name('delete-nptc-admin');

// VR Company API Routes
Route::get('download-media/{mediaId}', [VRCompanyController::class, 'downloadMedia'])
    ->name('download-media');

Route::get('preview-media/{mediaId}', [VRCompanyController::class, 'previewMedia'])
    ->name('preview-media');

Route::post('vr-company', [VRCompanyController::class, 'store'])
    ->name('vr-company.store');

// VR Contacts API Routes
Route::get('vr-contacts', [VrContactsController::class, 'index'])
    ->name('vr-contacts.index');

Route::post('vr-contacts', [VrContactsController::class, 'store'])
    ->name('vr-contacts.store');

Route::post('vr-contacts/multiple', [VrContactsController::class, 'storeMultiple'])
    ->name('vr-contacts.store-multiple');

// VR Admin API Routes
Route::post('vr-admins', [VRAdminController::class, 'store'])
    ->name('vr-admins.store');

Route::apiResource('operators', OperatorAdminController::class);


// Catch-all for unhandled API routes
Route::fallback(function () {
    return response()->json(['error' => 'Route not found'], 404);
});

