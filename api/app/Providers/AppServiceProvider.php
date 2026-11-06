<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Authentication responses contain credentials; keep the whole flow
        // out of Telescope rather than recording tokens or OAuth state.
        config(['telescope.ignore_paths' => array_merge(config('telescope.ignore_paths', []), [
            'auth/discord*', 'api/auth/*', 'api/logout',
        ])]);
    }
}
