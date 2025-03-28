<?php

use App\Http\Controllers\OperatorAdminController;
use App\Models\Operator;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get(
    '/create-operator', function () {
        return Inertia::render('create-operator', [
            'companies' => \App\Models\VRCompany::all(),
        ]);
    }
)->name('create-operator.admin');

Route::get(
    '/operator-admin', function () {
        return Inertia::render('operator-admin');
    }
)->name('operator.admin');
Route::get('/operators', [OperatorAdminController::class, 'index'])->name('operators.index');
Route::get('/operators/create', [OperatorAdminController::class, 'create'])->name('operators.create');
Route::post('operators.store', [OperatorAdminController::class, 'store'])->name('operators.store');
Route::get('/operators/{operator}/edit', [OperatorAdminController::class, 'edit'])->name('operators.edit');
Route::patch('/operators/{operator}', [OperatorAdminController::class, 'update'])->name('operators.update');

Route::delete('/operators/{operator}', [OperatorAdminController::class, 'destroy'])->name('operators.destroy');
Route::get('/operators/{vr_company_id}', function ($vr_company_id) {
    $operators = Operator::where('vr_company_id', $vr_company_id)
        ->with('user')
        ->get();

    return response()->json($operators);
})->name('operators.get');

Route::patch('operator/updateStatus/{id}', [OperatorAdminController::class, 'updateStatus'])->name('operator.updateStatus');
Route::delete('/operators/{operator}', [OperatorAdminController::class, 'destroy'])->name('operators.destroy');

Route::get('/operator/edit/{id}', [OperatorAdminController::class, 'editView'])->name('operator.edit');

// route for edit function in the controller vrcompany
Route::patch('operator/update/{operator}', [OperatorAdminController::class, 'update'])->name('operator.update');

Route::get('download-operator-media/{mediaId}', [OperatorAdminController::class, 'downloadMedia'])
    ->name('download-operator-media');

Route::get('preview-operator-media/{mediaId}', [OperatorAdminController::class, 'previewMedia'])
    ->name('preview-operator-media');

Route::post('/operators/{operator}/upload-files', [OperatorAdminController::class, 'updateOperatorMedia'])->name('operator.upload-files');

Route::patch('operator/updateStatus/{id}', [OperatorAdminController::class, 'updateStatus'])->name('operator.updateStatus');

Route::delete('/operators/{operator}/media', [OperatorAdminController::class, 'deleteMedia'])->name('delete-operator-media');
