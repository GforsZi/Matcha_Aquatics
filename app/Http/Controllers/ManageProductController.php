<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageProductController extends Controller
{
    public function index() {
        $products = Product::select('prd_id as id', 'prd_name', 'prd_price', 'prd_status', 'prd_created_at')->with('categories:cat_id,cat_name,cat_slug')->latest()->paginate(10);
        return Inertia::render('product/index', compact('products'));
    }

    public function show($id) {
        return Inertia::render('product/detail');
    }

    public function add() {
        return Inertia::render('product/add');
    }

    public function edit($id) {
        return Inertia::render('product/edit');
    }

    public function add_system(Request $request) {
        dd($request);
        try {
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product/add')->with([
                'error' => $th->getMessage().' | produk gagal dibuat.',
            ])->setStatusCode(303);
        }
    }

    public function edit_system(Request $request, $id) {
        try {
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product'.$id.'/edit')->with([
                'error' => $th->getMessage().' | produk gagal diubah.',
            ])->setStatusCode(303);
        }
    }

    public function delete_system($id) {
        try {
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product')->with([
                'error' => $th->getMessage().' | produk gagal dihapus.',
            ])->setStatusCode(303);
        }
    }
}
