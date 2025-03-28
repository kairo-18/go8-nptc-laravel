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
        Schema::create('manual_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operator_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('AccountName');
            $table->enum('ModePayment', ['G-cash', 'Maya', 'Bank Transfer']);
            $table->string('Receipt')->nullable();        
            $table->string('ReferenceNumber')->unique;
            $table->string('AccountNumber');
            $table->string('Notes');
            $table->string('Amount')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manual_payments');
    }
};