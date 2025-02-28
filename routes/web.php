<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\NPTCAdminMiddleware;

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
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
