<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;

class AppListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:list-users {limit=10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lists the most recent  users';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $limit = (int) $this->argument('limit');

        $users = User::orderBy('id', 'desc')
            ->limit($limit)
            ->get();

        $this->info('Most recent users:');

        $users->each(function($user) {
            $this->info(
                "{$user->name} ({$user->email}) registered {$user->created_at->diffForHumans()}"
            );
        });
    }
}
