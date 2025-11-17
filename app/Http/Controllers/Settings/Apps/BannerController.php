<?php

namespace App\Http\Controllers\Settings\Apps;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $app_banner = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_banner')->get()->first();
        return Inertia::render('settings/apps/banner', compact('app_banner'));
    }

    public function edit_system(Request $request)
    {
        try {
            $message = [
                'image.image' => 'File harus berupa gambar.',
                'image.max' => 'Ukuran gambar maksimal 4MB.',
            ];
            $validateData = $request->validate([
                'image' => ['nullable', 'image', 'max:4096'],
            ], $message);
            if ($request->hasFile('image')) {
                $destinationPath = public_path('media/app_banner/');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                $filename = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move($destinationPath, $filename);

                $validateData['app_banner'] = 'media/app_banner/' . $filename;
                AppSetting::where('app_stg_title', 'app_banner')->updateOrCreate(
                    ['app_stg_title' => 'app_banner'],
                    ['app_stg_value' => $validateData['app_banner']],
                );
            }
            return redirect('/app/setting/banner')->with([
                'success' => 'Sepanduk pada aplikasi berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/app/setting/banner')->with([
                'error' => $th->getMessage() . ' | sepanduk pada aplikasi gagal diubah.',
            ])->setStatusCode(303);
        }
    }
}
