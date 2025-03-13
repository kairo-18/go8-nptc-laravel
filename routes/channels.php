<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('new-vr-company', function ($user) {
    return $user->hasRole(['NPTC Admin', 'NPTC Super Admin']);
});
