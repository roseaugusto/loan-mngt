import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav, NavDropdown } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const Page = ({ children, title = '' }) => {
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  const logout = async () => {
    await apiRequest.post('logout', {}).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  };

  const penalty = async () => {
    await apiRequest.post('penalty', {}).catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchUserData();
    penalty();
  }, []);
  return (
    <>
      <Navbar
        expand='lg'
        variant='dark'
        className='shadow text-white'
        style={{ backgroundColor: '#6778ee' }}
      >
        <Container fluid>
          <Navbar.Brand href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
            <img
              src='/logo.jpeg'
              width='30'
              height='30'
              className='d-inline-block align-top'
              alt='React Bootstrap logo'
            />{' '}
            Loan Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav className='me-auto my-2 my-lg-0' style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
                Home
              </Nav.Link>
              <Nav.Link href='/user/info'>Member Info</Nav.Link>

              <NavDropdown title='Savings' id='navbarScrollingDropdown'>
                <NavDropdown.Item href='/savings'>Savings</NavDropdown.Item>
                {user?.role === 'admin' ? (
                  <>
                    <NavDropdown.Item href='/withdraw'>Withdraw</NavDropdown.Item>
                    <NavDropdown.Item href='/deposit'>Deposit</NavDropdown.Item>
                  </>
                ) : null}
              </NavDropdown>
              <NavDropdown title='Loans' id='navbarScrollingDropdown'>
                {user?.role === 'member' ? (
                  <NavDropdown.Item href='/user/apply-loan'>Apply Loan</NavDropdown.Item>
                ) : null}

                <NavDropdown.Item href='/user/regular-loan'>Regular Loan</NavDropdown.Item>
                <NavDropdown.Item href='/user/petty-loan'>Petty Cash</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text className='px-3'>
              Signed in as: <a href='#login'>{user?.name}</a>
            </Navbar.Text>
            <Navbar.Text
              className='border-left px-3'
              style={{ cursor: 'pointer' }}
              onClick={() => logout()}
            >
              <b>&#9212; Logout</b>
            </Navbar.Text>
            {/* 
            //drop down icon here for more settings
            <>
              <NavDropdown title='Reports' id='navbarScrollingDropdown'>
                <NavDropdown.Item href='/user/info'>My Profile</NavDropdown.Item>
                <NavDropdown.Item href='/logout'>Logout</NavDropdown.Item>
              </NavDropdown>
            </> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='bg-light' style={{ padding: '30px 120px', margin: '60px 180px' }}>
        <h3>{title}</h3>
        {children}
      </div>
    </>
  );
};
