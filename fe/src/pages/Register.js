import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';
import Image from 'react-bootstrap/Image';

export const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    address: '',
    contact: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/register', user)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/dashboard';
        }
      })
      .catch((e) => alert('Missing Fields'));
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center py-5 align-items-center bg-light'>
      <div className='card border-0'>
        <div className='card-body'>
          <div className='d-flex flex-row align-items-center'>
            <div className='px-5 py-2 w-50'>
              <form onSubmit={onSubmit}>
                <h3 className='card-title text-center mb-2'>Loan Management</h3>
                <h5 className='card-title text-center my-2'>Registration</h5>
                <div className='mb-3'>
                  <h6>Name</h6>
                  <input
                    type='name'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <h6>Email</h6>
                  <input
                    type='email'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <h6>Contact</h6>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, contact: e.target.value })}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <h6>Address</h6>
                  <textarea
                    className='form-control'
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <h6>Birthdate</h6>
                  <input
                    type='date'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <h6>Password</h6>
                  <input
                    type='password'
                    className='form-control'
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                  />
                </div>
                <div className='text-center'>
                  <button type='submit' className='btn btn-primary'>
                    Register
                  </button>
                  <br />
                  <a href='/login'>Have an account? Login Here</a>
                </div>
              </form>
            </div>
            <div className='w-50'>
              <center>
                <Image fluid src='/logo.jpeg' width={'100%'} />
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
