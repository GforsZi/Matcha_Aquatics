<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Carbon\Carbon;

class ReportsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $from;
    protected $to;

    public function __construct(string $from, string $to)
    {
        // Expect format YYYY-MM-DD
        $this->from = Carbon::parse($from)->startOfDay();
        $this->to = Carbon::parse($to)->endOfDay();
    }

    public function query()
    {
        // return Eloquent query with items count
        return Transaction::query()
            ->withCount('items')
            ->whereBetween('trx_created_at', [$this->from, $this->to])
            ->orderBy('trx_created_at', 'asc');
    }

    public function map($transaction): array
    {
        // Map numeric enums to human readable strings (sesuaikan bila perlu)
        $paymentMethodMap = [
            '1' => 'Tunai',
            '2' => 'Non-tunai',
            '3' => 'Tunai + Pengiriman',
            '4' => 'Non-tunai + Pengiriman',
        ];

        $statusMap = [
            '1' => 'Menunggu pembayaran',
            '2' => 'Pembayaran berhasil',
            '3' => 'Menunggu pengiriman',
            '4' => 'Pengiriman berhasil',
            '5' => 'Transaksi selesai',
            '6' => 'Transaksi gagal',
        ];

        return [
            $transaction->trx_invoice,
            optional($transaction->user)->usr_name ?? $transaction->trx_buyer_name,
            $transaction->trx_created_at ? Carbon::parse($transaction->trx_created_at)->toDateTimeString() : '',
            $transaction->trx_subtotal,
            $transaction->trx_discount,
            $transaction->trx_total,
            $transaction->trx_payment ?? '',
            $transaction->trx_change ?? '',
            $paymentMethodMap[$transaction->trx_payment_method] ?? $transaction->trx_payment_method,
            $statusMap[$transaction->trx_status] ?? $transaction->trx_status,
            $transaction->items_count ?? 0,
        ];
    }

    public function headings(): array
    {
        return [
            'Invoice',
            'Pembeli',
            'Dibuat pada',
            'Subtotal',
            'Diskon',
            'Total',
            'Pembayaran',
            'Kembalian',
            'Metode Transaksi',
            'Status',
            'Jumlah Produk',
        ];
    }
}
