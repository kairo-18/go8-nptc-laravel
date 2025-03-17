<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('new-vr-company', function ($user) {
    return $user->hasRole(['NPTC Admin', 'NPTC Super Admin']);
});

Broadcast::channel('thread.{threadId}', function ($user, $threadId) {
    // Ensure the user is a participant in the thread
    return \App\Models\Thread::where('id', $threadId)
        ->where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })
        ->exists();
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
