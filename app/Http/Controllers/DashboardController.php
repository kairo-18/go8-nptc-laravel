<?php

namespace App\Http\Controllers;

use App\Models\VRCompany;
use App\Models\Operator;
use App\Models\Driver;
use App\Models\ManualPayment;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VehicleRentalOwner;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch all required data
        $vrCompaniesCount = VRCompany::count();
        $activeOperatorsCount = Operator::whereIn('Status', ['Active', 'Approved'])->count();
        $activeDriversCount = Driver::whereIn('Status', ['Active', 'Approved'])->count();
        $pendingPaymentsCount = ManualPayment::where('Status', 'Pending')->count();
        $ongoingTripsCount = Trip::where('status', 'Ongoing')->count();

        // Fetch ongoing bookings with driver's FirstName and LastName
        $ongoingBookings = Trip::where('status', 'Ongoing')
            ->with(['driver.user'])  // Eager load the related user of the driver
            ->get()
            ->map(function ($trip) {
                // Access the driver's FirstName and LastName through the user relationship
                $trip->driver_first_name = $trip->driver->user->FirstName;
                $trip->driver_last_name = $trip->driver->user->LastName;
                return $trip;
            });

        // Pending Registrations count from different models
        $pendingDriversCount = Driver::where('Status', 'Pending')->count();
        $pendingVehicleRentalOwnersCount = VehicleRentalOwner::where('Status', 'Pending')->count();
        $pendingVRCompaniesCount = VRCompany::where('Status', 'Pending')->count();
        $pendingOperatorsCount = Operator::where('Status', 'Pending')->count();

        $pendingRegistrationsCount = $pendingDriversCount + $pendingVehicleRentalOwnersCount + $pendingVRCompaniesCount + $pendingOperatorsCount;

        return Inertia::render('dashboard', [
            'vrCompaniesCount' => $vrCompaniesCount,
            'activeOperatorsCount' => $activeOperatorsCount,
            'activeDriversCount' => $activeDriversCount,
            'pendingPaymentsCount' => $pendingPaymentsCount,
            'ongoingTripsCount' => $ongoingTripsCount,
            'ongoingBookings' => $ongoingBookings,
            'pendingRegistrationsCount' => $pendingRegistrationsCount,  
        ]);
    }

    public function driverDashboard()
    {
        // Get current date, week start, and month start
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        // Fetch scheduled trips for the driver dashboard
        $allTrips = Trip::whereIn('status', ['Scheduled', 'Ongoing', 'Done'])
        ->get()
        ->map(function ($trip) use ($today, $thisWeek, $thisMonth) {
            // Access driver's name
            $trip->driver_first_name = $trip->driver->user->FirstName;
            $trip->driver_last_name = $trip->driver->user->LastName;
    
            $pickupDate = Carbon::parse($trip->pickupDate);

            if ($pickupDate->isToday()) {
                $trip->booking_type = 'Today';
            } elseif ($pickupDate->isAfter($thisWeek) && $pickupDate->isBefore($thisMonth->copy()->addMonth())) {
                $trip->booking_type = 'This Week';
            } elseif ($pickupDate->isAfter($thisMonth->subDay()) && $pickupDate->isBefore($thisMonth->copy()->endOfMonth()->addDay())) { 
                // Include "This Week" in "This Month"
                $trip->booking_type = 'This Month';
            } else {
                $trip->booking_type = 'Earlier';
            }
            return $trip;
        });
    
        $scheduledBookings = Trip::where('status', 'Scheduled')
        ->with(['driver.user', 'vehicle'])  // Include the vehicle relationship
        ->get()
        ->map(function ($trip) use ($today, $thisWeek, $thisMonth) {
            // Access driver's name
            $trip->driver_first_name = $trip->driver->user->FirstName;
            $trip->driver_last_name = $trip->driver->user->LastName;
    
            // Access vehicle model
            $trip->vehicle_model = $trip->vehicle ? $trip->vehicle->PlateNumber : 'No vehicle assigned';
    
            // Access pickup and dropoff addresses
            $trip->pickup_address = $trip->pickupAddress;
            $trip->dropoff_address = $trip->dropOffAddress;
    
            return $trip;
        });
    
        // Group trips by booking type
        $bookingsToday = $allTrips->where('booking_type', 'Today');
        $bookingsThisWeek = $allTrips->where('booking_type', 'This Week');
        $bookingsThisMonth = $allTrips->where('booking_type', 'This Month');

        return Inertia::render('driver-dashboard', [
            'scheduledBookings'=> $scheduledBookings,
            'bookingsToday' => $bookingsToday,
            'bookingsThisWeek' => $bookingsThisWeek,
            'bookingsThisMonth' => $bookingsThisMonth,
        ]);
    }
}
