<?php

namespace App\Http\Controllers;

use App\Models\Loans;
use App\Models\LoanStatements;
use App\Models\Payments;
use App\Models\Savings;
use App\Models\User;
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

     $last_year = date('Y', strtotime('-1 year'));

     $cbu_latest = Savings::where('type', 'credit')->whereYear('created_at', date('Y'))->sum('amount');
     $cbu_lastyear = Savings::where('type', 'credit')->whereYear('created_at', $last_year)->sum('amount');

     $loan_latest = Loans::where('type', 'regular')->whereYear('created_at', date('Y'))->sum('loan_amount');
     $loan_lastyear = Loans::where('type', 'regular')->whereYear('created_at', $last_year)->sum('loan_amount');
     
     $user_latest = User::whereYear('created_at', date('Y'))->count();
     $user_lastyear = User::whereYear('created_at', $last_year)->count();

     $payment_latest = Payments::whereYear('created_at', date('Y'))->sum('amount');
     $payment_lastyear = Payments::whereYear('created_at', $last_year)->sum('amount');

     $chart = Savings::where('type', 'credit')->whereYear('created_at', date('Y'))->get();
     $jan = 0;
     $feb = 0;
     $march = 0;
     $april = 0;
     $may = 0;
     $june = 0;
     $july = 0;
     $august = 0;
     $sept = 0;
     $oct = 0;
     $nov = 0;
     $dec = 0;

     foreach ($chart as $c) {
      if(date('m', strtotime($c['created_at'])) == '01') {
        $jan += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '02') {
        $feb += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '03') {
        $march += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '04') {
        $april += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '05') {
        $may += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '06') {
        $june += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '07') {
        $july += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '08') {
        $august += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '09') {
        $sept += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '10') {
        $oct += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '11') {
        $nov += $c['amount'];
      } else if(date('m', strtotime($c['created_at'])) == '12') {
        $dec += $c['amount'];
      }
     }



      return response()->json([
        'pendings' => $pendingLoans, 
        'dues' => $dueLoans,
        'cbu' => [
          'latest' => $cbu_latest,
          'previous' => $cbu_lastyear,
        ],
        'loan' => [
          'latest' => $loan_latest,
          'previous' => $loan_lastyear,
        ],
        'user' => [
          'latest' => $user_latest,
          'previous' => $user_lastyear,
        ],
        'payment' => [
          'latest' => $payment_latest,
          'previous' => $payment_lastyear,
        ],
        'chart' => [
          'Jan' => $jan,
          'Feb' => $feb,
          'Mar' => $march,
          'April' => $april,
          'May' => $may,
          'June' => $june,
          'Jul' => $july,
          'Aug' => $august,
          'Sept' => $sept,
          'Oct' => $oct,
          'Nov' => $nov,
          'Dec' => $dec,
        ]
      ], 200);
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
        'amount' => ($loan->amortization + $loan->penalty),
      ]);

      
      $loan->status = 'paid';
      $loan->save();

      $total = Payments::where('loan_id', $loan->loan_id)->sum('amount');


      $l=Loans::with('statements')->find($loan->loan_id);

      $sum = 0;
      foreach($l->statements as $s) {
        $sum += $s->penalty;
      }

      $l->check_amount = $total;
      $l->penalty_amount= $sum;
      $l->save();  
    }

    public function penalty(Request $request) {
      $dues = Loans::with('statements')->where('status', 'approved')->get();
      // ->whereHas('statements', function($query) {
      //   $query->whereDate('due_date', '<', date('y-m-d'))->where('status', 'to pay');
      // })
      $d1 = [];
      foreach($dues as $d) {
        foreach($d['statements'] as $statement) {
          if ($statement['status'] === 'to pay') {
            if (is_null($statement['penalty_updated']) || strtotime($statement['penalty_updated']) < strtotime(date('y-m-d'))) {
              if (strtotime($statement['due_date']) < strtotime(date('y-m-d'))){
                $days = round(abs(strtotime(date('y-m-d')) - strtotime($statement['due_date'])) / 86400);
                $months = (date('Y', strtotime(date('y-m-d'))) - date('Y', strtotime($statement['due_date']))) * 12;
                $months += date('m', strtotime(date('y-m-d'))) - date('m', strtotime($statement['due_date']));
                $penalty = $statement['principal'] * $months * 0.05;
                $s = LoanStatements::find($statement['id']);
                $s->penalty = $penalty;
                $s->penalty_updated = date('y-m-d');
                $s->save();

                $loan_penalty_total = 0;
                if($d['penalty_amount']) {
                  $loan_penalty_total = $d['penalty_amount'] + $penalty;
                } else {
                  $loan_penalty_total = $d['penalty_amount'];
                }

                $d1[] = $s;
              }
            }
          }
        }
      }

      return response($d1);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
