<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Class DatabaseSeeder
 *
 * Seed the application's database.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        Role::create(['name' => 'NPTC Super Admin']);
        Role::create(['name' => 'NPTC Admin']);
        Role::create(['name' => 'VR Admin']);
        Role::create(['name' => 'Operator']);
        Role::create(['name' => 'Driver']);

        $user = User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
            'FirstName' => 'Test',
            'LastName' => 'User',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
        ]);

        $user->assignRole('NPTC Super Admin');



        $user2 = User::factory()->create([
            'username' => 'Alex',
            'email' => 'alez@example.com',
            'FirstName' => 'Alexander',
            'LastName' => 'Parayno',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
        ]);



        $user2->assignRole("NPTC Admin");

        if ($user2->hasRole("Driver")) {
            $user2->driver()->create([
                'License' => 'path/to/license',
                'LicenseNumber' => '1234567890',
                'Photo' => 'path/to/photo',
                'NBI_clearance' => 'path/to/nbi',
                'Police_clearance' => 'path/to/police',
                'BIR_clearance' => 'path/to/bir',
            ]);
        }




    }

}
