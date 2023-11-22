import React from 'react';
import ReactDOM from 'react-dom/client';

import { Page } from './pages/Page';
import { UserRegularLoans } from './pages/UserRegularLoans';
import { UserPettyLoans } from './pages/UserPettyLoans';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserApplyLoans } from './pages/UserApplyLoans';
import { UserLoanDetails } from './pages/UserLoanDetails';
import { LoanDetailsDownload } from './pages/LoanDetailsDownload';
import { LoanPaymentsDownload } from './pages/LoanPaymentsDownload';
import { SavingsDownload } from './pages/SavingsDownload';
import { UserDashboard } from './pages/UserDashboard';
import { Withdraw } from './pages/Withdraw';
import { Deposit } from './pages/Deposit';
import { Savings } from './pages/Savings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MembersInfo } from './pages/MembersInfo';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Page />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/user/dashboard' element={<UserDashboard />} />
        <Route path='/user/info' element={<MembersInfo />} />
        <Route path='/user/regular-loan' element={<UserRegularLoans />} />
        <Route path='/user/petty-loan' element={<UserPettyLoans />} />
        <Route path='/user/apply-loan/' element={<UserApplyLoans />} />
        <Route path='/user/loan-details/:id' element={<UserLoanDetails />} />
        <Route path='/user/loan-details/:id/download' element={<LoanDetailsDownload />} />
        <Route path='/user/loan-payments/:id/download' element={<LoanPaymentsDownload />} />

        <Route path='/admin/dashboard' element={<AdminDashboard />} />

        <Route path='/withdraw' element={<Withdraw />} />
        <Route path='/deposit' element={<Deposit />} />
        <Route path='/savings' element={<Savings />} />
        <Route path='/savings/download' element={<SavingsDownload />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
