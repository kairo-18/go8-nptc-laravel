<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;

class TripController extends Controller
{
    public function store(Request $request) {
    $request->validate([
        'general.unitId' => 'required|integer',
        'general.driverId' => 'required|integer',
        'general.pickupAddress' => 'required|string|max:255',
        'general.dropoffAddress' => 'required|string|max:255',
        'general.pickupDate.day' => 'required|digits_between:1,2',
        'general.pickupDate.month' => 'required|digits_between:1,2',
        'general.pickupDate.year' => 'required|digits:4',
        'general.dropoffDate.day' => 'required|digits_between:1,2',
        'general.dropoffDate.month' => 'required|digits_between:1,2',
        'general.dropoffDate.year' => 'required|digits:4',
        'general.tripType' => 'required|string|in:Drop-off,Airport Pick-up,Wedding,City Tour,Vacation,Team Building,Home Transfer,Corporate,Government,Others',
    ]);
        $pickupDate = sprintf(
            '%04d-%02d-%02d 00:00:00',
            $request->input('general.pickupDate.year'),
            $request->input('general.pickupDate.month'),
            $request->input('general.pickupDate.day')
        );

        $dropOffDate = sprintf(
            '%04d-%02d-%02d 00:00:00',
            $request->input('general.dropoffDate.year'),
            $request->input('general.dropoffDate.month'),
            $request->input('general.dropoffDate.day')
        );

        $trip = new Trip();
        $trip->vehicle_id = $request->input('general.unitId');
        $trip->driver_id = $request->input('general.driverId');
        $trip->pickupAddress = $request->input('general.pickupAddress');
        $trip->dropOffAddress = $request->input('general.dropoffAddress');
        $trip->pickupDate = $pickupDate;
        $trip->dropOffDate = $dropOffDate;
        $trip->tripType = $request->input('general.tripType');

        $trip->save();

        return response()->json([
            'message' => 'Trip created successfully',
            'trip' => $trip,
        ]);
    }

    public function addPassengers(Request $request){
        $request->validate([
            'tripId' => 'required|integer',
            'passengers' => 'required|array',
            'passengers.*.FirstName' => 'required|string|max:255',
            'passengers.*.LastName' => 'required|string|max:255',
            'passengers.*.ContactNumber' => 'required|string|max:255',
            'passengers.*.Address' => 'required|string|max:255',
        ]);

        $trip = Trip::findOrFail($request->input('tripId'));

        foreach ($request->input('passengers') as $passenger) {
            $trip->passengers()->create($passenger);
        }

        return response()->json([
            'message' => 'Passengers added successfully',
            'trip' => $trip,
        ]);
    }

}
