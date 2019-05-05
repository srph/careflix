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
}