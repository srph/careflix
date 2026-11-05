<?php

namespace App\Http\Controllers;

use App\Party;
use App\Support\JoinParty;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PartyCodesController extends Controller
{
    public function show(Request $request, $code)
    {
        $party = Party::where('join_code', $code)->with('creator')->firstOrFail();
        $video = $party->video;
        abort_unless($video && $video->show, 404);

        // A code grants a preview before membership, not playback URLs, email addresses, or chat.
        return response()->json([
            'id' => $party->id,
            'creator' => $party->creator,
            'is_member' => $request->user()->isMemberOfParty($party),
            'is_playing' => (bool) $party->is_playing,
            'current_time' => (int) $party->current_time,
            'last_activity_at' => Carbon::parse($party->last_activity_at, config('app.timezone'))->toIso8601String(),
            'video' => [
                'title' => $video->title,
                'duration' => $video->duration,
                'preview_image' => $video->preview_image ?: $video->show->preview_image,
                'show' => $video->show->only('title', 'title_type'),
                'group' => $video->group ? $video->group->only('title') : null
            ],
            'members' => $party->members->map(function ($member) {
                return array_merge($member->only('id', 'name', 'avatar'), [
                    'pivot' => ['is_active' => (bool) $member->pivot->is_active]
                ]);
            })->values()
        ])->header('Cache-Control', 'no-store');
    }

    public function join(Request $request, $code, JoinParty $join)
    {
        $party = Party::where('join_code', $code)->whereHas('video.show')->firstOrFail();
        return $join->join($request->user(), $party);
    }
}
