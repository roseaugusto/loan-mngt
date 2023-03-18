import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb, Container, Row, Col } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Withdraw = () => {
  const [saving, setSaving] = useState({
    amount: '',
    type: 'debit',
    id: null,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/savings', saving)
      .then((res) => {
        window.location.href = '/savings';
      })
      .catch((e) =>
        e.response.data
          ? alert(e.response.data.error + '\n' + 'Balance is only ' + e.response.data.balance)
          : alert('error'),
      );
  };

  return (
    <Page title='Withdraw'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Withdraw</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={onSubmit}>
        <h3 className='card-title text-center my-2'>Widthraw</h3>
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
