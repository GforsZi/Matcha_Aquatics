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
        $app_cs_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_cs_name')->get()->first();
        $app_cs_nomor = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_cs_nomor')->get()->first();
        return Inertia::render('settings/apps/seller', compact('app_cs_name', 'app_cs_nomor'));
    }

    public function edit_system(Request $request)
    {
        try {
            $message = [
                'app_cs_name.required' => 'Nama pusat bantuan wajib diisi.',
                'app_cs_name.max' => 'Nama pusat bantuan memiliki maksimal :max karakter.',
                'app_cs_nomor.required' => 'Nomor pusat bantuan wajib diisi.',
                'app_cs_nomor.max' => 'Nomor pusat bantuan memiliki maksimal :max karakter.',
                'app_cs_nomor.phone' => 'Nomor pusat bantuan tidak valid.',
            ];
            $request->validate([
                'app_cs_name' => ['required', 'string', 'max:255'],
                'app_cs_nomor' => ['required', 'string', 'max:255', 'phone:ID,mobile'],
            ], $message);
            if ($request->has('app_cs_name')) {
                AppSetting::where('app_stg_title', 'app_cs_name')->updateOrCreate(
                    ['app_stg_title' => 'app_cs_name'],
                    ['app_stg_value' => $request->app_cs_name],
                );
            }
            if ($request->has('app_cs_nomor')) {
                AppSetting::where('app_stg_title', 'app_cs_nomor')->updateOrCreate(
                    ['app_stg_title' => 'app_cs_nomor'],
                    ['app_stg_value' => $request->app_cs_nomor],
                );
            }
            return redirect('/app/setting/cs')->with([
                'success' => 'Pusat bantuan pada aplikasi berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/app/setting/cs')->with([
                'error' => $th->getMessage() . ' | pusat bantuan pada aplikasi gagal diubah.',
            ])->setStatusCode(303);
        }
    }
}
