<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
        $user = User::select('usr_id', 'name', 'email')->find($id);
        $role = $user->getRoleNames();
        return Inertia::render('user/edit', compact('user', 'role'));
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

        return redirect('/manage/user')->with([
            'success' => 'Akun berhasil dibuat.',
        ]);
    } catch (\Throwable $th) {
        return redirect('/manage/user/add')->with([
            'error' => $th->getMessage().' | akun gagal dibuat.',
        ]);
    }
    }

    public function edit_system(Request $request, $id) {
        $user = User::select('usr_id', 'email')->find($id);
        try {
            if ($user['usr_id'] == Auth::id()) {
                throw new \Exception('Tidak diizinkan mengubah akun yang sedang anda gunakan');
            }
            $validateData = $request->validate([]);
            $messages = [
                'name.required' => 'Nama pengguna wajib diisi.',
                'name.max' => 'Nama pengguna memiliki maksimal :max karakter.',
                'name.min' => 'Nama pengguna minimal harus memiliki :min karakter.',
                'role.required' => 'Peran wajib diisi.',
                'role.exists' => 'Peran tidak dikenali.',
            ];

            $messageEmail= [
                'email.required' => 'Alamat email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.max' => 'email memiliki maksimal :max karakter.',
                'email.unique' => 'Email ini sudah terdaftar.',
            ];

            $messagePassword= [
                'password.required' => 'Kata sandi wajib diisi.',
                'password.max' => 'Kata sandi memiliki maksimal :max karakter.',
                'password.min' => 'Kata sandi minimal harus memiliki :min karakter.',
                'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            ];
            $validateData = $request->validate([
                'name' => ['sometimes', 'required', 'string', 'max:50', 'min:3'],
                'role' => ['sometimes', 'required', 'string', 'exists:roles,name'],
            ], $messages);

            if ($request->email != $user['email']) {
                $no_wa = $request->validate([
                    'email' => ['sometimes', 'required', 'email', 'string', 'max:255', 'unique:users,email'],
                ], $messageEmail);
                $validateData['email'] = $no_wa['email'];
            }

            if ($request->password != null) {
                $password = $request->validate([
                'password' => ['sometimes', 'required', 'min:8', 'max:30', 'confirmed'],
                ], $messagePassword);
                $validateData['password'] = Hash::make($password['password']);
            }

            $user->update($validateData);
            $user->syncRoles($request->role);
            return redirect('/manage/user')->with([
                'success' => 'Akun berhasil diubah.',
            ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/user/'.$id.'/edit')->with([
                'error' => $th->getMessage().' | akun gagal diubah.',
            ])->setStatusCode(303);
        }
    }

    public function delete_system($id) {
        try {
            $user = User::select('usr_id')->find($id);
            if ($user['usr_id'] == Auth::id()) {
                throw new \Exception('Tidak diizinkan menghapus akun yang sedang anda gunakan');
            }
            $user->delete();
        return redirect('/manage/user')->with([
            'success' => 'Akun berhasil dihapus.',
        ])->setStatusCode(303);
        } catch (\Throwable $th) {
            return redirect('/manage/user')->with([
                'error' => $th->getMessage().' | akun gagal dihapus.',
            ])->setStatusCode(303);
        }
    }
}
