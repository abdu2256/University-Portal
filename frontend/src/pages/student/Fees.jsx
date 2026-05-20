import React, { useEffect, useState } from 'react';
import { getFee } from '../../services/api';

const DEMO = [
  { semesterName:'Spring 2025', totalAmount:72500, paidAmount:72500, status:'paid', paidDate:'2025-01-18', challanNo:'29847',
    breakdown:[{description:'Tuition Fee',amount:54000},{description:'Registration Fee',amount:5000},{description:'Lab Charges',amount:8000},{description:'Library Fee',amount:2500},{description:'Student Activity Fund',amount:3000}] },
  { semesterName:'Fall 2024',   totalAmount:68000, paidAmount:68000, status:'paid', paidDate:'2024-09-05', challanNo:'28341', breakdown:[] },
  { semesterName:'Spring 2024', totalAmount:65000, paidAmount:65000, status:'paid', paidDate:'2024-01-20', challanNo:'26102', breakdown:[] },
];

export default function Fees() {
  const [fees, setFees]     = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getFee().then(r=>setFees(r.data.data)).catch(()=>setFees(DEMO)).finally(()=>setLoading(false)); }, []);
  const rows = fees.length ? fees : DEMO;
  const current = rows[0];

  return (
    <div>
      <div className="sec-header">Fee Statement</div>
      {current && (
        <div className="card" style={{marginBottom:14}}>
          <div className="card-title">{current.semesterName} — Current Semester</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:14}}>
            <div><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Total Fee</div><div style={{fontSize:28,fontWeight:700,color:'var(--teal-dark)'}}>Rs. {current.totalAmount?.toLocaleString()}</div></div>
            <div><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Status</div><div style={{fontSize:16,fontWeight:700,color:current.status==='paid'?'var(--success)':'var(--danger)'}}>{current.status==='paid'?'✓ Paid in Full':'⚠ Unpaid'}</div></div>
            <div><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Challan No</div><div style={{fontSize:16,fontWeight:600}}>{current.challanNo||'—'}</div><div style={{fontSize:11,color:'var(--text2)'}}>{current.paidDate?new Date(current.paidDate).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'}):''}</div></div>
          </div>
          {current.breakdown?.length>0 && (
            <table className="uni-table">
              <thead><tr><th>Description</th><th style={{textAlign:'right'}}>Amount (Rs.)</th><th style={{textAlign:'center'}}>Status</th></tr></thead>
              <tbody>
                {current.breakdown.map((b,i)=>(
                  <tr key={i}><td>{b.description}</td><td style={{textAlign:'right',fontWeight:500}}>{b.amount?.toLocaleString()}</td><td style={{textAlign:'center'}}><span className="pill pill-green">Paid</span></td></tr>
                ))}
                <tr style={{fontWeight:700}}><td>Total</td><td style={{textAlign:'right'}}>Rs. {current.totalAmount?.toLocaleString()}</td><td></td></tr>
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className="sec-header">Fee History</div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead><tr><th>Semester</th><th>Total Amount</th><th>Paid Amount</th><th>Challan No</th><th>Payment Date</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((f,i)=>(
              <tr key={i}>
                <td style={{fontWeight:600}}>{f.semesterName}</td>
                <td>Rs. {f.totalAmount?.toLocaleString()}</td>
                <td>Rs. {f.paidAmount?.toLocaleString()}</td>
                <td>{f.challanNo||'—'}</td>
                <td>{f.paidDate?new Date(f.paidDate).toLocaleDateString('en-PK'):'-'}</td>
                <td><span className={`pill ${f.status==='paid'?'pill-green':f.status==='partial'?'pill-amber':'pill-red'}`} style={{textTransform:'capitalize'}}>{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
