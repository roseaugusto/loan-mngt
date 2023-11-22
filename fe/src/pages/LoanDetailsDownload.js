import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Table, Image } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const LoanDetailsDownload = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState([]);
  const [totals, setTotals] = useState({ amortization: 0, interest: 0, principal: 0, payments: 0 });
  const [user, setUser] = useState({});
  const exportRef = useRef();

  const fetchData = async () => {
    await apiRequest.get(`/loans/${id}`).then((res) => {
      setLoan(res.data || []);
      res.data?.statements.map((key) => {
        let t = { ...totals };
        let asum = t.amortization + key.amortization;
        let isum = t.interest + key.interest;
        let psum = t.principal + key.principal;
        setTotals({ ...totals, amortization: asum, interest: isum, principal: psum });

        res.data?.payments.map((key) => {
          let t = { ...totals };
          let p = t.payments + key.amount;
          setTotals({ ...totals, payments: p });
        });
      });
    });
  };

  const calculate = (type) => {
    let sum = 0;
    if (type === 'payments') {
      loan.payments?.map((key) => {
        sum = sum + key.amount;
      });
    } else {
      loan.statements?.map((key) => {
        sum = sum + key[type];
      });
    }

    return sum;
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
      doc.save(`${user.name}_loan_statement.pdf`);
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
          <h3>Loan Statement</h3>
        </div>
        <b>Name:</b> {loan.user?.name} <br />
        <b>Amount Loan:</b> {loan.loan_amount?.toLocaleString()} <br />
        <b>Referrence Number:</b>
        {loan.code} <br />
        <b>Loan Type:</b> {loan.type} <br />
        <Table striped bordered hover size='sm' className='text-center mt-5'>
          <thead>
            <tr>
              <th>Applicable Month</th>
              <th>Due Date</th>
              <th colSpan={4}>Amount</th>
              <th>Outstanding Principal Balance</th>
              <th>Status</th>
            </tr>
            <tr>
              <th />
              <th />
              <th>Amortization</th>
              <th>Interest</th>
              <th>Principal</th>
              <th>Semi Gross Interest</th>
              <th>Semi Monthly Amortization</th>
              <th>Penalty</th>
              <th />
              <th />
            </tr>
            <tr>
              <th colSpan={8} />
              <th> {loan.loan_amount?.toLocaleString()}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loan.statements?.map((key, index) => (
              <tr key={index}>
                <td>{key.month}</td>
                <td>{DateTime.fromISO(key.due_date).toFormat('yyyy-MM-dd')}</td>
                <td> {key.principal.toLocaleString()}</td>
                <td> {key.interest.toLocaleString()}</td>
                <td> {key.amortization.toLocaleString()}</td>
                <td>{(calculate('interest') / loan.months_to_pay).toLocaleString()}</td>
                <td>
                  {(calculate('amortization') / loan.months_to_pay).toFixed(2).toLocaleString()}
                </td>
                <td> {key.penalty?.toLocaleString() || 0}</td>
                <td> {key.outstanding.toLocaleString()}</td>
                <td>{key.status}</td>
              </tr>
            ))}
            <tr>
              <th colSpan={2}>Total</th>
              <th> {calculate('principal').toLocaleString()}</th>
              <th> {calculate('interest').toLocaleString()}</th>
              <th> {calculate('amortization').toLocaleString()}</th>
              <th> {calculate('interest').toLocaleString()}</th>
              <th> {calculate('amortization').toLocaleString()}</th>
              <th> {calculate('penalty').toLocaleString()}</th>
              <th colSpan={3} />
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};
