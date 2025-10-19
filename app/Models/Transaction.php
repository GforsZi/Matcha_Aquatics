<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'trx_id';
    protected $blameablePrefix = 'trx_';

    const CREATED_AT = 'trx_created_at';
    const UPDATED_AT = 'trx_updated_at';
    const DELETED_AT = 'trx_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_deleted_by', 'usr_id');
    }
}
