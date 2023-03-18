<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanStatements extends Model
{
    use HasFactory;

    protected $fillable = [
      'loan_id',
      'month',
      'due_date',
      'amortization',
      'interest',
      'principal',
      'outstanding',
      'status',
      'ls_code',
  ];

  public function loan() {
    return $this->belongsTo(Loans::class, 'loan_id');
  }

  public function payments() {
    return $this->hasMany(Payments::class, 'loan_statement_id');
  }
}
