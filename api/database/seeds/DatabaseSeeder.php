<?php

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        App\User::truncate();
        App\Show::truncate();
        App\ShowGroup::truncate();
        App\ShowVideo::truncate();

        $faker = Faker::create();

        $this->command->info('Seeding `users` table (1/1)');

        $user = App\User::create([
            'name' => $faker->name,
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => 'password',
            'remember_token' => Str::random(10),
            'is_admin' => true
        ]);

        $user = App\User::create([
            'name' => $faker->name,
            'email' => 'user@user.com',
            'email_verified_at' => now(),
            'password' => 'password',
            'remember_token' => Str::random(10),
            'is_admin' => false
        ]);

        foreach(range(0, 10) as $i) {
            $is_movie = $i < 5;

            $title_type = $is_movie ? 'movie' : 'series';

            $this->command->info(sprintf('Seeding `shows` table [%s] (%s / %s)', $title_type, $i + 1, 10));

            $show = App\Show::create([
                'title' => $is_movie ? 'Avengers: Endgame' : 'Brooklyn Nine-Nine',
                'title_type' => $title_type,
                'synposis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2000 + $i, 0, 0),
                'air_end' => $is_movie ? null : Carbon::create(2000 + $i + 1, 0, 0),
                'age_rating' => '13+'
            ]);

            if ($is_movie) {
                App\ShowVideo::create([
                    'show_id' => $show->id,
                    'video_url' => 'https://tite.com',
                    'duration' => 7200,
                    'synopsis' => $faker->text
                ]);
            } else {
                foreach (range(0, 2) as $j) {
                    $group = App\ShowGroup::create([
                        'show_id' => $show->id,
                        'title' => sprintf("Season %s", $j + 1)
                    ]);

                    foreach(range(0, 5) as $k) {
                        App\ShowVideo::create([
                            'show_id' => $show->id,
                            'show_group_id' => $group->id,
                            'title' => sprintf("Episode %s", $k),
                            'video_url' => 'https://tite.com',
                            'duration' => 1200,
                            'synopsis' => $faker->text
                        ]);
                    }
                }
            }
        }
    }
}
