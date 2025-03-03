<?php

namespace Database\Factories;

use App\Models\VrContacts;
use Illuminate\Database\Eloquent\Factories\Factory;

class VrContactsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = VrContacts::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_rental_owner_id' => $this->faker->numberBetween(1, 100),
            'email' => $this->faker->unique()->safeEmail,
            'ContactNumber' => $this->faker->phoneNumber,
            'LastName' => $this->faker->lastName,
            'FirstName' => $this->faker->firstName,
            'MiddleName' => $this->faker->randomLetter,
            'Position' => $this->faker->jobTitle,
        ];
    }
}
