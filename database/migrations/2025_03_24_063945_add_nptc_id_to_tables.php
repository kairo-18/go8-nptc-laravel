<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });

        Schema::table('vr_companies', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });

        Schema::table('operators', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });

        Schema::table('trips', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('NPTC_ID');
        });

        Schema::table('vr_companies', function (Blueprint $table) {
            $table->dropColumn('NPTC_ID');
        });

        Schema::table('operators', function (Blueprint $table) {
            $table->dropColumn('NPTC_ID');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('NPTC_ID');
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn('NPTC_ID');

        Schema::table('trips', function (Blueprint $table) {
            $table->string('NPTC_ID')->unique()->nullable()->after('id');
        });
        });
    }
};
