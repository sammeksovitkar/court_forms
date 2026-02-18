import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Kharda = () => {
  const [rawData, setRawData] = useState([]);
  const [selection, setSelection] = useState({ start: '', end: '', all: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      // --- FIX: EXACT COLUMN MAPPING BASED ON YOUR IMAGE ---
      const mappedData = json.map(row => {
        // We trim and check for your specific column headers
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
    };
    reader.readAsBinaryString(file);
  };

  const filteredData = useMemo(() => {
    if (selection.all) return rawData;
    if (!selection.start || !selection.end) return [];

    const startDate = new Date(selection.start);
    const endDate = new Date(selection.end);

    return rawData.filter(item => {
      if (!item.nextDate) return false;
      let d = item.nextDate instanceof Date 
        ? item.nextDate 
        : new Date(item.nextDate.toString().split(/[-/]/).reverse().join('-'));
      return d >= startDate && d <= endDate;
    });
  }, [rawData, selection]);

  const generatePDF = () => {
    if (filteredData.length === 0) return alert("No records selected!");
    
    setIsLoading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      let currentY = 20;

      // Group by Date
      const groups = filteredData.reduce((acc, row) => {
        const dStr = row.nextDate instanceof Date 
          ? row.nextDate.toLocaleDateString('en-GB').replace(/\//g, '-') 
          : row.nextDate.toString().trim();
        if (!acc[dStr]) acc[dStr] = [];
        acc[dStr].push(row);
        return acc;
      }, {});

      // Sort dates and build PDF
      Object.keys(groups).sort((a,b) => {
        const toD = (s) => new Date(s.split('-').reverse().join('-'));
        return toD(a) - toD(b);
      }).forEach((dateKey) => {
        const records = groups[dateKey];
        const dayName = new Date(dateKey.split('-').reverse().join('-'))
                        .toLocaleDateString('en-US', { weekday: 'long' });

        if (currentY > 230) { doc.addPage(); currentY = 20; }

        // HEADER
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`DATE: ${dateKey} (${dayName.toUpperCase()})`, 14, currentY);
        currentY += 6;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Took Seat at: _________  Rise at: _________`, 14, currentY);
        currentY += 4;

        // TABLE - Using the exact mapped keys
        autoTable(doc, {
          startY: currentY,
          head: [['Case Number', 'Next Purpose']],
          body: records.map(r => [String(r.caseNum), String(r.purpose)]),
          theme: 'grid',
          headStyles: { fillColor: [40, 40, 40] },
          styles: { fontSize: 9 },
          didDrawPage: (data) => { currentY = data.cursor.y + 12; }
        });

        doc.text("Officer Signature: ____________________", 130, currentY);
        currentY += 15;
      });

      doc.save("Legal_Diary_Report.pdf");
      setIsLoading(false);
    }, 100);
  };

  return (
    <div style={styles.container}>
      {isLoading && <div style={styles.loader}>Generating PDF... Please Wait</div>}
      <div style={styles.card}>
        <h2 style={{marginTop: 0}}>Court Diary Generator</h2>
        <div style={styles.uploadArea}>
            <input type="file" accept=".xlsx" onChange={handleFileUpload} />
            {rawData.length > 0 && <p style={{color: 'green'}}>✓ {rawData.length} Records Loaded</p>}
        </div>

        {rawData.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, start: e.target.value, all: false})} />
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, end: e.target.value, all: false})} />
            </div>
            <button 
                onClick={() => setSelection({...selection, all: !selection.all})} 
                style={selection.all ? styles.btnActive : styles.btnSec}
            >
              {selection.all ? "Custom Range Mode" : "Select All Records"}
            </button>
            <div style={styles.statBox}>
              Selected: <b>{filteredData.length} Records</b>
            </div>
            <button onClick={generatePDF} disabled={filteredData.length === 0} style={styles.btnPrimary}>
              Download Professional PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#f4f4f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial' },
  card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', width: '400px' },
  loader: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' },
  uploadArea: { border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '8px' },
  input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' },
  btnPrimary: { width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnSec: { width: '100%', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' },
  btnActive: { width: '100%', padding: '10px', background: '#e7f3ff', border: '1px solid #3498db', color: '#3498db', borderRadius: '8px', marginBottom: '10px', fontWeight: 'bold' },
  statBox: { padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }
};

export default Kharda;
