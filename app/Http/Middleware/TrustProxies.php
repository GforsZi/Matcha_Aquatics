<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * Izinkan semua proxy, termasuk:
     * - ngrok
     * - cloudflare
     * - nginx reverse proxy
     * - load balancer
     */
    protected $proxies = '*';

    /**
     * Header-header proxy yang dibaca Laravel
     */
    protected $headers =
    Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO;
}
