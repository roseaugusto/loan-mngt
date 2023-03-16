import React from 'react';
import ReactDOM from 'react-dom/client';

import { Page } from './pages/Page';
import { UserRegularLoans } from './pages/UserRegularLoans';
import { UserPettyLoans } from './pages/UserPettyLoans';
import { AdminRegularLoans } from './pages/AdminRegularLoans';
import { AdminLoanDetails } from './pages/AdminLoanDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserApplyLoans } from './pages/UserApplyLoans';
import { UserLoanDetails } from './pages/UserLoanDetails';
import { UserDashboard } from './pages/UserDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

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
        <Route path='/user/regular-loan' element={<UserRegularLoans />} />
        <Route path='/user/petty-loan' element={<UserPettyLoans />} />
        <Route path='/user/apply-loan/' element={<UserApplyLoans />} />
        <Route path='/user/loan-details/:id' element={<UserLoanDetails />} />

        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/regular-loan' element={<AdminRegularLoans />} />
        <Route path='/admin/loan-details/:id' element={<AdminLoanDetails />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
