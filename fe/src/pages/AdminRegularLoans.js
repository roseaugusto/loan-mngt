import React, { useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, Table, Badge, Button } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminRegularLoans = () => {
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

  const fetchData = async () => {
    await apiRequest.get(`/show-loans?type=regular`).then((res) => {
      //setSub(res.data);
    });
  };

  const onChangeStatus = async (stat, id) => {
    await apiRequest
      .patch(`/change-status/${id}`, {
        status: stat,
      })
      .then((res) => {
        fetchData();
      })
      .catch((e) => alert('error'));
  };

  useEffect(() => {
    fetchData();
  }, []);
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
            <th>#</th>
            <th>Reference Number</th>
            <th>Applicant ID</th>
            <th>Applicant Name</th>
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
              <a href={`/admin/loan-details/1`}>R0001</a>
            </td>
            <td>1237</td>
            <td>Ronel Dayanan</td>
            <td>Mar 3, 2023</td>
            <td>20,00</td>
            <td>26,000</td>
            <td>
              <Badge bg={getStatus()} className='text-white'>
                Ongoing
              </Badge>
            </td>
          </tr>
          <tr>
            <td colSpan={9} className='text-center'>
              No Loan/s available
            </td>
          </tr>
        </tbody>
      </Table>
    </Page>
  );
};
