<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $trips = Trip::with(['driver.user', 'vehicle'])
            ->whereNotNull('pickupDate')
            ->get()
            ->map(function ($trip) {
                return [
                    'id' => $trip->id,
                    'pickupDate' => $trip->pickupDate,
                    'dropoffDate' => $trip->dropoffDate,
                    'pickupAddress' => $trip->pickupAddress,
                    'dropoffAddress' => $trip->dropoffAddress,
                    'tripType' => $trip->tripType,
                    'status' => $trip->status,
                    'NPTC_ID' => $trip->NPTC_ID,
                    'driver_id' => $trip->driver_id,
                    'vehicle_id' => $trip->vehicle_id,
                    'driver_first_name' => $trip->driver && $trip->driver->user ? $trip->driver->user->FirstName : null,
                    'driver_last_name' => $trip->driver && $trip->driver->user ? $trip->driver->user->LastName : null,
                    'vehicle_model' => $trip->vehicle ? $trip->vehicle->Model : null,
                    'vehicle_plate' => $trip->vehicle ? $trip->vehicle->PlateNumber : null,
                ];
            });

        return response()->json($trips);
    }
}