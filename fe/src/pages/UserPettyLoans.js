import React from 'react';
import { Page } from './Page';
import { Breadcrumb, Table, Badge } from 'react-bootstrap';

export const UserPettyLoans = () => {
  const getStatus = (status = 'ongoing') => {
    switch (status) {
      case 'cancelled':
      case 'due':
        return 'danger';
      case 'released':
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  };
  return (
    <Page title='Petty Cash Loans'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Petty Cash Loans</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Reference Number</th>
            <th>Loan Date</th>
            <th>Check Amount / Disbursed Amount</th>
            <th>Loan Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <a href='/'>R0001</a>
            </td>
            <td>Mar 3, 2023</td>
            <td>20,000</td>
            <td>26,000</td>
            <td>
              <Badge bg={getStatus()} className='text-white'>
                Ongoing
              </Badge>
            </td>
          </tr>
          <tr>
            <td colSpan={6} className='text-center'>
              No Loan/s available
            </td>
          </tr>
        </tbody>
      </Table>
    </Page>
  );
};
