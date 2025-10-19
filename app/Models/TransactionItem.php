<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionItem extends Pivot
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'trxi_id';
    protected $blameablePrefix = 'trxi_';

    const CREATED_AT = 'trxi_created_at';
    const UPDATED_AT = 'trxi_updated_at';
    const DELETED_AT = 'trxi_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trxi_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trxi_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trxi_deleted_by', 'usr_id');
    }
}
