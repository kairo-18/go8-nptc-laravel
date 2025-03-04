<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VRCompany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Inertia\Inertia;
use Inertia\Response;

class VRCompanyController extends Controller
{
    public function store(Request $request)
    {
        // Validate input fields and file uploads
        $request->validate([
            'CompanyName' => 'required|string',
            'BusinessPermitNumber' => 'required|integer',
            'BusinessPermit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_2303' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'DTI_Permit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BrandLogo' => 'nullable|file|mimes:jpg,png|max:1024',
            'SalesInvoice' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);


        $vrCompany = VRCompany::create([
            'BusinessPermitNumber' => $request->BusinessPermitNumber,
            "CompanyName" => $request->CompanyName,
        ]);

        // Upload media files (only if provided)
        if ($request->hasFile('BusinessPermit')) {
            $vrCompany->addMediaFromRequest('BusinessPermit')->toMediaCollection('business_permit', 'private');
        }

        if ($request->hasFile('BIR_2303')) {
            $vrCompany->addMedia($request->file('BIR_2303'))->toMediaCollection('bir_2303', 'private');
        }

        if ($request->hasFile('DTI_Permit')) {
            $vrCompany->addMedia($request->file('DTI_Permit'))->toMediaCollection('dti_permit', 'private');
        }

        if ($request->hasFile('BrandLogo')) {
            $vrCompany->addMedia($request->file('BrandLogo'))->toMediaCollection('brand_logo', 'private');
        }

        if ($request->hasFile('SalesInvoice')) {
            $vrCompany->addMedia($request->file('SalesInvoice'))->toMediaCollection('sales_invoice', 'private');
        }

        \Log::info('VR Company created successfully', ['id' => $vrCompany->id]);
    }

    public function downloadMedia($mediaId)
    {
        $media = Media::findOrFail($mediaId);
        return response()->download($media->getPath());
    }

    public function previewMedia($mediaId)
    {
        $media = Media::findOrFail($mediaId);
        $filePath = $media->getPath();
        $mimeType = $media->mime_type;

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->file($filePath, ['Content-Type' => $mimeType]);
    }

    public function registrationPage(): Response
    {
        $companies = VRCompany::select('id', 'BusinessPermitNumber')->get();

        return Inertia::render('registration', [
            'companies' => $companies
        ]);
    }
}
