<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function storeTempAcc(Request $request)
    {
        $request->validate(
            [
                'FirstName' => 'required|string|max:255',
                'LastName' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'Address' => 'nullable|string|max:255',
                'BirthDate' => 'nullable|date',
                'ContactNumber' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users',
            ]
        );

        $birthYear = '1234';
        if ($request->BirthDate) {
            $birthYear = date('Y', strtotime($request->BirthDate));
        }
        // Add Last Name
        $generatedPassword = $request->LastName.$birthYear;
        \Log::info($generatedPassword);

        $user = User::create(
            [
                'FirstName' => $request->FirstName,
                'LastName' => $request->LastName,
                'username' => $request->username,
                'Address' => $request->Address,
                'BirthDate' => $request->BirthDate,
                'ContactNumber' => $request->ContactNumber,
                'email' => $request->email,
                'password' => Hash::make($generatedPassword),
            ]
        );

        if ($request->Type == 'operator') {
            $user->assignRole('Temp User Operator');
        } else {
            $user->assignRole('Temp User');
        }

        event(new Registered($user));

    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(
            [
                'FirstName' => 'required|string|max:255',
                'LastName' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'Address' => 'nullable|string|max:255',
                'Birthdate' => 'nullable|date',
                'ContactNumber' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]
        );

        $user = User::create(
            [
                'FirstName' => $request->FirstName,
                'LastName' => $request->LastName,
                'username' => $request->username,
                'Address' => $request->Address,
                'Birthdate' => $request->Birthdate,
                'ContactNumber' => $request->ContactNumber,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]
        );

        event(new Registered($user));

        return to_route('home');
    }

    public function generateUserQr(User $user)
    {
        // Generate Qr that contains the link for download
        $builder = new Builder(
            writer: new PngWriter,
            writerOptions: [],
            validateResult: false,
            data: env('APP_URL').'/user-verification-profile/'.$user->id,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            labelText: 'Scan to View Profile',
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
