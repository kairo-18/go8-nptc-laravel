<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\VRCompany;
use App\Models\VrContacts;

class VrContactsController extends Controller
{
    //
    public function index() {
        return Inertia::render('create-vr-contacts', [
           "companies" => VRCompany::all(),
        ]);
    }

    public function storeMultiple(Request $request)
    {
        $contacts = $request->contacts;
        $errors = [];
        $createdContacts = [];

        foreach ($contacts as $index => $contactData) {
            $validator = \Illuminate\Support\Facades\Validator::make($contactData, [
                'vr_company_id' => 'required|exists:vr_companies,id',
                'email' => 'required|email',
                'ContactNumber' => 'required',
                'LastName' => 'required',
                'FirstName' => 'required',
                'MiddleName' => 'nullable',
                'Position' => 'required',
            ]);

            if ($validator->fails()) {
                $errors["contacts.$index"] = $validator->errors()->toArray();
            } else {
                $createdContact = VrContacts::create($contactData);
                $createdContacts[] = $createdContact;
            }
        }

        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 422);
        }

        return response()->json(['contacts' => $createdContacts]);

    }

    public function store(Request $request)
    {
        $request->validate([
            'vr_company_id' => 'required|integer|exists:vr_companies,id',
            'email' => 'required|email|unique:vr_contacts,email',
            'ContactNumber' => 'required|string',
            'LastName' => 'required|string',
            'FirstName' => 'required|string',
            'MiddleName' => 'nullable|string',
            'Position' => 'required|string',
        ]);

        $vrContact = VrContacts::create([
            'vr_company_id' => $request->vr_company_id,
            'email' => $request->email,
            'ContactNumber' => $request->ContactNumber,
            'LastName' => $request->LastName,
            'FirstName' => $request->FirstName,
            'MiddleName' => $request->MiddleName,
            'Position' => $request->Position,
        ]);

        if(Auth::user()->hasRole(['Temp User'])){
            Auth::logout();
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:vr_contacts,id',
            'vr_company_id' => 'required|integer|exists:vr_companies,id',
            'email' => 'required|email|unique:vr_contacts,email,' . $request->id,
            'ContactNumber' => 'required|string',
            'LastName' => 'required|string',
            'FirstName' => 'required|string',
            'MiddleName' => 'nullable|string',
            'Position' => 'required|string',
        ]);

        $vrContact = VrContacts::findOrFail($request->id);
        $vrContact->update([
            'vr_company_id' => $request->vr_company_id,
            'email' => $request->email,
            'ContactNumber' => $request->ContactNumber,
            'LastName' => $request->LastName,
            'FirstName' => $request->FirstName,
            'MiddleName' => $request->MiddleName,
            'Position' => $request->Position,
        ]);

        return redirect()->route('vr-contacts.index')->with('success', 'VR Contact updated successfully.');
    }

    public function updateMultiple(Request $request){
        $contacts = $request->contacts;
        $errors = [];
        $updatedContacts = [];

        \Log::info('Updating info:', request()->all());

        foreach ($contacts as $index => $contactData) {
            $rules = [
                'vr_company_id' => 'sometimes|exists:vr_companies,id',
                'email' => 'sometimes|email',
                'ContactNumber' => 'sometimes|string',
                'LastName' => 'sometimes|string',
                'FirstName' => 'sometimes|string',
                'MiddleName' => 'nullable|string',
                'Position' => 'sometimes|string',
            ];

            // Add 'id' validation only if the contact is being updated
            if (!empty($contactData['id'])) {
                $rules['id'] = 'required|integer|exists:vr_contacts,id';
            }

            $validator = \Illuminate\Support\Facades\Validator::make($contactData, $rules);

            if ($validator->fails()) {
                $errors["contacts.$index"] = $validator->errors()->toArray();
            } else {
                if (!empty($contactData['id'])) {
                    // Update existing contact
                    $vrContact = VrContacts::findOrFail($contactData['id']);
                    $vrContact->update($contactData);
                    $updatedContacts[] = $vrContact; // Store updated contact
                } else {
                    // Create new contact
                    $createdContact = VrContacts::create($contactData);
                    $updatedContacts[] = $createdContact; // Store new contact too
                }
            }
        }

        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 422);
        }

        \Log::info('Updated contacts:', $contacts);

        return response()->json(['contacts' => $updatedContacts]);

        if(Auth::user()->hasRole(['Temp User'])){
            Auth::logout();
            return redirect()->route('login');
        }
    }

}
