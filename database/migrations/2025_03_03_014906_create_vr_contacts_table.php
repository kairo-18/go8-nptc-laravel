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
        Schema::create('vr_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vr_company_id')->constrained('vr_companies')->cascadeOnDelete();
            $table->string('email');
            $table->string('ContactNumber');
            $table->string('LastName');
            $table->string('FirstName');
            $table->string('MiddleName');
            $table->string('Position');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vr_contacts');
    }
};
