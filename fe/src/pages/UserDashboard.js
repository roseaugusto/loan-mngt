import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, ListGroup, Card } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const UserDashboard = () => {
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
    <Page title='Member Dashboard'>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <Card>
        <Card.Body>
          <Card.Title>Pending Loans for Approvals</Card.Title>
          <ListGroup as='ol' numbered>
            {data.dues?.length > 0 ? (
              data.dues?.map((key, index) => (
                <a href={`/user/loan-details/${key.id}`} style={{ color: 'black' }} key={index}>
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
                No due/s
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Page>
  );
};
