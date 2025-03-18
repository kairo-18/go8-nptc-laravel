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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operator_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('PlateNumber');
            $table->string('Model');
            $table->string('Brand');
            $table->integer('SeatNumber');
            $table->enum('Status', ['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected'])
                  ->default('Pending');
            $table->string('front_image')->nullable();
            $table->string('back_image')->nullable();
            $table->string('left_side_image')->nullable();
            $table->string('right_side_image')->nullable();
            $table->string('or_image')->nullable();
            $table->string('cr_image')->nullable();
            $table->string('id_card_image')->nullable();
            $table->string('gps_certificate_image')->nullable();
            $table->string('inspection_certificate_image')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
