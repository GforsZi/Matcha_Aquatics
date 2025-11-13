<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'usr_latitude' => ['nullable', 'string'],
            'usr_longtitude' => ['nullable', 'string'],
            'usr_no_wa' => ['nullable', 'string', 'phone:ID', 'regex:/^[0-9]+$/'],
            'usr_provice_name' => ['nullable', 'string'],
            'usr_city_name' => ['nullable', 'string'],
            'usr_city_id' => ['nullable', 'string']
        ];
    }
}
