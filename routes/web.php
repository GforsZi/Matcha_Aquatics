<?php

use App\Http\Controllers\ManageAccountController;
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

    Route::get('/manage/user', [ManageAccountController::class, 'index']);
    Route::delete('/manage/user', [ManageAccountController::class, 'index']);
    Route::get('/manage/user/{id}/detail', [ManageAccountController::class, 'show']);
    Route::get('/manage/user/add', [ManageAccountController::class, 'add']);
    Route::get('/manage/user/{id}/edit', [ManageAccountController::class, 'edit']);
    Route::post('/user/add', [ManageAccountController::class, 'add_system']);
});

Route::middleware(['auth', 'verified', 'role:buyer'])->group(function () {
    Route::get('/home', function () {
        return Inertia::render('dashboard');

    });
});

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::post('/user/add', [ManageAccountController::class, 'add_system']);
    Route::delete('/user/{id}/delete', [ManageAccountController::class, 'delete_system']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
