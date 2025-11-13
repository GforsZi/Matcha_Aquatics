<?php

namespace App\Http\Controllers\Settings\Apps;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index(Request $request)
    {
        $app_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->get()->first();
        $app_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->get()->first();
        $app_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_name')->get()->first();
        return Inertia::render('settings/apps/location', compact('app_latitude', 'app_longitude', 'app_name'));
    }

    public function edit_system(Request $request)
    {
        try {
            $request->validate([
                'app_location_latitude' => ['required', 'string', 'max:255'],
                'app_location_longitude' => ['required', 'string', 'max:255'],
                'app_location_name' => ['required', 'string', 'max:255'],
            ]);
            if ($request->has('app_location_latitude')) {
                AppSetting::where('app_stg_title', 'app_location_latitude')->updateOrCreate([
                    'app_stg_title' => 'app_location_latitude',
                    'app_stg_value' => $request->app_location_latitude,
                ]);
            }
            if ($request->has('app_location_longitude')) {
                AppSetting::where('app_stg_title', 'app_location_longitude')->updateOrCreate([
                    'app_stg_title' => 'app_location_longitude',
                    'app_stg_value' => $request->app_location_longitude,
                ]);
            }
            if ($request->has('app_location_name')) {
                AppSetting::where('app_stg_title', 'app_location_name')->updateOrCreate([
                    'app_stg_title' => 'app_location_name',
                    'app_stg_value' => $request->app_location_name,
                ]);
            }
            return redirect('/app/setting/location')->with([
                'success' => 'Lokasi toko pada aplikasi berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/app/setting/location')->with([
                'error' => $th->getMessage() . ' | lokasi toko pada aplikasi gagal diubah.',
            ])->setStatusCode(303);
        }
    }
}
