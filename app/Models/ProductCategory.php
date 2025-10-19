<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductCategory extends Pivot
{
    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'prd_cat_id';
    protected $blameablePrefix = 'prd_cat_';

}
