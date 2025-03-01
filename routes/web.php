<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\NPTCAdminMiddleware;
use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\VRAdminController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', NPTCAdminMiddleware::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', NPTCAdminMiddleware::class])->group(function () {
    Route::get('nptc-admins', function () {
        return Inertia::render('nptc-admins', [
            'users' => \App\Models\User::role('NPTC Admin')->get()
        ]);
    })->name('dashboard');
}); 

Route::middleware('auth', 'verified', NPTCAdminMiddleware::class)->group(function () {
    Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
        ->name('create-nptc-admin');

    Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
        ->name('update-nptc-admin');

    Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
        ->name('delete-nptc-admin');
});

Route::get('vr-owner', function () {
    return Inertia::render('vr-admin', [
        'users' => \App\Models\User::role('VR Admin')->get()
    ]);
})->name('vr-owner');

    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin');
    })->name('create-vr-admin');

    Route::post('vr-admins.store', [VRAdminController::class, 'store'])
        ->name('vr-admins.store');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
