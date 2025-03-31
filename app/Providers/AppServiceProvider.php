<?php

namespace App\Providers;

use App\Models\Driver;
use App\Models\Operator;
use App\Observers\DriverObserver;
use App\Observers\OperatorObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Operator::observe(OperatorObserver::class);
        Driver::observe(DriverObserver::class);
    }
}
