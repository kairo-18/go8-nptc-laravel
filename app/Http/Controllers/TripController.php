<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TripController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'general.unitId' => 'required|integer',
            'general.driverId' => 'required|integer',
            'general.pickupAddress' => 'required|string|max:255',
            'general.dropoffAddress' => 'required|string|max:255',
            'general.pickupDate.day' => 'required|digits_between:1,2',
            'general.pickupDate.month' => 'required|digits_between:1,2',
            'general.pickupDate.year' => 'required|digits:4',
            'general.pickupDate.hours' => 'required|digits_between:1,2|between:0,23',
            'general.pickupDate.minutes' => 'required|digits_between:1,2|between:0,59',
            'general.dropoffDate.day' => 'required|digits_between:1,2',
            'general.dropoffDate.month' => 'required|digits_between:1,2',
            'general.dropoffDate.year' => 'required|digits:4',
            'general.dropoffDate.hours' => 'required|digits_between:1,2|between:0,23',
            'general.dropoffDate.minutes' => 'required|digits_between:1,2|between:0,59',
            'general.tripType' => 'required|string|in:Drop-off,Airport Pick-up,Wedding,City Tour,Vacation,Team Building,Home Transfer,Corporate,Government,Others',
        ]);
        $pickupDate = sprintf(
            '%04d-%02d-%02d %02d:%02d:00',
            $request->input('general.pickupDate.year'),
            $request->input('general.pickupDate.month'),
            $request->input('general.pickupDate.day'),
            $request->input('general.pickupDate.hours'),
            $request->input('general.pickupDate.minutes')
        );

        $dropOffDate = sprintf(
            '%04d-%02d-%02d %02d:%02d:00',
            $request->input('general.dropoffDate.year'),
            $request->input('general.dropoffDate.month'),
            $request->input('general.dropoffDate.day'),
            $request->input('general.dropoffDate.hours'),
            $request->input('general.dropoffDate.minutes')
        );

        if (strtotime($pickupDate) >= strtotime($dropOffDate)) {
            return response()->json([
                'error' => 'The pickup date must be before the drop-off date.',
            ], 400);  // You can change the response code if needed
        }
        $trip = new Trip;
        $trip->vehicle_id = $request->input('general.unitId');
        $trip->driver_id = $request->input('general.driverId');
        $trip->pickupAddress = $request->input('general.pickupAddress');
        $trip->dropOffAddress = $request->input('general.dropoffAddress');
        $trip->pickupDate = $pickupDate;
        $trip->dropOffDate = $dropOffDate;
        $trip->tripType = $request->input('general.tripType');
        $trip->status = 'Scheduled';

        $trip->save();

        return response()->json([
            'message' => 'Trip created successfully',
            'trip' => $trip,
        ]);
    }

    public function addPassengers(Request $request)
    {
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

    public function generatePaymentLink(Request $request)
    {
        $amount = $request->input('amount', 15000); // Default: 150 PHP

        $description = $request->input('description', 'NPTC Trip Ticket Payment');

        $response = Http::withHeaders([
            'Authorization' => 'Basic '.base64_encode(env('PAY_MONGO_SECRET_KEY').':'),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post('https://api.paymongo.com/v1/links', [
            'data' => [
                'attributes' => [
                    'amount' => $amount,
                    'description' => $description,
                ],
            ],
        ]);

        return response()->json($response->json());
    }

    public function checkStatus($id)
    {
        $apiKey = env('PAY_MONGO_SECRET_KEY');

        $response = Http::withBasicAuth($apiKey, '')
            ->acceptJson()
            ->get("https://api.paymongo.com/v1/links/{$id}");

        return response()->json($response->json());
    }

    public function startTrip($tripId)
    {
        try {
            $trip = Trip::findOrFail($tripId);

            if ($trip->status === 'Ongoing') {
                return response()->json(['message' => 'Trip is already ongoing'], 400);
            }

            $trip->status = 'Ongoing';
            $trip->save();

            return response()->json(['message' => 'Trip started successfully', 'trip' => $trip], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to start trip', 'details' => $e->getMessage()], 500);
        }
    }

    public function endTrip($tripId)
    {
        try {
            $trip = Trip::findOrFail($tripId);

            if ($trip->status === 'Done') {
                return response()->json(['message' => 'Trip is already done'], 400);
            }

            $trip->status = 'Done';
            $trip->save();

            return response()->json(['message' => 'Trip ended successfully', 'trip' => $trip], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to end trip', 'details' => $e->getMessage()], 500);
        }
    }

    public function downloadTripTicket(Trip $trip)
    {
        try {
            $trip = Trip::with('passengers')->findOrFail($trip->id);

            $html = view('trip-ticket-pdf', ['trip' => $trip])->render();

            $pdf = \Spatie\Browsershot\Browsershot::html($html)
                ->format('A4')
                ->margins(10, 10, 10, 10)
                ->noSandbox()
                ->pdf();

            $filename = $trip->driver->operator->vrCompany->CompanyName.'/'.
                        $trip->driver->operator->user->FirstName.' '.$trip->driver->operator->user->LastName.'/'.
                        $trip->driver->user->FirstName.' '.$trip->driver->user->LastName.'/'.
                        date('Y-m-d', strtotime($trip->created_at)).'/'.
                        $trip->id.'.pdf';

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate PDF', 'details' => $e->getMessage()], 500);
        }
    }
}
