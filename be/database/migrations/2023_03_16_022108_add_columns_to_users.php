<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
          $table->enum('role', ['admin', 'member'])->default('member');
          $table->string('contact')->nullable();
          $table->string('address')->nullable();
          $table->date('birthdate')->nullable();
          $table->date('image')->nullable();
          $table->date('remarks')->nullable();
          $table->boolean('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
