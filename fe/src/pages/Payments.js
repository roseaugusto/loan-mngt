import React from 'react';
import { Table } from 'react-bootstrap';

export const Payments = ({ payments = [], total = 0 }) => {
  return (
    <Table striped bordered hover size='sm' className='text-center'>
      <thead>
        <tr>
          <th>Post Date</th>
          <th>Transaction Code</th>
          <th>Due Date</th>
          <th>Amount</th>
        </tr>
        {payments.map((key, index) => (
          <tr key={index}>
            <td>{key.created_at}</td>
            <td>{key.trans_code}</td>
            <td>{key.statement.due_date}</td>
            <td> {key.amount.toLocaleString()}</td>
          </tr>
        ))}

        <tr>
          <th>Total</th>
          <th colSpan={3} className='text-right'>
            {total.toLocaleString()}
          </th>
        </tr>
      </thead>
    </Table>
  );
};
