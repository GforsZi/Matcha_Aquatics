<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShippingController extends Controller
{
    protected RajaOngkirService $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function provinces()
    {
        $data = $this->rajaOngkir->getProvinces();

        // API format baru: hasil ada di $data['data']
        Log::info('Get Provinces', ['response' => $data]);
        return response()->json($data['data'] ?? []);
    }

    public function cities($provinceId)
    {
        $data = $this->rajaOngkir->getCities($provinceId);

        Log::info('Get Cities', ['response' => $data]);
        return response()->json($data['data'] ?? []);
    }

    public function cost(Request $request)
    {

        $validated = $request->validate([
            'origin' => 'required',
            'destination' => 'required',
            'weight' => 'required',
            'courier' => 'required',
        ]);

        $data = $this->rajaOngkir->getCost(
            $request->origin,
            $request->destination,
            $request->weight,
            $request->courier
        );

        Log::info('Get Cost', ['response' => $data]);
        return response()->json($data['data'] ?? []);
    }
}
