<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OperatorAdminController;
use App\Http\Controllers\VRCompanyController;
use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\VRAdminController;
use App\Http\Controllers\VrContactsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\NPTCAdminMiddleware;

// Home route
Route::get(
    '/', function () {
        return Inertia::render('welcome');
    }
)->name('home');

// Routes restricted to authenticated and verified users
Route::group(
    ['middleware' => ['auth', 'verified']], function () {

        // Routes restricted to NPTC Admins only
        Route::group(
            ['middleware' => ['role:NPTC Admin|NPTC Super Admin']], function () {
                Route::get(
                    'dashboard', function () {
                        return Inertia::render('dashboard');
                    }
                )->name('dashboard');

                Route::get(
                    'nptc-admins', function () {
                        return Inertia::render(
                            'nptc-admins', [
                            'users' => \App\Models\User::role('NPTC Admin')->get()
                            ]
                        );
                    }
                )->name('nptc-admins');

                Route::get(
                    'vr-owner', function () {
                        return Inertia::render(
                            'records', [
                            'users' => \App\Models\User::role('VR Admin')->get(),
                            'operators' => \App\Models\User::role('Operator')->get()->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
                            'companies' => \App\Models\VRCompany::all()->makeHidden(['created_at', 'updated_at']),
                            'companiesWithMedia' => \App\Models\VRCompany::with(['owner.user'])->get()->each(
                                function ($company) {
                                    $company->media_files = $company->getMedia();
                                }
                            ),
                            ]
                        );
                    }
                )->name('vr-owner');

                Route::get(
                    'pending', function () {
                        return Inertia::render('pending');
                    }
                )->name('pending');

                Route::get(
                    'create-vr-company-page', function () {
                        return Inertia::render(
                            'create-vr-company', [
                            'users' => \App\Models\User::role('VR Admin')->get()
                            ]
                        );
                    }
                )->name('create-vr-company-page');

                Route::get('create-vr-contacts', [VrContactsController::class, 'index'])->name('vr-contacts.index');

                Route::get(
                    'create-vr-admin', function () {
                        return Inertia::render(
                            'create-vr-admin', [
                            'companies' => \App\Models\VRCompany::all()
                            ]
                        );
                    }
                )->name('create-vr-admin');
            }
        );

        //Route for vr-registration
        Route::get(
            'vr-registration', function () {
                return Inertia::render('vr-registration');
            }
        )->name('vr-registration');

        // Registration page exposed to Temp Users
        Route::group(
            ['middleware' => ['role:Temp User|NPTC Admin|NPTC Super Admin']], function () {
                Route::get(
                    'registration', function () {
                        return Inertia::render(
                            'registration', [
                            'companies' => \App\Models\VRCompany::all(),
                            ]
                        );
                    }
                )->name('registration');
            }
        );
    }
);

// NPTC Admin routes
Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
    ->name('create-nptc-admin');

Route::middleware(['auth', 'verified', NPTCAdminMiddleware::class])->group(
    function () {
        Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
        ->name('update-nptc-admin');

        Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
        ->name('delete-nptc-admin');
    }
);

// VR Company routes
Route::get('download-media/{mediaId}', [VRCompanyController::class, 'downloadMedia'])
    ->name('download-media');

Route::get('preview-media/{mediaId}', [VRCompanyController::class, 'previewMedia'])
    ->name('preview-media');

Route::post('vr-company.store', [VRCompanyController::class, 'store'])->name('vr-company.store');

// Contacts routes
Route::post('vr-contacts.store', [VrContactsController::class, 'store'])->name('vr-contacts.store');
Route::post('vr-contacts.store-multiple', [VrContactsController::class, 'storeMultiple'])->name('vr-contacts.store-multiple');

// VR Admin routes
Route::post('vr-admins.store', [VRAdminController::class, 'store'])
    ->name('vr-admins.store');

// Route for temporary registration page
Route::post('temp-registration', [RegisteredUserController::class, 'storeTempAcc'])
    ->name('temp-registration');

//Operator
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

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
