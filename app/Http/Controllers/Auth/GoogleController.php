<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Exception;
use GuzzleHttp\Client;
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

            // Gunakan Guzzle client khusus untuk mem-bypass SSL verify (hanya lokal)
            $socialite = Socialite::driver('google')
                ->stateless()
                ->setHttpClient(new Client([
                    'verify' => false,
                ]));

            $googleUser = $socialite->user();

            $user = User::where('usr_google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                $user->usr_google_id = $googleUser->getId();
                $user->usr_foto_profile = $googleUser->getAvatar();
                $user->save();
            } else {
                $user = User::create([
                    'name'              => $googleUser->getName(),
                    'email'             => $googleUser->getEmail(),
                    'user_verified_at'  => now(),
                    'usr_google_id'     => $googleUser->getId(),
                    'usr_foto_profile'  => $googleUser->getAvatar(),
                    'password'          => Hash::make(Str::random(16)),
                ]);

                $user->assignRole('buyer');
            }

            Auth::login($user, true);

            if ($user->hasRole('seller')) {
                return redirect()->intended('/dashboard')->with('success', 'Login berhasil.');
            }

            return redirect()->intended('/home')->with('success', 'Login berhasil.');
        } catch (\Exception $e) {

            return redirect()->route('login')->with(
                'error',
                'Login Google gagal: ' . $e->getMessage()
            );
        }
    }
}
