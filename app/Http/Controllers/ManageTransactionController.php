<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageTransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::select('trx_id as id', 'trx_buyer_id', 'trx_payment_status', 'trx_status', 'trx_created_at')->with('user')->latest()->paginate(10);
        return Inertia::render('transaction/index', compact('transactions'));
    }

    public function show($id)
    {
        return Inertia::render('transaction/detail');
    }

    public function add()
    {
        return Inertia::render('transaction/add');
    }

    public function edit($id)
    {
        return Inertia::render('transaction/edit');
    }
}
