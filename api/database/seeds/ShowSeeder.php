<?php

use Illuminate\Database\Seeder;

class ShowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $movies = [
            [
                'title' => 'Bumblebee',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => ''
            ],
            [
                'title' => 'How To Train Your Dragon 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2014),
                'preview_image' => ''
            ],
            [
                'title' => 'How To Train Your Dragon: The Hidden World',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => ''
            ],
            [
                'title' => 'Spider-Man: Into The Spider-Verse',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => ''
            ],
            [
                'title' => 'Spider-Man: Into The Spider-Verse',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => ''
            ]
        ];

        foreach($movies as $movie) {
            $show = App\Show::create([
                'title' => $is_movie ? 'Avengers: Endgame' : 'Brooklyn Nine-Nine',
                'title_type' => $title_type,
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2000 + $i, 0, 0),
                'air_end' => $is_movie ? null : Carbon::create(2000 + $i + 1, 0, 0),
                'age_rating' => '13+',
                'preview_image' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/thumbnail.png'
            ]);

            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/big-buck-bunny.mp4',
                'duration' => 596,
                'synopsis' => $faker->text,
            ]);
        }

        $series = [
            [
                'title' => 'We Bare Bears',
                'title_type' => 'series',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => '',
                'age_rating' => 'G'
            ]
        ];

        foreach($movies as $movie) {
            $show = App\Show::create([
                'title' => $is_movie ? 'Avengers: Endgame' : 'Brooklyn Nine-Nine',
                'title_type' => $title_type,
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2000 + $i, 0, 0),
                'air_end' => $is_movie ? null : Carbon::create(2000 + $i + 1, 0, 0),
                'age_rating' => '13+',
                'preview_image' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/thumbnail.png'
            ]);

            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/big-buck-bunny.mp4',
                'duration' => 596,
                'synopsis' => $faker->text,
            ]);
        }

        $show = App\Show::create([
            'title' => $is_movie ? 'Avengers: Endgame' : 'Brooklyn Nine-Nine',
            'title_type' => $title_type,
            'synopsis' => $faker->text,
            'language' => 'English',
            'air_start' => Carbon::create(2000 + $i, 0, 0),
            'air_end' => $is_movie ? null : Carbon::create(2000 + $i + 1, 0, 0),
            'age_rating' => '13+',
            'preview_image' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/thumbnail.png'
        ]);

        if ($is_movie) {
            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/big-buck-bunny.mp4',
                'duration' => 596,
                'synopsis' => $faker->text,
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
                        'video_url' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/big-buck-bunny.mp4',
                        'duration' => 596,
                        'synopsis' => $faker->text,
                        'preview_image' => 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/big-buck-bunny/thumbnail.png'
                    ]);
                }
            }
        }
    }
}
