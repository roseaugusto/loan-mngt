import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav, NavDropdown } from 'react-bootstrap';

export const Page = ({ children, title = '' }) => {
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <>
      <Navbar bg='light' expand='lg' className='shadow'>
        <Container fluid>
          <Navbar.Brand href='#'>Loan Management</Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav className='me-auto my-2 my-lg-0' style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link href='#action1'>Home</Nav.Link>
              <Nav.Link href='#action2'>Member Info</Nav.Link>
              <Nav.Link href='#action3'>Savings</Nav.Link>
              <NavDropdown title='Loans' id='navbarScrollingDropdown'>
                <NavDropdown.Item href='/user/apply-loan'>Apply Loan</NavDropdown.Item>
                <NavDropdown.Item href='/user/regular-loan'>Regular Loan</NavDropdown.Item>
                <NavDropdown.Item href='/user/petty-loan'>Petty Cash</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text className='px-3'>
              Signed in as: <a href='#login'>{user?.name}</a>
            </Navbar.Text>
            <Navbar.Text className='border-left px-3' style={{ cursor: 'pointer' }}>
              &#9212; Logout
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className='p-5 bg-light my-4'>
        <h3>{title}</h3>
        {children}
      </Container>
    </>
  );
};
