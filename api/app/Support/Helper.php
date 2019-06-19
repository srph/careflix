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
    return preg_replace("/(--)|(:)/g", "", $hypenated);
  }

  /**
   * 
   */
  static public function getVideoUrlFromMovieTitle($title) {
    $filename = Helper::getVideoFilenameFromTitle($title);
    return "https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/{$filename}/{$filename}.mp4";
  }

  /**
   * we-bare-bears-s1-e23
   */
  static public function getVideoUrlFromEpisode($settings) {
    $filename = Helper::getVideoFilenameFromTitle($settings['title']);
    $index = "{$settings['season']}-{$settings['episode']}"; // s1-e11
    $ext = isset($settings['extension']) ?? 'mp4';
    return "https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/{$filename}/{$filename}-{$index}.{$ext}";
  }
}