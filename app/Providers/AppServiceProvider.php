<?php

namespace App\Providers;

use App\Models\Driver;
use App\Models\Operator;
use App\Models\VehicleRentalOwner;
use App\Observers\DriverObserver;
use App\Observers\OperatorObserver;
use App\Observers\VrOwnerObserver;
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
        VehicleRentalOwner::observe(VrOwnerObserver::class);
        ini_set('upload_max_filesize', '25M');
        ini_set('post_max_size', '25M');
    }
}
