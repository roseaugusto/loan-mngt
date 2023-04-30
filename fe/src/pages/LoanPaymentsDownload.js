import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Table, Image } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const LoanPaymentsDownload = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState([]);
  const [totals, setTotals] = useState(0);
  const [user, setUser] = useState({});
  const exportRef = useRef();

  const fetchData = async () => {
    await apiRequest.get(`/loans/${id}`).then((res) => {
      setLoan(res.data || []);
      let sum = 0;
      res.data?.payments.map((key) => {
        sum = sum + key.amount;
      });
      setTotals(sum);
    });
  };

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
      doc.save(`${user.name}_credited_payments.pdf`);
    });
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
    fetchData();
  }, []);

  return (
    <>
      <a href={`/user/loan-details/${id}`}>
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
          <h3>Credited Payments</h3>
        </div>
        <b>Name:</b> {loan.user?.name} <br />
        <b>Amount Loan:</b> {loan.loan_amount?.toLocaleString()} <br />
        <b>Referrence Number:</b>
        {loan.code} <br />
        <b>Loan Type:</b> {loan.type} <br />
        <Table striped bordered hover size='sm' className='text-center'>
          <thead>
            <tr>
              <th>Post Date</th>
              <th>Transaction Code</th>
              <th>Due Date</th>
              <th>Amount</th>
            </tr>
            {loan.payments?.map((key, index) => (
              <tr key={index}>
                <td>{key.created_at}</td>
                <td>{key.trans_code}</td>
                <td>{key.statement.due_date}</td>
                <td className='text-right'> {key.amount.toLocaleString()}</td>
              </tr>
            ))}

            <tr>
              <th>Total</th>
              <th colSpan={3} className='text-right'>
                {totals.toLocaleString()}
              </th>
            </tr>
          </thead>
        </Table>
      </div>
    </>
  );
};
