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
        ];

        foreach($movies as $movie) {
            if ($movie['title_type'] === 'movie') {
                $show = App\Show::create(Arr::except($movie, ['duration', 'extension', 'subtitle_url']));

                App\ShowVideo::create([
                    'show_id' => $show->id,
                    'video_url' => Helper::getVideoUrlFromMovieTitle($show->title, $movie['extension']),
                    'subtitle_url' => $movie['subtitle_url'],
                    'duration' => $movie['duration'],
                    'synopsis' => $faker->text,
                ]);
            } else {
                $show = App\Show::create(Arr::except($movie, ['seasons']));

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
            }
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
