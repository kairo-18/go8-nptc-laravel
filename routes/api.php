<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use function Pest\Laravel\json;

Route::get('/user', function () {
    return response()->json("HELLO WORLD");
});
