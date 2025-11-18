<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ManageTransactionController extends Controller
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
        $transactions = Transaction::select('trx_id as id', 'trx_buyer_name', 'trx_payment_method', 'trx_status', 'trx_created_at')->with('user')->latest()->paginate(10);
        return Inertia::render('transaction/index', compact('transactions'));
    }

    public function show($id)
    {

        $transaction = Transaction::with('products', 'payment', 'shipment', 'created_by', 'updated_by', 'deleted_by')->findOrFail($id);
        return Inertia::render('transaction/detail', compact('transaction'));
    }

    public function add()
    {
        $app_provice_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_provice_name')->first();
        $app_city_name = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_name')->first();
        $app_city_id = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_city_id')->first();
        $app_location_latitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_latitude')->first();
        $app_location_longitude = AppSetting::select('app_stg_title', 'app_stg_value')->where('app_stg_title', 'app_location_longitude')->first();
        return Inertia::render('transaction/add', compact('app_provice_name', 'app_city_name', 'app_city_id', 'app_location_latitude', 'app_location_longitude'));
    }

    public function payment_link_page($id)
    {
        $transaction = Transaction::select('trx_id', 'trx_invoice')->findOrFail($id);
        return Inertia::render('transaction/payment_link', compact('transaction'));
    }

    public function add_system(Request $request)
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
                'trx_payment_method' => ['required', 'in:1,2,3,4'],
                'trx_total' => ['required', 'integer', 'min:0', 'max:99999999999'],
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
            $validateDataTrx['trx_seller_id'] = Auth::id();
            $validateDataTrx['trx_subtotal'] = $request->trx_total + $request->trx_shipping_cost;
            if ($request->trx_payment_method == '1') {
                $validateDataTrx['trx_status'] = '2';
            } elseif ($request->trx_payment_method == '3') {
                $validateDataTrx['trx_status'] = '2';
            }

            $transaction = Transaction::create($validateDataTrx);

            if ($request->has('product_id')) {
                foreach ($request->product_id as $prd_id) {
                    if ($prd_id == null) {
                        throw new \Exception('Terjadi kesalahan pada input transaksi');
                    }
                    $copy =
                        Product::select('prd_status', 'prd_id', 'prd_selled_at')
                        ->where('prd_id', $prd_id)
                        ->where('prd_status', '1')
                        ->findOrFail($prd_id);

                    if (!$copy) {
                        throw new \Exception('Terdapat product yang telah dibeli');
                    }
                    if ($request->trx_payment_method == '1') {
                        $copy->update(['prd_status' => '2', 'prd_selled_at' => now()]);
                    } elseif ($request->trx_payment_method == '2') {
                        $copy->update(['prd_status' => '4']);
                    } elseif ($request->trx_payment_method == '3') {
                        $copy->update(['prd_status' => '2', 'prd_selled_at' => now()]);
                    } elseif ($request->trx_payment_method == '4') {
                        $copy->update(['prd_status' => '4']);
                    }
                }
                $transaction->products()->sync($validateDataProduct['product_id']);
                if ($request->trx_payment_method == '3') {
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
                        'shp_etd' => ['required', 'string'],
                        'shp_service' => ['required', 'string'],
                        'shp_weight' => ['required', 'integer'],
                        'shp_tracking_url' => ['nullable', 'string'],
                        'shp_origin_latitude' => ['required', 'string'],
                        'shp_origin_longitude' => ['required', 'string'],
                        'shp_destination_latitude' => ['required', 'string'],
                        'shp_destination_longitude' => ['required', 'string'],
                    ]);
                    $validateDataShp['shp_transaction_id'] = $transaction->trx_id;
                    Shipment::create($validateDataShp);
                } elseif ($request->trx_payment_method == '4') {
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
                }
                if ($request->trx_payment_method == '1') {
                    return redirect('/manage/transaction')->with([
                        'success' => 'Transaksi berhasil dibuat.',
                    ])->setStatusCode(303);
                } elseif ($request->trx_payment_method == '3') {
                    return redirect('/manage/transaction')->with([
                        'success' => 'Transaksi berhasil dibuat.',
                    ])->setStatusCode(303);
                } elseif ($request->trx_payment_method == '2') {
                    return redirect('/manage/transaction/' . $transaction->trx_id . '/payment_link')->with([
                        'success' => 'Transaksi berhasil dibuat.',
                    ])->setStatusCode(303);
                } elseif ($request->trx_payment_method == '4') {
                    return redirect('/manage/transaction/' . $transaction->trx_id . '/payment_link')->with([
                        'success' => 'Transaksi berhasil dibuat.',
                    ])->setStatusCode(303);
                }
            }
        } catch (\Throwable $th) {

            return redirect('/manage/transaction/add')->with([
                'error' => $th->getMessage() . ' | transaksi gagal dibuat.'
            ])->setStatusCode(303);
        }
    }
    public function payment_link_system($trx_id)
    {
        $trx = Transaction::with('items.product', 'user')->findOrFail($trx_id);

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

        $customer = [
            'first_name' => $trx->trx_buyer_name ?? 'Customer',
            'last_name' => ' ',
            'email' => $trx->user->email ?? null,
            'phone' => null,
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

        $response = Http::withBasicAuth($this->serverKey, '')
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->post($url, $payload);

        if ($response->failed()) {
            Log::error('Midtrans create payment link failed', [
                'trx_id' => $trx->trx_id,
                'payload' => $payload,
                'response' => $response->json(),
            ]);

            return response()->json([
                'message' => 'Gagal membuat payment link',
                'detail' => $response->json(),
            ], 500);
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

    public function webhook(Request $request)
    {
        $payload = $request->all();
        Log::info('Midtrans webhook');

        if (isset($payload['signature_key'])) {
            $orderId = $payload['order_id'] ?? '';
            $statusCode = $payload['status_code'] ?? '';
            $grossAmount = $payload['gross_amount'] ?? ($payload['transaction_details']['gross_amount'] ?? '');
            $localSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $this->serverKey);

            if (!hash_equals($localSignature, $payload['signature_key'])) {
                Log::warning('Midtrans invalid signature', ['payload' => $payload, 'local' => $localSignature]);
                return response()->json(['message' => 'Invalid signature'], 400);
            }
        }

        $orderId = $payload['order_id'];
        $transactionStatus = $payload['transaction_status'] ?? ($payload['status'] ?? null);
        $orderId = $payload['order_id'] ?? '';
        $transactionStatus = $payload['transaction_status'] ?? ($payload['status'] ?? null);

        $baseOrderId = preg_replace('/-\d{10,}$/', '', $orderId);
        $payment = Payment::where('pay_midtrans_id', $baseOrderId)->first();
        $transaction = Transaction::with('products')->where('trx_invoice', $baseOrderId)->first();

        if (! $payment) {
            Log::warning('Payment not found for webhook', ['order_id' => $orderId]);
            return response()->json(['message' => 'Payment not found'], 404);
        }
        $prd_status = '4';

        if (in_array($transactionStatus, ['settlement'])) {
            $payment->update([
                'pay_status' => '2',
                'pay_paid_at' => now(),
                'pay_response' => json_encode($payload),
                'pay_method' => $payload['payment_type'],
            ]);
            $transaction->update(['trx_status' => '2', 'trx_payment' => (int) $payload['gross_amount']]);
            $prd_status = '2';
        } elseif (in_array($transactionStatus, ['capture'])) {
            $payment->update([
                'pay_status' => '3',
                'pay_paid_at' => now(),
                'pay_response' => json_encode($payload),
                'pay_method' => $payload['payment_type'],
            ]);
            $transaction->update(['trx_status' => '2', 'trx_payment' => (int) $payload['gross_amount']]);
            $prd_status = '2';
        } elseif (in_array($transactionStatus, ['expire'])) {
            $payment->update(['pay_status' => '4', 'pay_response' => json_encode($payload)]);
            $transaction->update(['trx_status' => '6']);
            $prd_status = '3';
        } elseif (in_array($transactionStatus, ['cancel'])) {
            $payment->update(['pay_status' => '5', 'pay_response' => json_encode($payload)]);
            $transaction->update(['trx_status' => '6']);
            $prd_status = '3';
        } elseif (in_array($transactionStatus, ['deny'])) {
            $payment->update(['pay_status' => '6', 'pay_response' => json_encode($payload)]);
            $transaction->update(['trx_status' => '6']);
            $prd_status = '3';
        } elseif (in_array($transactionStatus, ['failure'])) {
            $payment->update(['pay_status' => '7', 'pay_response' => json_encode($payload)]);
            $transaction->update(['trx_status' => '6']);
            $prd_status = '3';
        } else {
            $payment->update(['pay_response' => json_encode($payload)]);
            $prd_status = '4';
            $transaction->update(['trx_status' => '1']);
        }

        foreach ($transaction->products as $prd) {
            if ($prd == null) {
                throw new \Exception('Terjadi kesalahan pada input transaksi');
                Log::warning('product id is null');
            }
            $id = $prd->prd_id;
            $copy =
                Product::select('prd_status', 'prd_id', 'prd_selled_at')
                ->findOrFail($id);

            if (!$copy) {
                Log::warning('data product is null');
            }
            if ($prd_status == '2') {
                $copy->update(['prd_status' => $prd_status, 'prd_selled_at' => now()]);
            } else {
                $copy->update(['prd_status' => $prd_status]);
            }
        }

        return response()->json(['ok' => true]);
    }

    public function delete_payment_link_system($orderId)
    {
        $url = $this->baseUrl . "/payment-links/{$orderId}";

        $response = Http::withBasicAuth($this->serverKey, '')
            ->delete($url);

        if ($response->failed()) {
            return response()->json(['message' => 'Delete failed', 'detail' => $response->json()], $response->status());
        }

        $payment = Payment::where('pay_midtrans_id', $orderId)->first();
        if ($payment) $payment->update(['pay_status' => 'deleted']);

        return response()->json(['message' => 'Deleted']);
    }
}
