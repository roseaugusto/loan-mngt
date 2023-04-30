import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import Select from 'react-select';

export const UserApplyLoans = () => {
  const [loan, setLoan] = useState({
    loan_amount: '',
    type: null,
    months_to_pay: 12,
  });

  const options = [
    { value: '1', label: 1 },
    { value: '2', label: 2 },
    { value: '3', label: 3 },
    { value: '4', label: 4 },
    { value: '5', label: 5 },
    { value: '6', label: 6 },
    { value: '7', label: 7 },
    { value: '8', label: 8 },
    { value: '9', label: 9 },
    { value: '10', label: 10 },
    { value: '11', label: 11 },
    { value: '12', label: 12 },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option) => {
    setSelectedOption(option);
    setLoan({ ...loan, months_to_pay: option.value });
  };

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
          {loan.type === 'regular' ? (
            <div className='mt-3'>
              <h6>Number of Months to Pay</h6>
              <Select value={selectedOption} onChange={handleChange} options={options} />
            </div>
          ) : null}
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
