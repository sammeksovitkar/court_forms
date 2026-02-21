import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Kharda = () => {
  const [rawData, setRawData] = useState([]);
  const [selection, setSelection] = useState({ start: '', end: '', all: false });
  const [caseType, setCaseType] = useState('civil'); 
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
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

        let rawDate = getVal(['Next Date', 'Date']);
        let formattedDate = null;

        if (rawDate instanceof Date) {
          formattedDate = rawDate;
        } else if (typeof rawDate === 'string') {
          const parts = rawDate.split(/[-/]/);
          if (parts.length === 3) {
            formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }

        return {
          caseNum: getVal(['Cases', 'Case Number', 'Case']),
          nextDate: formattedDate,
          purpose: getVal(['Next Purpose', 'Purpose'])
        };
      }).filter(item => item.caseNum && item.nextDate);

      setRawData(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  // Helper logic for categorization
  const getStageCategory = (purpose) => {
    const p = String(purpose).toLowerCase();
    if (p.includes('judgment') || p.includes('order')) return 'Judgment';
    if (p.includes('argument')) return 'Arguments';
    if (p.includes('part heard')) return 'Evidence PH';
    if (p.includes('evidence') || p.includes('witness')) return 'Evidence';
    if (p.includes('issue')) return 'Issues';
    if (p.includes('hearing') || p.includes('say') || p.includes('compliance') || 
        p.includes('summons') || p.includes('notice') || p.includes('citation') || 
        p.includes('steps') || p.includes('awaiting') || p.includes('amended')) return 'Hearing';
    return 'Other';
  };

  const filteredData = useMemo(() => {
    if (selection.all) return rawData;
    if (!selection.start || !selection.end) return [];

    const startDate = new Date(selection.start);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(selection.end);
    endDate.setHours(23,59,59,999);

    return rawData.filter(item => {
      const d = item.nextDate;
      return d >= startDate && d <= endDate;
    });
  }, [rawData, selection]); // Dependencies fixed

  const generatePDF = () => {
    if (filteredData.length === 0) return alert("No records selected!");
    setIsLoading(true);
    
    setTimeout(() => {
      const doc = new jsPDF('p', 'mm', 'a4');
      let currentY = 15;

      const dateGroups = filteredData.reduce((acc, row) => {
        const dStr = row.nextDate.toLocaleDateString('en-GB').replace(/\//g, '-');
        if (!acc[dStr]) acc[dStr] = [];
        acc[dStr].push(row);
        return acc;
      }, {});

      Object.keys(dateGroups).forEach((dateKey) => {
        const records = dateGroups[dateKey];
        const stageGroups = { 'Judgment': [], 'Arguments': [], 'Hearing': [], 'Evidence': [], 'Evidence PH': [], 'Issues': [], 'Other': [] };
        
        records.forEach(r => {
          const cat = getStageCategory(r.purpose);
          stageGroups[cat].push(r.caseNum);
        });

        const maxRows = Math.max(...Object.values(stageGroups).map(arr => arr.length));
        if (currentY + (maxRows * 8) > 270) { doc.addPage(); currentY = 15; }

        doc.setFontSize(10).setFont("helvetica", "bold");
        doc.text(`DATE: ${dateKey} (${caseType.toUpperCase()})`, 14, currentY);
        currentY += 5;

        let head = [['Judgment', 'Arguments', 'Hearing', 'Evidence', 'Evid. PH']];
        if (caseType === 'civil') head[0].push('Issues');
        head[0].push('Other');

        const body = [];
        for (let i = 0; i < maxRows; i++) {
          let row = [
            stageGroups['Judgment'][i] || '', 
            stageGroups['Arguments'][i] || '', 
            stageGroups['Hearing'][i] || '', 
            stageGroups['Evidence'][i] || '', 
            stageGroups['Evidence PH'][i] || ''
          ];
          if (caseType === 'civil') row.push(stageGroups['Issues'][i] || '');
          row.push(stageGroups['Other'][i] || '');
          body.push(row);
        }

        autoTable(doc, {
          startY: currentY,
          head: head,
          body: body,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5, halign: 'center' },
          headStyles: { fillColor: [230, 230, 230], textColor: 0, lineWidth: 0.1 },
          didDrawPage: (data) => { currentY = data.cursor.y + 10; }
        });
      });

      doc.save(`Compact_Diary_${caseType}.pdf`);
      setIsLoading(false);
    }, 100);
  };

  return (
    <div style={styles.container}>
      {isLoading && <div style={styles.loader}>Generating...</div>}
      <div style={styles.card}>
        <h2 style={{textAlign: 'center', fontSize: '20px'}}>Diary Book Generator</h2>
        
        <div style={styles.uploadArea}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {rawData.length > 0 && <p style={{color: 'green', margin: '5px 0 0 0'}}>✓ {rawData.length} cases loaded</p>}
        </div>

        {rawData.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <div style={styles.radioGroup}>
              <label><input type="radio" checked={caseType === 'civil'} onChange={() => setCaseType('civil')} /> Civil</label>
              <label style={{marginLeft: '15px'}}><input type="radio" checked={caseType === 'criminal'} onChange={() => setCaseType('criminal')} /> Criminal</label>
            </div>

            <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, start: e.target.value, all: false})} />
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, end: e.target.value, all: false})} />
            </div>

            <button onClick={() => setSelection(prev => ({...prev, all: !prev.all}))} style={selection.all ? styles.btnActive : styles.btnSec}>
              {selection.all ? "Custom Date Range Mode" : "Select All Records"}
            </button>

            <div style={styles.statBox}>
              Records found: <b>{filteredData.length}</b>
            </div>

            <button onClick={generatePDF} disabled={filteredData.length === 0} style={styles.btnPrimary}>
              Download Compact PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  card: { background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '380px' },
  radioGroup: { display: 'flex', justifyContent: 'center', marginBottom: '15px', fontWeight: 'bold' },
  uploadArea: { border: '2px dashed #ccc', padding: '15px', textAlign: 'center', borderRadius: '5px' },
  input: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' },
  btnPrimary: { width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnSec: { width: '100%', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' },
  btnActive: { width: '100%', padding: '10px', background: '#eef', border: '1px solid #3498db', borderRadius: '5px', marginBottom: '10px' },
  statBox: { padding: '10px', background: '#f9f9f9', textAlign: 'center', marginBottom: '10px', borderRadius: '5px' },
  loader: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }
};

export default CourtDiaryFinalFix;
