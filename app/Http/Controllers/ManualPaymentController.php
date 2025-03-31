<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\ManualPayment;
use App\Models\Operator;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManualPaymentController extends Controller
{
    public function show($operatorId)
    {
        // Count drivers and vehicles for the operator
        $driverCount = Driver::where('operator_id', $operatorId)->count();
        $vehicleCount = Vehicle::where('operator_id', $operatorId)->count();

        // Calculate total amount
        $totalAmount = ($driverCount * 5000) + ($vehicleCount * 10000);

        return Inertia::render('Manual-Payment', [
            'operatorId' => $operatorId,
            'totalAmount' => $totalAmount,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'operator_id' => 'required|exists:operators,id',
            'AccountName' => 'required|string',
            'ModePayment' => 'required|string',
            'Receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf',
            'ReferenceNumber' => 'nullable|string',
            'AccountNumber' => 'nullable|string',
            'Notes' => 'nullable|string',
            'Amount' => 'nullable|string',
        ]);

        $manualPayment = ManualPayment::create($validatedData);

        if ($request->hasFile('Receipt')) {
            $media = $manualPayment->addMediaFromRequest('Receipt')->toMediaCollection('receipt', 'private');
            $manualPayment->update(['Receipt' => $media->getPath()]);
        }

        return response()->json([
            'message' => 'Payment recorded successfully',
            'manual_payment' => $manualPayment,
        ]);
    }
}
