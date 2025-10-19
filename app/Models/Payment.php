<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'pay_id';
    protected $blameablePrefix = 'pay_';

    const CREATED_AT = 'pay_created_at';
    const UPDATED_AT = 'pay_updated_at';
    const DELETED_AT = 'pay_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pay_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pay_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pay_deleted_by', 'usr_id');
    }
}
