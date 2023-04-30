<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loans extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'code',
      'check_amount',
      'loan_amount',
      'type',
      'status',
      'penalty',
      'penalty_updated',
      'months_to_pay'
  ];

  public function user() {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function statements() {
    return $this->hasMany(LoanStatements::class, 'loan_id');
  }

  public function payments() {
    return $this->hasMany(Payments::class, 'loan_id');
  }
}
