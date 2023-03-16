import React, { useState } from 'react';
import { Page } from './Page';
import { Breadcrumb } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const UserDashboard = () => {
  return (
    <Page title='Dashboard'>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <br />
    </Page>
  );
};
