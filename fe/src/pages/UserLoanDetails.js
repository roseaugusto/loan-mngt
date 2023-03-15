import React from 'react';
import { Page } from './Page';
import {
  Breadcrumb,
  Table,
  Badge,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

export const UserLoanDetails = () => {
  const getStatus = (status = 'paid') => {
    switch (status) {
      case 'overdue':
      case 'due':
        return 'danger';
      case 'paid':
        return 'success';
      default:
        return 'primary';
    }
  };
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      Click to see payments
    </Tooltip>
  );
  return (
    <Page title='Loan Details'>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Loan Details</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Container className='bg-white py-3'>
        <Row>
          <Col>
            <b>Name:</b> Ronel Dayanan
          </Col>
          <Col className='text-right'>
            <b>Amount Loan:</b> 26,000
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Referrence Number:</b>{' '}
            <OverlayTrigger
              placement='bottom'
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <a href='/'>R0001</a>
            </OverlayTrigger>
          </Col>
          <Col className='text-right'>
            <b>Loan Type:</b> Regular Loan
          </Col>
        </Row>
      </Container>
      <br />
      <Table striped bordered hover size='sm' className='text-center'>
        <thead>
          <tr>
            <th>Applicable Month</th>
            <th>Due Date</th>
            <th colSpan={3}>Amount</th>
            <th>Outstanding Principal Balance</th>
            <th>Status</th>
          </tr>
          <tr>
            <th />
            <th />
            <th>Amortization</th>
            <th>Interest</th>
            <th>Principal</th>
            <th />
            <th />
          </tr>
          <tr>
            <th colSpan={7} className='text-right'>
              26,000
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>June</td>
            <td>June 22, 2023</td>
            <td></td>
            <td>Mar 3, 2023</td>
            <td>20,00</td>
            <td>
              <Badge bg={getStatus()} className='text-white px-4'>
                Paid
              </Badge>
            </td>
          </tr>
        </tbody>
      </Table>
    </Page>
  );
};
