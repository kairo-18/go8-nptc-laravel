<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
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
        // Env vars
        $merchantId = env('PAYNAMICS_MERCHANT_ID');
        $merchantKey = env('PAYNAMICS_MERCHANT_KEY');
        $gatewayUrl = env('PAYNAMICS_GATEWAY_URL');
        $basicAuthUser = env('PAYNAMICS_BASIC_AUTH_USER');
        $basicAuthPass = env('PAYNAMICS_BASIC_AUTH_PASS');
        $returnUrl = env('PAYNAMICS_RETURN_URL');
        $cancelUrl = env('PAYNAMICS_CANCEL_URL');
    
        // Data setup
        $amount = number_format($request->input('amount', 15000), 2, '.', '');
        $requestId = uniqid('PNX');
        $clientIp = $request->ip() ?? '127.0.0.1';
        $hostIp = gethostbyname(gethostname());
    
        $customer = [
            "fname" => $request->input('first_name', 'Juan'),
            "lname" => $request->input('last_name', 'Dela Cruz'),
            "mname" => $request->input('middle_name', 'Amendo'),
            "address1" => $request->input('address1', '123 Main St'),
            "address2" => $request->input('address2', 'bahay kubo'),
            "city" => $request->input('city', 'Manila'),
            "state" => $request->input('state', 'NCR'),
            "country" => $request->input('country', 'PH'),
            "postal" => $request->input('postal', '1000'),
            "email" => $request->input('email', 'test@example.com'),
            "phone" => $request->input('phone', '09613470587'),
            "mobile" => $request->input('mobile', '09171234567'),
            "dob" => $request->input('dob', '2000-01-01'),
        ];
    
        $transaction = [
            "merchant_id" => $merchantId,
            "request_id" => $requestId,
            "ip_address" => $clientIp,
            "client_ip" => $clientIp,
            "host_ip" => $hostIp,
            "notification_url" => $returnUrl,
            "response_url" => $returnUrl,
            "cancel_url" => $cancelUrl,
            "pmethod" => "wallet",
            "pchannel" => "gc",
            "payment_action" => "url_link",
            "processtype" => "1",
            "accttype" => "personal",
            "consumername" => $customer['fname'] . ' ' . $customer['lname'],
            "accountname" => $customer['fname'] . ' ' . $customer['lname'],
            "collection_method" => "single_pay",
            "amount" => $amount,
            "currency" => "PHP",
            "parent_id" => "",
            "mersubid" => "",
            "schedule" => "",
            "deferred_period" => "",
            "deferred_time" => "",
            "dp_balance_info" => "",
            "descriptor_note" => "",
            "payment_notification_status" => "",
            "payment_notification_channel" => "",
        ];
    
        // Generate signature
        $transaction['signature'] = $this->generateTransactionSignature($transaction, $merchantKey);
        $customer['signature'] = $this->generateCustomerSignature($customer, $merchantKey);
    
        // Create final payload
        $finalPayload = [
            "transaction" => $transaction,
            "customer_info" => $customer,
        ];
    
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->withBasicAuth($basicAuthUser, $basicAuthPass)
            ->post($gatewayUrl, $finalPayload);
    
            $responseData = $response->json();
    
            \Log::info('Paynamics API response', [
                'response' => $responseData,
            ]);

    
            return $responseData;
    
        } catch (\Exception $e) {
            \Log::error('Paynamics API Error', ['message' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
   
    
    private function generateTransactionSignature(array $transaction, string $key): string
    {
        $forSign =
            ($transaction['merchant_id'] ?? '') .
            ($transaction['request_id'] ?? '') .
            ($transaction['notification_url'] ?? '') .
            ($transaction['response_url'] ?? '') .
            ($transaction['cancel_url'] ?? '') .
            ($transaction['pmethod'] ?? '') .
            ($transaction['payment_action'] ?? '') .
            ($transaction['schedule'] ?? '') .
            ($transaction['collection_method'] ?? '') .
            ($transaction['deferred_period'] ?? '') .
            ($transaction['deferred_time'] ?? '') .
            ($transaction['dp_balance_info'] ?? '') .
            ($transaction['amount'] ?? '') .
            ($transaction['currency'] ?? '') .
            ($transaction['descriptor_note'] ?? '') .
            ($transaction['payment_notification_status'] ?? '') .
            ($transaction['payment_notification_channel'] ?? '') .
            $key;
    
        \Log::info('Transaction Signature Generation', [
            'concat_string' => $forSign,
            'signature' => hash_hmac('sha512', $forSign, $key),
        ]);
    
        return strtolower(hash_hmac('sha512', $forSign, $key));
    }
    
    private function generateCustomerSignature(array $customer, string $key): string
    {
        $forSign =
            ($customer['fname'] ?? '') .
            ($customer['lname'] ?? '') .
            ($customer['mname'] ?? '') .
            ($customer['email'] ?? '') .
            ($customer['phone'] ?? '') .
            ($customer['mobile'] ?? '') .
            ($customer['dob'] ?? '') .
            $key;
    
        \Log::info('Customer Signature Generation', [
            'concat_string' => $forSign,
            'signature' => hash_hmac('sha512', $forSign, $key),
        ]);
    
        return strtolower(hash_hmac('sha512', $forSign, $key));
    }
     
    
    
    public function handleResponse() {
        return Inertia::render('response-page');
    }
    
    public function handleCancel() {
        return Inertia::render('cancel-page');
    }
    
    public function handleReturn(Request $request) {
        $transactionId = $request->input('request_id');
        $paymentStatus = $request->input('status'); // Assuming Paynamics sends a 'status' parameter
    
        // Find the corresponding transaction in your database (based on the request ID)
        $trip = Trip::where('payment_transaction_id', $transactionId)->first();
    
        if ($trip) {
            // Update the status based on the response
            $trip->payment_status = $paymentStatus;
            $trip->save();
            
            return Inertia::render('return-page', [
                'paymentStatus' => $paymentStatus,
                'transactionId' => $transactionId,
            ]);
        } else {
            // Handle case where the transaction is not found
            return Inertia::render('error-page', ['message' => 'Transaction not found.']);
        }
    }
    
    
    

    public function checkStatus($id)
    {
        // $apiKey = env('PAY_MONGO_SECRET_KEY');

        // $response = Http::withBasicAuth($apiKey, '')
        //     ->acceptJson()
        //     ->get("https://api.paymongo.com/v1/links/{$id}");

        // return response()->json($response->json());
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

    public function generateQr(Trip $trip)
    {
        // Generate Qr that contains the link for download
        $builder = new Builder(
            writer: new PngWriter,
            writerOptions: [],
            validateResult: false,
            data: env('APP_URL').'/trip-ticket/download/'.$trip->id,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            labelText: 'Scan this QR to download the trip ticket pdf',
            labelFont: new OpenSans(20),
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();

        // Generate a data URI to include image data inline (i.e. inside an <img> tag)
        $dataUri = $result->getDataUri();

        return response()->json([
            'message' => 'QR code generated successfully',
            'qr_code' => $dataUri,
        ]);
    }
}
