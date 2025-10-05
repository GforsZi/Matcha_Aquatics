<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');

    })->name('dashboard');

    Route::get('/manage/user', [UserController::class, 'index']);
});

Route::middleware(['auth', 'verified', 'role:buyer'])->group(function () {
    Route::get('/home', function () {
        return Inertia::render('dashboard');

    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
