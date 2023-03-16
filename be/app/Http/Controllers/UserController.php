<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request) {
      $fields = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|unique:users,email',
        'password' => 'required'
      ]);

      $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'password' => bcrypt($fields['password']),
        'contact' => $request->input('contact'),
        'address' => $request->input('address'),
        'birthdate' => $request->input('birthdate'),
        'image' => $request->input('image'),
        'remarks' => $request->input('remarks'),
        'role' => 'member',
      ]);

      $token = $user->createToken('uniquetoken')->plainTextToken;

      $response = [
        'user' => $user,
        'token' => $token
      ];

      return response($response, 201);
    }

    public function login(Request $request) {
      $fields = $request->validate([
        'email' => 'required',
        'password' => 'required'
      ]);

      $user = User::where('email', $fields['email'])->first();

      if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
          'message' => 'Email or password do not match'
        ], 400);
      } else {
        $token = $user->createToken('uniquetoken')->plainTextToken;

        return response([
          'user' => $user,
          'token' => $token
        ], 200);

      }
    }

    public function showUsersbyRole($role) {
      return User::where('role', $role)->get();
    }

    public function logout(Request $request) {
      auth()->user()->tokens()->delete();
      return [
        'message' => 'Logged out'
      ];
    }
}
