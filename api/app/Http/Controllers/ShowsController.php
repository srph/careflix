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
    public function index(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:200',
            'title_type' => 'nullable|in:movie,series',
            'per_page' => 'nullable|integer|min:1|max:60',
            'page' => 'nullable|integer|min:1'
        ]);

        $shows = Show::with('movieVideo')->withCount('groups');

        if ($request->filled('title_type')) {
            $shows->where('title_type', $request->get('title_type'));
        }

        if ($request->filled('q')) {
            $shows->searchTitle($request->get('q'));
        }

        return $shows->orderBy('id', 'desc')
            ->paginate($request->get('per_page') ?: 30);
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
