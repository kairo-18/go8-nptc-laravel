<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Operator;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VRCompany;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Generate a unique NPTC_ID based on the prefix and latest entry.
     */
    private function generateNPTCId(string $prefix, string $modelClass): string
    {
        $latest = $modelClass::latest('id')->first();
        $nextNumber = $latest ? ((int) substr($latest->NPTC_ID, 3)) + 1 : 1;

        return $prefix.'-'.str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::create(['name' => 'NPTC Super Admin']);
        Role::create(['name' => 'NPTC Admin']);
        Role::create(['name' => 'VR Admin']);
        Role::create(['name' => 'Operator']);
        Role::create(['name' => 'Driver']);
        Role::create(['name' => 'Temp User']);
        Role::create(['name' => 'Temp User Operator']);

        $user = User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
            'FirstName' => 'Test',
            'MiddleName' => 'PointFive',
            'LastName' => 'User',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
            'NPTC_ID' => $this->generateNPTCId('AD', User::class),
        ]);
        $user->assignRole('NPTC Super Admin');

        $user2 = User::factory()->create([
            'username' => 'Alex',
            'email' => 'alez@example.com',
            'FirstName' => 'Alexander',
            'MiddleName' => 'PointFive',
            'LastName' => 'Parayno',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
            'NPTC_ID' => $this->generateNPTCId('AD', User::class),
        ]);
        $user2->assignRole('NPTC Admin');

        VRCompany::factory()->create([
            'CompanyName' => 'Example VR Company',
            'BusinessPermitNumber' => 123456,
            'Status' => 'Approved',
            'NPTC_ID' => $this->generateNPTCId('VC', VRCompany::class),
        ]);

        VRCompany::factory()->create([
            'CompanyName' => 'Company3',
            'BusinessPermitNumber' => 1231231,
            'Status' => 'Pending',
            'NPTC_ID' => $this->generateNPTCId('VC', VRCompany::class),
        ]);

        VRCompany::factory()->create([
            'CompanyName' => 'Company2',
            'BusinessPermitNumber' => 123123,
            'Status' => 'Pending',
            'NPTC_ID' => $this->generateNPTCId('VC', VRCompany::class),
        ]);

        $user3 = User::factory()->create([
            'username' => 'Alexis',
            'email' => 'alex@example.com',
            'FirstName' => 'Alexander',
            'MiddleName' => 'PointFive',
            'LastName' => 'Parayno',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
        ]);
        $user3->assignRole('Operator');

        $user3->operator()->create([
            'user_id' => $user3->id,
            'vr_company_id' => 1,
            'Status' => 'Approved',
            'NPTC_ID' => $this->generateNPTCId('OP', Operator::class),
        ]);

        $user4 = User::factory()->create([
            'username' => 'Driver1',
            'email' => 'driver1@example.com',
            'FirstName' => 'Driver',
            'MiddleName' => 'PointFive',
            'LastName' => 'One',
            'Address' => 'Test Address',
            'BirthDate' => '2000-01-01',
            'ContactNumber' => '09123456789',
        ]);
        $user4->assignRole('Driver');

        $user4->driver()->create([
            'operator_id' => 1,
            'vr_company_id' => 1,
            'License' => 'path/to/license',
            'LicenseNumber' => '1234567890',
            'Photo' => 'path/to/photo',
            'NBI_clearance' => 'path/to/nbi',
            'Police_clearance' => 'path/to/police',
            'BIR_clearance' => 'path/to/bir',
            'NPTC_ID' => $this->generateNPTCId('DR', Driver::class),
        ]);

        Vehicle::create([
            'operator_id' => 1,
            'driver_id' => 1,
            'PlateNumber' => 'ABC1234',
            'Model' => 'Toyota Corolla',
            'Brand' => 'Toyota',
            'SeatNumber' => 4,
            'Status' => 'Approved',
            'NPTC_ID' => $this->generateNPTCId('UN', Vehicle::class),
        ]);

        Vehicle::create([
            'operator_id' => 1,
            'driver_id' => 1,
            'PlateNumber' => 'XYZ5678',
            'Model' => 'Honda Civic',
            'Brand' => 'Honda',
            'SeatNumber' => 5,
            'Status' => 'Pending',
            'NPTC_ID' => $this->generateNPTCId('UN', Vehicle::class),
        ]);
    }
}
