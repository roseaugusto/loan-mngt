import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, Button } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const MembersInfo = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    address: '',
    contact: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .patch('/user/update', user)
      .then((res) => {
        fetchData();
        setIsEdit(false);
      })
      .catch((e) => alert('Missing Fields'));
  };

  const fetchData = async () => {
    await apiRequest.get(`/user/info`).then((res) => {
      setUser(res.data[0]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page title='Member Info'>
      <Breadcrumb>
        <Breadcrumb.Item href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Member Info</Breadcrumb.Item>
      </Breadcrumb>
      <br />
      <div className='d-flex justify-content-end'>
        {isEdit ? (
          <Button
            className='btn-danger ml-2'
            onClick={() => {
              setIsEdit(false);
              fetchData();
            }}
          >
            Cancel
          </Button>
        ) : (
          <Button className='btn-success' onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <div className='mb-3'>
          <h6>Name</h6>
          <input
            type='name'
            className='form-control'
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            value={user.name}
            disabled={!isEdit}
          />
        </div>
        <div className='mb-3'>
          <h6>Email</h6>
          <input
            type='email'
            className='form-control'
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            disabled={!isEdit}
          />
        </div>
        <div className='mb-3'>
          <h6>Contact</h6>
          <input
            type='text'
            className='form-control'
            onChange={(e) => setUser({ ...user, contact: e.target.value })}
            value={user.contact}
            maxLength='11'
            pattern='^[0-9,]*$'
            disabled={!isEdit}
          />
        </div>
        <div className='mb-3'>
          <h6>Address</h6>
          <textarea
            className='form-control'
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            value={user.address}
            disabled={!isEdit}
          />
        </div>
        <div className='mb-3'>
          <h6>Birthdate</h6>
          <input
            type='date'
            className='form-control'
            onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
            value={user.birthdate}
            disabled={!isEdit}
          />
        </div>
        {isEdit ? (
          <div className='text-center'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
            <br />
          </div>
        ) : null}
      </form>
    </Page>
  );
};
