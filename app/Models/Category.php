<?php

namespace App\Models;

use App\Traits\Blameable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes, Blameable, Sluggable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'cat_id';
    protected $blameablePrefix = 'cat_';

    const CREATED_AT = 'cat_created_at';
    const UPDATED_AT = 'cat_updated_at';
    const DELETED_AT = 'cat_deleted_at';

    public function sluggable(): array
    {
        return [
            'cat_slug' => [
                'source' => 'cat_name'
            ]
        ];
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cat_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cat_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cat_deleted_by', 'usr_id');
    }
}
