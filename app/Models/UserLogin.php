<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserLogin extends Pivot
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'usr_lg_id';
    protected $blameablePrefix = 'usr_lg_';

    const CREATED_AT = 'usr_lg_created_at';
    const UPDATED_AT = 'usr_lg_updated_at';
    const DELETED_AT = 'usr_lg_deleted_at';

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'usr_lg_user_id', 'usr_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_lg_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_lg_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usr_lg_deleted_by', 'usr_id');
    }
}
