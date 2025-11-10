<?php

namespace App\Listeners;

use App\Models\UserLogin;
use Illuminate\Auth\Events\Login;
use Jenssegers\Agent\Agent;

class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $agent = new Agent();

        // Deteksi kategori device
        if ($agent->isMobile()) {
            $deviceType = 'Mobile';
        } elseif ($agent->isTablet()) {
            $deviceType = 'Tablet';
        } elseif ($agent->isDesktop()) {
            $deviceType = 'Desktop';
        } elseif ($agent->isRobot()) {
            $deviceType = 'Bot';
        } else {
            $deviceType = 'Unknown';
        }

        // Simpan ke database
        UserLogin::create([
            'usr_lg_user_id' => $event->user->usr_id,
            'usr_lg_ip_address' => request()->ip(),
            'usr_lg_user_agent' => request()->userAgent(),
            'usr_lg_device_type' => $deviceType,
            'usr_lg_logged_in_at' => now(),
        ]);
    }
}
