<?php

use App\Http\Controllers\ManageAccountController;
use App\Http\Controllers\ManageCategoryController;
use App\Http\Controllers\ManageProductController;
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
    Route::get('/manage/user/{id}/detail', [ManageAccountController::class, 'show']);
    Route::get('/manage/user/add', [ManageAccountController::class, 'add']);
    Route::get('/manage/user/{id}/edit', [ManageAccountController::class, 'edit']);

    Route::get('/manage/product', [ManageProductController::class, 'index']);
    Route::get('/manage/product/{id}/detail', [ManageProductController::class, 'show']);
    Route::get('/manage/product/add', [ManageProductController::class, 'add']);
    Route::get('/manage/product/{id}/edit', [ManageProductController::class, 'edit']);

    Route::get('/manage/category', [ManageCategoryController::class, 'index']);
    Route::get('/manage/category/{id}/detail', [ManageCategoryController::class, 'show']);
    Route::get('/manage/category/add', [ManageCategoryController::class, 'add']);
    Route::get('/manage/category/{id}/edit', [ManageCategoryController::class, 'edit']);
});

Route::middleware(['auth', 'verified', 'role:buyer'])->group(function () {
    Route::get('/home', function () {
        return Inertia::render('dashboard');

    });
});

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::post('/user/add', [ManageAccountController::class, 'add_system']);
    Route::put('/user/{id}/edit', [ManageAccountController::class, 'edit_system']);
    Route::delete('/user/{id}/delete', [ManageAccountController::class, 'delete_system']);

    Route::post('/product/add', [ManageProductController::class, 'add_system']);
    Route::put('/product/{id}/edit', [ManageProductController::class, 'edit_system']);
    Route::delete('/product/{id}/delete', [ManageProductController::class, 'delete_system']);

    Route::post('/category/add', [ManageCategoryController::class, 'add_system']);
    Route::put('/category/{id}/edit', [ManageCategoryController::class, 'edit_system']);
    Route::delete('/category/{id}/delete', [ManageCategoryController::class, 'delete_system']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
