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
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Bumblebee'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:53:52')
            ],
            [
                'title' => 'How To Train Your Dragon 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2014),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('How To Train Your Dragon 2'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:55')
            ],
            [
                'title' => 'How To Train Your Dragon: The Hidden World',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('How To Train Your Dragon: The Hidden World'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:23')
            ],
            [
                'title' => 'Spider-Man: Into The Spider-Verse',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Spider-Man: Into The Spider-Verse'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:56:48')
            ],
            [
                'title' => 'Hachiko',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2009),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hachiko'),
                'age_rating' => '',
                //
                'extension' => 'mkv',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:14')
            ],
            [
                'title' => 'John Wick Chapter 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2017),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('John Wick Chapter 2'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:02:22')
            ],
            [
                'title' => 'Rampage',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Rampage'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:47:16')
            ],
            [
                'title' => 'Silent Retreat',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2017),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Silent Retreat'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:24:40')
            ],
            [
                'title' => 'Silent Hill',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2006),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Silent Hill'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:05:19')
            ],
            [
                'title' => 'Silent Hill Revelation',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2012),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Silent Hill Revelation'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:34:46')
            ],
            [
                'title' => 'Shazam',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Shazam'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:34:46')
            ],
            [
                'title' => 'Coco',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Coco'),
                'age_rating' => 'G',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:45:02')
            ],
            [
                'title' => 'Annihilation',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Annihilation'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:55:29')
            ],
            [
                'title' => 'Godzilla: The Planet Eater',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Godzilla: The Planet Eater'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:30:30')
            ],
            [
                'title' => 'Littleman',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Littleman'),
                'age_rating' => 'R18',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:37:39')
            ],
            [
                'title' => 'Mandy',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2018),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Mandy'),
                'age_rating' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:10')
            ],
            [
                'title' => 'Mulan',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(1998),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Mulan'),
                'age_rating' => 'G',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:27:50')
            ],
            [
                'title' => 'Mulan 2: The Final War',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2004),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Mulan 2: The Final War'),
                'age_rating' => 'G',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:18:41')
            ],
            [
                'title' => 'Noroi: The Curse',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'Japanese',
                'air_start' => Carbon::create(2005),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Noroi: The Curse'),
                'age_rating' => 'G',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:54:43')
            ],
            [
                'title' => 'Stay Alive',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2006),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Stay Alive'),
                'age_rating' => 'G',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:25:28')
            ],
        ];

        foreach($movies as $movie) {
            $show = App\Show::create(Arr::except($movie, ['duration', 'extension']));

            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => Helper::getVideoUrlFromMovieTitle($show->title, $movie['extension']),
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
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('We Bare Bears'),
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
