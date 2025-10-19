<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'rpt_id';
    protected $blameablePrefix = 'rpt_';

    const CREATED_AT = 'rpt_created_at';
    const UPDATED_AT = 'rpt_updated_at';
    const DELETED_AT = 'rpt_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rpt_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rpt_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rpt_deleted_by', 'usr_id');
    }
}
