<?php

use App\Http\Controllers\VRCompanyController;
use App\Models\VrContacts;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\NPTCAdminMiddleware;
use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\VRAdminController;
use App\Http\Controllers\VrContactsController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', NPTCAdminMiddleware::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('nptc-admins', function () {
        return Inertia::render('nptc-admins', [
            'users' => \App\Models\User::role('NPTC Admin')->get()
        ]);
    })->name('dashboard');
    Route::get('vr-owner', function () {
        return Inertia::render('vr-admin', [
            'users' => \App\Models\User::role('VR Admin')->get(),
            'companies' => \App\Models\VRCompany::with(['owner.user'])->get()->each(function ($company) {
                $company->media_files = $company->getMedia(); // Fetch all media files
            }),
        ]);
    })->name('vr-owner');
});

    Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
        ->name('create-nptc-admin');
Route::middleware('auth', 'verified', NPTCAdminMiddleware::class)->group(function () {

    Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
        ->name('update-nptc-admin');

    Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
        ->name('delete-nptc-admin');
});


//Registration page on the sidebar
Route::get('registration', function(){
    return Inertia::render('registration', [
        'companies' => \App\Models\VRCompany::all(),
    ]);
})->name('registration');

Route::get('pending', function(){
    return Inertia::render('pending');
})->name('registration');


//move to vr company controller
Route::get('create-vr-company-page', function () {
    return Inertia::render('create-vr-company', [
        'users' => \App\Models\User::role('VR Admin')->get()
    ]);
})->name('create-vr-company-page');

//VR Company
Route::get('download-media/{mediaId}', [VRCompanyController::class, 'downloadMedia'])
    ->name('download-media');

Route::get('preview-media/{mediaId}', [VRCompanyController::class, 'previewMedia'])
    ->name('preview-media');

Route::post('vr-company.store', [VRCompanyController::class, 'store'])->name('vr-company.store');

//Contacts
Route::get('create-vr-contacts', [VrContactsController::class, 'index'])->name('vr-contacts.index');
Route::post('vr-contacts.store', [VrContactsController::class, 'store'])->name('vr-contacts.store');
Route::post('vr-contacts.store-multiple', [VrContactsController::class, 'storeMultiple'])->name('vr-contacts.store-multiple');

//VR Admin
Route::get('create-vr-admin', function () {
    return Inertia::render('create-vr-admin', [
        'companies' => \App\Models\VRCompany::all()
    ]);
})->name('create-vr-admin');

Route::post('vr-admins.store', [VRAdminController::class, 'store'])
    ->name('vr-admins.store');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
