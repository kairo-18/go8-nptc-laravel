<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VRCompany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use function Laravel\Prompts\warning;

class VRCompanyController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Update Request Data:', $request->all());

        // Validate input fields and file uploads
        $request->validate(
            [
            'CompanyName' => 'required|string',
            'BusinessPermitNumber' => 'required|integer',
            'BusinessPermit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_2303' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'DTI_Permit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BrandLogo' => 'nullable|file|mimes:jpg,png|max:1024',
            'SalesInvoice' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            ]
        );


        $userRoles = Auth::user()->getRoleNames();

        $vrCompany = VRCompany::create(
            [
            'BusinessPermitNumber' => $request->BusinessPermitNumber,
            "CompanyName" => $request->CompanyName,
            "Status" => $userRoles->contains('NPTC Super Admin') || $userRoles->contains('NPTC Admin') ? 'Approved' : 'Pending',
            ]
        );

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

        \Log::info('VR Company created successfully', ['id' => $vrCompany->id], $request->all());
        \Log::info('VR Company created successfully', ['id' => $vrCompany->id, 'files' => $request->allFiles()]);
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

        return Inertia::render(
            'registration', [
            'companies' => $companies
            ]
        );
    }

    public function edit(Request $request){
        $validated = $request->validate([
            'CompanyName' => 'sometimes|string',
            'BusinessPermitNumber' => 'sometimes|integer',
        ]);

        $vrCompany = VRCompany::find($request->id);

        $vrCompany->update([
            'CompanyName' => $request->CompanyName,
            'BusinessPermitNumber' => $request->BusinessPermitNumber,
        ]);

        return response()->json(['Success' => 'Updated Succesfully'], 200);
    }

    public function update(Request $request)
    {
        \Log::info('Update Request Data:', $request->all());

        $validated = $request->validate([
            'oldCompanyName' => 'sometimes|string',
            'CompanyName' => 'sometimes|string',
            'BusinessPermitNumber' => 'sometimes|integer',
            'BusinessPermit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_2303' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'DTI_Permit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BrandLogo' => 'nullable|file|mimes:jpg,png|max:1024',
            'SalesInvoice' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // Search VRCompany by oldCompanyName
        $vrCompany = VRCompany::where('CompanyName', $request->oldCompanyName)->first();

        if (!$vrCompany) {
            return response()->json(['error' => 'Company not found for User Update'], 404);
        }

        \Log::info('VR Company found:', ['id' => $vrCompany->id]);

        // Update company details
        $vrCompany->update([
            'CompanyName' => $request->CompanyName,
            'BusinessPermitNumber' => $request->BusinessPermitNumber,
        ]);

        if ($vrCompany->owner && $vrCompany->owner->user) {
            $targetUser = $vrCompany->owner->user;
            // If `targetUser` needs to be updated, ensure correct fields are used
        } else {
            \Log::warning('Owner or user not found for company:', ['id' => $vrCompany->id]);
        }

        \Log::info('VR Company updated successfully', ['id' => $vrCompany->id]);
    }

    public function uploadMedia(Request $request)
    {
        \Log::info('Uploading media files', $request->all());

        // Validate request
        $request->validate([
            'vr_company_id' => 'nullable|integer|exists:vr_companies,id',
            'oldCompanyName' => 'sometimes|string',
            'BusinessPermit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BIR_2303' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'DTI_Permit' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'BrandLogo' => 'nullable|file|mimes:jpg,png|max:1024',
            'SalesInvoice' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // Find company using vr_company_id or oldCompanyName
        $vrCompany = $request->vr_company_id
            ? VRCompany::find($request->vr_company_id)
            : VRCompany::where('CompanyName', $request->oldCompanyName)->first();

        if (!$vrCompany) {
            return response()->json(['error' => 'Company not found for File Uploads'], 404);
        }

        \Log::info("Company found: {$vrCompany->CompanyName}");

        // Upload media files
        $files = [
            'BusinessPermit' => 'business_permit',
            'BIR_2303' => 'bir_2303',
            'DTI_Permit' => 'dti_permit',
            'BrandLogo' => 'brand_logo',
            'SalesInvoice' => 'sales_invoice'
        ];

        foreach ($files as $fileKey => $collection) {
            if ($request->hasFile($fileKey)) {
                \Log::info("Uploading new file for: {$fileKey}");

                // Clear existing media
                $vrCompany->clearMediaCollection($collection);

                // Upload new file
                $mediaItem = $vrCompany->addMediaFromRequest($fileKey)->toMediaCollection($collection, 'private');

                \Log::info("Uploaded file for {$fileKey}: {$mediaItem->file_name}");
            }
        }

        return response()->json(['Success' => $vrCompany->CompanyName], 200);
    }

    public function editView($id)
    {
        $company = VRCompany::with('owner.user', 'contacts')->find($id);

        if (!$company) {
            return abort(404, 'Company not found');
        }

        $companyMedia = $company->getMedia("*");

        return Inertia::render('edit-vr-company', [
            'company' => $company,
            'companies' => VRCompany::all(),
            'companyMedia' => $companyMedia, // Send media files separately if needed
            'admin' => $company->owner->user ?? null,
            'contacts' => $company->contacts,
            'companies' => VRCompany::all(),
        ]);
    }
}
