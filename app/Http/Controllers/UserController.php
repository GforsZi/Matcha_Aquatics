<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Cart;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;



class UserController extends Controller
{
    protected string $serverKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->serverKey = env('MIDTRANS_SERVER_KEY');
        $this->baseUrl = env('MIDTRANS_BASE_URL', 'https://api.sandbox.midtrans.com/v1');
    }

    public function index()
    {
        $app_banner = AppSetting::select('app_stg_value')->where('app_stg_title', 'app_banner')->get()->first();
        $products = Product::select('prd_id', 'prd_name', 'prd_price', 'prd_img_url', 'prd_status', 'prd_slug')->where('prd_status', '1')->latest()->limit(40)->get();
        return Inertia::render('home/index', compact('app_banner', 'products'));
    }
    public function search(Request $request)
    {
        $cat_products = [];
        if ($request->has('category')) {
            $cat_products = Product::query()
                ->select('prd_id', 'prd_name', 'prd_price', 'prd_img_url', 'prd_status', 'prd_slug')
                ->with('categories')->where('prd_status', '1')
                ->when($request->query('category'), function ($query, $category) {
                    $query->whereHas('categories', function ($q) use ($category) {
                        $q->where('cat_slug', $category);
                    });
                })
                ->orderByDesc('prd_id')
                ->limit(40)
                ->get();
        }
        return Inertia::render('home/search', compact('cat_products'));
    }

    public function cart()
    {
        $app_provice_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_provice_name')->first();
        $app_city_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_name')->first();
        $app_city_id = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_id')->first();
        $app_location_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->first();
        $app_location_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->first();
        $carts = Cart::with('product')
            ->where('crt_user_id', Auth::id())
            ->whereHas('product', function ($q) {
                $q->whereNull('prd_deleted_at');
            })
            ->latest()
            ->get();

        // dd($carts->toArray());
        return Inertia::render('home/cart', compact('carts', 'app_city_id', 'app_city_name', 'app_location_latitude', 'app_location_longitude', 'app_provice_name'));
    }

    public function add_cart_system(Request $request)
    {
        try {
            $user = User::select('usr_no_wa', 'usr_latitude', 'usr_longtitude', 'usr_provice_name', 'usr_city_name', 'usr_city_id')->findOrFail(Auth::id());
            $app_city_id = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_id')->first();
            $app_location_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->first();
            $app_location_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->first();

            if (!$user->usr_no_wa || !$user->usr_latitude || !$user->usr_longtitude || !$user->usr_provice_name || !$user->usr_city_name || !$user->usr_city_id) {
                throw new \Exception('Pastikan informasi pada akun sudah terisi dengan benar');
            }

            if (!$app_city_id || !$app_location_latitude || !$app_location_longitude) {
                throw new \Exception('Pemilik toko belum menentukan lokasi tokonya, hubungi layanan pelanggan untuk informasi lebih lanjut');
            }

            $request->validate([
                'product_id' => ['required', 'exists:products,prd_id']
            ]);

            Cart::updateOrCreate(
                [
                    'crt_user_id' => Auth::id(),
                    'crt_product_id' => $request->product_id

                ],
                [
                    'crt_user_id' => Auth::id(),
                    'crt_product_id' => $request->product_id
                ]
            );
            return redirect('/cart')->with([
                'success' => 'Produk berhasil dimasukan ke keranjang.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/settings/profile')->with([
                'error' => $th->getMessage() . ' | produk gagal dimasukan ke keranjang.',
            ])->setStatusCode(303);
        }
    }

    public function delete_cart_system(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,prd_id']
        ]);

        $cart = Cart::select('crt_id')
            ->where('crt_user_id', Auth::id())
            ->where('crt_product_id', $request->product_id)
            ->first();

        if (!$cart) {
            return back()->with([
                'error' => 'Data keranjang tidak ditemukan.'
            ])->setStatusCode(303);
        }
        $cart->delete();

        return back()->with([
            'success' => 'Produk berhasil dihapus dari keranjang.'
        ])->setStatusCode(303);
    }


    public function product($slug)
    {
        $app_provice_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_provice_name')->first();
        $app_city_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_name')->first();
        $app_location_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->first();
        $app_location_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->first();
        $product = Product::with('categories')->where('prd_slug', $slug)->get()->first();
        return Inertia::render('home/product', compact('product', 'app_provice_name', 'app_city_name', 'app_location_latitude', 'app_location_longitude'));
    }

    public function customer_service()
    {
        $app_cs_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_cs_name')->get()->first();
        $app_cs_nomor = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_cs_nomor')->get()->first();
        return Inertia::render('home/customer_service', compact('app_cs_name', 'app_cs_nomor'));
    }

    public function transaction_system(Request $request)
    {
        try {
            $message = [
                'trx_buyer_id.exists' => 'Data pembeli tidak tersedia.',
                'trx_type.required' => 'Tipe transaksi wajib diisi.',
                'trx_type.in' => 'Tipe transaksi tidak valid.',
                'trx_buyer_name.min' => 'Nama pembeli tidak boleh kurang dari :min.',
                'trx_buyer_name.max' => 'Nama pembeli tidak boleh melebihi :max.',
                'trx_payment_method.required' => 'Metode pembayaran wajib diisi.',
                'trx_payment_method.max' => 'Metode pembayaran wajib diisi.',
                'trx_total.required' => 'Total dari transaksi wajib diisi.',
                'trx_total.min' => 'Total dari transaksi tidak boleh kurang dari :min.',
                'trx_total.max' => 'Total dari transaksi tidak boleh melebihi :max.',
                'trx_discount.max' => 'Diskon tidak boleh melebihi :max.',
                'trx_discount.min' => 'Diskon tidak boleh kurang dari :min.',
                'trx_shipping_cost.max' => 'Ongkir tidak boleh melebihi :max.',
                'trx_shipping_cost.min' => 'Ongkir tidak boleh kurang dari :min.',

            ];
            $validateDataTrx = $request->validate([
                'trx_buyer_id' => ['nullable', 'integer', 'exists:users,usr_id'],
                'trx_buyer_name' => ['nullable', 'string', 'min:3', 'max:255'],
                'trx_payment_method' => ['required', 'in:1,2,3,4,5'],
                'trx_subtotal' => ['required', 'integer', 'min:0', 'max:99999999999'],
                'trx_discount' => ['nullable', 'integer', 'min:0', 'max:99999999999'],
                'trx_payment' => ['nullable', 'integer', 'min:0', 'max:99999999999'],
                'trx_change' => ['nullable', 'integer', 'min:0', 'max:99999999999'],
            ], $message);
            $validateDataProduct = $request->validate([
                'product_id' => 'required|array|min:1',
                'product_id.*' => 'exists:products,prd_id',
            ], [
                'product_id.array' => 'Format Produk tidak valid.',
                'product_id.min' => 'Minimal satu Produk wajib dipilih.',
                'product_id.*.exists' => 'Produk tidak ditemukan.',
            ]);
            $validateDataTrx['trx_total'] = $request->trx_subtotal + $request->trx_shipping_cost;


            if ($request->has('product_id')) {
                foreach ($request->product_id as $prd_id) {
                    if ($prd_id == null) {
                        throw new \Exception('Terjadi kesalahan pada input transaksi');
                    }
                    $copy =
                        Product::select('prd_status', 'prd_id', 'prd_selled_at')
                        ->where('prd_id', $prd_id)
                        ->where('prd_status', '1')
                        ->find($prd_id);

                    if (!$copy) {
                        throw new \Exception('Terdapat product yang tidak aktif');
                    }
                    $copy->update(['prd_status' => '4']);
                }
                $transaction = Transaction::create($validateDataTrx);
                $transaction->products()->sync($validateDataProduct['product_id']);
                $validateDataShp = $request->validate([
                    'trx_shipping_cost' => ['required', 'integer', 'min:0', 'max:99999999999'],
                    'shp_origin_city_id' => ['required', 'string'],
                    'shp_destination_city_id' => ['required', 'string'],
                    'shp_origin_province_name' => ['required', 'string'],
                    'shp_origin_city_name' => ['required', 'string'],
                    'shp_destination_province_name' => ['required', 'string'],
                    'shp_destination_city_name' => ['required', 'string'],
                    'shp_courier' => ['required', 'string'],
                    'shp_cost' => ['required', 'integer'],
                    'shp_weight' => ['required', 'integer'],
                    'shp_tracking_url' => ['nullable', 'string'],
                    'shp_origin_latitude' => ['nullable', 'string'],
                    'shp_origin_longitude' => ['nullable', 'string'],
                    'shp_destination_latitude' => ['nullable', 'string'],
                    'shp_destination_longitude' => ['nullable', 'string'],
                ]);
                $validateDataShp['shp_transaction_id'] = $transaction->trx_id;
                Shipment::create($validateDataShp);
                return redirect('/payment_link/' . $transaction->trx_invoice)->with([
                    'success' => 'Transaksi berhasil dibuat.',
                ])->setStatusCode(303);
            }
        } catch (\Throwable $th) {
            return redirect('cart')->with([
                'error' => $th->getMessage() . ' | transaksi gagal dibuat.'
            ])->setStatusCode(303);
        }
    }

    public function payment_link_page($invoice)
    {
        $transaction = Transaction::select('trx_id', 'trx_invoice')->where('trx_invoice', $invoice)->first();
        return Inertia::render('home/payment_link', compact('transaction'));
    }

    public function payment_link_system($invoice)
    {
        $trx = Transaction::with('items.product', 'user')->where('trx_invoice', $invoice)->first();
        $shp = Shipment::where('shp_transaction_id', $trx->trx_id)->first();

        $paymentLinkId = 'pl-' . ($trx->trx_invoice ?? $trx->trx_id) . '-' . Str::random(6);

        $itemDetails = [];
        foreach ($trx->items as $item) {
            $prod = $item->product;
            if (! $prod) continue;

            $itemDetails[] = [
                'id' =>  $prod->prd_id,
                'name' => $prod->prd_name,
                'price' => (int) $prod->prd_price,
                'quantity' => (int) ($item->quantity ?? 1),
                'brand' => $prod->prd_sys_note ?? '',
                'category' => 'General',
                'merchant_name' => config('app.name', 'Merchant'),
            ];
        }
        if ($shp) {
            $itemDetails[] = [
                'id' =>  $shp->shp_id,
                'name' => $shp->shp_courier . ' ' . $shp->shp_service,
                'price' => (int) $shp->shp_cost,
                'quantity' => (int) (1),
                'brand' => $shp->prd_sys_note ?? '',
                'category' => 'General',
                'merchant_name' => config('app.name', 'Merchant'),
            ];
        }


        $customer = [
            'first_name' => $trx->trx_buyer_name ?? 'Customer',
            'last_name' => ' ',
            'email' => $trx->user->email ?? null,
            'phone' => $trx->user->usr_no_wa ?? null,
            'notes' => $trx->trx_notes ?? null,
        ];

        $startTime = now()->format('Y-m-d H:i O');
        $expiry = [
            'start_time' => $startTime,
            'duration' => 1,
            'unit' => 'days'
        ];

        $payload = [
            'transaction_details' => [
                'order_id' => (string) ($trx->trx_invoice ?? $paymentLinkId),
                'gross_amount' => (int) $trx->trx_total,
                'payment_link_id' => $paymentLinkId,
            ],
            'customer_required' => true,
            'usage_limit' => 1,
            'expiry' => $expiry,
            'enabled_payments' => ['credit_card', 'bca_va', 'indomaret'],
            'item_details' => $itemDetails,
            'customer_details' => $customer,
            'enabled_payments' => ['gopay'],
        ];

        $url = $this->baseUrl . '/payment-links';

        $response = Http::withBasicAuth($this->serverKey, '')->withOptions(['verify' => false])
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->post($url, $payload);

        if ($response->failed()) {

            return response()->json([
                'message' => 'Gagal membuat payment link',
                'detail' => $response->json(),
            ], 503);
        }

        $resp = $response->json();

        $payment = Payment::create([
            'pay_transaction_id' => $trx->trx_id,
            'pay_midtrans_id' => $resp['order_id'] ?? $paymentLinkId,
            'pay_method' => 'midtrans_payment_link',
            'pay_status' => '1',
            'pay_amount' => (int) $trx->trx_total,
            'pay_qr_url' => $resp['url'] ?? $resp['payment_url'] ?? null,
            'pay_response' => json_encode($resp),
        ]);

        return response()->json([
            'message' => 'Payment link dibuat',
            'payment' => $payment,
            'response' => $resp,
        ], 201);
    }
}
