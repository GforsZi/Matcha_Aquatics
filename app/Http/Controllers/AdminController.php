<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserLogin;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $startDate = Carbon::now()->subMonths(2)->startOfDay();
        $endDate   = Carbon::now()->endOfDay();

        $logins = UserLogin::selectRaw("
    DATE(usr_lg_logged_in_at) as date,
    SUM(CASE WHEN usr_lg_device_type = 'Desktop' THEN 1 ELSE 0 END) as desktop,
    SUM(CASE WHEN usr_lg_device_type = 'Mobile' THEN 1 ELSE 0 END) as mobile,
    SUM(CASE WHEN usr_lg_device_type = 'Tablet' THEN 1 ELSE 0 END) as tablet,
    SUM(CASE WHEN usr_lg_device_type = 'Bot' THEN 1 ELSE 0 END) as bot,
    SUM(CASE WHEN usr_lg_device_type = 'Unknown' THEN 1 ELSE 0 END) as unknown
")
            ->whereBetween('usr_lg_logged_in_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(usr_lg_logged_in_at)'))
            ->orderBy('date', 'asc')
            ->get();

        $startDate = now()->subDays(30)->startOfDay();
        $endDate   = now()->endOfDay();

        $transactions = Transaction::selectRaw('DATE(trx_created_at) as date, SUM(trx_total) as desktop')
            ->whereBetween('trx_created_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(trx_created_at)'))
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date'    => $item->date,
                    'desktop' => (int) $item->desktop,
                ];
            });

        $app_location_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->first();
        $app_location_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->first();
        $total_product = Product::select('prd_id')->whereIn('prd_status', ['1', '3'])->get()->count();
        $total_customer = User::select('usr_id')->role('buyer')->get()->count();
        $trx_total = Transaction::where('trx_created_at', '>=', Carbon::now()->subDays(30))
            ->get();

        $total_transaction = $trx_total->sum('trx_total');

        return Inertia::render('dashboard', compact('logins', 'app_location_latitude', 'app_location_longitude', 'total_product', 'total_customer', 'transactions', 'total_transaction'));
    }
}
