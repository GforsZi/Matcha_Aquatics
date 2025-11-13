<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppSetting extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'app_stg_id';
    protected $blameablePrefix = 'app_stg_';

    const CREATED_AT = 'app_stg_created_at';
    const UPDATED_AT = 'app_stg_updated_at';
    const DELETED_AT = 'app_stg_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'app_stg_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'app_stg_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'app_stg_deleted_by', 'usr_id');
    }
}
