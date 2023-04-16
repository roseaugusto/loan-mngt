import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Breadcrumb, ListGroup, Card } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';

export const CashFlow = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  }, []);

  return <Page title='Cash Flow'></Page>;
};
