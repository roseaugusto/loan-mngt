import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const AdminDashboard = () => {
  return (
    <Page title='Dashboard'>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <br />
    </Page>
  );
};
