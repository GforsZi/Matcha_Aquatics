<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index() {
        $users = User::select(['usr_id', 'name', 'email'])->latest()->paginate(10)->withQueryString();;
        return Inertia::render('user/index', compact('users'));
    }
}
