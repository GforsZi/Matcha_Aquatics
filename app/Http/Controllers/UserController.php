<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
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
        $products = Product::select('prd_id', 'prd_name', 'prd_price', 'prd_img_url', 'prd_status', 'prd_slug')->latest()->limit(40)->get();
        return Inertia::render('home/index', compact('app_banner', 'products'));
    }
    public function search(Request $request)
    {
        $cat_products = [];
        if ($request->has('category')) {
            $cat_products = Product::query()
                ->select('prd_id', 'prd_name', 'prd_price', 'prd_img_url', 'prd_status', 'prd_slug')
                ->with('categories')
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
        return Inertia::render('home/cart');
    }

    public function product()
    {
        return Inertia::render('home/product');
    }
}
