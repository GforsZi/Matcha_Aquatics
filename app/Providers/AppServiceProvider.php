<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Request $request): void
    {
        // disable this if projuct run on local
        URL::forceScheme('https');
        Inertia::share([
            // Data auth global
            'auth' => function () {
                $user = Auth::user();
                return [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'usr_latitude' => $user->usr_latitude,
                        'usr_longtitude' => $user->usr_longtitude,
                        'usr_no_wa' => $user->usr_no_wa,
                        'avatar' => $user->usr_foto_profile,
                    ] : null,
                ];
            },
            'assetBaseUrl' => asset(''),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
            ],

            // Error validasi otomatis dari Laravel
            'errors' => fn() => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
        ]);
    }
}
