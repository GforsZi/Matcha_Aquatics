<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class RajaOngkirService
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url');
    }

    /**
     * Default HTTP Client dengan SSL verify OFF (khusus lokal)
     */
    protected function client()
    {
        return Http::withOptions([
            'verify' => false,
        ])->withHeaders([
            'key'    => $this->apiKey,
            'Accept' => 'application/json',
        ]);
    }

    public function getProvinces(): array
    {
        try {
            $response = $this->client()->get("{$this->baseUrl}/destination/province");

            if ($response->failed()) {
                Log::error('RajaOngkir getProvinces failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return ['data' => [], 'error' => true];
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('RajaOngkir getProvinces exception', [
                'error' => $e->getMessage()
            ]);
            return ['data' => [], 'error' => true];
        }
    }

    public function getCities($provinceId): array
    {
        try {
            $response = $this->client()->get("{$this->baseUrl}/destination/city/" . $provinceId);

            if ($response->failed()) {
                Log::error('RajaOngkir getCities failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return ['data' => [], 'error' => true];
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('RajaOngkir getCities exception', [
                'error' => $e->getMessage()
            ]);
            return ['data' => [], 'error' => true];
        }
    }

    public function getCost($origin, $destination, $weight, $courier): array
    {
        Log::info('info request cost', compact('origin', 'destination', 'weight', 'courier'));

        try {
            $response = Http::withOptions([
                'verify' => false,
            ])
                ->asForm()
                ->withHeaders(['key' => $this->apiKey])
                ->post("{$this->baseUrl}/calculate/domestic-cost", [
                    'origin'      => $origin,
                    'destination' => $destination,
                    'weight'      => $weight,
                    'courier'     => $courier,
                ]);

            if ($response->failed()) {
                Log::error('RajaOngkir getCost failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return ['data' => [], 'error' => true];
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('RajaOngkir getCost exception', [
                'error' => $e->getMessage()
            ]);
            return ['data' => [], 'error' => true];
        }
    }
}
