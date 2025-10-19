<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageCategoryController extends Controller
{
    public function index() {
        $categories = Category::select('cat_id as id', 'cat_name', 'cat_slug', 'cat_created_at')->latest()->paginate(10);
        return Inertia::render('category/index', compact('categories'));
    }

    public function show($id) {
        $category = Category::with('created_by:usr_id,name', 'updated_by:usr_id,name', 'deleted_by:usr_id,name')->find($id)->toArray();
        return Inertia::render('category/detail', compact('category'));
    }

    public function add() {
        return Inertia::render('category/add');
    }

    public function edit($id) {
        $category = Category::select('cat_id', 'cat_name')->find($id);
        return Inertia::render('category/edit', compact('category'));
    }

    public function add_system(Request $request) {
        try {
            $messages = [
                'cat_name.required' => 'Nama kategori wajib diisi.',
                'cat_name.max' => 'Nama kategori memiliki maksimal :max karakter.',
                'cat_name.min' => 'Nama kategori minimal harus memiliki :min karakter.',
            ];
            $validateData = $request->validate([
                'cat_name' => ['required', 'string', 'min:3', 'max:255']
            ], $messages);

            Category::create($validateData);
            return redirect('/manage/category')->with([
                'success' => 'Kategori berhasil dibuat.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/category/add')->with([
                'error' => $th->getMessage().' | kategori gagal dibuat.',
            ])->setStatusCode(303);
        }
    }

    public function edit_system(Request $request, $id) {
        try {
            $category = Category::select('cat_id')->find($id);
            $messages = [
                'cat_name.required' => 'Nama kategori wajib diisi.',
                'cat_name.max' => 'Nama kategori memiliki maksimal :max karakter.',
                'cat_name.min' => 'Nama kategori minimal harus memiliki :min karakter.',
            ];
            $validateData = $request->validate([
                'cat_name' => ['sometimes' ,'required', 'string', 'min:3', 'max:255']
            ], $messages);

            $category->update($validateData);
            return redirect('/manage/category')->with([
                'success' => 'Kategori berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/category'.$id.'/edit')->with([
                'error' => $th->getMessage().' | kategori gagal diubah.',
            ])->setStatusCode(303);
        }
    }

    public function delete_system($id) {
        try {
            $category = Category::select('cat_id')->find($id);
            $category->delete();
            return redirect('/manage/category')->with([
                'success' => 'Kategori berhasil dihapus.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/category')->with([
                'error' => $th->getMessage().' | kategori gagal dihapus.',
            ])->setStatusCode(303);
        }
    }
}
