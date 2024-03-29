import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../utils/apiRequest';
import { DateTime } from 'luxon';
import { Table, Image } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const SavingsDownload = () => {
  const exportRef = useRef();

  const [user, setUser] = useState({});
  const [savings, setSavings] = useState(null);

  const fetchData = async () => {
    await apiRequest.get(`/savings`).then((res) => {
      setSavings(res.data);
    });
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);

  const generatePDF = async () => {
    html2canvas(exportRef.current).then((canvas) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      heightLeft -= pageHeight;
      const doc = new jsPDF('p', 'mm');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save(`${user.name}_statement_of_account.pdf`);
    });
  };

  return (
    <>
      <a href={`/savings`}>
        <button className='btn btn-primary float-right' style={{ margin: '80px 80px 160px 10px' }}>
          Back
        </button>
      </a>
      <button
        className='btn btn-primary float-right'
        style={{ margin: '80px 0px' }}
        onClick={() => generatePDF()}
      >
        Download
      </button>
      <div style={{ padding: '80px 160px' }} ref={exportRef}>
        <div className='d-flex justify-content-start align-items-center'>
          <div>
            <Image fluid src='/logo.jpeg' width={'100px'} />
          </div>
          <h3>Owners Capital</h3>
        </div>
        <b>ID:</b> {user?.id} <br />
        <b>{user?.role === 'admin' ? 'Prepared By: ' : 'Name: '}</b> {user?.name} <br />
        <Table striped bordered hover size='sm' q>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference Number</th>
              {user?.role === 'admin' ? (
                <>
                  <th>Member ID</th>
                  <th>Member Name</th>
                </>
              ) : null}
              <th>Credit</th>
              <th>Debit</th>
              {user?.role === 'member' ? <th>Balance</th> : null}
            </tr>
          </thead>
          <tbody>
            {savings ? (
              savings.data.map((key, index) => (
                <tr key={index}>
                  <td>{DateTime.fromISO(key.created_at).toFormat('yyyy-MM-dd')}</td>
                  <td>{key.code}</td>
                  {user?.role === 'admin' ? (
                    <>
                      <td>{key.user.id}</td>
                      <td>{key.user.name}</td>
                    </>
                  ) : null}
                  <td> {key.balance.toLocaleString()}</td>
                  <td>{key.type === 'debit' ? key.amount.toLocaleString() : '-'}</td>
                  <td>{key.type === 'credit' ? key.amount.toLocaleString() : '-'}</td>
                  {user?.role === 'member' ? <td>{key.balance.toLocaleString()}</td> : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className='text-center'>
                  No Transaction/s available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};
