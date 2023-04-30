import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Deposit = () => {
  const [user, setUser] = useState({});
  const [saving, setSaving] = useState({
    amount: '',
    type: 'credit',
    name: null,
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/savings', saving)
      .then((res) => {
        window.location.href = '/savings';
      })
      .catch((e) => alert('Something went wrong, please try again.'));
  };

  return (
    <Page title='Deposit'>
      <Breadcrumb>
        <Breadcrumb.Item href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Deposit</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <form onSubmit={onSubmit}>
        <h3 className='card-title text-center my-2'>Deposit</h3>
        <div className='mb-3'>
          <h6>Member Name</h6>
          <input
            type='text'
            className='form-control'
            onChange={(e) => setSaving({ ...saving, name: e.target.value })}
            required
          />
        </div>
        <div className='mb-3'>
          <h6>Amount</h6>
          <input
            type='number'
            className='form-control'
            pattern='^[0-9,]*$'
            onChange={(e) => setSaving({ ...saving, amount: e.target.value })}
            required
          />
        </div>
        <div className='text-center'>
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </div>
      </form>
    </Page>
  );
};
