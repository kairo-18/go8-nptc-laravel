<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VRCompany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VrContactsTest extends TestCase
{
    use RefreshDatabase;

    public function test_vr_contacts_can_be_created()
    {
        $this->actingAs(User::factory()->create());

        $vrCompany = VRCompany::factory()->create();

        $response = $this->post(route('vr-contacts.store'), [
            'vr_company_id' => $vrCompany->id,
            'email' => 'test@example.com',
            'ContactNumber' => '1234567890',
            'LastName' => 'Doe',
            'FirstName' => 'John',
            'MiddleName' => 'M',
            'Position' => 'Manager',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('vr_contacts', [
            'email' => 'test@example.com',
            'ContactNumber' => '1234567890',
        ]);
    }

    public function test_contact_number_is_required()
    {
        $this->actingAs(User::factory()->create());

        $vrCompany = VRCompany::factory()->create();

        $response = $this->post(route('vr-contacts.store'), [
            'vr_company_id' => $vrCompany->id,
            'email' => 'test@example.com',
            'LastName' => 'Doe',
            'FirstName' => 'John',
            'MiddleName' => 'M',
            'Position' => 'Manager',
        ]);

        $response->assertSessionHasErrors('ContactNumber');
    }

    public function test_contact_number_must_be_a_valid_phone_number()
    {
        $this->actingAs(User::factory()->create());

        $vrCompany = VRCompany::factory()->create();

        $response = $this->post(route('vr-contacts.store'), [
            'vr_company_id' => $vrCompany->id,
            'email' => 'test@example.com',
            'ContactNumber' => 'invalid',
            'LastName' => 'Doe',
            'FirstName' => 'John',
            'MiddleName' => 'M',
            'Position' => 'Manager',
        ]);

        $response->assertSessionHasErrors('ContactNumber');
    }
}