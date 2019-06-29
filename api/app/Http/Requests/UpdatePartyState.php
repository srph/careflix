<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartyState extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'is_playing' => 'required|boolean',
            // @TODO Should not be more than the current video's duration.
            // Currently applies for connection losses, even if we don't fully support that anyway haha.
            // Just to protect our data from becoming trashed.
            'current_time' => 'required|numeric'
        ];
    }
}
