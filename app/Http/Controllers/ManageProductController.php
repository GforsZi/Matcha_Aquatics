<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageProductController extends Controller
{
    public function index()
    {
        $products = Product::select('prd_id as id', 'prd_name', 'prd_price', 'prd_status', 'prd_created_at')->with('categories:cat_id,cat_name,cat_slug')->latest()->paginate(10);
        return Inertia::render('product/index', compact('products'));
    }

    public function show($id)
    {
        $product = Product::with('categories', 'created_by:usr_id,name', 'updated_by:usr_id,name', 'deleted_by:usr_id,name')->findOrFail($id)->toArray();
        return Inertia::render('product/detail', compact('product'));
    }

    public function add()
    {
        return Inertia::render('product/add');
    }

    public function edit($id)
    {
        $product = Product::select('prd_id', 'prd_name', 'prd_img_url', 'prd_description', 'prd_price', 'prd_status')->with('categories')->findOrFail($id);
        return Inertia::render('product/edit', compact('product'));
    }

    public function search_system(Request $request)
    {
        $query = trim($request->get('q', ''));

        if ($query === '') {
            return response()->json([]);
        }

        $products = Product::where('prd_name', 'like', "%{$query}%")
            ->select('prd_id', 'prd_name', 'prd_price', 'prd_img_url', 'prd_status', 'prd_slug')->where('prd_status', '1')
            ->limit(10)
            ->get();

        return response()->json($products);
    }

    public function add_system(Request $request)
    {
        try {
            $message = [
                'prd_name.required' => 'Nama produk wajib diisi.',
                'prd_name.max' => 'Nama produk wajib diisi.',
                'prd_price.required' => 'Harga produk wajib diisi.',
                'prd_price.max' => 'Harga produk tidak boleh melebihi :max.',
                'prd_price.min' => 'Harga produk tidak boleh kurang dari :min.',
                'prd_description.max' => 'Deskripsi produk tidak boleh melebihi :max.',
                'prd_status.in' => 'Status produk tidak valid.',
                'image.image' => 'File harus berupa gambar.',
                'image.max' => 'Ukuran gambar maksimal 4MB.',

            ];
            $validateData = $request->validate([
                'prd_name' => ['required', 'string', 'max:255'],
                'prd_price' => ['required', 'integer', 'max:9999999999', 'min:0'],
                'prd_description' => ['nullable', 'string', 'max:65535'],
                'prd_status' => ['nullable', 'in:1,2,3'],
                'image' => ['nullable', 'image', 'max:4096'],
            ], $message);

            if ($request->prd_status == null) {
                $validateData['prd_status'] = '3';
            }

            if ($request->hasFile('image')) {
                $destinationPath = public_path('media/cover_product/');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                $filename = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move($destinationPath, $filename);

                $validateData['prd_img_url'] = 'media/cover_product/' . $filename;
            }

            $product = Product::create($validateData);

            if ($request->has('category_id')) {
                $validateDataCategory = $request->validate([
                    'category_id' => 'required|array|min:1',
                    'category_id.*' => 'exists:categories,cat_id',
                ], [
                    'category_id.array' => 'Format kategori tidak valid.',
                    'category_id.min' => 'Minimal satu kategori wajib dipilih.',
                    'category_id.*.exists' => 'kategori tidak ditemukan.',
                ]);

                $product->categories()->sync($validateDataCategory['category_id']);
            }
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product/add')->with([
                'error' => $th->getMessage() . ' | produk gagal dibuat.',
            ])->setStatusCode(303);
        }
    }

    public function edit_system(Request $request, $id)
    {
        $product = Product::select('prd_id')->findOrFail($id);
        try {
            $message = [
                'prd_name.required' => 'Nama produk wajib diisi.',
                'prd_name.max' => 'Nama produk wajib diisi.',
                'prd_price.required' => 'Harga produk wajib diisi.',
                'prd_price.max' => 'Harga produk tidak boleh melebihi :max.',
                'prd_price.min' => 'Harga produk tidak boleh kurang :min.',
                'prd_description.max' => 'Deskripsi produk tidak boleh melebihi :max.',
                'prd_status.in' => 'Status produk tidak valid.',
                'image.image' => 'File harus berupa gambar.',
                'image.max' => 'Ukuran gambar maksimal 4MB.',

            ];
            $validateData = $request->validate([
                'prd_name' => ['required', 'string', 'max:255'],
                'prd_price' => ['sometimes', 'required', 'integer', 'max:9999999999', 'min:0'],
                'prd_description' => ['nullable', 'string', 'max:65535'],
                'prd_status' => ['sometimes', 'nullable', 'in:1,2,3'],
                'image' => ['sometimes', 'nullable', 'image', 'max:4096'],
            ], $message);

            if ($request->prd_status == null) {
                $validateData['prd_status'] = '3';
            }

            if ($request->hasFile('image')) {
                $destinationPath = public_path('media/cover_product/');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                $filename = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move($destinationPath, $filename);

                $validateData['prd_img_url'] = 'media/cover_product/' . $filename;
            }

            $product->update($validateData);
            $product->categories()->detach();
            if ($request->has('category_id')) {
                $validateDataCategory = $request->validate([
                    'category_id' => 'required|array|min:1',
                    'category_id.*' => 'exists:categories,cat_id',
                ], [
                    'category_id.array' => 'Format kategori tidak valid.',
                    'category_id.min' => 'Minimal satu kategori wajib dipilih.',
                    'category_id.*.exists' => 'kategori tidak ditemukan.',
                ]);

                $product->categories()->sync($validateDataCategory['category_id']);
            }
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product/' . $id . '/edit')->with([
                'error' => $th->getMessage() . ' | produk gagal diubah.',
            ])->setStatusCode(303);
        }
    }

    public function delete_system($id)
    {
        try {
            $product = Product::select('prd_id')->findOrFail($id);
            $product->delete();
            return redirect('/manage/product')->with([
                'success' => 'Produk berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/product')->with([
                'error' => $th->getMessage() . ' | produk gagal dihapus.',
            ])->setStatusCode(303);
        }
    }
}
