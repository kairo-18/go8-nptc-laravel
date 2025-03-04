<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('vr_companies', function (Blueprint $table) {
            $table->id();
            $table->string('CompanyName');
            $table->integer('BusinessPermitNumber');
            $table->enum('Status', ['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('vr_companies');
    }
};
