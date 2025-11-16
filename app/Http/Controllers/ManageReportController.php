<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageReportController extends Controller
{
    public function index()
    {
        return Inertia::render('report/index');
    }
}
