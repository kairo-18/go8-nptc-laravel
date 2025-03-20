<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('pickupAddress');
            $table->string('dropOffAddress');
            $table->dateTime('pickupDate');
            $table->dateTime('dropOffDate');
            $table->enum('tripType', ['Drop-off', 'Airport Pick-up', 'Wedding', 'City Tour', 'Vacation', 'Team Building', 'Home Transfer', 'Corporate', 'Government', 'Others']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
