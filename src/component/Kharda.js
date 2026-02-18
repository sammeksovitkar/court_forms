import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Kharda = () => {
  const [rawData, setRawData] = useState([]);
  const [selection, setSelection] = useState({ start: '', end: '', all: false });
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Robust Date Parsing for strings or Excel Date objects
  const parseDate = (input) => {
    if (input instanceof Date) return input;
    if (!input) return null;
    const parts = input.toString().split(/[-/]/);
    if (parts.length === 3) {
      // Assumes DD-MM-YYYY format from your Excel screenshot
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(input);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        const mappedData = json.map(row => {
          const getVal = (targets) => {
            const key = Object.keys(row).find(k => 
              targets.some(t => k.trim().toLowerCase() === t.toLowerCase())
            );
            return key ? row[key] : "";
          };

          return {
            caseNum: getVal(['Cases', 'Case Number', 'Case']),
            nextDate: getVal(['Next Date', 'Date']),
            purpose: getVal(['Next Purpose', 'Purpose'])
          };
        });

        setRawData(mappedData);
      } catch (err) {
        alert("Error reading Excel file. Please ensure it is a valid .xlsx file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredData = useMemo(() => {
    if (selection.all) return rawData;
    if (!selection.start || !selection.end) return [];

    const startDate = new Date(selection.start);
    const endDate = new Date(selection.end);

    return rawData.filter(item => {
      const d = parseDate(item.nextDate);
      return d && d >= startDate && d <= endDate;
    });
  }, [rawData, selection]);

  const generatePDF = () => {
    if (filteredData.length === 0) return alert("No records selected!");
    
    setIsLoading(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        let currentY = 20;

        // Group by Date String
        const groups = filteredData.reduce((acc, row) => {
          const d = parseDate(row.nextDate);
          const dStr = d ? d.toLocaleDateString('en-GB').replace(/\//g, '-') : "Unknown Date";
          if (!acc[dStr]) acc[dStr] = [];
          acc[dStr].push(row);
          return acc;
        }, {});

        // Sort dates chronologically
        const sortedDates = Object.keys(groups).sort((a, b) => {
          const toD = (s) => new Date(s.split('-').reverse().join('-'));
          return toD(a) - toD(b);
        });

        sortedDates.forEach((dateKey) => {
          const records = groups[dateKey];
          const dObj = new Date(dateKey.split('-').reverse().join('-'));
          const dayName = isNaN(dObj) ? "" : dObj.toLocaleDateString('en-US', { weekday: 'long' });

          // Start new page if only 25% of page is left
          if (currentY > 220) {
            doc.addPage();
            currentY = 20;
          }

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`DATE: ${dateKey} ${dayName ? `(${dayName.toUpperCase()})` : ""}`, 14, currentY);
          currentY += 6;
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Took Seat at: _________  Rise at: _________`, 14, currentY);
          currentY += 4;

          autoTable(doc, {
            startY: currentY,
            head: [['Case Number', 'Next Purpose']],
            body: records.map(r => [String(r.caseNum || ""), String(r.purpose || "")]),
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40] },
            styles: { fontSize: 9 },
            didDrawPage: (data) => { currentY = data.cursor.y + 12; }
          });

          doc.setFontSize(9);
          doc.text("Officer Signature: ____________________", 130, currentY);
          currentY += 15;
        });

        doc.save(`Court_Report_${new Date().getTime()}.pdf`);
      } catch (err) {
        alert("An error occurred while generating the PDF.");
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div style={styles.container}>
      {isLoading && <div style={styles.loader}>Processing Records... Please Wait</div>}
      <div style={styles.card}>
        <h2 style={{marginTop: 0, color: '#2c3e50'}}>Legal Diary System</h2>
        
        <div style={styles.uploadArea}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {rawData.length > 0 && (
              <p style={{color: '#27ae60', fontWeight: 'bold', marginTop: '10px'}}>
                ✓ {rawData.length.toLocaleString()} Records Loaded
              </p>
            )}
        </div>

        {rawData.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
              <div style={{flex: 1}}>
                <label style={styles.label}>Start Date</label>
                <input type="date" style={styles.input} onChange={e => setSelection(prev => ({...prev, start: e.target.value, all: false}))} />
              </div>
              <div style={{flex: 1}}>
                <label style={styles.label}>End Date</label>
                <input type="date" style={styles.input} onChange={e => setSelection(prev => ({...prev, end: e.target.value, all: false}))} />
              </div>
            </div>

            <button 
                onClick={() => setSelection(prev => ({...prev, all: !prev.all}))} 
                style={selection.all ? styles.btnActive : styles.btnSec}
            >
              {selection.all ? "Custom Range Active" : "Select All Records"}
            </button>

            <div style={styles.statBox}>
              Selected: <b>{filteredData.length.toLocaleString()} Records</b>
            </div>

            <button 
              onClick={generatePDF} 
              disabled={filteredData.length === 0} 
              style={filteredData.length > 0 ? styles.btnPrimary : styles.btnDisabled}
            >
              Download Professional PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '450px' },
  loader: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' },
  uploadArea: { border: '2px dashed #d1d5db', padding: '30px', textAlign: 'center', borderRadius: '12px', background: '#f9fafb' },
  label: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' },
  btnDisabled: { width: '100%', padding: '16px', background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontSize: '16px' },
  btnSec: { width: '100%', padding: '12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '15px', cursor: 'pointer', color: '#475569' },
  btnActive: { width: '100%', padding: '12px', background: '#eff6ff', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold' },
  statBox: { padding: '15px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', color: '#334155' }
};

export default Kharda;
