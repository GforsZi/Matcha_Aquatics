<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i = 0; $i < 30; $i++) {

            $date = Carbon::now()->subDays($i + 1);


            for ($j = 0; $j < 10; $j++) {

                $subtotal = rand(50000, 500000);
                $total = $subtotal + rand(0, 20000);
                $payment = $total + rand(0, 5000);
                $change = $payment - $total;

                DB::table('transactions')->insert([
                    'trx_invoice'        => 'INV-' . strtoupper(uniqid()),
                    'trx_buyer_id'       => 1,
                    'trx_seller_id'      => 1,
                    'trx_buyer_name'     => 'Customer ' . rand(1, 1000),

                    'trx_total'          => $total,
                    'trx_subtotal'       => $subtotal,
                    'trx_payment'        => $payment,
                    'trx_change'         => $change,

                    'trx_payment_method' => rand(1, 5),
                    'trx_status'         => rand(1, 6),

                    'trx_notes'          => 'Seeder generated transaction',

                    'trx_created_by'     => 1,
                    'trx_updated_by'     => null,
                    'trx_deleted_by'     => null,

                    'trx_sys_note'       => null,

                    'trx_created_at'     => $date->copy()->addMinutes(rand(0, 1440)),
                    'trx_updated_at'     => $date->copy()->addMinutes(rand(0, 1440)),
                    'trx_deleted_at'     => null,
                ]);
            }
        }
    }
}
