<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageAccountController extends Controller
{
    public function index() {
        $users = User::select(['usr_id as id', 'name', 'email', 'usr_created_at'])->latest()->paginate(10)->withQueryString();
        return Inertia::render('user/index', compact('users'));
    }

    public function show($id) {
        $user = User::with('created_by:usr_id,name', 'updated_by:usr_id,name', 'deleted_by:usr_id,name')->find($id)->toArray();
        return Inertia::render('user/detail', compact('user'));
    }

    public function add() {
        return Inertia::render('user/add');
    }

    public function edit($id) {
        return Inertia::render('user/edit');
    }

    public function add_system(Request $request) {
    try {
        $messages = [
            'name.required' => 'Nama pengguna wajib diisi.',
            'name.max' => 'Nama pengguna memiliki maksimal :max karakter.',
            'name.min' => 'Nama pengguna minimal harus memiliki :min karakter.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'email memiliki maksimal :max karakter.',
            'email.unique' => 'Email ini sudah terdaftar.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.max' => 'Kata sandi memiliki maksimal :max karakter.',
            'password.min' => 'Kata sandi minimal harus memiliki :min karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ];
        $validateData = $request->validate([
            'name' => ['required', 'string', 'max:50', 'min:3'],
            'email' => ['required', 'email', 'string', 'max:255', 'unique:users,email'],
            'password' => ['required', 'min:8', 'max:30', 'confirmed']
        ], $messages);

        $user = User::create($validateData);
        $user->assignRole('seller');

        return back()->with([
            'success' => 'Akun berhasil dibuat.',
        ]);
    } catch (\Throwable $th) {
        return back()->with([
            'error' => $th->getMessage().' Akun gagal dibuat.',
        ]);
    }
    }

    public function delete_system($id) {
        try {
            $user = User::select('usr_id')->find($id);
            $user->delete();
        return redirect('/manage/user')->with([
            'success' => 'Akun berhasil dihapus.',
        ]);
    } catch (\Throwable $th) {
        return redirect('/manage/user')->with([
            'error' => $th->getMessage().' Akun gagal dihapus.',
        ]);
    }
    }
}
