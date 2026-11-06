<?php

namespace App\Http\Middleware;

use Closure;

class EnsureRequestAccess
{
    public function handle($request, Closure $next)
    {
        if ($request->user()->needsRequestAccess()) {
            return response()->json([
                'error' => 'request_access_required',
                'message' => 'Please sign in again to enter your access code.',
            ], 403);
        }

        return $next($request);
    }
}
