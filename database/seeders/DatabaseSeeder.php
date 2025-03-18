<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\VRCompany;
use App\Models\VrContacts;
use App\Models\Vehicle;
use Database\Factories\VrCompanyFactory;


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
        Role::create(['name' => 'Temp User']);

        $user = User::factory()->create(
            [
            'username' => 'Test User',
            'email' => 'test@example.com',
            'FirstName' => 'Test',
            'LastName' => 'User',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
            ]
        );

        $user->assignRole('NPTC Super Admin');



        $user2 = User::factory()->create(
            [
            'username' => 'Alex',
            'email' => 'alez@example.com',
            'FirstName' => 'Alexander',
            'LastName' => 'Parayno',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
            ]
        );



        $user2->assignRole("NPTC Admin");
        

        VRCompany::factory()->create(
            [
            'CompanyName' => 'Example VR Company',
            'BusinessPermitNumber' => 123456,
            'Status' => 'Approved'
            ]
        );

        $user3 = User::factory()->create(
            [
            'username' => 'Alexis',
            'email' => 'alex@example.com',
            'FirstName' => 'Alexander',
            'LastName' => 'Parayno',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
            ]
        );

        $user3->assignRole("Operator");

        $user3->operator()->create(
            [
            'user_id' => $user3->id,
            'vr_company_id' => 1,
            'Status' => 'Approved'
            ]
        );

        $user4 = User::factory()->create([
            'username' => 'Driver1',
            'email' => 'driver1@example.com',
            'FirstName' => 'Driver',
            'LastName' => 'One',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
        ]);
        $user4->assignRole("Driver");

        $user4->driver()->create([
            'operator_id' => 1, 
            'vr_company_id' => 1, 
            'License' => 'path/to/license',
            'LicenseNumber' => '1234567890',
            'Photo' => 'path/to/photo',
            'NBI_clearance' => 'path/to/nbi',
            'Police_clearance' => 'path/to/police',
            'BIR_clearance' => 'path/to/bir',
        ]);

        Vehicle::create([
            'operator_id' => 1, 
            'driver_id' => 1,
            'PlateNumber' => 'ABC1234',
            'Model' => 'Toyota Corolla',
            'Brand' => 'Toyota',
            'SeatNumber' => 4,
            'Status' => 'Approved'
        ]);

        Vehicle::create([
            'operator_id' => 1,
            'driver_id' => 1,
            'PlateNumber' => 'XYZ5678',
            'Model' => 'Honda Civic',
            'Brand' => 'Honda',
            'SeatNumber' => 5,
            'Status' => 'Pending'
        ]);


         
        
            
       


    }

}
