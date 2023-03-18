<?php

namespace App\Http\Controllers;

use App\Models\Loans;
use App\Models\LoanStatements;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class LoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
     $type = request()->query('type');

      if($type) {
        $loans = Loans::with('user')->where('type', $type)->get();
      } else {
        $loans = Loans::with('user')->get();
      }

      return response($loans);
    }

    public function dashboard(Request $request)
    {
     $pendingLoans = Loans::with('user')->where('status', 'pending')->orderBy('id', 'desc')->get();
     $dueLoans = Loans::with('user')->whereHas('statements', function($query) {
      $query->where('due_date', Carbon::today());
     })->where('id', auth()->user()->id)->orderBy('id', 'desc')->get();

      return response()->json(['pendings' => $pendingLoans, 'dues' => $dueLoans], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $fields = $request->validate([
        'loan_amount' => 'required',
        'type' => 'required',
      ]);

      $l = Loans::count();
      $code = $fields['type'] === 'regular' ? 'R':'P';
      $code = $code.date("ymd").$l;

      $loan = Loans::create([
        'user_id' => auth()->user()->id,
        'code' => $code,
        'check_amount' => 0,
        'loan_amount' => $fields['loan_amount'],
        'type' => $fields['type'],
        'status' => 'pending',
      ]);

      $todaydate = strtotime(date("Y/m/d"));
      $rate = 0.03;
      $numberOfMonths = 12;

      $lastLsCount = LoanStatements::count();

      if($fields['type'] === 'regular') {
        for($i=1; $i<=$numberOfMonths; $i++) {
          $duedate = date('Y-m-d', strtotime('+'.$i.' month', $todaydate));
          if ($i == 1) {
            $principal = $fields['loan_amount'];
            $outstanding = $fields['loan_amount'];
          } else {
            $principal = $outstanding;
          }
  
          $lsCode =  $i == 1 ? "LS".date("ymd").$lastLsCount + 1 : "LS".date("ymd").$lastLsCount + $i;
  
          $interestPerMonth = $principal * ($rate / $numberOfMonths);
          $usefullLife = (1 - (pow((1+($rate/$numberOfMonths)), ($numberOfMonths * -1))));
  
          // monthly
          $amortization = $i == 1 ? $interestPerMonth / $usefullLife : $amortization;
  
          // ang loan jud
          $principal = $amortization-$interestPerMonth;
  
          // ang original loan - principal
          $outstanding = $outstanding - $principal;
  
          LoanStatements::create([
            'loan_id' => $loan->id,
            'month' =>  date('m', strtotime('-1 month', strtotime($duedate))),
            'due_date' => $duedate,
            'amortization' => $amortization,
            'interest' => $interestPerMonth,
            'principal' => $principal,
            'outstanding' => $outstanding,
            'ls_code' => $lsCode,
          ]);
        }
      } else {
        $principal = $fields['loan_amount'];
        $interest = $fields['loan_amount'] * 0.05;

        LoanStatements::create([
          'loan_id' => $loan->id,
          'month' =>  date('m', strtotime('-1 month', $todaydate)),
          'due_date' => date('Y-m-d', strtotime('+1 month', $todaydate)),
          'amortization' => $interest,
          'interest' => $interest,
          'principal' => $principal,
          'outstanding' => $interest + $principal,
          'ls_code' => "LS".date("ymd").$lastLsCount + 1,
        ]);

        LoanStatements::create([
          'loan_id' => $loan->id,
          'month' =>  date('m', strtotime('-1 month', strtotime($todaydate))),
          'due_date' => date('Y-m-d', strtotime('+1 month', $todaydate)),
          'amortization' => $principal,
          'interest' => 0,
          'principal' => $principal,
          'outstanding' => 0,
          'ls_code' => "LS".date("ymd").$lastLsCount + 2,
        ]);
        
      }

      response($loan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
      $loan = Loans::with('user')->with('statements')->with('payments.statement')->where('id', $id)->first();
      return response($loan,200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
      $fields = $request->validate([
        'status' => 'required',
      ]);

      $loan = Loans::findOrFail($id);
      $loan->status = $fields['status'];
      $loan->save();
    }

    public function pay(Request $request, string $id)
    {
      $loan = LoanStatements::findOrFail($id);
      $l = Payments::count();
      $code = 'P'.date("ymd").$l;

      Payments::create([
        'loan_statement_id' => $loan->id,
        'loan_id' => $loan->loan_id,
        'trans_code' => $code,
        'amount' => $loan->amortization,
      ]);

      
      $loan->status = 'paid';
      $loan->save();

      $total = Payments::where('loan_id', $loan->loan_id)->sum('amount');

      $l=Loans::find($loan->loan_id);
      $l->check_amount = $total;
      $l->save();  
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
