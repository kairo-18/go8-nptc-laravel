<?php

use App\Http\Controllers\VRAdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin', [
            'companies' => \App\Models\VRCompany::all(),
        ]);
    })->name('create-vr-admin');

 Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('vr-owner', function () {
       return Inertia::render('records', [
          'users' => \App\Models\User::role('VR Admin')->get(),
                'operators' => \App\Models\Operator::withCount(['vehicles', 'drivers'])
                    ->join('users', 'users.id', '=', 'operators.user_id')
                    ->get(['Status','users.FirstName', 'users.LastName', 'operators.vr_company_id', 'operators.id', 'operators.vehicles_count', 'operators.drivers_count'])
                    ->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
                'drivers' => \App\Models\User::role('Driver')
                    ->join('drivers', 'users.id', '=', 'drivers.user_id')
                    ->get(['drivers.id', 'users.FirstName','users.MiddleName', 'users.LastName', 'Status', 'drivers.operator_id'])
                    ->makeHidden(['created_at', 'updated_at', 'email_verified_at']),
                'vehicles' => \App\Models\Vehicle::all()
                    ->makeHidden(['created_at', 'updated_at', 'operator','front_image','back_image','left_side_image','right_side_image','or_image','cr_image','id_card_image','gps_certificate_image','inspection_certificate_image'])
                    ->map(function ($vehicle) {
                        $vehicle->operator_id = $vehicle->operator->id;
                        return $vehicle;
                    }),
                'companies' => \App\Models\VRCompany::with('owner.user')->get()->makeHidden(['created_at', 'updated_at', "owner", "operators"])->map(function ($company) {
                    $company->OwnerName = $company->owner ? $company->owner->user->FirstName . " "  . $company->owner->user->LastName : 'No Owner';
                    $company->Operators = $company->operators ? $company->operators->count() : "No Operators";
                    return $company;
                }),
                'companiesWithMedia' => \App\Models\VRCompany::with(['owner.user'])->get()->each(function ($company) {
                    $company->media_files = $company->getMedia();
                }),
            ]);
        })->name('vr-owner');
    });

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin'])->group(function () {
    Route::get('create-vr-company-page', function () {
        return Inertia::render('create-vr-company', [
            'users' => \App\Models\User::role('VR Admin')->get()
        ]);
    })->name('create-vr-company-page');

    Route::get('create-vr-admin', function () {
        return Inertia::render('create-vr-admin', [
            'companies' => \App\Models\VRCompany::all()
        ]);
    })->name('create-vr-admin');

    });

});


