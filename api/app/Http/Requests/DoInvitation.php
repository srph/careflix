<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        // Really not sure with the expirations for now.
        return $invitation->action == 'pending' || $invitation->action == null;

        // @TODO Check if user is recipient/sender
        // @TODO Make sure accept/decline is not done by sender?
        // return !$invitation->action && Carbon::now()->lessThan($invitation->expires_at);
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
