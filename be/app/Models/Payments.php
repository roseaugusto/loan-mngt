<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    protected $fillable = [
      'loan_statement_id',
      'loan_id',
      'trans_code',
      'amount',
  ];

  public function statement() {
    return $this->belongsTo(LoanStatements::class, 'loan_statement_id');
  }

  public function loan() {
    return $this->belongsTo(Loans::class, 'loan_id');
  }
}
