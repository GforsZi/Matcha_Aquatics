<?php

namespace App\Listeners;

use App\Models\UserLogin;
use Illuminate\Auth\Events\Login;
use IlluminateAuthEventsLogin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        UserLogin::create([
            'usr_lg_user_id' => $event->user->usr_id,
            'usr_lg_ip_address' => request()->ip(),
            'usr_lg_user_agent' => request()->userAgent(),
            'usr_lg_logged_in_at' => now(),
        ]);
    }
}
