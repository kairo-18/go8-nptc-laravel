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
        Schema::create('vehicle_rental_owners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vr_company_id')->constrained('vr_companies')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('Status', ['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment'])
                ->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_rental_owners');
    }
};
