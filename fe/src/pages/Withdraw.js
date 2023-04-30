import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Withdraw = () => {
  const [user, setUser] = useState({});
  const [saving, setSaving] = useState({
    amount: '',
    type: 'debit',
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
      .catch((e) =>
        e.response.data.error
          ? alert(e.response.data.error + '\n' + 'Balance is only ' + e.response.data.balance)
          : alert('Something went wrong, please try again.'),
      );
  };

  return (
    <Page title='Withdraw'>
      <Breadcrumb>
        <Breadcrumb.Item href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Withdraw</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={onSubmit}>
        <h3 className='card-title text-center my-2'>Withdraw</h3>
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
