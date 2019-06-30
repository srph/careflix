<?php

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Support\Helper;

class ShowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        App\Show::truncate();
        App\ShowGroup::truncate();
        App\ShowVideo::truncate();

        $faker = Faker::create();

        $movies = [
            [
                'title' => 'Bumblebee',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Bumblebee', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:53:52')
            ],
            [
                'title' => 'How To Train Your Dragon 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2014),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('How To Train Your Dragon 2', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:55')
            ],
            [
                'title' => 'How To Train Your Dragon: The Hidden World',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('How To Train Your Dragon: The Hidden World', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:23')
            ],
            [
                'title' => 'Spider-Man: Into The Spider-Verse',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Spider-Man: Into The Spider-Verse', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:56:48')
            ],
            [
                'title' => 'Hachiko',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2009),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hachiko', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:14')
            ],
            [
                'title' => 'John Wick Chapter 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2017),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('John Wick Chapter 2', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:02:22')
            ],
            [
                'title' => 'Rampage',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Rampage', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:47:16')
            ],
            [
                'title' => 'Silent Retreat',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2017),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Silent Retreat', '16:9'),
                'age_rating' => '',
                //
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:24:40')
            ]
        ];

        foreach($movies as $movie) {
            $show = App\Show::create(Arr::except($movie, ['duration']));

            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => Helper::getVideoUrlFromMovieTitle($show->title),
                'duration' => $movie['duration'],
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
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('We Bare Bears', '16:9'),
                'age_rating' => 'G',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 23,
                        'extension' => 'mkv'
                    ]
                ]
            ]
        ];

        foreach($series as $series) {
            $show = App\Show::create(Arr::except($series, ['seasons']));

            foreach($series['seasons'] as $i => $season) {
                $group = App\ShowGroup::create([
                    'show_id' => $show->id,
                    'title' => $season['title']
                ]);

                for($j = 0; $j < $season['episodes']; $j++) {
                    App\ShowVideo::create([
                        'show_group_id' => $group->id,
                        'show_id' => $show->id,
                        'title' => 'Episode ' . ($j + 1),
                        'video_url' => \App\Support\Helper::getVideoUrlFromEpisode([
                            'title' => $show->title,
                            'season' => $i + 1,
                            'episode' => $j + 1,
                            'extension' => 'mkv'
                        ]),
                        'duration' => Helper::getDurationInSecondsFromReadableFormat('11:09'),
                        'synopsis' => $faker->text,
                    ]);
                }
            }
        }
    }
}
