import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, ListGroup, Card } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await apiRequest.get(`/dashboard`).then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);
  return (
    <Page title='Admin Dashboard'>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Card>
        <Card.Body>
          <Card.Title>Pending Loans for Approvals</Card.Title>
          <ListGroup as='ol' numbered>
            {data.pendings?.length > 0 ? (
              data.pendings?.map((key, index) => (
                <a href={`/user/loan-details/${key.id}`} style={{ color: 'black' }}>
                  <ListGroup.Item
                    as='li'
                    className='d-flex justify-content-between align-items-start'
                  >
                    <div className='ms-2'>
                      <b className='bold'>{key.code}</b>
                      <br />
                      {key.user.name}
                    </div>
                    <div>{key.created_at}</div>
                  </ListGroup.Item>
                </a>
              ))
            ) : (
              <ListGroup.Item as='li' className='d-flex justify-content-center align-items-start'>
                No loan/s for approval
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Page>
  );
};
