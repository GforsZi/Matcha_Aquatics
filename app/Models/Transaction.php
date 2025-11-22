<?php

namespace App\Models;

use App\Traits\Blameable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes, Blameable;

    protected $guarded = ['id', 'timestamps'];
    protected $primaryKey = 'trx_id';
    protected $blameablePrefix = 'trx_';

    const CREATED_AT = 'trx_created_at';
    const UPDATED_AT = 'trx_updated_at';
    const DELETED_AT = 'trx_deleted_at';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $prefix = 'INV-' . Carbon::now()->format('Ymd') . '-';
            $countToday = self::whereDate('trx_created_at', Carbon::today())->count() + 1;
            $sequence = str_pad($countToday, 6, '0', STR_PAD_LEFT);
            $timeSuffix = Carbon::now()->format('Hisv');

            $model->trx_invoice = $prefix . $sequence . '-' . $timeSuffix;
        });
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'transaction_item', 'trxi_transaction_id', 'trxi_product_id')->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_buyer_id', 'usr_id');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'trxi_transaction_id', 'trx_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'pay_transaction_id', 'trx_id');
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class, 'shp_transaction_id', 'trx_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_created_by', 'usr_id');
    }
    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_updated_by', 'usr_id');
    }
    public function deleted_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trx_deleted_by', 'usr_id');
    }
}
