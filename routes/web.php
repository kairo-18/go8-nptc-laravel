<?php

use App\Events\MailReceive;
use App\Events\NewThreadCreated;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ManualPaymentController;
use App\Http\Controllers\PendingController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\VRCompanyController;
use App\Models\Mail;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

// Home route
Route::get(
    '/',
    function () {
        return redirect()->route('login');
    }
)->name('home');

Route::middleware(['auth', 'verified', 'role:NPTC Admin|NPTC Super Admin|Operator|Driver|VR Admin'])->group(function () {
    Route::get('/book-trip', function () {

        return Inertia::render('trip-booking', [
            'companies' => \App\Models\VRCompany::all(),
            'drivers' => \App\Models\Driver::with(['media', 'user'])->get(),
            'vehicles' => \App\Models\Vehicle::with(['operator.vrCompany'])->get(),
            'operators' => \App\Models\Operator::with(['user'])->get(),
        ]);
    })->name('book-trip');

    Route::get('/bookings', function () {
        return Inertia::render('bookings', [
            'bookings' => App\Models\Trip::with(['driver.user', 'vehicle.driver', 'driver.operator.vrCompany', 'passengers'])->get(),
        ]);
    })->name('bookings');

    Route::post('/driver/trips/{tripId}/start', [TripController::class, 'startTrip']);
    Route::post('/driver/trips/{tripId}/end', [TripController::class, 'endTrip']);

});

Route::get(
    '/mails',
    function () {
        return Inertia::render('mails');
    }
)->middleware(['auth', 'verified'])->name('mails');

Route::get('mails/threads', function () {
    $threads = Thread::where('sender_id', auth()->id())
        ->orWhere('receiver_id', auth()->id())
        ->with(['mails', 'sender', 'receiver', 'mails.media'])
        ->get();

    // Attach preview URLs for media
    $threads->each(function ($thread) {
        $thread->mails->each(function ($mail) {
            $mail->media->each(function ($media) {
                $media->preview_url = url('/preview-media/'.$media->id);
                $media->append('preview_url'); // Append the preview_url to the response
            });
        });
    });

    return response()->json(['threads' => $threads]);
});

Route::get('mails/thread/{thread}', function (Thread $thread) {
    // Ensure the authenticated user has access to this thread
    if ($thread->sender_id !== auth()->id() && $thread->receiver_id !== auth()->id()) {
        abort(403, 'Forbidden');
    }

    return response()->json(['thread' => $thread]);
});

// VR Company API Routes
Route::get('download-media/{mediaId}', [VRCompanyController::class, 'downloadMedia'])
    ->name('download-media');

Route::get('preview-media/{mediaId}', [VRCompanyController::class, 'previewMedia'])
    ->name('preview-media');

Route::put('mails/mark-read/{thread}', function (Thread $thread) {
    $thread->mails()->update(['is_read' => true]);

    return response()->json(['thread' => $thread]);
});

// Manual Direct Payment
Route::get('/manual-payment/operator/{operatorId}', [ManualPaymentController::class, 'show'])->name('manual-payment.show');
Route::post('/manual-payments/store', [ManualPaymentController::class, 'store'])->name('manual-payments.store');
Route::post('/reject-billing/{driver}', [ManualPaymentController::class, 'rejectBilling'])->name('reject.billing');

Route::post('mails/new-mail', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'subject' => 'required|string',
        'content' => 'sometimes|string',
        'is_read' => 'sometimes|boolean',
        'attachments' => 'nullable|array', // Allow multiple file uploads
        'attachments.*' => 'file|mimes:jpeg,png,gif,pdf|max:20480', // Validate file types and size
    ]);

    // Find the receiver by email
    $sender = auth()->user();
    $receiver = User::where('email', $request->email)->first();
    if (! $receiver) {
        return response()->json(['errors' => ['email' => ['This email is not registered.']]], 422);
    }

    // Check if a thread already exists between the sender and receiver with the same subject
    $thread = Thread::where(function ($query) use ($receiver, $request) {
        $query->where('sender_id', auth()->id())
            ->where('receiver_id', $receiver->id)
            ->whereHas('mails', function ($q) use ($request) {
                $q->where('subject', $request->subject);
            });
    })->orWhere(function ($query) use ($receiver, $request) {
        $query->where('sender_id', $receiver->id)
            ->where('receiver_id', auth()->id())
            ->whereHas('mails', function ($q) use ($request) {
                $q->where('subject', $request->subject);
            });
    })->first();

    $isNewThread = false; // Track if a new thread is created

    // If no thread exists with the same subject, create a new one
    if (! $thread) {
        $thread = Thread::create([
            'original_sender_id' => auth()->id(),
            'sender_id' => auth()->id(),
            'receiver_id' => $receiver->id,
        ]);
        $isNewThread = true; // Mark that a new thread is created
    } else {
        // Swap sender and receiver for replies
        $thread->update([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    // Create the mail
    $mail = Mail::create([
        'sender_id' => auth()->id(),
        'thread_id' => $thread->id,
        'subject' => $request->subject,
        'content' => $request->content ?? '',
        'is_read' => $request->is_read ?? false,
    ]);

    // Attach files to the mail
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $mail->addMedia($file)->toMediaCollection('attachments');
        }
    }

    // Dispatch real-time mail event
    MailReceive::dispatch($mail);

    // If this is a new thread, broadcast it
    if ($isNewThread) {
        NewThreadCreated::dispatch($thread, $receiver->id);
    }

    return response()->json(['mail' => $mail]);
});

Route::post('/generate-payment-link', [TripController::class, 'generatePaymentLink'])
    ->name('generate-payment-link');

Route::get('/generate-qr/{trip}', [TripController::class, 'generateQr']);

Route::get('/generate-user-qr/{user}', [RegisteredUserController::class, 'generateUserQr']);

Route::get('/user-verification-profile/{user}', function (User $user) {
    if (! $user->hasRole('Driver')) {
        return redirect()->route('home');
    }

    $driver = $user->driver()->with(['vehicle', 'media'])->first();

    if (! $driver) {
        abort(404, 'Driver profile not found.');
    }

    $mediaCollections = ['license', 'photo', 'nbi_clearance', 'police_clearance', 'bir_clearance'];

    // Collect media files from all defined collections
    $mediaFiles = collect($mediaCollections)->flatMap(function ($collection) use ($driver) {
        return $driver->getMedia($collection)->map(fn ($media) => [
            'id' => $media->id,
            'name' => $media->file_name,
            'collection_name' => $media->collection_name,
            'mime_type' => $media->mime_type,
            'url' => route('preview-driver-media', ['mediaId' => $media->id]),
        ]);
    })->values();

    $companyName = $driver->operator->vrCompany->CompanyName ?? null;

    $status = $driver->Status;

    return Inertia::render('UserVerificationProfile', [
        'user' => $user->load('driver.vehicle'),
        'media_files' => $mediaFiles,
        'company' => $companyName,
        'status' => $status,
    ]);
})->name('user-verification-profile');

// pending
Route::get('/pending-data', [PendingController::class, 'index']);

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/temp_reg.php';
require __DIR__.'/nptc_admin.php';
require __DIR__.'/vr_admin.php';
require __DIR__.'/vr_company.php';
require __DIR__.'/vr_contacts.php';
require __DIR__.'/operator.php';
require __DIR__.'/driver.php';
require __DIR__.'/vehicle.php';
require __DIR__.'/pending.php';

Route::get('/trip-ticket/download/{trip}', [TripController::class, 'downloadTripTicket'])->name('trip-ticket.download');
