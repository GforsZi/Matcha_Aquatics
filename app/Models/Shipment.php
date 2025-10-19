<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shipment extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'shp_id';
    protected $blameablePrefix = 'shp_';

    const CREATED_AT = 'shp_created_at';
    const UPDATED_AT = 'shp_updated_at';
    const DELETED_AT = 'shp_deleted_at';

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shp_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shp_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shp_deleted_by', 'usr_id');
    }
}
