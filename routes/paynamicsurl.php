<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/payment/response', fn () => Inertia::render('response-page'));
Route::get('/payment/cancel', fn () => Inertia::render('cancel-page'));
Route::post('/payment/return', [PaymentController::class, 'handleReturn']);
