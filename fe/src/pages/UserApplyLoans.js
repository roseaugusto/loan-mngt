import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const UserApplyLoans = () => {
  const [loan, setLoan] = useState({
    loan_amount: '',
    type: 'regular',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loan.type === 'petty') {
      if (loan.loan_amount > 5000) {
        alert('Petty Loans must not exceed 5000');
      }
    }
    await apiRequest
      .post('/loans', loan)
      .then((res) => {
        window.location.href = loan.type === 'regular' ? '/user/regular-loan' : '/user/petty-loan';
      })
      .catch((e) => alert('Missing Fields'));
  };

  return (
    <Page title='Apply for a loan'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Apply Loan</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <form onSubmit={onSubmit}>
        <h3 className='card-title text-center my-2'>Loan Application</h3>
        <div className='mb-3'>
          <h6>Amount</h6>
          <input
            type='number'
            className='form-control'
            pattern='^[0-9,]*$'
            onChange={(e) => setLoan({ ...loan, loan_amount: e.target.value })}
            required
          />
        </div>
        <div className='mb-3'>
          <h6>Loan Type</h6>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='radio'
              name='typeRadios'
              value='regular'
              onChange={(e) => setLoan({ ...loan, type: e.target.value })}
              required
            />
            <label className='form-check-label' for='exampleRadios2'>
              Regular
            </label>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='radio'
              name='typeRadios'
              value='petty'
              onChange={(e) => setLoan({ ...loan, type: e.target.value })}
              required
            />
            <label className='form-check-label'>Petty Cash</label>
          </div>
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
