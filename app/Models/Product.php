<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'prd_id';
    protected $blameablePrefix = 'prd_';

    const CREATED_AT = 'prd_created_at';
    const UPDATED_AT = 'prd_updated_at';
    const DELETED_AT = 'prd_deleted_at';

    public function categories(): HasMany {
        return $this->hasMany(Category::class, 'product_categories', 'prd_cat_product_id', 'prd_cat_category_id');

    }

    public function transactions(): HasMany {
        return $this->hasMany(Transaction::class, 'transaction_items', 'trxi_product_id', 'trxi_transaction_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prd_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prd_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prd_deleted_by', 'usr_id');
    }
}
