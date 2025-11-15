<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method \Illuminate\Support\Collection getRoleNames()
 * @method bool hasRole(string|array|\Spatie\Permission\Models\Role $roles)
 * @method $this assignRole(...$roles)
 * @method $this removeRole($role)
 * @method $this syncRoles(...$roles)
 */

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes, Blameable, HasRoles;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'usr_id';
    protected $blameablePrefix = 'usr_';

    const CREATED_AT = 'usr_created_at';
    const UPDATED_AT = 'usr_updated_at';
    const DELETED_AT = 'usr_deleted_at';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

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

    public function login(): HasMany
    {
        return $this->hasMany(User::class, 'usr_lg_user_id', 'usr_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'trx_user_id', 'usr_id');
    }


    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_deleted_by', 'usr_id');
    }
}
