<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Hash;

class GoogleController extends Controller
{
    // Redirect user ke Google OAuth
    public function redirect_google()
    {
        return Socialite::driver('google')->redirect();
    }

    // Callback dari Google
    public function handle_google_callback()
    {
        try {
            /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->user();

            $user = User::where('usr_google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if ($user) {
                // Update google_id dan avatar jika perlu
                $user->usr_google_id = $googleUser->getId();
                $user->usr_foto_profile = $googleUser->getAvatar();
                $user->save();
            } else {
                // Buat user baru
                $user = User::create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'usr_google_id' => $googleUser->getId(),
                    'usr_foto_profile'    => $googleUser->getAvatar(),
                    'password'  => Hash::make(Str::random(16))
                ]);

                $user->assignRole('buyer');
            }

            // Login user dan redirect ke dashboard atau halaman utama
            Auth::login($user, true);
            if ($user->hasRole('seller')) {
                # code...
                return redirect()->intended('/dashboard');
            } else {
                # code...
                return redirect()->intended('/home');
            }

        } catch (Exception $e) {
            // Tangani error (misal: redirect ke login dengan pesan error)
            return redirect()->route('login')
                             ->with('error', 'Login Google gagal: ' . $e->getMessage());
        }
    }
}
