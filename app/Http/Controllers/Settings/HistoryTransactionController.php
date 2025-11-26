<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryTransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::select('trx_id as id', 'trx_invoice', 'trx_payment_method', 'trx_status', 'trx_created_at')->where('trx_buyer_id', Auth::id())
            ->with('user')
            ->latest()
            ->paginate(10);

        $payload = $transactions->toArray();
        $payload['links'] = array_map(function ($l) {
            if (!empty($l['url'])) {
                $l['url'] = preg_replace('/^http:/i', 'https:', $l['url']);
            }
            return $l;
        }, $payload['links']);

        return Inertia::render('settings/transaction-history', [
            'transactions' => $payload,
        ]);
    }
}
