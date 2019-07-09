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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:11:43')
            ],
            [
                'title' => 'Coco',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Coco'),
                'age_rating' => 'G',
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => '',
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
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Noroi: The Curse', 'en'),
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
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'avi',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:25:28')
            ],
            [
                'title' => 'Alvin And The Chipmunks: The Road Chip',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2015),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Alvin And The Chipmunks: The Road Chip'),
                'age_rating' => 'G',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:32:00')
            ],
            [
                'title' => 'Don\'t Breathe',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2015),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Don\'t Breathe'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:28:32')
            ],
            [
                'title' => 'Jumanji',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(1995),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Jumanji'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:06')
            ],
            [
                'title' => 'Jumanji: Welcome to the Jungle',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2017),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Jumanji: Welcome to the Jungle'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:03')
            ],
            [
                'title' => 'The Exorcism of Emily Rose',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2005),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Exorcism of Emily Rose'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:45')
            ],
            [
                'title' => 'One Piece: Gold',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'Japanese',
                'air_start' => Carbon::create(2016),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('One Piece: Gold'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mkv',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:45')
            ],
            [
                'title' => 'One Piece: Z',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'Japanese',
                'air_start' => Carbon::create(2012),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('One Piece: Z'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mkv',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:45')
            ],
            [
                'title' => 'Hellboy',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2004),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hellboy'),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Hellboy', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:12:29')
            ],
            [
                'title' => 'Hellboy: The Golden Army',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2008),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hellboy: The Golden Army'),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Hellboy: The Golden Army', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:49')
            ],
            [
                'title' => 'Hellboy 2019',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hellboy 2019'),
                'age_rating' => 'R',
                'subtitle_url' => '',
                //
                'extension' => 'mkv',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:00:40')
            ],
            [
                'title' => 'Warcraft',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2016),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Warcraft'),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Warcraft', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:03:07')
            ],
            [
                'title' => 'Escape Room',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2019),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Escape Room'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:39:34')
            ],
            [
                'title' => 'Scary Movie 5',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2013),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Scary Movie 5'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:28:07')
            ],
            [
                'title' => 'Scary Movie 4',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2006),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Scary Movie 4'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:29:32')
            ],
            [
                'title' => 'Scary Movie 3',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2003),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Scary Movie 3'),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:25:40')
            ],
            [
                'title' => 'Scary Movie 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Scary Movie 2'),
                'air_start' => Carbon::create(2001),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:22:27')
            ],
            [
                'title' => 'Scary Movie',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Scary Movie'),
                'air_start' => Carbon::create(2000),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:28:17')
            ],
            [
                'title' => 'American Pie Reunion',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Pie Reunion'),
                'air_start' => Carbon::create(2012),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:53:51')
            ],
            [
                'title' => 'American Pie Presents: The Book Of Love',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Pie Presents: The Book Of Love'),
                'air_start' => Carbon::create(2009),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:34')
            ],
            [
                'title' => 'American Wedding',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Wedding'),
                'air_start' => Carbon::create(2003),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:42:34')
            ],
            [
                'title' => 'American Pie 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Pie 2'),
                'air_start' => Carbon::create(2001),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:50:40')
            ],
            [
                'title' => 'American Pie',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Pie'),
                'air_start' => Carbon::create(1999),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:35:37')
            ],
            [
                'title' => 'Drinking Buddies',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Drinking Buddies'),
                'air_start' => Carbon::create(2013),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:30:22')
            ],
            [
                'title' => 'My Best Friend\'s Wedding',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('My Best Friend\'s Wedding'),
                'air_start' => Carbon::create(1997),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:52')
            ],
            [
                'title' => 'The Sweetest Thing',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Sweetest Thing'),
                'air_start' => Carbon::create(2002),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:24:29')
            ],
            [
                'title' => 'The Todo List',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Todo List'),
                'air_start' => Carbon::create(2013),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:43:53')
            ],
            [
                'title' => 'Assassin\'s Creed',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Assassin\'s Creed'),
                'air_start' => Carbon::create(2016),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:55:31')
            ],
            [
                'title' => 'Saint Young Men',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Saint Young Men'),
                'air_start' => Carbon::create(2013),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Saint Young Men', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:29:39')
            ],
        ];

        foreach($movies as $movie) {
            $show = App\Show::create(Arr::except($movie, ['duration', 'extension', 'subtitle_url']));

            App\ShowVideo::create([
                'show_id' => $show->id,
                'video_url' => Helper::getVideoUrlFromMovieTitle($show->title, $movie['extension']),
                'subtitle_url' => $movie['subtitle_url'],
                'duration' => $movie['duration'],
                'synopsis' => $faker->text,
            ]);
        }

        $series = [
            // [
            //     'title' => 'We Bare Bears',
            //     'title_type' => 'series',
            //     'synopsis' => $faker->text,
            //     'language' => 'English',
            //     'air_start' => Carbon::create(2018),
            //     'preview_image' => Helper::getPreviewUrlFromMovieTitle('We Bare Bears'),
            //     'age_rating' => 'G',
            //     //
            //     'seasons' => [
            //         [
            //             'title' => 'Season 1',
            //             'episodes' => 23,
            //             'extension' => 'mkv'
            //         ]
            //     ]
            // ]
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
