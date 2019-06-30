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
   * 
   */
  static public function getVideoFilenameFromTitle($title) {
    // Spider-Man: Into The Spider-Verse -> spider--man:-into-the-spider--verse
    $hypenated = Str::kebab($title);
    // spider--man:-into-the-spider--verse -> spider-man-into-the-spider-verse
    $sanitized = preg_replace("/--/", "-", $hypenated);
    $sanitized = preg_replace("/:/", "", $sanitized);
    // how-to-train-your-dragon2 -> how-to-train-your-dragon-2
    $sanitized = preg_replace("/(\w+)(\d+)/", "$1-$2", $sanitized);

    return $sanitized;
  }

  /**
   * 
   */
  static public function getVideoUrlFromMovieTitle($title, $ext = 'mp4') {
    $filename = Helper::getVideoFilenameFromTitle($title);
    return Helper::cdn("videos/{$filename}/{$filename}.{$ext}");
  }

  /**
   * we-bare-bears-s1-e23
   */
  static public function getVideoUrlFromEpisode($settings) {
    $filename = Helper::getVideoFilenameFromTitle($settings['title']);
    $index = "s{$settings['season']}-e{$settings['episode']}"; // s1-e11
    $ext = $settings['extension'] ?? 'mp4';
    return Helper::cdn("videos/{$filename}/{$filename}-{$index}.{$ext}");
  }

  /**
   * @param string $title Spider-Man: Into The Spider-Verse
   * @param string $ratio 16:9
   */
  static public function getPreviewUrlFromMovieTitle($title, $ratio) {
    // 16:9 => 16-9
    $ratio = preg_replace('/:/', '-', $ratio, 1);
    $filename = Helper::getVideoFilenameFromTitle($title);
    return Helper::cdn("videos/{$filename}/{$filename}-preview-{$ratio}.jpg");
  }
}