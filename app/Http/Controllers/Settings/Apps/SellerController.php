<?php

namespace App\Http\Controllers\Settings\Apps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/apps/seller');
    }
}
