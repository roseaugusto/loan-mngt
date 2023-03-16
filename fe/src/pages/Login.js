import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';
import Image from 'react-bootstrap/Image';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/login', {
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/dashboard';
        }
      })
      .catch((e) => alert('Invalid credentials'));
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center py-5 align-items-center bg-light'>
      <div className='card border-0'>
        <div className='card-body'>
          <div className='d-flex flex-row align-items-center'>
            <div className='p-5 w-50'>
              <form onSubmit={onSubmit}>
                <h3 className='card-title text-center mb-2'>Loan Management</h3>
                <h5 className='card-title text-center my-2'>Login</h5>
                <div className='mb-3'>
                  <h6>Email</h6>
                  <input
                    type='email'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                <div className='mb-3'>
                  <h6>Password</h6>
                  <input
                    type='password'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                </div>
                <div className='text-center'>
                  <button type='submit' className='btn btn-primary '>
                    Login
                  </button>
                  <br />
                  <a href='/register'>Don't have an account? Register Here</a>
                </div>
              </form>
            </div>
            <div className='w-50'>
              <center>
                <Image fluid src='/logo.jpeg' width={'70%'} />
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
