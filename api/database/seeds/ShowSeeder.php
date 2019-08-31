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
                'synopsis' => 'When Hiccup and Toothless discover an ice cave that is home to hundreds of new wild dragons and the mysterious Dragon Rider, the two friends find themselves at the center of a battle to protect the peace.',
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
                'synopsis' => 'When Hiccup discovers Toothless isn\'t the only Night Fury, he must seek "The Hidden World", a secret Dragon Utopia before a hired tyrant named Grimmel finds it first.',
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
                'synopsis' => 'Aspiring musician Miguel, confronted with his family\'s ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.',
                'language' => 'English',
                'air_start' => Carbon::create(2017, 11, 22),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Coco'),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Coco', 'en'),
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
                'synopsis' => 'The Straw Hat Pirates take on Gild Tesoro, one of the richest and most ambitious men in the world.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2016),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('One Piece: Gold'),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('One Piece: Gold', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:45')
            ],
            [
                'title' => 'One Piece: Z',
                'title_type' => 'movie',
                'synopsis' => 'A former Marine admiral steals the Dyna Stones, and stands in the way of the Straw Hat Pirates.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2012),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('One Piece: Z'),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('One Piece: Z', 'en'),
                //
                'extension' => 'mp4',
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
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Assassin\'s Creed', 'en'),
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
            [
                'title' => 'American Pie: The Naked Mile',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('American Pie: The Naked Mile'),
                'air_start' => Carbon::create(2013),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:47')
            ],
            [
                'title' => 'Harry Potter and the Deathly Hallows: Part 1',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Harry Potter and the Deathly Hallows: Part 1'),
                'air_start' => Carbon::create(2010),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:26:05')
            ],
            [
                'title' => 'Harry Potter and the Deathly Hallows: Part 2',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Harry Potter and the Deathly Hallows: Part 2'),
                'air_start' => Carbon::create(2011),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:10:26')
            ],
            [
                'title' => 'The Matrix',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Matrix'),
                'air_start' => Carbon::create(1999),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Matrix', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:16:17')
            ],
            [
                'title' => 'The Matrix Reloaded',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Matrix Reloaded'),
                'air_start' => Carbon::create(2003),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Matrix Reloaded', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:18:15')
            ],
            [
                'title' => 'The Matrix Revolutions',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Matrix Revolutions'),
                'air_start' => Carbon::create(2003),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Matrix Revolutions', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:09:16')
            ],
            [
                'title' => 'The Wailing',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Wailing'),
                'air_start' => Carbon::create(2016),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Wailing', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:36:08')
            ],
            [
                'title' => 'One More Chance',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('One More Chance'),
                'air_start' => Carbon::create(2007),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:54:55')
            ],
            [
                'title' => 'The Girl Next Door',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Girl Next Door'),
                'air_start' => Carbon::create(2004),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Girl Next Door', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:49:28')
            ],
            [
                'title' => 'What Happened To Monday',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('What Happened To Monday'),
                'air_start' => Carbon::create(2017),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('What Happened To Monday', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:03:31')
            ],
            [
                'title' => 'Kingsman: The Secret Service',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kingsman: The Secret Service'),
                'air_start' => Carbon::create(2014),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:08:37')
            ],
            [
                'title' => 'Kingsman: The Golden Circle',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kingsman: The Golden Circle'),
                'air_start' => Carbon::create(2017),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:21:02')
            ],
            [
                'title' => 'Euro Trip',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Euro Trip'),
                'air_start' => Carbon::create(2004),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:29:41')
            ],
            [
                'title' => 'Alita Battle Angel',
                'title_type' => 'movie',
                'synopsis' => $faker->text,
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Alita Battle Angel'),
                'air_start' => Carbon::create(2019),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:01:47')
            ],
            [
                'title' => 'Kyoukai no Kanata',
                'title_type' => 'series',
                'synopsis' => $faker->text,
                'language' => 'English',
                'air_start' => Carbon::create(2013, 10, 3),
                'air_end' => Carbon::create(2013, 12, 19),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kyoukai no Kanata'),
                'age_rating' => 'PG-13',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:42'
                    ]
                ]
            ],
            [
                'title' => 'White Chicks',
                'title_type' => 'movie',
                'synopsis' => 'Two disgraced FBI agents go way undercover in an effort to protect hotel heiresses the Wilson Sisters from a kidnapping plot.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('White Chicks'),
                'air_start' => Carbon::create(2004),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('White Chicks', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:48:44')
            ],
            [
                'title' => 'How To Train Your Dragon',
                'title_type' => 'movie',
                'synopsis' => 'A hapless young Viking who aspires to hunt dragons becomes the unlikely friend of a young dragon himself, and learns there may be more to the creatures than he assumed.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('How To Train Your Dragon'),
                'air_start' => Carbon::create(2010),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('How To Train Your Dragon', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:37:51')
            ],
            [
                'title' => 'My Sassy Girl',
                'title_type' => 'movie',
                'synopsis' => 'A young man sees a drunk, cute woman standing too close to the tracks at a metro station in Seoul and pulls her back. She ends up getting him into trouble repeatedly after that, starting on the train.',
                'language' => 'Korean',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('My Sassy Girl'),
                'air_start' => Carbon::create(2001),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('My Sassy Girl', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:03:35')
            ],
            [
                'title' => 'It',
                'title_type' => 'movie',
                'synopsis' => 'In 1960, seven preteen outcasts fight an evil demon that poses as a child-killing clown. Thirty years later, they reunite to stop the demon once and for all when it returns to their hometown.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('It'),
                'air_start' => Carbon::create(1990),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('3:07:25')
            ],
            [
                'title' => 'It 2017',
                'title_type' => 'movie',
                'synopsis' => 'In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster, which disguises itself as a clown and preys on the children of Derry, their small Maine town.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('It 2017'),
                'air_start' => Carbon::create(2017),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('It 2017', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:14:22')
            ],
            [
                'title' => 'The Curse of La Llorona',
                'title_type' => 'movie',
                'synopsis' => 'Ignoring the eerie warning of a troubled mother suspected of child endangerment, a social worker and her own small kids are soon drawn into a frightening supernatural realm.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Curse of La Llorona'),
                'air_start' => Carbon::create(2019),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Curse of La Llorona', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:12')
            ],
            [
                'title' => 'The Hows of Us',
                'title_type' => 'movie',
                'synopsis' => 'A young couple dream of growing old together as they as they deal with the struggles of being in a long-term relationship.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Hows of Us'),
                'air_start' => Carbon::create(2018),
                'age_rating' => '',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:57')
            ],
            [
                'title' => 'My Boss, My Hero',
                'title_type' => 'movie',
                'synopsis' => 'A Korean gangster (Jun-ho Jeong) is sent back to high school by his boss so that he can earn a diploma and be eligible for promotion.',
                'language' => 'Korean',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('My Boss, My Hero'),
                'air_start' => Carbon::create(2001),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('My Boss, My Hero', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:38:12')
            ],
            [
                'title' => 'Kimetsu no Yaiba',
                'title_type' => 'series',
                'synopsis' => 'Tanjiro Kamado is a kindhearted and intelligent boy who lives with his family, making money by selling charcoal. Everything changes when his family is attacked and slaughtered by demons.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2019, 4, 6),
                // 'air_end' => Carbon::create(2013, 12, 19),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kimetsu no Yaiba'),
                'age_rating' => 'PG-13',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 16,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ]
                ]
            ],
            [
                'title' => 'Black Swan',
                'title_type' => 'movie',
                'synopsis' => 'A committed dancer struggles to maintain her sanity after winning the lead role in a production of Tchaikovsky\'s "Swan Lake".',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Black Swan'),
                'air_start' => Carbon::create(2010),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Black Swan', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:48:07')
            ],
            [
                'title' => 'Whiplash',
                'title_type' => 'movie',
                'synopsis' => 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Whiplash'),
                'air_start' => Carbon::create(2014),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Whiplash', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:46:45')
            ],
            [
                'title' => 'The Truman Show',
                'title_type' => 'movie',
                'synopsis' => 'An insurance salesman discovers his whole life is actually a reality TV show.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Truman Show'),
                'air_start' => Carbon::create(1998),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Truman Show', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:42:57')
            ],
            [
                'title' => 'Coherence',
                'title_type' => 'movie',
                'synopsis' => 'Strange things begin to happen when a group of friends gather for a dinner party on an evening when a comet is passing overhead.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Coherence'),
                'air_start' => Carbon::create(2013),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Coherence', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:27:53')
            ],
            [
                'title' => 'You Are The Apple Of My Eye',
                'title_type' => 'movie',
                'synopsis' => 'A group of close friends who attend a private school all have a debilitating crush on the sunny star pupil, Shen Jiayi. The only member of the group who claims not to is Ke Jingteng, but he ends up loving her as well.',
                'language' => 'Chinese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('You Are The Apple Of My Eye'),
                'air_start' => Carbon::create(2011),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('You Are The Apple Of My Eye', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:49:34')
            ],
            [
                'title' => 'The Boy and the Beast',
                'title_type' => 'movie',
                'synopsis' => 'Kyuta slips into an alternate universe where he is raised by the bear-man, Kumatetsu. Kyuta is eventually thrust into an adventure that spans both worlds.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Boy and the Beast'),
                'air_start' => Carbon::create(2015),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Boy and the Beast', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:06')
            ],
            [
                'title' => 'The Perfect Date',
                'title_type' => 'movie',
                'synopsis' => 'A high school student creates an app to offer his services as a fake date to make money for college. When he develops feelings for someone, his plan gets complicated.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Perfect Date'),
                'air_start' => Carbon::create(2019, 3, 27),
                'age_rating' => 'TV-14',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:30:40')
            ],
            [
                'title' => 'Pee Mak',
                'title_type' => 'movie',
                'synopsis' => 'Mak returns from a war with four comrades he has invited to meet his beautiful wife and infant son. But Mak\'s friends begin to realize that Mak\'s family is really dead.',
                'language' => 'Thai',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pee Mak'),
                'air_start' => Carbon::create(2013, 3, 28),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pee Mak', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:51:52')
            ],
            [
                'title' => 'Hentai Kamen 2: The Abnormal Crisis',
                'title_type' => 'movie',
                'synopsis' => 'A hero wearing a mask and a "mankini" slays bad guys with deviant martial arts moves and crotch attacks.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hentai Kamen 2: The Abnormal Crisis'),
                'air_start' => Carbon::create(2016, 5, 14),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Hentai Kamen 2: The Abnormal Crisis', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:57:53')
            ],
            [
                'title' => 'Men In Black: International',
                'title_type' => 'movie',
                'synopsis' => 'The Men in Black have always protected the Earth from the scum of the universe. In this new adventure, they tackle their biggest threat to date: a mole in the Men in Black organization.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Men In Black: International'),
                'air_start' => Carbon::create(2019),
                'age_rating' => 'PG-13',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:54:57')
            ],
            [
                'title' => 'Big Buck Bunny',
                'title_type' => 'movie',
                'synopsis' => 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness. For testing purposes.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Big Buck Bunny'),
                'air_start' => Carbon::create(2008),
                'age_rating' => 'G',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('9:56')
            ],
            [
                'title' => 'Golden Kamuy',
                'title_type' => 'series',
                'synopsis' => 'The magnificent nature of Hokkaido vs vicious convicts and the meeting with a pure Ainu girl, Ashiripa!! A survival battle for a hidden treasure hunt begins!',
                'language' => 'English',
                'air_start' => Carbon::create(2018, 4, 9),
                'air_end' => Carbon::create(2018, 6, 25),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Golden Kamuy'),
                'age_rating' => 'R-17+',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ]
                ]
            ],
            [
                'title' => 'Crows Zero',
                'title_type' => 'movie',
                'synopsis' => 'The son (Shun Oguri) of a Japanese gangster (Gorô Kishitani) attends a high school where the main student activity is brawling.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Crows Zero'),
                'air_start' => Carbon::create(2007, 10, 27),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Crows Zero', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:10:02')
            ],
            [
                'title' => 'Wotaku ni Koi wa Muzukashii',
                'title_type' => 'series',
                'synopsis' => 'Narumi Momose is a closet otaku who likes fujoshi. After a breakup due to these kind of interests, she quits her job and joins a new company.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2018, 4, 13),
                'air_end' => Carbon::create(2018, 6, 22),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Wotaku ni Koi wa Muzukashii'),
                'age_rating' => 'PG-13',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 11,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '22:54'
                    ]
                ]
            ],
            [
                'title' => 'Avengers: Endgame',
                'title_type' => 'movie',
                'synopsis' => 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Avengers: Endgame'),
                'air_start' => Carbon::create(2019, 5, 26),
                'age_rating' => 'PG-13',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('3:01:36')
            ],
            [
                'title' => 'Avengers: Infinity War',
                'title_type' => 'movie',
                'synopsis' => 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Avengers: Infinity War'),
                'air_start' => Carbon::create(2018, 5, 27),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Avengers: Infinity War', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:29:21')
            ],
            [
                'title' => 'I Love You, Beth Cooper',
                'title_type' => 'movie',
                'synopsis' => 'A nerdy valedictorian proclaims his love for the hottest and most popular girl in school. Much to his surprise, Beth shows up at his door that very night and decides to show him the best night of his life.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('I Love You, Beth Cooper'),
                'air_start' => Carbon::create(2009, 7, 10),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('I Love You, Beth Cooper', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:48')
            ],
            [
                'title' => 'I Love You, Man',
                'title_type' => 'movie',
                'synopsis' => 'Friendless Peter Klaven goes on a series of man-dates to find a Best Man for his wedding. But, when his insta-bond with his new B.F.F. puts a strain on his relationship with his fiancée, can the trio learn to live happily ever after?',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('I Love You, Man'),
                'air_start' => Carbon::create(2009, 3, 20),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('I Love You, Man', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:46')
            ],
            [
                'title' => 'Paper Towns',
                'title_type' => 'movie',
                'synopsis' => 'After an all-night adventure, Quentin\'s lifelong crush, Margo, disappears, leaving behind clues that Quentin and his friends follow on the journey of a lifetime.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Paper Towns'),
                'air_start' => Carbon::create(2015, 7, 24),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Paper Towns', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:49:05')
            ],
            [
                'title' => 'Oldboy',
                'title_type' => 'movie',
                'synopsis' => 'After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.',
                'language' => 'Korean',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Oldboy'),
                'air_start' => Carbon::create(2003, 11, 21),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Oldboy', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:58')
            ],
            [
                'title' => 'Oldboy',
                'title_type' => 'movie',
                'synopsis' => 'After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.',
                'language' => 'Korean',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Oldboy'),
                'air_start' => Carbon::create(2003, 11, 21),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Oldboy', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:58')
            ],
            [
                'title' => 'X-Men',
                'title_type' => 'movie',
                'synopsis' => 'In a world where mutants (evolved super-powered humans) exist and are discriminated against, two groups form for an inevitable clash: the supremacist Brotherhood, and the pacifist X-Men.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men'),
                'air_start' => Carbon::create(2000, 7, 14),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:20')
            ],
            [
                'title' => 'X-Men 2',
                'title_type' => 'movie',
                'synopsis' => 'When anti-mutant Colonel William Stryker kidnaps Professor X and attacks his school, the X-Men must ally with their archenemy Magneto to stop him.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men 2'),
                'air_start' => Carbon::create(2003, 5, 2),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men 2', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:13:47')
            ],
            [
                'title' => 'X-Men: The Last Stand',
                'title_type' => 'movie',
                'synopsis' => 'The human government develops a cure for mutations, and Jean Gray becomes a darker uncontrollable persona called the Phoenix who allies with Magneto, causing escalation into an all-out battle for the X-Men.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men: The Last Stand'),
                'air_start' => Carbon::create(2006, 5, 26),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men: The Last Stand', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:05')
            ],
            [
                'title' => 'X-Men: First Class',
                'title_type' => 'movie',
                'synopsis' => 'In the 1960s, superpowered humans Charles Xavier and Erik Lensherr work together to find others like them, but Erik\'s vengeful pursuit of an ambitious mutant who ruined his life causes a schism to divide them.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men: First Class'),
                'air_start' => Carbon::create(2011, 6, 3),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men: First Class', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:11:43')
            ],
            [
                'title' => 'X-Men: Days Of Future Past',
                'title_type' => 'movie',
                'synopsis' => 'The X-Men send Wolverine to the past in a desperate effort to change history and prevent an event that results in doom for both humans and mutants.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men: Days Of Future Past'),
                'air_start' => Carbon::create(2014, 5, 23),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men: Days Of Future Past', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:11:35')
            ],
            [
                'title' => 'X-Men: Apocalypse',
                'title_type' => 'movie',
                'synopsis' => 'In the 1980s the X-Men must defeat an ancient all-powerful mutant, En Sabah Nur, who intends to thrive through bringing destruction to the world.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men: Apocalypse'),
                'air_start' => Carbon::create(2016, 5, 27),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men: Apocalypse', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:23:57')
            ],
            [
                'title' => 'Charlie\'s Angels',
                'title_type' => 'movie',
                'synopsis' => 'Three women, detectives with a mysterious boss, retrieve stolen voice-ID software, using martial arts, tech skills, and sex appeal.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Charlie\'s Angels'),
                'air_start' => Carbon::create(2000, 11, 3),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Charlie\'s Angels', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:38:23')
            ],
            [
                'title' => 'Charlie\'s Angels: Full Throttle',
                'title_type' => 'movie',
                'synopsis' => 'The Angels investigate a series of murders which occur after the theft of a witness protection profile database.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Charlie\'s Angels: Full Throttle'),
                'air_start' => Carbon::create(2003, 6, 27),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Charlie\'s Angels: Full Throttle', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:47:06')
            ],
            [
                'title' => 'Zootopia',
                'title_type' => 'movie',
                'synopsis' => 'In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Zootopia'),
                'air_start' => Carbon::create(2016, 3, 4),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Zootopia', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:48:32')
            ],
            [
                'title' => 'Ant-Man',
                'title_type' => 'movie',
                'synopsis' => 'Armed with a super-suit with the astonishing ability to shrink in scale but increase in strength, cat burglar Scott Lang must embrace his inner hero and help his mentor, Dr. Hank Pym, plan and pull off a heist that will save the world.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Ant-Man'),
                'air_start' => Carbon::create(2015, 7, 17),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Ant-Man', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:57:06')
            ],
            [
                'title' => 'Ant-Man and The Wasp',
                'title_type' => 'movie',
                'synopsis' => 'As Scott Lang balances being both a Super Hero and a father, Hope van Dyne and Dr. Hank Pym present an urgent new mission that finds the Ant-Man fighting alongside The Wasp to uncover secrets from their past.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Ant-Man and The Wasp'),
                'air_start' => Carbon::create(2018, 7, 6),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Ant-Man and The Wasp', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:58:06')
            ],
            [
                'title' => 'Captain America: Civil War',
                'title_type' => 'movie',
                'synopsis' => 'Political involvement in the Avengers\' affairs causes a rift between Captain America and Iron Man.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Captain America: Civil War'),
                'air_start' => Carbon::create(2018, 7, 6),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Captain America: Civil War', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:27:41')
            ],
            [
                'title' => 'X-Men Origins: Wolverine',
                'title_type' => 'movie',
                'synopsis' => 'The early years of James Logan, featuring his rivalry with his brother Victor Creed, his service in the special forces team Weapon X, and his experimentation into the metal-lined mutant Wolverine.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('X-Men Origins: Wolverine'),
                'air_start' => Carbon::create(2009, 5, 1),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('X-Men Origins: Wolverine', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:47:21')
            ],
            [
                'title' => 'The Wolverine',
                'title_type' => 'movie',
                'synopsis' => 'Wolverine comes to Japan to meet an old friend whose life he saved years ago, and gets embroiled in a conspiracy involving yakuza and mutants.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Wolverine'),
                'air_start' => Carbon::create(2013, 7, 26),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Wolverine', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:18:14')
            ],
            [
                'title' => 'Logan',
                'title_type' => 'movie',
                'synopsis' => 'In a future where mutants are nearly extinct, an elderly and weary Logan leads a quiet life. But when Laura, a mutant child pursued by scientists, comes to him for help, he must get her to safety.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Logan'),
                'air_start' => Carbon::create(2017, 3, 3),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Logan', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:17:23')
            ],
            [
                'title' => 'Deadpool',
                'title_type' => 'movie',
                'synopsis' => 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Deadpool'),
                'air_start' => Carbon::create(2016, 2, 12),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Deadpool', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:48:06')
            ],
            [
                'title' => 'Deadpool 2',
                'title_type' => 'movie',
                'synopsis' => 'Foul-mouthed mutant mercenary Wade Wilson (AKA. Deadpool), brings together a team of fellow mutant rogues to protect a young boy with supernatural abilities from the brutal, time-traveling cyborg, Cable.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Deadpool 2'),
                'air_start' => Carbon::create(2018, 5, 18),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Deadpool 2', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:13:59')
            ],
            [
                'title' => 'Tate no Yuusha no Nariagari',
                'title_type' => 'series',
                'synopsis' => 'Naofumi Iwatani, an uncharismatic Otaku suddenly finds himself summoned to a parallel universe. He discovers he is one of four heroes equipped with legendary weapons and tasked with saving the world from its prophesied destruction.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2019, 1, 9),
                'air_end' => Carbon::create(2019, 6, 26),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Tate no Yuusha no Nariagari'),
                'age_rating' => 'PG-13',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 25,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ]
                ]
            ],
            [
                'title' => 'Bungou Stray Dogs',
                'title_type' => 'series',
                'synopsis' => 'Nakajima Atsushi meets Dazai Osamu, a member of a very special detective agency with supernatural powers. After their encounter, he becomes involved in solving their dangerous special mystery cases.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2016, 4, 7),
                'air_end' => Carbon::create(2019, 6, 28),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Bungou Stray Dogs'),
                'age_rating' => 'PG-13',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ],
                    [
                        'title' => 'Season 2',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ],
                    [
                        'title' => 'Season 3',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '23:40'
                    ]
                ]
            ],
            [
                'title' => 'A Taxi Driver',
                'title_type' => 'movie',
                'synopsis' => 'In 1980, a foreign journalist hires a down-on-his-luck taxi driver to take him to Gwangju, South Korea. They soon arrive to find a city under siege by student protesters and the military.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('A Taxi Driver'),
                'air_start' => Carbon::create(2017, 8, 11),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('A Taxi Driver', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:17:27')
            ],
            [
                'title' => 'Beck',
                'title_type' => 'series',
                'synopsis' => 'Fourteen-year-old Yukio "Koyuki" Tanaka is a dispirited young boy with no goals in life. However, this all changes when Koyuki saves a strange-looking dog named Beck from being harassed by a group of local kids.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2004, 10, 7),
                'air_end' => Carbon::create(2005, 3, 31),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Beck'),
                'age_rating' => 'R-17+',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 12,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '24:19'
                    ]
                ]
            ],
            [
                'title' => 'Aladdin',
                'title_type' => 'movie',
                'synopsis' => 'A kind-hearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Aladdin'),
                'air_start' => Carbon::create(2019, 5, 24),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Aladdin', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:07:58')
            ],
            [
                'title' => 'Dumbo',
                'title_type' => 'movie',
                'synopsis' => 'A young elephant, whose oversized ears enable him to fly, helps save a struggling circus, but when the circus plans a new venture, Dumbo and his friends discover dark secrets beneath its shiny veneer.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Dumbo'),
                'air_start' => Carbon::create(2019, 3, 29 ),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Dumbo', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:51:56')
            ],
            [
                'title' => 'Bao',
                'title_type' => 'movie',
                'synopsis' => 'A Chinese-Canadian woman suffering from empty nest syndrome gets a second shot at motherhood when one of her handmade dumplings comes alive.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Bao'),
                'air_start' => Carbon::create(2018, 6, 15),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Bao', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('7:41')
            ],
            [
                'title' => 'Moana',
                'title_type' => 'movie',
                'synopsis' => 'In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana\'s island, she answers the Ocean\'s call to seek out the Demigod to set things right.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Moana'),
                'air_start' => Carbon::create(2016, 11, 23),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Moana', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:47:12')
            ],
            [
                'title' => 'Inside Out',
                'title_type' => 'movie',
                'synopsis' => 'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Inside Out'),
                'air_start' => Carbon::create(2015, 6, 19),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Inside Out', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:34:37')
            ],
            [
                'title' => 'Frozen',
                'title_type' => 'movie',
                'synopsis' => 'When the newly-crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Frozen'),
                'air_start' => Carbon::create(2013, 11, 27),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Frozen', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:34:37')
            ],
            [
                'title' => 'Pinocchio',
                'title_type' => 'movie',
                'synopsis' => 'A living puppet, with the help of a cricket as his conscience, must prove himself worthy to become a real boy.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pinocchio'),
                'air_start' => Carbon::create(1940, 2, 23),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pinocchio', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:27:44')
            ],
            [
                'title' => 'Big Hero 6',
                'title_type' => 'movie',
                'synopsis' => 'The special bond that develops between plus-sized inflatable robot Baymax, and prodigy Hiro Hamada, who team up with a group of friends to form a band of high-tech heroes.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Big Hero 6'),
                'air_start' => Carbon::create(2014, 11, 7),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Big Hero 6', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:52')
            ],
            [
                'title' => '101 Dalmatians',
                'title_type' => 'movie',
                'synopsis' => 'When a litter of Dalmatian puppies are abducted by the minions of Cruella de Vil, the parents must find them before she uses them for a diabolical fashion statement.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('101 Dalmatians'),
                'air_start' => Carbon::create(1961, 1, 25),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('101 Dalmatians', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:19:16')
            ],
            [
                'title' => 'Dororo',
                'title_type' => 'series',
                'synopsis' => 'This child is disposed of in a river and forgotten. But he is saved by a medicine man who provides him with prosthetics and weapons. He meets an orphan boy, and the unlikely pair now fights for their survival and humanity.',
                'language' => 'Japanese',
                'air_start' => Carbon::create(2019, 1, 7),
                'air_end' => Carbon::create(2019, 6, 24),
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Dororo'),
                'age_rating' => 'R-17+',
                //
                'seasons' => [
                    [
                        'title' => 'Season 1',
                        'episodes' => 24,
                        'extension' => 'mp4',
                        'subtitle_language' => 'en',
                        'duration' => '24:00'
                    ]
                ]
            ],
            [
                'title' => 'Parasite',
                'title_type' => 'movie',
                'synopsis' => 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
                'language' => 'Korean',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Parasite'),
                'air_start' => Carbon::create(2019, 11, 11),
                'age_rating' => 'R-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Parasite', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:12:02')
            ],
            [
                'title' => 'Kimi no na wa',
                'title_type' => 'movie',
                'synopsis' => 'A teenage boy and girl embark on a quest to meet each other for the first time after they magically swap bodies.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kimi no na wa'),
                'air_start' => Carbon::create(2016, 12, 14),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Kimi no na wa', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:46:35')
            ],
            [
                'title' => 'Colorful',
                'title_type' => 'movie',
                'synopsis' => 'A soul wakes up in the body of suicide victim Makoto and must find a way to fit into his existence. The soul must unravel two mysteries -- the secret of the great sin it committed in its previous life and why Makoto committed suicide.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Colorful'),
                'air_start' => Carbon::create(2010, 8, 21),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Colorful', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:06:30')
            ],
            [
                'title' => 'A Letter To Momo',
                'title_type' => 'movie',
                'synopsis' => 'Clinging to an unfinished letter written by her recently deceased father, young Momo moves with her mother from bustling Tokyo to the remote Japanese island of Shio.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('A Letter To Momo'),
                'air_start' => Carbon::create(2012, 4, 21),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('A Letter To Momo', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:00:18')
            ],
            [
                'title' => 'Tekkonkinkreet',
                'title_type' => 'movie',
                'synopsis' => 'The tale of a pair of orphans who attempt to prevent the Yakuza and their assorted violent and corrupt allies from taking over their city.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Tekkonkinkreet'),
                'air_start' => Carbon::create(2006, 12, 11),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Tekkonkinkreet', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:50:36')
            ],
            [
                'title' => 'Tokyo Godfathers',
                'title_type' => 'movie',
                'synopsis' => 'It\'s Christmas Eve and three homeless friends have experienced their own Christmas miracle: while rummaging in a dump for a Christmas present, they discover a newborn baby. Despite having nothing, the three take the baby in and name her Kiyoko, meaning Pure One.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Tokyo Godfathers'),
                'air_start' => Carbon::create(2003, 11, 8),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Tokyo Godfathers', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:31:40')
            ],
            [
                'title' => 'Kimetsu no Yaiba',
                'title_type' => 'series:append-episodes',
                'season_name' => 'Season 1',
                'range' => [17, 19]
            ],
            [
                'title' => 'Detective Pikachu',
                'title_type' => 'movie',
                'synopsis' => 'In a world where people collect Pokémon to do battle, a boy comes across an intelligent talking Pikachu who seeks to be a detective.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Detective Pikachu'),
                'air_start' => Carbon::create(2019, 5, 10),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Detective Pikachu', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:44:29')
            ],
            [
                'title' => 'Brightburn',
                'title_type' => 'movie',
                'synopsis' => 'What if a child from another world crash-landed on Earth, but instead of becoming a hero to mankind, he proved to be something far more sinister?',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Brightburn'),
                'air_start' => Carbon::create(2019, 5, 24),
                'age_rating' => 'R',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:30:30')
            ],
            [
                'title' => 'Shoplifters',
                'title_type' => 'movie',
                'synopsis' => 'A family of small-time crooks take in a child they find outside in the cold.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Shoplifters'),
                'air_start' => Carbon::create(2018, 11, 23),
                'age_rating' => 'R',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Shoplifters', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:00:53')
            ],
            [
                'title' => 'Golden Kamuy',
                'title_type' => 'series:append-season',
                'season_name' => 'Season 2',
                'episodes' => 12,
                'duration' => Helper::getDurationInSecondsFromReadableFormat('23:40')
            ],
            [
                'title' => '5 Centimeters Per Second',
                'title_type' => 'movie',
                'synopsis' => 'Takaki Toono and Akari Shinohara, two very close friends and classmates, are torn apart when Akari\'s family is transferred to another region of Japan due to her family\'s job.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('5 Centimeters Per Second'),
                'air_start' => Carbon::create(2007, 3, 3),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('5 Centimeters Per Second', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:02:46')
            ],
            [
                'title' => 'Godzilla: King of the Monsters',
                'title_type' => 'movie',
                'synopsis' => 'The crypto-zoological agency Monarch faces off against a battery of god-sized monsters, including the mighty Godzilla, who collides with Mothra, Rodan, and his ultimate nemesis, the three-headed King Ghidorah.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Godzilla: King of the Monsters'),
                'air_start' => Carbon::create(2019, 5, 31),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Godzilla: King of the Monsters', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:11:39')
            ],
            [
                'title' => 'Crazy Rich Asians',
                'title_type' => 'movie',
                'synopsis' => 'This contemporary romantic comedy, based on a global bestseller, follows native New Yorker Rachel Chu to Singapore to meet her boyfriend\'s family.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Crazy Rich Asians'),
                'air_start' => Carbon::create(2018, 8, 15),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Crazy Rich Asians', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:00:39')
            ],
            [
                'title' => 'Ma',
                'title_type' => 'movie',
                'synopsis' => 'A lonely woman befriends a group of teenagers and decides to let them party at her house. Just when the kids think their luck couldn\'t get any better, things start happening that make them question the intention of their host.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Ma'),
                'air_start' => Carbon::create(2019, 5, 31),
                'age_rating' => 'R',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:39:220')
            ],
            [
                'title' => 'Pitch Perfect',
                'title_type' => 'movie',
                'synopsis' => 'Beca, a freshman at Barden University, is cajoled into joining The Bellas, her school\'s all-girls singing group. Injecting some much needed energy into their repertoire, The Bellas take on their male rivals in a campus competition.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pitch Perfect'),
                'air_start' => Carbon::create(2012, 10, 5),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pitch Perfect', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:52:07')
            ],
            [
                'title' => 'Pitch Perfect 2',
                'title_type' => 'movie',
                'synopsis' => 'After a humiliating command performance at The Kennedy Center, the Barden Bellas enter an international competition that no American group has ever won in order to regain their status and right to perform.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pitch Perfect 2'),
                'air_start' => Carbon::create(2015, 5, 15),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pitch Perfect 2', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:54:46')
            ],
            [
                'title' => 'Pitch Perfect 3',
                'title_type' => 'movie',
                'synopsis' => 'Following their win at the world championship, the now separated Bellas reunite for one last singing competition at an overseas USO tour, but face a group who uses both instruments and voices.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pitch Perfect 3'),
                'air_start' => Carbon::create(2017, 12, 22),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pitch Perfect 3', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:02')
            ],
            [
                'title' => 'Mean Girls',
                'title_type' => 'movie',
                'synopsis' => 'Cady Heron is a hit with The Plastics, the A-list girl clique at her new school, until she makes the mistake of falling for Aaron Samuels, the ex-boyfriend of alpha Plastic Regina George.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Mean Girls'),
                'air_start' => Carbon::create(2004, 4, 30),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Mean Girls', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:36:53')
            ],
            [
                'title' => 'La La Land',
                'title_type' => 'movie',
                'synopsis' => 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('La La Land'),
                'air_start' => Carbon::create(2016, 12, 25),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('La La Land', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:07:48')
            ],
            [
                'title' => 'Hello, Love, Goodbye',
                'title_type' => 'movie',
                'synopsis' => 'The film centers on the love story of Joy and Ethan, Filipino workers based in Hong Kong. Ethan, a bartender, is keen on romantically pursuing Joy, a domestic helper who is wholly dedicated to providing for her family.',
                'language' => 'Tagalog',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Hello, Love, Goodbye'),
                'air_start' => Carbon::create(2019, 8, 9),
                'age_rating' => 'PG-13',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:57:23')
            ],
            [
                'title' => 'Kimetsu no Yaiba',
                'title_type' => 'series:append-episodes',
                'season_name' => 'Season 1',
                'range' => [20, 20]
            ],
            [
                'title' => 'Arrietty',
                'title_type' => 'movie',
                'synopsis' => 'The Clock family are four-inch-tall people who live anonymously in another family\'s residence, borrowing simple items to make their home. Life changes for the Clocks when their teenage daughter, Arrietty, is discovered.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Arrietty'),
                'air_start' => Carbon::create(2010, 7, 17),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Arrietty', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:34:07')
            ],
            [
                'title' => 'Castle in the Sky',
                'title_type' => 'movie',
                'synopsis' => 'A young boy and a girl with a magic crystal must race against pirates and foreign agents in a search for a legendary floating castle.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Castle in the Sky'),
                'air_start' => Carbon::create(1986, 8, 2),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Castle in the Sky', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:04:34')
            ],
            [
                'title' => 'From Up on Poppy Hill',
                'title_type' => 'movie',
                'synopsis' => 'A group of Yokohama teens look to save their school\'s clubhouse from the wrecking ball in preparations for the 1964 Tokyo Olympics.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('From Up on Poppy Hill'),
                'air_start' => Carbon::create(2011, 7, 16),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('From Up on Poppy Hill', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:31:27')
            ],
            [
                'title' => 'Grave of the Fireflies',
                'title_type' => 'movie',
                'synopsis' => 'A young boy and his little sister struggle to survive in Japan during World War II.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Grave of the Fireflies'),
                'air_start' => Carbon::create(1988, 4, 16),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Grave of the Fireflies', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:28:32')
            ],
            [
                'title' => 'Howl\'s Moving Castle',
                'title_type' => 'movie',
                'synopsis' => 'When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard and his companions in his legged, walking castle.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Howl\'s Moving Castle'),
                'air_start' => Carbon::create(2004, 11, 20),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Howl\'s Moving Castle', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:09')
            ],
            [
                'title' => 'Kiki\'s Delivery Service',
                'title_type' => 'movie',
                'synopsis' => 'A young witch, on her mandatory year of independent life, finds fitting into a new community difficult while she supports herself by running an air courier service.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Kiki\'s Delivery Service'),
                'air_start' => Carbon::create(1989, 7, 29),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Kiki\'s Delivery Service', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:43:04')
            ],
            [
                'title' => 'My Neighbor Totoro',
                'title_type' => 'movie',
                'synopsis' => 'When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('My Neighbor Totoro'),
                'air_start' => Carbon::create(1988, 4, 16),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('My Neighbor Totoro', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:26:25')
            ],
            [
                'title' => 'My Neighbors the Yamadas',
                'title_type' => 'movie',
                'synopsis' => 'Takashi Yamada and his wacky wife Matsuko, who has no talent for housework, navigate their way through the ups and downs of work, marriage and family life with a sharp-tongued grandmother who lives with them, a teenage son who wishes he had cooler parents, and a pesky daughter whose loud voice is unusual for someone so small. Even the family dog has issues!',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('My Neighbors the Yamadas'),
                'air_start' => Carbon::create(1999, 7, 17),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('My Neighbors the Yamadas', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:43:40')
            ],
            [
                'title' => 'Nausicaa of the Valley of the Wind',
                'title_type' => 'movie',
                'synopsis' => 'Warrior and pacifist Princess Nausicaä desperately struggles to prevent two warring nations from destroying themselves and their dying planet.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Nausicaa of the Valley of the Wind'),
                'air_start' => Carbon::create(1984, 3, 11),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Nausicaa of the Valley of the Wind', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:57:02')
            ],
            [
                'title' => 'Ocean Waves',
                'title_type' => 'movie',
                'synopsis' => 'As a young man returns home after his first year away at college he recalls his senior year of high school and the iron-willed, big city girl that turned his world upside down.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Ocean Waves'),
                'air_start' => Carbon::create(1993, 5, 5),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Ocean Waves', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:12:08')
            ],
            [
                'title' => 'Only Yesterday',
                'title_type' => 'movie',
                'synopsis' => 'A twenty-seven-year-old office worker travels to the countryside while reminiscing about her childhood in Tokyo.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Only Yesterday'),
                'air_start' => Carbon::create(1991, 7, 20),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Only Yesterday', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:00:12')
            ],
            [
                'title' => 'Pom Poko',
                'title_type' => 'movie',
                'synopsis' => 'A community of magical shape-shifting raccoon dogs struggle to prevent their forest home from being destroyed by urban development.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Pom Poko'),
                'air_start' => Carbon::create(1994, 6, 13),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Pom Poko', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:59:11')
            ],
            [
                'title' => 'Ponyo',
                'title_type' => 'movie',
                'synopsis' => 'A five-year-old boy develops a relationship with Ponyo, a young goldfish princess who longs to become a human after falling in love with him.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Ponyo'),
                'air_start' => Carbon::create(2008, 7, 19),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Ponyo', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:40:50')
            ],
            [
                'title' => 'Porco Rosso',
                'title_type' => 'movie',
                'synopsis' => 'In 1930s Italy, a veteran World War I pilot is cursed to look like an anthropomorphic pig.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Porco Rosso'),
                'air_start' => Carbon::create(1992, 7, 18),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Porco Rosso', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:19')
            ],
            [
                'title' => 'Princess Mononoke',
                'title_type' => 'movie',
                'synopsis' => 'On a journey to find the cure for a Tatarigami\'s curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony. In this quest he also meets San, the Mononoke Hime.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Princess Mononoke'),
                'air_start' => Carbon::create(1997, 7, 12),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Princess Mononoke', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:13:22')
            ],
            [
                'title' => 'Spirited Away',
                'title_type' => 'movie',
                'synopsis' => 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Spirited Away'),
                'air_start' => Carbon::create(2001, 7, 20),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Spirited Away', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:04:32')
            ],
            [
                'title' => 'Tales from Earthsea',
                'title_type' => 'movie',
                'synopsis' => 'In a mythical land, a man and a young boy investigate a series of unusual occurrences.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Tales from Earthsea'),
                'air_start' => Carbon::create(2006, 7, 29),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Tales from Earthsea', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:55:32')
            ],
            [
                'title' => 'The Cat Returns',
                'title_type' => 'movie',
                'synopsis' => 'After helping a cat, a 17-year-old girl finds herself involuntarily engaged to a cat prince in a magical world where her only hope of freedom lies with a dapper cat statuette come to life.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Cat Returns'),
                'air_start' => Carbon::create(2002, 7, 20),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Cat Returns', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:15:04')
            ],
            [
                'title' => 'The Tale of Princess Kaguya',
                'title_type' => 'movie',
                'synopsis' => 'Found inside a shining stalk of bamboo by an old bamboo cutter and his wife, a tiny girl grows rapidly into an exquisite young lady. The mysterious young princess enthralls all who encounter her, but ultimately she must confront her fate, the punishment for her crime.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Tale of Princess Kaguya'),
                'air_start' => Carbon::create(2013, 11, 23),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Tale of Princess Kaguya', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:10:21')
            ],
            [
                'title' => 'The Wind Rises',
                'title_type' => 'movie',
                'synopsis' => 'A look at the life of Jiro Horikoshi, the man who designed Japanese fighter planes during World War II.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Wind Rises'),
                'air_start' => Carbon::create(2013, 7, 20),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Wind Rises', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:06:31')
            ],
            [
                'title' => 'When Marnie Was There',
                'title_type' => 'movie',
                'synopsis' => 'A 12-year-old girl is sent to the country for health reasons, where she meets an unlikely friend in the form of Marnie, a young girl with long, flowing blonde hair. As the friendship unravels it is possible that Marnie has closer ties to the protagonist than we might expect.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('When Marnie Was There'),
                'air_start' => Carbon::create(2014, 7, 19),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('When Marnie Was There', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:42:41')
            ],
            [
                'title' => 'Whisper of the Heart',
                'title_type' => 'movie',
                'synopsis' => 'A love story between a girl who loves reading books, and a boy who has previously checked out all of the library books she chooses.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Whisper of the Heart'),
                'air_start' => Carbon::create(1995, 7, 15),
                'age_rating' => 'G',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Whisper of the Heart', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:50:50')
            ],
            [
                'title' => 'The Secret Life of Pets',
                'title_type' => 'movie',
                'synopsis' => 'The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Secret Life of Pets'),
                'air_start' => Carbon::create(2016, 7, 8),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Secret Life of Pets', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:26:27')
            ],
            [
                'title' => 'The Secret Life of Pets 2',
                'title_type' => 'movie',
                'synopsis' => 'Continuing the story of Max and his pet friends, following their secret lives after their owners leave them for work or school each day.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Secret Life of Pets 2'),
                'air_start' => Carbon::create(2019, 6, 7),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Secret Life of Pets 2', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:26:03')
            ],
            [
                'title' => 'Astro Kid',
                'title_type' => 'movie',
                'synopsis' => 'Following the destruction of their ship, the young Willy is separated from his parents with whom he traveled in space. His spare capsule lands on a wild and unexplored planet. With the help of Buck, a survival robot, he will have to hold until the arrival of a rescue mission.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Astro Kid'),
                'air_start' => Carbon::create(2019, 4, 3),
                'age_rating' => 'PG',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:30:03')
            ],
            [
                'title' => 'John Wick: Chapter 3 - Parabellum',
                'title_type' => 'movie',
                'synopsis' => 'Super-assassin John Wick is on the run after killing a member of the international assassin\'s guild, and with a $14 million price tag on his head - he is the target of hit men and women everywhere.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('John Wick: Chapter 3 - Parabellum'),
                'air_start' => Carbon::create(2019, 5, 17),
                'age_rating' => 'R',
                'subtitle_url' => '',
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('2:10:45')
            ],
            [
                'title' => 'Kimetsu no Yaiba',
                'title_type' => 'series:append-episodes',
                'season_name' => 'Season 1',
                'range' => [21, 21]
            ],
            [
                'title' => 'Finding Neverland',
                'title_type' => 'movie',
                'synopsis' => 'The story of Sir J.M. Barrie\'s friendship with a family who inspired him to create Peter Pan.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Finding Neverland'),
                'air_start' => Carbon::create(2004, 12, 17),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Finding Neverland', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:41:05')
            ],
            [
                'title' => '500 Days of Summer',
                'title_type' => 'movie',
                'synopsis' => 'An offbeat romantic comedy about a woman who doesn\'t believe true love exists, and the young man who falls for her.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('500 Days of Summer'),
                'air_start' => Carbon::create(2009, 8, 7),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('500 Days of Summer', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:35:04')
            ],
            [
                'title' => 'The Perks of Being a Wallflower',
                'title_type' => 'movie',
                'synopsis' => 'An introvert freshman is taken under the wings of two seniors who welcome him to the real world.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Perks of Being a Wallflower'),
                'air_start' => Carbon::create(2012, 10, 12),
                'age_rating' => 'PG-13',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Perks of Being a Wallflower', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:42:40')
            ],
            [
                'title' => 'The Nightmare Before Christmas',
                'title_type' => 'movie',
                'synopsis' => 'Jack Skellington, king of Halloween Town, discovers Christmas Town, but his attempts to bring Christmas to his home causes confusion.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('The Nightmare Before Christmas'),
                'air_start' => Carbon::create(1993, 10, 29),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('The Nightmare Before Christmas', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:16:36')
            ],
            [
                'title' => 'Song of the Sea',
                'title_type' => 'movie',
                'synopsis' => 'Ben, a young Irish boy, and his little sister Saoirse, a girl who can turn into a seal, go on an adventure to free the fairies and save the spirit world.',
                'language' => 'English',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Song of the Sea'),
                'air_start' => Carbon::create(2015, 11, 20),
                'age_rating' => 'PG',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Song of the Sea', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:33:59')
            ],
            [
                'title' => 'Sword of the Stranger',
                'title_type' => 'movie',
                'synopsis' => 'A swordsman from a strange land is caught in a struggle between morality, righteousness, and devotion as he reluctantly agrees to take a raggedy boy and his dog to a remote, Buddhist temple.',
                'language' => 'Japanese',
                'preview_image' => Helper::getPreviewUrlFromMovieTitle('Sword of the Stranger'),
                'air_start' => Carbon::create(2007, 2, 5),
                'age_rating' => '',
                'subtitle_url' => Helper::getSubtitleUrlFromMovieTitle('Sword of the Stranger', 'en'),
                //
                'extension' => 'mp4',
                'duration' => Helper::getDurationInSecondsFromReadableFormat('1:43:36')
            ],
        ];

        foreach($movies as $movie) {
            if ($movie['title_type'] === 'movie') {
                $show = App\Show::create(Arr::except($movie, ['duration', 'extension', 'subtitle_url']));

                $this->command->info("[ShowSeeder]: Inserted {$show->title}");

                App\ShowVideo::create([
                    'show_id' => $show->id,
                    'video_url' => Helper::getVideoUrlFromMovieTitle($show->title, $movie['extension']),
                    'subtitle_url' => $movie['subtitle_url'],
                    'duration' => $movie['duration'],
                    'synopsis' => $faker->text,
                ]);
            } else if ($movie['title_type'] === 'series') {
                $show = App\Show::create(Arr::except($movie, ['seasons']));

                $this->command->info("[ShowSeeder]: Inserted {$show->title}");

                foreach($movie['seasons'] as $i => $season) {
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
                                'extension' => $season['extension']
                            ]),
                            'subtitle_url' => $season['subtitle_language'] ? Helper::getSubtitleUrlFromSeriesTitle([
                                'title' => $show->title,
                                'season' => $i + 1,
                                'episode' => $j + 1
                            ], $season['subtitle_language']) : '',
                            'duration' => Helper::getDurationInSecondsFromReadableFormat($season['duration']),
                            'synopsis' => $faker->text,
                        ]);
                    }
                }
            } else if ($movie['title_type'] === 'series:append-episodes') {
                $show = App\Show::where('title', $movie['title'])->first();

                $group = $show->groups()->where('title', $movie['season_name'])->first();

                $season = Helper::match($group->title, "/[0-9]/");
                $start = $movie['range'][0];
                $end = $movie['range'][1];

                foreach(range($start, $end) as $episode) {
                    App\ShowVideo::create([
                        'show_group_id' => $group->id,
                        'show_id' => $show->id,
                        'title' => 'Episode ' . $episode,
                        'video_url' => \App\Support\Helper::getVideoUrlFromEpisode([
                            'title' => $show->title,
                            'season' => $season,
                            'episode' => $episode,
                            'extension' => 'mp4'
                        ]),
                        'subtitle_url' => Helper::getSubtitleUrlFromSeriesTitle([
                            'title' => $show->title,
                            'season' => $season,
                            'episode' => $episode
                        ]),
                        'duration' => $group->videos->first()->duration,
                        'synopsis' => $show->synopsis,
                    ]);
                }

                if ($start === $end) {
                    $this->command->info("[ShowSeeder]: Appended Episode {$start} for {$show->title} ({$group->title})");
                } else {
                    $this->command->info("[ShowSeeder]: Appended Episodes {$start}-{$end} for {$show->title} ({$group->title})");
                }
            } else if ($movie['title_type'] === 'series:append-season') {
                $show = App\Show::where('title', $movie['title'])->first();

                $group = App\ShowGroup::create([
                    'show_id' => $show->id,
                    'title' => $movie['season_name']
                ]);

                $season = Helper::match($group->title, "/[0-9]/");

                for($i = 0; $i < $movie['episodes']; $i++) {
                    $episode = $i + 1;

                    App\ShowVideo::create([
                        'show_group_id' => $group->id,
                        'show_id' => $show->id,
                        'title' => 'Episode ' . $episode,
                        'video_url' => \App\Support\Helper::getVideoUrlFromEpisode([
                            'title' => $show->title,
                            'season' => $season,
                            'episode' => $episode,
                            'extension' => 'mp4'
                        ]),
                        'subtitle_url' => Helper::getSubtitleUrlFromSeriesTitle([
                            'title' => $show->title,
                            'season' => $season,
                            'episode' => $episode
                        ]),
                        'duration' => $movie['duration'],
                        'synopsis' => $show->synopsis,
                    ]);
                }

                $this->command->info("[ShowSeeder]: Appended Season {$season} ({$group->count()} episodes) to {$show->title}");
            }
        }
    }
}
