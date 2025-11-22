<?php

namespace App\Http\Controllers;

use App\Exports\ReportsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\TransactionsExport;
use App\Models\Report;
use App\Models\Transaction;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ManageReportController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $reports = Report::where('rpt_user_id', $user->usr_id)
            ->orderBy('rpt_created_at', 'desc')
            ->get([
                'rpt_id',
                'rpt_exel_url',
                'rpt_period_from',
                'rpt_period_to',
                'rpt_total_sales',
                'rpt_total_items_sold',
                'rpt_created_at'
            ]);

        return Inertia::render('report/index', [
            'reports' => $reports,
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date',
        ]);

        $from = Carbon::parse($request->get('from'))->startOfDay();
        $to = Carbon::parse($request->get('to'))->endOfDay();
        $transactionsQuery = Transaction::query()
            ->whereBetween('trx_created_at', [$from, $to]);

        $totalSales = (int) $transactionsQuery->sum('trx_total');
        $totalItems = (int) DB::table('transaction_item')
            ->join('transactions', 'transaction_item.trxi_transaction_id', '=', 'transactions.trx_id')
            ->whereBetween('transactions.trx_created_at', [$from, $to])
            ->count();
        $timestamp = Carbon::now()->format('YmdHisv');
        $filename = 'report_transactions_' . Auth::id() . '_' . $timestamp . '.xlsx';

        $destinationDir = public_path('/media/reports/');
        if (!File::exists($destinationDir)) {
            File::makeDirectory($destinationDir, 0777, true);
        }
        $fullPath = $destinationDir . $filename;
        $export = new ReportsExport($from->toDateString(), $to->toDateString());

        $content = Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
        File::put($fullPath, $content);

        $report = Report::create([
            'rpt_user_id' => Auth::id(),
            'rpt_exel_url' => 'reports/' . $filename,
            'rpt_period_from' => $from->toDateString(),
            'rpt_period_to' => $to->toDateString(),
            'rpt_total_sales' => $totalSales,
            'rpt_total_items_sold' => $totalItems,
            'rpt_created_by' => Auth::id(),
        ]);

        return response()->download($fullPath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
