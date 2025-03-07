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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vr_company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('License')->nullable(); // Path to uploaded license file
            $table->string('LicenseNumber')->nullable()->unique();
            $table->string('Photo')->nullable(); // Path to 1x1 photo file
            $table->string('NBI_clearance')->nullable(); // Path to NBI clearance file
            $table->string('Police_clearance')->nullable(); // Path to Police clearance file
            $table->string('BIR_clearance')->nullable(); // Path to BIR clearance file
            $table->enum('Status', ['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected'])
                  ->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
