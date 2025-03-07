<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OperatorAdminController;
use Inertial\Inertia;

Route::get(
    '/create-operator-admin', function () {
        return Inertia::render('create-operator-admin');
    }
)->name('create-operator.admin');

Route::get(
    '/operator-admin', function () {
        return Inertia::render('operator-admin');
    }
)->name('operator.admin');
Route::get('/operators', [OperatorAdminController::class, 'index'])->name('operators.index');
Route::get('/operators/create', [OperatorAdminController::class, 'create'])->name('operators.create');
Route::post('/operators', [OperatorAdminController::class, 'store'])->name('operators.store');
Route::get('/operators/{operator}/edit', [OperatorAdminController::class, 'edit'])->name('operators.edit');
Route::patch('/operators/{operator}', [OperatorAdminController::class, 'update'])->name('operators.update');
Route::delete('/operators/{operator}', [OperatorAdminController::class, 'destroy'])->name('operators.destroy');