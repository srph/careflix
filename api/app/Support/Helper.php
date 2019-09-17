<?php

namespace App\Support;

use Str;

class Helper {
  /**
   * e.g., X4345-ZXCA4-S3XYB-3AST1
   */
  static public function generateInvitationCode() {
    $strings = [];

    for ($i = 0; $i < 5; $i++) {
      $strings[] = strtoupper(Str::random(5));
    }

    return implode('-', $strings);
  }

  /**
   * Gets the first matched regex pattern
   * 
   * @return {string}
   */
  static public function match($string, $pattern) {
    preg_match($pattern, $string, $matches);
    return count($matches) ? $matches[0] : null;
  }

  /**
   * Properly prepend the provided path to the configurated cdn.
   */
  static public function cdn($path) {
    return rtrim(config('config.cdn'), '/') . '/' . ltrim($path, '/');
  }

  /**
   * 1:53:02 -> 6782
   */
  static public function getDurationInSecondsFromReadableFormat($formatted) {
    // We'll reverse to allow us to check if we're in the hour string.
    $strings = array_reverse(
      explode(":", $formatted)
    );

    $total = 0;

    foreach($strings as $index => $time) {
      // 00 -> 0; 03 -> 3
      $time = (int) $time;

      if ($index === 0) {
        // Seconds
        $total += $time;
      } else if ($index === 1) {
        // Minutes
        $total += $time * 60;
      } else if ($index === 2) {
        // Hours
        $total += $time * 60 * 60;
      }
    }

    return $total;
  }

  /**
   * 6782 -> 1:53:02
   * 
   * @return int
   */
  static public function getReadableFormatFromDurationInSeconds(int $seconds) {
    $hh = floor($seconds / 3600);
    $mm = floor(($seconds % 3600) / 60);
    $ss = floor($seconds % 60);

    return implode(
      ':',
      array_map(function($unit) {
        return str_pad($unit, '2', '0', STR_PAD_LEFT);
      }, [$hh, $mm, $ss])
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Utility for movie-type titles
  |--------------------------------------------------------------------------
  |
  */

  /**
   * How To Train Your Dragon 2 -> how-to-train-your-dragon-2
   */
  static public function getVideoFilenameFromTitle($title) {
    // Spider-Man: Into The Spider-Verse -> spider--man:-into-the-spider--verse
    $hypenated = Str::kebab($title);
    
    // spider--man:-into-the-spider--verse -> spider-man-into-the-spider-verse
    $sanitized = preg_replace("/--/", "-", $hypenated);
    $sanitized = preg_replace("/:/", "", $sanitized);
    // my-boss,-my-hero -> my-boss-my-hero
    $sanitized = preg_replace("/,/", "", $sanitized);
    // Remove apostrophes (Don't Breathe -> dont-breathe)
    $sanitized = preg_replace("/\'/", "", $sanitized);
    // Remove quesion marks
    $sanitized = preg_replace("/\?/", "", $sanitized);
    // how-to-train-your-dragon2 -> how-to-train-your-dragon-2
    $sanitized = preg_replace("/([A-Za-z]+)(\d+)/", "$1-$2", $sanitized);

    return $sanitized;
  }

  /**
   * cdn + videos/we-bare-bears/we-bare-bears.mp4
   */
  static public function getVideoUrlFromMovieTitle($title, $ext = 'mp4') {
    $filename = Helper::getVideoFilenameFromTitle($title);
    return Helper::cdn("videos/{$filename}/{$filename}.{$ext}");
  }

  /**
   * cdn + videos/one-piece-z/one-piece-z-en.srt
   */
  static public function getSubtitleUrlFromMovieTitle($title, $language = 'en') {
    $filename = Helper::getVideoFilenameFromTitle($title);
    return Helper::cdn("videos/{$filename}/{$filename}-{$language}.srt");
  }

  /**
   * @param string $title Spider-Man: Into The Spider-Verse
   * @param string $ratio 16:9
   */
  static public function getPreviewUrlFromMovieTitle($title, $ratio = '16:9') {
    // 16:9 => 16-9
    $ratio = preg_replace('/:/', '-', $ratio, 1);
    $filename = Helper::getVideoFilenameFromTitle($title);
    return Helper::cdn("videos/{$filename}/{$filename}-preview-{$ratio}.jpg");
  }

  /*
  |--------------------------------------------------------------------------
  | Utility for series
  |--------------------------------------------------------------------------
  |
  */

  /**
   * we-bare-bears-s1-ep23
   */
  static public function getVideoFilenameFromEpisode($settings) {
    $filename = Helper::getVideoFilenameFromTitle($settings['title']);
    $index = "s{$settings['season']}-ep{$settings['episode']}"; // s1-e11
    return "{$filename}-{$index}";
  }

  /**
   * cdn + videos/we-bare-bears/we-bare-bears-s1-ep23.mp4
   */
  static public function getVideoUrlFromEpisode($settings) {
    $directory = Helper::getVideoFilenameFromTitle($settings['title']);
    $filename = Helper::getVideoFilenameFromEpisode($settings);
    $ext = $settings['extension'] ?? 'mp4';
    return Helper::cdn("videos/{$directory}/{$filename}.{$ext}");
  }

  /**
   * cdn + videos/we-bare-bears/we-bare-bears-s1-ep23.srt
   */
  static public function getSubtitleUrlFromSeriesTitle($settings, $language = 'en') {
    $directory = Helper::getVideoFilenameFromTitle($settings['title']);
    $filename = Helper::getVideoFilenameFromEpisode($settings);
    return Helper::cdn("videos/{$directory}/{$filename}-{$language}.srt");
  }
}