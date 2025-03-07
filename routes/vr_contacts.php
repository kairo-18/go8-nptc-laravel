<?php

use App\Http\Controllers\VrContactsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('create-vr-contacts', [VrContactsController::class, 'index'])->name('vr-contacts.index');
    Route::post('vr-contacts.store', [VrContactsController::class, 'store'])->name('vr-contacts.store');
    Route::post('vr-contacts.store-multiple', [VrContactsController::class, 'storeMultiple'])->name('vr-contacts.store-multiple');
});
