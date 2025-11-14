<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ManageAccountController;
use App\Http\Controllers\ManageCategoryController;
use App\Http\Controllers\ManageProductController;
use App\Http\Controllers\ManageTransactionController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::get('dashboard', [AdminController::class, 'index'])->name('dashboard');

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

    Route::get('/manage/transaction', [ManageTransactionController::class, 'index']);
    Route::get('/manage/transaction/{id}/detail', [ManageTransactionController::class, 'show']);
    Route::get('/manage/transaction/{id}/payment_link', [ManageTransactionController::class, 'payment_link_page']);
    Route::get('/manage/transaction/add', [ManageTransactionController::class, 'add']);
});

Route::middleware(['auth', 'verified', 'role:buyer'])->group(function () {
    Route::get('/home', [AdminController::class, 'index']);
});

Route::middleware(['auth', 'verified', 'role:seller'])->group(function () {
    Route::get('/system/users/search', [ManageAccountController::class, 'search_system']);
    Route::post('/system/user/add', [ManageAccountController::class, 'add_system']);
    Route::put('/system/user/{id}/edit', [ManageAccountController::class, 'edit_system']);
    Route::delete('/system/user/{id}/delete', [ManageAccountController::class, 'delete_system']);

    Route::get('/system/product/search', [ManageProductController::class, 'search_system']);
    Route::post('/system/product/add', [ManageProductController::class, 'add_system']);
    Route::put('/system/product/{id}/edit', [ManageProductController::class, 'edit_system']);
    Route::delete('/system/product/{id}/delete', [ManageProductController::class, 'delete_system']);

    Route::get('/system/categories/search', [ManageCategoryController::class, 'search_system']);
    Route::post('/system/category/add', [ManageCategoryController::class, 'add_system']);
    Route::put('/system/category/{id}/edit', [ManageCategoryController::class, 'edit_system']);
    Route::delete('/system/category/{id}/delete', [ManageCategoryController::class, 'delete_system']);

    Route::post('/system/transaction/add', [ManageTransactionController::class, 'add_system']);
    Route::put('/system/transaction/{id}/edit', [ManageTransactionController::class, 'edit_system']);
    Route::delete('/system/transaction/{id}/delete', [ManageTransactionController::class, 'delete_system']);

    Route::post('/system/payment/create/{trx_id}', [ManageTransactionController::class, 'payment_link_system']);
    Route::delete('/payment/{order_id}', [ManageTransactionController::class, 'delete_payment_link_system']);

    Route::get('/system/shipping/provinces', [ShippingController::class, 'provinces']);
    Route::get('/system/shipping/cities/{province}', [ShippingController::class, 'cities']);
    Route::post('/system/shipping/cost', [ShippingController::class, 'cost']);
});
Route::withoutMiddleware([VerifyCsrfToken::class])->post('/system/payment/webhook', [ManageTransactionController::class, 'webhook']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
