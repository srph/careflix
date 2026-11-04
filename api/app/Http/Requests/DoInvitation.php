<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class DoInvitation extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $invitation = $this->route('invitation');
        $isResponse = in_array($this->route()->getActionMethod(), ['accept', 'decline']);

        return $invitation->action === 'pending'
            && (!$isResponse || Carbon::parse($invitation->expires_at)->isFuture());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}
