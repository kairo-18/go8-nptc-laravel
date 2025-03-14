<?php

use App\Events\MailReceive;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OperatorAdminController;
use App\Http\Controllers\VRCompanyController;
use App\Http\Controllers\NptcAdminController;
use App\Http\Controllers\VRAdminController;
use App\Http\Controllers\VrContactsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\NPTCAdminMiddleware;
use Illuminate\Http\Request;
use App\Models\Mail;
use App\Models\Thread;
use App\Models\User;
use App\Events\NewThreadCreated;

// Home route
Route::get(
    '/',
    function () {
        return Inertia::render('welcome');
    }
)->name('home');

Route::get(
    '/mails',
    function () {
        return Inertia::render('mails');
    }
)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('mails/threads', function () {
    $threads = Thread::where('sender_id', auth()->id())
        ->orWhere('receiver_id', auth()->id())
        ->with(['mails', 'sender', 'receiver'])
        ->get();

    return response()->json(['threads' => $threads]);
});

Route::get('mails/thread/{thread}', function (Thread $thread) {
    $thread->load(['mails', 'sender', 'receiver']);

    return response()->json(['thread' => $thread]);
});

Route::post('mails/new-mail', function (Request $request) {
    $request->validate([
        'email' => 'required|email|exists:users,email',
        'thread_id' => 'nullable|exists:threads,id',
        'subject' => 'required|string',
        'content' => 'required|string',
    ]);

    $receiver = User::where('email', $request->email)->firstOrFail();
    $thread = null;
    $isNewThread = false; // Track if a new thread is created

    if ($request->thread_id) {
        $thread = Thread::findOrFail($request->thread_id);
    } else {
        // Check if a thread already exists between the sender and receiver
        $thread = Thread::where(function ($query) use ($receiver) {
            $query->where('sender_id', auth()->id())
                  ->where('receiver_id', $receiver->id);
        })->orWhere(function ($query) use ($receiver) {
            $query->where('sender_id', $receiver->id)
                  ->where('receiver_id', auth()->id());
        })->first();

        // If no thread exists, create a new one
        if (!$thread) {
            $thread = Thread::create([
                'sender_id' => auth()->id(),
                'receiver_id' => $receiver->id,
            ]);
            $isNewThread = true; // Mark that a new thread is created
        }
    }

    $mail = Mail::create([
        'sender_id' => auth()->id(),
        'thread_id' => $thread->id,
        'subject' => $request->subject,
        'content' => $request->content,
    ]);

    // Dispatch real-time mail event
    MailReceive::dispatch($mail);

    // If this is a new thread, broadcast it
    if ($isNewThread) {
        NewThreadCreated::dispatch($thread, $receiver->id);
    }

    return response()->json(['mail' => $mail]);
});



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
