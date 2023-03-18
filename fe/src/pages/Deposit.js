import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Deposit = () => {
  const [saving, setSaving] = useState({
    amount: '',
    type: 'credit',
    id: null,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/savings', saving)
      .then((res) => {
        window.location.href = '/savings';
      })
      .catch((e) => alert('Missing Fields'));
  };

  return (
    <Page title='Deposit'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Deposit</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <form onSubmit={onSubmit}>
        <h3 className='card-title text-center my-2'>Deposit</h3>
        <div className='mb-3'>
          <h6>Member ID</h6>
          <input
            type='number'
            className='form-control'
            pattern='^[0-9,]*$'
            onChange={(e) => setSaving({ ...saving, id: e.target.value })}
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