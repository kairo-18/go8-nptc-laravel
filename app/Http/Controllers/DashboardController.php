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
        $user = auth()->user();
        $isVrAdmin = $user && $user->roles->contains('name', 'VR Admin');
        $isOperator = $user && $user->roles->contains('name', 'Operator');
        $vrCompanyId = null;
        $operatorId = null;

        if ($isVrAdmin) {
            $vrCompanyId = optional($user->vrOwner?->vrCompany)->id;
        }

        if ($isOperator) {
            $operator = $user->operator()->first();
            $vrCompanyId = optional($operator?->vrCompany)->id;

            $operatorId = $operator?->id;
        }

        // Fetch all required data
        $vrCompaniesCount = VRCompany::count();

        if ($isVrAdmin && $vrCompanyId) {
            // Filtered counts for VR Admin
            $activeOperatorsCount = Operator::where('vr_company_id', $vrCompanyId)
                ->whereIn('Status', ['Active', 'Approved'])
                ->count();

            $activeDriversCount = Driver::where('vr_company_id', $vrCompanyId)
                ->whereIn('Status', ['Active', 'Approved'])
                ->count();

            $pendingPaymentsCount = ManualPayment::where('Status', 'Pending')
                ->whereIn('operator_id', function ($query) use ($vrCompanyId) {
                    $query->select('id')
                        ->from('operators')
                        ->where('vr_company_id', $vrCompanyId);
                })
                ->count();

            $ongoingTripsCount = Trip::where('status', 'Scheduled')
                ->whereIn('driver_id', function ($sub) use ($vrCompanyId) {
                    $sub->select('id')
                        ->from('drivers')
                        ->where('vr_company_id', $vrCompanyId);
                })
                ->count();

            $ongoingBookings = Trip::where('status', 'Scheduled')
                ->whereIn('driver_id', function ($sub) use ($vrCompanyId) {
                    $sub->select('id')
                        ->from('drivers')
                        ->where('vr_company_id', $vrCompanyId);
                })
                ->with(['driver.user'])
                ->get()
                ->map(function ($trip) {
                    $trip->driver_first_name = $trip->driver->user->FirstName;
                    $trip->driver_last_name = $trip->driver->user->LastName;
                    return $trip;
                });

            $pendingDriversCount = Driver::where('vr_company_id', $vrCompanyId)
                ->whereIn('Status', ['For Payment', 'For NPTC Approval', 'For VR Approval'])
                ->count();

            $pendingVehicleRentalOwnersCount = VehicleRentalOwner::where('vr_company_id', $vrCompanyId)
                ->whereIn('Status', ['For VR Approval', 'For NPTC Approval', 'For Payment'])
                ->count();

            $pendingVRCompaniesCount = 0; // VR Admins don't see pending VR companies
            $pendingOperatorsCount = Operator::where('vr_company_id', $vrCompanyId)
                ->whereIn('Status', ['For VR Approval', 'For NPTC Approval', 'For Payment'])
                ->count();

            $pendingRegistrationsCount = $pendingDriversCount + $pendingVehicleRentalOwnersCount + $pendingVRCompaniesCount + $pendingOperatorsCount;
        } else if ($isOperator && $vrCompanyId) {
            $activeOperatorsCount = 0;
            $activeDriversCount = Driver::whereIn('Status', ['Active', 'Approved'])->count();
            $activeVehiclesCount = Vehicle::where('operator_id', $operatorId)
                ->whereIn('Status', ['Active', 'Approved'])
                ->count();
            $pendingPaymentsCount = 0;
            $ongoingTripsCount = 0;

            $ongoingBookings = Trip::where('status', 'Scheduled')
                ->with(['driver.user'])
                ->get()
                ->map(function ($trip) {
                    $trip->driver_first_name = $trip->driver->user->FirstName;
                    $trip->driver_last_name = $trip->driver->user->LastName;
                    return $trip;
                });

                $pendingDriversCount = 0;
                $pendingVehicleRentalOwnersCount = 0;
                $pendingVRCompaniesCount = 0; // VR Admins don't see pending VR companies
                $pendingOperatorsCount = 0;

                $pendingRegistrationsCount = $pendingDriversCount + $pendingVehicleRentalOwnersCount + $pendingVRCompaniesCount + $pendingOperatorsCount;
        } else {
            // Global counts for other roles
            $activeOperatorsCount = Operator::whereIn('Status', ['Active', 'Approved'])->count();
            $activeDriversCount = Driver::whereIn('Status', ['Active', 'Approved'])->count();
            $pendingPaymentsCount = ManualPayment::where('Status', 'Pending')->count();
            $ongoingTripsCount = Trip::where('status', 'Scheduled')->count();

            $ongoingBookings = Trip::where('status', 'Scheduled')
                ->with(['driver.user'])
                ->get()
                ->map(function ($trip) {
                    $trip->driver_first_name = $trip->driver->user->FirstName;
                    $trip->driver_last_name = $trip->driver->user->LastName;
                    return $trip;
                });

            $pendingDriversCount = Driver::where('Status', 'Pending')->count();
            $pendingVehicleRentalOwnersCount = VehicleRentalOwner::where('Status', 'Pending')->count();
            $pendingVRCompaniesCount = VRCompany::where('Status', 'Pending')->count();
            $pendingOperatorsCount = Operator::where('Status', 'Pending')->count();

            $pendingRegistrationsCount = $pendingDriversCount + $pendingVehicleRentalOwnersCount + $pendingVRCompaniesCount + $pendingOperatorsCount;
        }

        return Inertia::render('dashboard', [
            'vrCompaniesCount' => $vrCompaniesCount,
            'activeOperatorsCount' => $activeOperatorsCount,
            'activeDriversCount' => $activeDriversCount,
            'activeVehiclesCount' => $activeVehiclesCount ?? 0,
            'pendingPaymentsCount' => $pendingPaymentsCount,
            'ongoingTripsCount' => $ongoingTripsCount,
            'ongoingBookings' => $ongoingBookings,
            'pendingRegistrationsCount' => $pendingRegistrationsCount,
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
