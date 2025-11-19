<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cart extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'crt_id';
    protected $blameablePrefix = 'crt_';

    const CREATED_AT = 'crt_created_at';
    const UPDATED_AT = 'crt_updated_at';
    const DELETED_AT = 'crt_deleted_at';

    public function product()
    {
        return $this->belongsTo(Product::class, 'crt_product_id', 'prd_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'crt_user_id', 'usr_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'crt_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'crt_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'crt_deleted_by', 'usr_id');
    }
}
