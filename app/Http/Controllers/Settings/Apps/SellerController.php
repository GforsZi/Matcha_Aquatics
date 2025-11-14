<?php

namespace App\Http\Controllers\Settings\Apps;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/apps/seller');
    }

    public function edit_system(Request $request)
    {
        try {
            $message = [
                'app_location_latitude.required' => 'Lokasi peta wajib diisi.',
                'app_location_latitude.max' => 'Lokasi peta memiliki maksimal :max karakter.',
                'app_location_longitude.required' => 'Lokasi peta wajib diisi.',
                'app_location_longitude.max' => 'Lokasi peta memiliki maksimal :max karakter.',
                'app_location_name.required' => 'Nama lokasi wajib diisi.',
                'app_location_name.max' => 'Nama lokasi memiliki maksimal :max karakter.',
                'app_provice_name.required' => 'Nama provinsi wajib diisi.',
                'app_provice_name.max' => 'Nama provinsi memiliki maksimal :max karakter.',
                'app_city_name.required' => 'Nama kota wajib diisi.',
                'app_city_name.max' => 'Nama kota memiliki maksimal :max karakter.',
                'app_city_id.required' => 'Id kota wajib diisi.',
                'app_city_id.max' => 'Id kota memiliki maksimal :max karakter.',
            ];
            $request->validate([
                'app_location_latitude' => ['required', 'string', 'max:255'],
                'app_location_longitude' => ['required', 'string', 'max:255'],
                'app_location_name' => ['required', 'string', 'max:255'],
                'app_provice_name' => ['required', 'string', 'max:255'],
                'app_city_name' => ['required', 'string', 'max:255'],
                'app_city_id' => ['required', 'string', 'max:255']
            ], $message);
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
            if ($request->has('app_provice_name')) {
                AppSetting::where('app_stg_title', 'app_provice_name')->updateOrCreate([
                    'app_stg_title' => 'app_provice_name',
                    'app_stg_value' => $request->app_provice_name,
                ]);
            }
            if ($request->has('app_city_name')) {
                AppSetting::where('app_stg_title', 'app_city_name')->updateOrCreate([
                    'app_stg_title' => 'app_city_name',
                    'app_stg_value' => $request->app_city_name,
                ]);
            }
            if ($request->has('app_city_id')) {
                AppSetting::where('app_stg_title', 'app_city_id')->updateOrCreate([
                    'app_stg_title' => 'app_city_id',
                    'app_stg_value' => $request->app_city_id,
                ]);
            }
            return redirect('/app/setting/seller')->with([
                'success' => 'Penjual toko pada aplikasi berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/app/setting/seller')->with([
                'error' => $th->getMessage() . ' | penjual toko pada aplikasi gagal diubah.',
            ])->setStatusCode(303);
        }
    }
}
