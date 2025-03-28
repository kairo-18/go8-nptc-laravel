<?php

use App\Http\Controllers\NptcAdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {

    Route::get('nptc-admins', function () {
        return Inertia::render('nptc-admins', [
            'users' => \App\Models\User::role('NPTC Admin')->get(),
        ]);
    })->name('nptc-admins');

    Route::post('create-nptc-admin', [NptcAdminController::class, 'createNPTCAdmin'])
        ->name('create-nptc-admin');

    Route::patch('update-nptc-admin', [NptcAdminController::class, 'updateNPTCAdmin'])
        ->name('update-nptc-admin');

    Route::delete('delete-nptc-admin', [NptcAdminController::class, 'destroy'])
        ->name('delete-nptc-admin');

    Route::get('vr-registration', function () {
        return Inertia::render('vr-registration', [
            'companies' => \App\Models\VRCompany::where('Status', 'Pending')->get()->makeHidden(['created_at', 'updated_at', 'owner', 'operators']),
        ]);
    })->name('vr-registration');

});

Route::group(['middleware' => ['role:NPTC Admin|NPTC Super Admin|Operator|VR Admin|Driver']], function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('pending', function () {
        return Inertia::render('pending');
    })->name('pending');

    Route::get('vr-owner', function () {
        return Inertia::render('records', [
            'users' => \App\Models\User::role('VR Admin')->get(),
            'operators' => \App\Models\Operator::with('user:id,FirstName,LastName')
                ->withCount(['drivers', 'vehicles']) // Include count of drivers and vehicles
                ->get()
                ->makeHidden(['created_at', 'updated_at', 'owner', 'operators']),
            'drivers' => \App\Models\User::role('Driver')
                ->join('drivers', 'users.id', '=', 'drivers.user_id')
                ->get(['drivers.id', 'drivers.user_id', 'drivers.NPTC_ID', 'users.FirstName', 'users.MiddleName', 'users.LastName', 'Status', 'drivers.operator_id'])
                ->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
            'vehicles' => \App\Models\Vehicle::all()
                ->makeHidden(['created_at', 'updated_at', 'operator', 'front_image', 'back_image', 'left_side_image', 'right_side_image', 'or_image', 'cr_image', 'id_card_image', 'gps_certificate_image', 'inspection_certificate_image'])
                ->map(function ($vehicle) {
                    $vehicle->operator_id = $vehicle->operator->id;

                    return $vehicle;
                }),
            'companies' => \App\Models\VRCompany::with('owner.user')->get()->makeHidden(['created_at', 'updated_at', 'owner', 'operators'])->map(function ($company) {
                $company->OwnerName = $company->owner ? $company->owner->user->FirstName.' '.$company->owner->user->LastName : 'No Owner';
                $company->Operators = $company->operators ? $company->operators->count() : 'No Operators';

                return $company;
            }),
            'companiesWithMedia' => \App\Models\VRCompany::with(['owner.user'])->get()->each(function ($company) {
                $company->media_files = $company->getMedia();
            }),
        ]);
    })->name('vr-owner');

    Route::get('op-registration', function () {
        return Inertia::render('op-registration', [
            'operators' => \App\Models\Operator::where('Status', 'Pending')->with('user')->get()->makeHidden(['created_at', 'updated_at', 'owner', 'operators']),
        ]);
    })->name('op-registration');
});

Route::group(['middleware' => ['role:Temp User|NPTC Admin|NPTC Super Admin']], function () {
    Route::get('registration', function () {
        return Inertia::render('registration', [
            'companies' => \App\Models\VRCompany::all(),
        ]);
    })->name('registration');
});
