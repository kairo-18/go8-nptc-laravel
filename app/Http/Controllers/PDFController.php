<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    public function downloadPDF(Request $request)
    {
        $payload = [
            'name' => $request->input('name', 'John Doe'),
            'company' => $request->input('company', 'ABC Transport Services'),
            'date' => $request->input('date', now()->format('F d, Y')),
        ];

        // Get the certificate type from the request (default to 'nptc-driver-certificate')
        $certificateType = $request->input('certificate_type', 'nptc-driver-certificate');

        // Ensure the requested view exists to avoid errors
        $validCertificates = [
            'nptc-driver-certificate',
            'nptc-operator-certificate',
            'nptc-vehicle-certificate',
            'nptc-vr-company-certificate'
        ];

        if (!in_array($certificateType, $validCertificates)) {
            return response()->json([
                'error' => 'Invalid certificate type',
                'message' => "The requested certificate template does not exist."
            ], 400);
        }

        try {
            // Load the selected certificate template
            $pdf = Pdf::loadView($certificateType, [
                'payload' => $payload,
                'pdf' => true // Pass this variable to hide elements
            ]);

            return $pdf->download('Certificate of Validation.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
