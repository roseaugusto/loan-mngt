<?php

namespace App\Http\Controllers;

use App\Models\Savings;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SavingsController extends Controller
{
  public function show()
  {
    if (auth()->user()->role === 'admin') {
      $s= Savings::with('user')->orderBy('id', 'desc')->paginate(10);
    } else {
      $s= Savings::with('user')->where('user_id', auth()->user()->id)->orderBy('id', 'desc')->get();
    }
    return response($s,200);
  }

  public function store(Request $request)
    {
      $fields = $request->validate([
        'amount' => 'required',
        'type' => 'required',
        'id' => 'required',
      ]);

      $user = User::where('id', $fields['id'])->first();

      $latest = Savings::where('user_id', $user->id)->orderBy('id', 'desc')->first();

      if($latest) {
        if ($fields['type'] === 'credit') {
          $balance = $latest->balance + $fields['amount'];
        } else {
          $balance = $latest->balance - $fields['amount'];
        }
      } else {
        $balance = $fields['amount'];
      }

      if ($balance < 0) {
        return response()->json(['error' => 'Balance is not sufficient', 'balance' => $latest->balance], 400);
      } else {
        $l = Savings::count();
        $code = 'S'.date("ymd").$l;

        $s = Savings::create([
          'user_id' => $user->id,
          'code' => $code,
          'type' => $fields['type'],
          'amount' => $fields['amount'],
          'balance' => $balance,
        ]);

        return response($s, 201);
      }
    }
}
