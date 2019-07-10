<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class RequestAccessCode implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $code = config('config.request_access_code');
        
        if (!strlen($code)) {
            return true;
        }

        return strtolower($code) === strtolower($value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'You supplied the incorrect request access code.';
    }
}
