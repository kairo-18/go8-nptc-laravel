<?php

namespace App\Observers;

use App\Mail\VrCompanyEmail;
use App\Models\VehicleRentalOwner;
use Illuminate\Support\Facades\Mail as IlluminateMail;

class VrOwnerObserver
{
    /**
     * Handle the VehicleRentalOwner "created" event.
     */
    public function created(VehicleRentalOwner $vehicleRentalOwner): void
    {
        //
    }

    /**
     * Handle the VehicleRentalOwner "updated" event.
     */
    public function updated(VehicleRentalOwner $vehicleRentalOwner): void
    {
        //
        $vehicleRentalOwner->load('vrCompany');

        if ($vehicleRentalOwner->isDirty('Status')) {
            $email = $vehicleRentalOwner->user->email;
            $userName = $vehicleRentalOwner->user->FirstName.' '.$vehicleRentalOwner->user->LastName.' ';
            $companyName = $vehicleRentalOwner->vrCompany->CompanyName;

            IlluminateMail::to($email)->send(new VrCompanyEmail($companyName, $userName, $vehicleRentalOwner->Status));
        }
    }

    /**
     * Handle the VehicleRentalOwner "deleted" event.
     */
    public function deleted(VehicleRentalOwner $vehicleRentalOwner): void
    {
        //
    }

    /**
     * Handle the VehicleRentalOwner "restored" event.
     */
    public function restored(VehicleRentalOwner $vehicleRentalOwner): void
    {
        //
    }

    /**
     * Handle the VehicleRentalOwner "force deleted" event.
     */
    public function forceDeleted(VehicleRentalOwner $vehicleRentalOwner): void
    {
        //
    }
}
