<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url');
    }

    public function getProvinces()
    {
        return Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/province')
            ->json();
    }

    public function getCities($province_id)
    {
        return Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/city', ['province' => $province_id])
            ->json();
    }

    public function getCost($origin, $destination, $weight, $courier)
    {
        return Http::withHeaders(['key' => $this->apiKey])
            ->post($this->baseUrl . '/cost', [
                'origin' => $origin,
                'destination' => $destination,
                'weight' => $weight,
                'courier' => $courier,
            ])->json();
    }
}
