<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait Blameable
{
    public static function bootBlameable()
    {
        static::creating(function ($model) {
            $prefix = $model->getBlameablePrefix();
            $model->{$prefix . 'created_by'} = Auth::id();
            $model->{$prefix . 'updated_by'} = Auth::id();
        });

        static::updating(function ($model) {
            $prefix = $model->getBlameablePrefix();
            $model->{$prefix . 'updated_by'} = Auth::id();
        });

        static::deleting(function ($model) {
            $prefix = $model->getBlameablePrefix();
            if (Auth::check()) {
                $model->{$prefix . 'deleted_by'} = Auth::id();
                $model->save();
            }
        });
    }

    public function getBlameablePrefix()
    {
        return property_exists($this, 'blameablePrefix') ? $this->blameablePrefix : '';
    }
}
