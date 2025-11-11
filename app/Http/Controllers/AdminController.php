<?php

namespace App\Http\Controllers;

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
        return Inertia::render('dashboard', compact('logins'));
    }
}
