<?php

namespace App\Http\Controllers;

use App\Show;
use Illuminate\Http\Request;

class ShowsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Show::all();
    }
}
