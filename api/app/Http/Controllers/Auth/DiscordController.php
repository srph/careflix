<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\DiscordAccountRequiresLinking;
use App\Http\Controllers\Controller;
use App\Support\DiscordLogin;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class DiscordController extends Controller
{
    public function redirect(Request $request)
    {
        $request->validate(['challenge' => ['required', 'regex:/^[a-f0-9]{64}$/']]);
        if (!config('services.discord.client_id') || !config('services.discord.client_secret')) {
            return $this->frontend(['error' => 'not_configured']);
        }

        $request->session()->put('discord_challenge', $request->query('challenge'));

        return Socialite::driver('discord')->setRequest($request)->scopes(['identify', 'email'])->redirect();
    }

    public function callback(Request $request, DiscordLogin $login)
    {
        $challenge = $request->session()->pull('discord_challenge');
        if (!$challenge) {
            return $this->frontend(['error' => 'expired']);
        }
        if ($request->has('error')) {
            $request->session()->forget('state');
            return $this->frontend(['error' => 'cancelled']);
        }

        try {
            $profile = Socialite::driver('discord')->setRequest($request)->user();
            $user = $login->resolveUser($profile);

            return $this->frontend(['code' => $login->ticket($user, 'handoff', $challenge)]);
        } catch (DiscordAccountRequiresLinking $exception) {
            return $this->frontend(['error' => 'account_link_required']);
        } catch (InvalidStateException $exception) {
            return $this->frontend(['error' => 'expired']);
        } catch (\Throwable $exception) {
            report($exception);
            return $this->frontend(['error' => 'connection_failed']);
        }
    }

    public function exchange(Request $request, DiscordLogin $login)
    {
        $this->validateTicket($request);
        $data = $login->redeem($request->input('ticket'), $request->input('verifier'), 'handoff', function ($user, $challenge) use ($login) {
            if (!$user->needsRequestAccess()) {
                return $login->session($user);
            }

            return [
                'requires_request_access' => true,
                'onboarding_ticket' => $login->ticket($user, 'onboarding', $challenge),
                'name' => $user->name,
                'expires_at' => now()->addMinutes(15)->toIso8601String(),
            ];
        });

        return response()->json($data)->header('Cache-Control', 'no-store');
    }

    public function requestAccess(Request $request, DiscordLogin $login)
    {
        $this->validateTicket($request);
        $request->validate(['request_access' => 'nullable|string|max:255']);
        $data = $login->redeem($request->input('ticket'), $request->input('verifier'), 'onboarding', function ($user) use ($login, $request) {
            if ($user->needsRequestAccess()) {
                $code = (string) $request->input('request_access', '');
                if (!hash_equals(trim((string) config('config.request_access_code')), $code)) {
                    throw ValidationException::withMessages(['request_access' => ['That code didn’t match. Please try again.']]);
                }
                $user->request_access = $code;
                $user->request_access_verified_at = now();
                $user->save();
            }

            return $login->session($user);
        });

        return response()->json($data)->header('Cache-Control', 'no-store');
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();

        return response()->json(['message' => 'Logged out.'])->header('Cache-Control', 'no-store');
    }

    private function validateTicket(Request $request)
    {
        $request->validate([
            'ticket' => ['required', 'regex:/^[a-f0-9]{64}$/'],
            'verifier' => ['required', 'regex:/^[a-f0-9]{64}$/'],
        ]);
    }

    private function frontend(array $parameters)
    {
        return redirect()->away(rtrim(config('services.discord.frontend_url'), '/') . '/auth/callback?' . http_build_query($parameters))
            ->header('Cache-Control', 'no-store')->header('Referrer-Policy', 'no-referrer');
    }
}
