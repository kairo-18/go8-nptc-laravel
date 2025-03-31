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
        Schema::table('manual_payments', function (Blueprint $table) {
            $table->enum('Status', ['Pending', 'Approved', 'Rejected'])->default('Pending')->after('Amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manual_payments', function (Blueprint $table) {
            $table->dropColumn('Status');
        });
    }
};
