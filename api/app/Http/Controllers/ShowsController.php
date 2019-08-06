<?php

namespace App\Http\Controllers;

use App\Show;
use App\ShowVideo;
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
        return Show::orderBy('id', 'desc')->get();
    }

    public function groups(Show $show) {
        return $show->groups()->with('videos')->get();
    }

    /**
     * Proxy for the subtitle file because we're getting a CORS error
     * when we try to directly access the subtitle through AJAX.
     * 
     * @return \Illuminate\Http\Response
     */
    public function subtitle(ShowVideo $video) {
        if (empty($video->subtitle_url)) {
            return response()->json([ 'subtitle' => '' ]);
        }

        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', $video->subtitle_url);
        return response()->json([ 'subtitle' => (string) $response->getBody() ]);
    }
}
