import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, Table, Container, Row, Col } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { apiRequest } from '../utils/apiRequest';
import CustomPagination from './components/CustomPagination';

export const Savings = () => {
  const [user, setUser] = useState({});
  const [savings, setSavings] = useState(null);

  const fetchData = async (page = 1) => {
    await apiRequest.get(`/savings?page=${page}`).then((res) => {
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
              <h4>Total Savings: {savings.data[0]?.balance.toLocaleString() || 0}</h4>
            ) : null}
          </Col>
        </Row>
      </Container>

      <Table striped bordered hover size='sm'>
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
            <th>Credit</th>
            <th>Debit</th>
            {user?.role === 'member' ? <th>Balance</th> : null}
          </tr>
        </thead>
        <tbody>
          {savings ? (
            savings.data.map((key, index) => (
              <tr key={index}>
                <td>{DateTime.fromISO(key.created_at).toFormat('yyyy-MM-dd')}</td>
                <td>{key.code}</td>
                {user?.role === 'admin' ? (
                  <>
                    <td>{key.user.id}</td>
                    <td>{key.user.name}</td>
                  </>
                ) : null}
                <td>{key.type === 'debit' ? key.amount.toLocaleString() : '-'}</td>
                <td>{key.type === 'credit' ? key.amount.toLocaleString() : '-'}</td>
                {user?.role === 'member' ? <td> {key.balance.toLocaleString()}</td> : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className='text-center'>
                No Transaction/s available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {savings ? (
        <CustomPagination
          total={savings.total}
          current_page={savings.current_page}
          fetchData={(page) => fetchData(page)}
        />
      ) : null}
    </Page>
  );
};
