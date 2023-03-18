import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, Table, Badge } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const UserRegularLoans = () => {
  const [loans, setLoans] = useState([]);
  const [user, setUser] = useState({});
  const fetchData = async () => {
    await apiRequest.get('/loans?type=regular').then((res) => {
      setLoans(res.data || []);
    });
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);

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
    <Page title='Regular Loans'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Regular Loans</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Reference Number</th>
            {user?.role === 'admin' ? (
              <>
                {' '}
                <th>Member ID</th>
                <th>Member Name</th>
              </>
            ) : null}
            <th>Loan Date</th>
            <th>Check Amount / Disbursed Amount</th>
            <th>Loan Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans?.length === 0 ? (
            <tr>
              <td colSpan={7} className='text-center'>
                No Loan/s available
              </td>
            </tr>
          ) : (
            loans.map((key, index) => (
              <tr key={index}>
                <td>
                  <a href={`/user/loan-details/${key.id}`}>{key.code}</a>
                </td>
                {user?.role === 'admin' ? (
                  <>
                    {' '}
                    <td>{key.user.id}</td>
                    <td>{key.user.name}</td>
                  </>
                ) : null}
                <td>{key.created_at}</td>
                <td>{key.check_amount.toLocaleString()}</td>
                <td>{key.loan_amount.toLocaleString()}</td>
                <td>
                  <Badge bg={getStatus(key.status)} className='text-white'>
                    {key.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Page>
  );
};
