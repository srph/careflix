<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Party;
use Carbon\Carbon;

class AppListPt extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:list-pt {days=3}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lists the most recent parties from the last n days.';

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
        $ago = Carbon::now()->subDays((int) $this->argument('days'));

        $parties = Party::where('created_at', '>=', $ago->format('Y-m-d') . ' 00:00:00')
            ->orderBy('id', 'desc')
            ->get();

        $parties->each(function($party) {
            $master = $party->members->splice(0, 1)->first();

            $when = $party->created_at->diffForHumans();
            
            if ($party->members->count()) {
                $members = $party->members->pluck('name')->join(', ', ', and ');

                $this->info(
                    "{$master->name} watched {$party->video->show->title} with {$members} {$when}"
                );
            } else {
                $this->info(
                    "{$master->name} watched {$party->video->show->title} {$when}"
                );
            }
        });
    }
}
