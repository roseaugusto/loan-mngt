import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, Table, Container, Row, Col } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Savings = () => {
  const [user, setUser] = useState({});
  const [savings, setSavings] = useState([]);

  const fetchData = async () => {
    await apiRequest.get(`/savings`).then((res) => {
      setSavings(res.data);
    });
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);
  return (
    <Page title='Savings'>
      <Breadcrumb>
        <Breadcrumb.Item href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Savings</Breadcrumb.Item>
      </Breadcrumb>

      <Container className='py-3 px-0'>
        <Row className='mx-0'>
          <Col className='text-left px-0'>
            <a href='/savings/download' target='_blank' rel='noreferrer'>
              <button className='btn btn-primary'>Generate Report</button>
            </a>
          </Col>
          <Col className='text-right'>
            {user?.role === 'member' ? (
              <h4>Remaining Balance: Php {savings[0]?.balance.toLocaleString() || 0}</h4>
            ) : null}
          </Col>
        </Row>
      </Container>

      <Table striped bordered hover size='sm' q>
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference Number</th>
            {user?.role === 'admin' ? (
              <>
                <th>Member ID</th>
                <th>Member Name</th>
              </>
            ) : null}
            <th>Debit</th>
            <th>Credit</th>
            {user?.role === 'member' ? <th>Balance</th> : null}
          </tr>
        </thead>
        <tbody>
          {savings.length === 0 ? (
            <tr>
              <td colSpan={9} className='text-center'>
                No Transaction/s available
              </td>
            </tr>
          ) : (
            savings.map((key, index) => (
              <tr key={index}>
                <td>{key.created_at}</td>
                <td>{key.code}</td>
                {user?.role === 'admin' ? (
                  <>
                    <td>{key.user.id}</td>
                    <td>{key.user.name}</td>
                  </>
                ) : null}
                <td>{key.type === 'debit' ? 'Php ' + key.amount.toLocaleString() : '-'}</td>
                <td>{key.type === 'credit' ? 'Php ' + key.amount.toLocaleString() : '-'}</td>
                {user?.role === 'member' ? <td>Php {key.balance.toLocaleString()}</td> : null}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Page>
  );
};
