<?php

namespace App\Http\Middleware;

use Closure;

class MemberOfParty
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $party = $request->route('party');

        if (!$request->user()->isMemberOfParty($party)) {
            return response()->json([
                'error' => true,
                'status' => 403,
                'message' => 'It appears that you don\'t have sufficient permissions to access this content.'
            ], 403);
        }

        return $next($request);
    }
}
