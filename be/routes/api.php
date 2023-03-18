<?php

use App\Http\Controllers\SavingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoansController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('register/', [UserController::class, 'register']);  
Route::post('login/', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {
  Route::resource('loans/', LoansController::class);
  Route::get('loans/{id}', [LoansController::class, 'show']);
  Route::patch('loans/{id}', [LoansController::class, 'update']);
  Route::patch('loans/pay/{id}', [LoansController::class, 'pay']);
  Route::get('dashboard', [LoansController::class, 'dashboard']);
  Route::post('logout/', [UserController::class, 'logout']);
  Route::get('savings/', [SavingsController::class, 'show']);
  Route::post('savings/', [SavingsController::class, 'store']);
  Route::get('users/{role}', [UserController::class, 'showUsersbyRole']);
});

