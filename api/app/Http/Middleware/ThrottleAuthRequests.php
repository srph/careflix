<?php

namespace App\Http\Middleware;

use Illuminate\Routing\Middleware\ThrottleRequests;

class ThrottleAuthRequests extends ThrottleRequests
{
    protected function resolveRequestSignature($request)
    {
        // Laravel 5.8 otherwise shares one IP bucket across every throttle
        // middleware, so a handoff could exhaust the access-code allowance.
        return sha1($request->path() . '|' . parent::resolveRequestSignature($request));
    }
}
