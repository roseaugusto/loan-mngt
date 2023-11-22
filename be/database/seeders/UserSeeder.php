<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
          ['name' => 'Admin User',
          'email' => 'admin@test.com',
          'password' => bcrypt('1234'),
          'role' => 'admin'
        ],
        ['name' => 'Member User',
          'email' => 'member@test.com',
          'password' => bcrypt('1234'),
          'role' => 'member',
        ],
      ]);
    }
}
