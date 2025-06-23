<?php

namespace App\Http\Controllers;

use App\Models\VRCompany;
use App\Models\Operator;
use App\Models\Driver;
use App\Models\ManualPayment;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VehicleRentalOwner;
use Illuminate\Support\Facades\Auth;
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

public function vrAdminDashboard()
{
    $user = Auth::user();
    $today = Carbon::today();
    $thisWeek = Carbon::now()->startOfWeek();
    $thisMonth = Carbon::now()->startOfMonth();
    
    // Get the VR Admin's company
    $vrCompany = VehicleRentalOwner::with('vrCompany')
        ->where('user_id', $user->id)
        ->firstOrFail();

    // Active Operators for this VR Company
    $activeOperators = Operator::where('vr_company_id', $vrCompany->vr_company_id)
        ->whereIn('Status', ['Active', 'Approved'])
        ->count();

    // Active Drivers belonging to this VR Company
    $activeDrivers = Driver::where('vr_company_id', $vrCompany->vr_company_id)
        ->whereIn('Status', ['Active', 'Approved'])
        ->count();

    // Get all trips for date filtering
    $allTrips = Trip::whereHas('driver', function($query) use ($vrCompany) {
            $query->where('vr_company_id', $vrCompany->vr_company_id);
        })
        ->whereIn('status', ['Scheduled', 'Ongoing', 'Done'])
        ->with(['driver.user', 'vehicle'])
        ->get()
        ->map(function ($trip) use ($today, $thisWeek, $thisMonth) {
            $pickupDate = Carbon::parse($trip->pickup_date);
            
            // Classify bookings by time period
            $bookingTypes = [];
            
            if ($pickupDate->isToday()) {
                $bookingTypes[] = 'Today';
            }
            
            if ($pickupDate->greaterThanOrEqualTo($thisWeek)) {
                $bookingTypes[] = 'This Week';
            }
            
            if ($pickupDate->greaterThanOrEqualTo($thisMonth)) {
                $bookingTypes[] = 'This Month';
            }
            
            $trip->setAttribute('booking_type', implode(', ', $bookingTypes));
            
            return $trip;
        });

    // Count bookings by period
    $bookingsToday = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'Today'))->count();
    $bookingsThisWeek = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Week'))->count();
    $bookingsThisMonth = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Month'))->count();

    // Scheduled Bookings for display
    $scheduledBookings = $allTrips
        ->where('status', 'Scheduled')
        ->map(function ($trip) {
            return [
                'id' => $trip->id,
                'pickupDate' => $trip->pickup_date,
                'pickupAddress' => $trip->pickup_address,
                'dropOffAddress' => $trip->dropoff_address,
                'driver_first_name' => $trip->driver->user->first_name,
                'driver_last_name' => $trip->driver->user->last_name,
                'vehicle_plate' => $trip->vehicle ? $trip->vehicle->plate_number : 'N/A',
            ];
        });

    // Pending Drivers for this VR Company
    $pendingDrivers = Driver::where('vr_company_id', $vrCompany->vr_company_id)
        ->where('Status', 'Pending')
        ->count();

    return Inertia::render('vr-admin-dashboard', [
        'activeOperatorsCount' => $activeOperators,
        'activeDriversCount' => $activeDrivers,
        'scheduledBookings' => $scheduledBookings,
        'pendingRegistrationsCount' => $pendingDrivers,
        'vrCompanyName' => $vrCompany->vrCompany->CompanyName ?? 'Your Company',
        'bookingsToday' => $bookingsToday,
        'bookingsThisWeek' => $bookingsThisWeek,
        'bookingsThisMonth' => $bookingsThisMonth,
    ]);
}

public function operatorDashboard()
{
    $user = Auth::user();
    $today = Carbon::today();
    $thisWeek = Carbon::now()->startOfWeek();
    $thisMonth = Carbon::now()->startOfMonth();
    
    // Get the Operator record
    $operator = Operator::where('user_id', $user->id)->firstOrFail();

    // Active Drivers managed by this Operator
    $activeDrivers = Driver::where('operator_id', $operator->id)
        ->whereIn('Status', ['Active', 'Approved'])
        ->count();

    // Get all trips for date filtering
    $allTrips = Trip::whereHas('driver', function($query) use ($operator) {
            $query->where('operator_id', $operator->id);
        })
        ->whereIn('status', ['Scheduled', 'Ongoing', 'Done'])
        ->with(['driver.user', 'vehicle'])
        ->get()
        ->map(function ($trip) use ($today, $thisWeek, $thisMonth) {
            $pickupDate = Carbon::parse($trip->pickup_date);
            
            // Classify bookings by time period
            $bookingTypes = [];
            
            if ($pickupDate->isToday()) {
                $bookingTypes[] = 'Today';
            }
            
            if ($pickupDate->greaterThanOrEqualTo($thisWeek)) {
                $bookingTypes[] = 'This Week';
            }
            
            if ($pickupDate->greaterThanOrEqualTo($thisMonth)) {
                $bookingTypes[] = 'This Month';
            }
            
            $trip->setAttribute('booking_type', implode(', ', $bookingTypes));
            
            return $trip;
        });

    // Count bookings by period
    $bookingsToday = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'Today'))->count();
    $bookingsThisWeek = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Week'))->count();
    $bookingsThisMonth = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Month'))->count();

    // Scheduled Bookings for display
    $scheduledBookings = $allTrips
        ->where('status', 'Scheduled')
        ->map(function ($trip) {
            return [
                'id' => $trip->id,
                'pickupDate' => $trip->pickup_date,
                'pickupAddress' => $trip->pickup_address,
                'dropOffAddress' => $trip->dropoff_address,
                'driver_first_name' => $trip->driver->user->first_name,
                'driver_last_name' => $trip->driver->user->last_name,
                'vehicle_plate' => $trip->vehicle ? $trip->vehicle->plate_number : 'N/A',
            ];
        });

    // Pending Drivers managed by this Operator
    $pendingDrivers = Driver::where('operator_id', $operator->id)
        ->where('Status', 'Pending')
        ->count();

    return Inertia::render('operator-dashboard', [
        'activeDriversCount' => $activeDrivers,
        'scheduledBookings' => $scheduledBookings,
        'pendingRegistrationsCount' => $pendingDrivers,
        'operatorName' => $operator->name ?? 'Operator',
        'bookingsToday' => $bookingsToday,
        'bookingsThisWeek' => $bookingsThisWeek,
        'bookingsThisMonth' => $bookingsThisMonth,
    ]);
}

    public function driverDashboard()
    {
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
        
                // Allow multiple classifications
                $bookingTypes = [];
        
                if ($pickupDate->isToday()) {
                    $bookingTypes[] = 'Today'; // Today trips should be counted in all categories
                }
        
                if ($pickupDate->greaterThanOrEqualTo($thisWeek)) {
                    $bookingTypes[] = 'This Week';
                }
        
                if ($pickupDate->greaterThanOrEqualTo($thisMonth)) {
                    $bookingTypes[] = 'This Month';
                }
        
                // Convert array to string for filtering
                $trip->setAttribute('booking_type', implode(', ', $bookingTypes));
        
                return $trip;
            });
        
        // Group trips by booking type
        $bookingsToday = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'Today'))->count();
        $bookingsThisWeek = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Week'))->count();
        $bookingsThisMonth = $allTrips->filter(fn($trip) => str_contains($trip->booking_type, 'This Month'))->count();
    
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
    
   

        return Inertia::render('driver-dashboard', [
            'scheduledBookings'=> $scheduledBookings,
            'bookingsToday' => (string) $bookingsToday,
            'bookingsThisWeek' => (string) $bookingsThisWeek,
            'bookingsThisMonth' => (string) $bookingsThisMonth,
        ]);
    }
}
