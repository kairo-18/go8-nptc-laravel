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
                VrContacts::create($contactData);
            }
        }

        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 422);
        }

        if(Auth::user()->hasRole(['Temp User'])){
            Auth::logout();
        }
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
}
