<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'FirstName',
        'MiddleName',
        'LastName',
        'Address',
        'BirthDate',
        'ContactNumber',
        'NPTC_ID',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if ($user->hasRole('NPTC Admin')) {
                $user->NPTC_ID = User::generateNPTCId('NPTC Admin');
            } elseif ($user->hasRole('VR Admin')) {
                $user->NPTC_ID = User::generateNPTCId('VR Admin');
            }
        });
    }

    public static function generateNPTCId($role)
    {
        $prefix = match ($role) {
            'NPTC Admin' => 'AD',
            'VR Admin' => 'VA',
            default => null,
        };

        if (! $prefix) {
            return null;
        }

        $count = self::where('NPTC_ID', 'LIKE', "$prefix-%")->count() + 1;

        return sprintf('%s-%04d', $prefix, $count);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function driver()
    {
        return $this->hasOne(Driver::class);
    }

    public function operator()
    {
        return $this->hasMany(Operator::class);
    }

    public function vrOwner()
    {
        return $this->hasOne(VehicleRentalOwner::class);
    }

    public function note()
    {
        return $this->hasMany(Notes::class);
    }
}
