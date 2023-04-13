import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, ListGroup, Card, Col, Row, Table } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faMoneyBill,
  faUsers,
  faCoins,
  faLongArrowUp,
  faLongArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  PointElement,
);

export const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await apiRequest.get(`/dashboard`).then((res) => {
      setData(res.data);
    });

    await apiRequest.get('users/member').then((res) => {
      setUsers(res.data);
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const labels = data.chart ? Object.keys(data.chart) : [];

  const chartdata = {
    labels,
    datasets: [
      {
        fill: true,
        data: data.chart ? Object.entries(data.chart) : [],
        backgroundColor: '#b3bcf7',
        borderColor: '#6778ee',
      },
    ],
  };

  const calculate = (type) => {
    let diff = data[type]?.latest - data[type]?.previous;
    let total = data[type]?.latest + data[type]?.previous;

    return (diff / total) * 100;
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);
  return (
    <Page title='Admin Dashboard'>
      <Row xs={1} md={4} className='g-4'>
        <Col>
          <Card style={{ minHeight: '180px' }}>
            <Card.Body>
              <Card.Title>CBU</Card.Title>
              <Card.Text>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h5>0.00</h5>
                    <div
                      className={`mt-4 ${calculate('cbu') < 0 ? 'text-danger' : 'text-success'}`}
                    >
                      <FontAwesomeIcon
                        icon={calculate('cbu') < 0 ? faLongArrowDown : faLongArrowUp}
                        color={calculate('cbu') < 0 ? 'red' : 'green'}
                      />
                      <span className='ml-2'>{calculate('cbu')}%</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faCalendar} size='2xl' color='purple' />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ minHeight: '180px' }}>
            <Card.Body>
              <Card.Title>REGULAR LOAN TOTAL INTEREST EARNED</Card.Title>
              <Card.Text>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h5>0.00</h5>
                    <div
                      className={`mt-4 ${calculate('loan') < 0 ? 'text-danger' : 'text-success'}`}
                    >
                      <FontAwesomeIcon
                        icon={calculate('loan') < 0 ? faLongArrowDown : faLongArrowUp}
                        color={calculate('loan') < 0 ? 'red' : 'green'}
                      />
                      <span className='ml-2'>{calculate('loan')}%</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faMoneyBill} size='2xl' color='green' />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ minHeight: '180px' }}>
            <Card.Body>
              <Card.Title>MEMBERS</Card.Title>
              <Card.Text>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h5>0.00</h5>
                    <div
                      className={`mt-4 ${calculate('user') < 0 ? 'text-danger' : 'text-success'}`}
                    >
                      <FontAwesomeIcon
                        icon={calculate('user') < 0 ? faLongArrowDown : faLongArrowUp}
                        color={calculate('user') < 0 ? 'red' : 'green'}
                      />
                      <span className='ml-2'>{calculate('user')}%</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faUsers} size='2xl' color='blue' />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ minHeight: '180px' }}>
            <Card.Body>
              <Card.Title>PAYDAY PAYMENT</Card.Title>
              <Card.Text>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h5>0.00</h5>
                    <div
                      className={`mt-4 ${
                        calculate('payment') < 0 ? 'text-danger' : 'text-success'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={calculate('payment') < 0 ? faLongArrowDown : faLongArrowUp}
                        color={calculate('payment') < 0 ? 'red' : 'green'}
                      />
                      <span className='ml-2'>{calculate('payment')}%</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faCoins} size='2xl' color='gold' />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
      <Card>
        <Card.Body>
          <Card.Title style={{ color: '#6778ee' }}>Yearly Recap Report for CBU</Card.Title>
          <Line options={options} data={chartdata} />
        </Card.Body>
      </Card>
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
      <br />
      <Card>
        <Card.Body>
          <Card.Title>Member List</Card.Title>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>CBU</th>
                <th>Email</th>
                <th>Address</th>
                <th>Birthdate</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>PHP {item.savings[0]?.balance.toLocaleString()}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.birthdate}</td>
                  <td>{item.contact}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Page>
  );
};
