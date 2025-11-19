<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class UserController extends Controller
{
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
        $carts = Cart::with('product')
            ->where('crt_user_id', Auth::id())
            ->get();
        // dd($carts->toArray());
        return Inertia::render('home/cart', compact('carts'));
    }

    public function add_cart_system(Request $request)
    {
        try {
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
            return redirect('/manage/product/add')->with([
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
        $product = Product::with('categories')->where('prd_slug', $slug)->get()->first();
        return Inertia::render('home/product', compact('product'));
    }
}
