import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Payments } from './Payments';
import { Button, Modal } from 'react-bootstrap';
import { Breadcrumb, Table, Badge, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

export const UserLoanDetails = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState([]);
  const [totals, setTotals] = useState({
    amortization: 0,
    interest: 0,
    principal: 0,
    payments: 0,
    penalty: 0,
  });
  const [tabKey, setTabKey] = useState('details');
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);

  const updateStatus = async (status) => {
    await apiRequest.patch(`/loans/${id}`, { status, amount }).then((res) => {
      fetchData();
    });
  };

  const pay = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await apiRequest.patch(`/loans/pay/${id}`).then((res) => {
      fetchData();
    });
  };

  const fetchData = async () => {
    await apiRequest.get(`/loans/${id}`).then((res) => {
      setLoan(res.data || []);
      setAmount(res.data?.loan_amount || 0);
      let asum = 0;
      let isum = 0;
      let psum = 0;
      let pnsum = 0;
      res.data?.statements.map((key) => {
        asum = asum + key.amortization;
        isum = isum + key.interest;
        psum = psum + key.principal;
        pnsum = pnsum + key.penalty;
      });
      let x = { ...totals };
      setTotals({ ...totals, amortization: asum, interest: isum, principal: psum });

      let sum = 0;
      res.data?.payments.map((key) => {
        sum = sum + key.amount;
      });
      setTotals({ ...totals, payments: sum });
    });
  };

  const calculate = (type) => {
    let sum = 0;
    if (type === 'payments') {
      loan.payments?.map((key) => {
        sum = sum + key.amount;
      });
    } else {
      loan.statements?.map((key) => {
        sum = sum + key[type];
      });
    }

    return sum;
  };

  const checkInterestButton = (type, index) => {
    if (type === 'petty') {
      if (index === 0) {
        return loan.statements && loan.statements[1].status !== 'paid';
      }
    }

    return loan.statements && loan.statements[index].status !== 'paid';
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);

  const getStatus = (status = 'paid') => {
    switch (status) {
      case 'overdue':
      case 'due':
        return 'danger';
      case 'paid':
        return 'success';
      case 'to pay':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Page title='Loan Details'>
      <Breadcrumb>
        <Breadcrumb.Item href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href={loan.type === 'petty' ? '/user/petty-loan' : '/user/regular-loan'}>
          {loan.type === 'petty' ? 'Petty Cash Loans' : 'Regular Loans'}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Loan Details</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      {loan.status === 'pending' && user?.role === 'admin' ? (
        <div className='d-flex justify-content-end'>
          <button
            className='btn btn-success mr-2'
            onClick={() => {
              setShow(true);
            }}
          >
            Approve
          </button>
          <button className='btn btn-danger' onClick={() => updateStatus('cancelled')}>
            Decline
          </button>
        </div>
      ) : null}
      <Container className='py-3'>
        <Row>
          <Col>
            <b>Name:</b> {loan.user?.name}
          </Col>
          <Col className='text-right'>
            <b>Amount Loan:</b> {loan.loan_amount?.toLocaleString()}
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Referrence Number:</b>
            {loan.code}
          </Col>
          <Col className='text-right'>
            <b>Loan Type: </b> {loan.type}
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Date Applied: </b>
            {DateTime.fromISO(loan.created_at).toFormat('yyyy-MM-dd')}
          </Col>
          <Col className='text-right'>
            <b>Status:</b> {loan.status}
          </Col>
        </Row>
      </Container>
      <br />
      {loan.status === 'approved' ? (
        <a
          href={
            tabKey === 'details'
              ? `/user/loan-details/${id}/download`
              : `/user/loan-payments/${id}/download`
          }
          target='_blank'
          rel='noreferrer'
        >
          <button className='btn btn-primary float-right'>Generate Report</button>
        </a>
      ) : null}
      <Tabs
        id='controlled-tab-example'
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k)}
        className='mb-3'
      >
        <Tab eventKey='details' title='Details'>
          <div>
            {loan.status === 'approved' ? (
              <Table striped bordered hover size='sm' className='text-center'>
                <thead>
                  <tr>
                    <th>Applicable Month</th>
                    <th>Due Date</th>
                    <th colSpan={6}>Amount</th>
                    <th>Outstanding Principal Balance</th>
                    <th>Status</th>
                    {user?.role === 'admin' ? <th>Actions</th> : null}
                  </tr>
                  <tr>
                    <th />
                    <th />
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Amortization</th>
                    <th>Semi Gross Interest</th>
                    <th>Semi Monthly Amortization</th>
                    <th>Penalty</th>
                    <th />
                    <th />
                    <th />
                  </tr>
                  <tr>
                    <th colSpan={8} />
                    <th> {loan.loan_amount?.toLocaleString()}</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {loan.statements?.map((key, index) => (
                    <tr key={index}>
                      <td>{key.month}</td>
                      <td>{key.due_date}</td>
                      <td>{key.principal.toLocaleString()}</td>
                      <td>{key.interest.toLocaleString()}</td>
                      <td>{key.amortization.toLocaleString()}</td>
                      <td>{(calculate('interest') / loan.months_to_pay).toLocaleString()}</td>
                      <td>
                        {(calculate('amortization') / loan.months_to_pay)
                          .toFixed(2)
                          .toLocaleString()}
                      </td>
                      <td>{key.penalty?.toLocaleString() || 0}</td>
                      <td>{key.outstanding.toLocaleString()}</td>
                      <td>
                        <Badge bg={getStatus(key.status)} className='text-white px-4'>
                          {key.status}
                        </Badge>
                      </td>
                      {user?.role === 'admin' ? (
                        <td>
                          {loan.status === 'approved' && checkInterestButton(loan.type, index) ? (
                            <button className='btn btn-success btn-sm' onClick={() => pay(key.id)}>
                              PAY
                            </button>
                          ) : (
                            '-'
                          )}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={2}>Total</th>
                    <th> {calculate('principal').toLocaleString()}</th>
                    <th> {calculate('interest').toLocaleString()}</th>
                    <th> {calculate('amortization').toLocaleString()}</th>
                    <th> {calculate('interest').toLocaleString()}</th>
                    <th> {calculate('amortization').toLocaleString()}</th>
                    <th> {calculate('penalty').toLocaleString()}</th>
                    <th colSpan={3} />
                  </tr>
                </tbody>
              </Table>
            ) : (
              <h6 className='text-center'>No details yet</h6>
            )}
          </div>
        </Tab>
        <Tab eventKey='payments' title='Payments'>
          <Payments payments={loan.payments} total={calculate('payments')} />
        </Tab>
      </Tabs>
      <Modal show={show} onHide={() => setShow(false)}>
        <form onSubmit={() => updateStatus('approved')}>
          <Modal.Header className='text-white' style={{ backgroundColor: '#6778ee' }}>
            <Modal.Title>Enter Final Loan Amount</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <h6>Amount</h6>
              <input
                type='number'
                className='form-control'
                pattern='^[0-9,]*$'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant='primary' type='submit'>
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Page>
  );
};
