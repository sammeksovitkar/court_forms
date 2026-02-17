import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const performLocalFilter = (data, searchTerm) => {
  if (!searchTerm) return data;
  const lowerSearch = searchTerm.toLowerCase();
  return data.filter((row) =>
    Object.values(row).some((val) => String(val || "").toLowerCase().includes(lowerSearch))
  );
};

function Kharda() {
  const api = "http://localhost:5000";
  const initialForm = { caseNo: "", stage: "", order: "", writtenStatement: "", issue: "", partHurd: "", judgement: "", other: "", date: "" };

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [searchTerm, setSearchTerm] = useState("");
  
  // UI States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [printData, setPrintData] = useState([]);
  const [printTitle, setPrintTitle] = useState("");

  const contentRef = useRef(null);

  const getCategory = (caseNo) => {
    const c = String(caseNo).toUpperCase();
    if (c.includes("RCS") || c.includes("CMA") || c.includes("DARKHAST")) return "Civil";
    return "Criminal";
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/data`);
      if (Array.isArray(res.data)) {
        const formatted = res.data.slice(1).map((row, index) => ({
          id: index + 2,
          caseNo: row[0] || "",
          stage: row[1] || "",
          order: row[2] || "",
          writtenStatement: row[3] || "",
          issue: row[4] || "",
          partHurd: row[5] || "",
          judgement: row[6] || "",
          other: row[7] || "",
          date: row[8] || "",
          category: getCategory(row[0] || "")
        }));
        setAllData(formatted);
        setFilteredData(performLocalFilter(formatted, searchTerm));
      }
    } catch (err) { console.error(err); }
  }, [searchTerm]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: printTitle,
  });

  const printCategorizedCases = (dateStr, category) => {
    const targetRecords = allData.filter(item => item.date === dateStr && item.category === category);
    if (targetRecords.length > 0) {
      const [year, month, day] = dateStr.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      setPrintData(targetRecords);
      setPrintTitle(`${category} Case Board - ${formattedDate}`);
      setTimeout(() => {
        if (contentRef.current) handlePrint();
      }, 500);
    } else {
      alert("No records found to print.");
    }
  };

  // Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${api}/update/${editId}`, form);
      } else {
        await axios.post(`${api}/add`, form);
      }
      setShowFormModal(false);
      setForm(initialForm);
      fetchData();
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Error saving record. Check console.");
    }
  };

  // Calendar Logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const changeYear = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + offset);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const grid = [];
    for (let i = 0; i < startDay; i++) grid.push(<div key={`e-${i}`} style={styles.calCellEmpty}></div>);

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayCases = allData.filter(item => item.date === dateStr);
      const civil = dayCases.filter(c => c.category === "Civil").length;
      const criminal = dayCases.filter(c => c.category === "Criminal").length;
      const isSun = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0;

      grid.push(
        <div key={day} style={styles.calCell}>
          <div style={styles.dayHeader}>
            <b>{day}</b> 
            {isSun && <span style={{color:'red', fontSize: '10px'}}>Weekly Off</span>}
          </div>
          <div style={styles.badgeContainer}>
            {civil > 0 && (
              <div onClick={(e) => { e.stopPropagation(); printCategorizedCases(dateStr, "Civil"); }} style={styles.blueBar}>
                Civil {civil}
              </div>
            )}
            {criminal > 0 && (
              <div onClick={(e) => { e.stopPropagation(); printCategorizedCases(dateStr, "Criminal"); }} style={styles.darkBlueBar}>
                Criminal {criminal}
              </div>
            )}
          </div>
        </div>
      );
    }
    return grid;
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2>📋 Kharda Dashboard</h2>
        <div style={{display:'flex', gap:'10px'}}>
          <button style={styles.calTriggerBtn} onClick={() => setShowCalendarModal(true)}>📅 Open Calendar</button>
          <button style={styles.addButton} onClick={() => { setEditId(null); setForm(initialForm); setShowFormModal(true); }}>+ Add Entry</button>
        </div>
      </div>

      {/* Main Table View */}
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr><th>Case No</th><th>Stage</th><th>Order</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {allData.map(row => (
            <tr key={row.id} style={styles.tr}>
              <td><b>{row.caseNo}</b></td><td>{row.stage}</td><td>{row.order}</td><td>{row.date}</td>
              <td>
                <button onClick={() => { setEditId(row.id); setForm(row); setShowFormModal(true); }} style={styles.editBtn}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📅 Calendar Modal */}
      {showCalendarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.calendarModalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.calControls}>
                <button onClick={() => changeYear(-1)} style={styles.navBtn}>« Prev</button>
                <select value={currentDate.getMonth()} onChange={handleMonthChange} style={styles.select}>
                  {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <span style={{fontSize:'20px', fontWeight:'bold'}}>{currentDate.getFullYear()}</span>
                <button onClick={() => changeYear(1)} style={styles.navBtn}>Next »</button>
              </div>
              <button onClick={() => setShowCalendarModal(false)} style={styles.closeBtn}>Close</button>
            </div>
            <div style={styles.calendarContainer}>
               <div style={styles.weekHeaderGrid}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} style={styles.weekDay}>{d}</div>)}</div>
               <div style={styles.calendarGrid}>{renderCalendar()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Add/Edit Entry Modal */}
      {showFormModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.formModalContent}>
            <h3 style={{ marginTop: 0 }}>{editId ? "Edit Case" : "Add New Case"}</h3>
            <form onSubmit={handleSubmit} style={styles.gridForm}>
              {Object.keys(initialForm).map((key) => (
                <div key={key} style={styles.inputGroup}>
                  <label style={styles.label}>{key.toUpperCase()}</label>
                  <input 
                    type={key === "date" ? "date" : "text"} 
                    name={key} 
                    value={form[key]} 
                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                    style={styles.input} 
                    required={key === "caseNo" || key === "date"}
                  />
                </div>
              ))}
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowFormModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🖨️ Hidden Print Template */}
      <div style={{ display: "none" }}>
        <div ref={contentRef} style={styles.printContainer}>
          {printData.length > 0 && (
            <>
              <div style={{ marginBottom: '10px', paddingBottom: '10px' }}>
                <h2 style={{ textAlign: 'center', textDecoration: 'underline', margin: '0 0 15px 0', fontSize: '24px' }}>{printTitle}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                  <span>Start Time: ________________</span>
                  <span>End Time: ________________</span>
                </div>
                <div style={{ borderBottom: '3px solid black', marginTop: '15px' }}></div>
              </div>
              <table style={styles.printTable}>
                <thead>
                  <tr style={{ backgroundColor: '#eeeeee' }}>
                    <th style={{ ...styles.printTableCell, width: '15%' }}>Case No</th>
                    <th style={{ ...styles.printTableCell, width: '12%' }}>Stage</th>
                    <th style={{ ...styles.printTableCell, width: '13%' }}>Order</th>
                    <th style={{ ...styles.printTableCell, width: '10%' }}>W/S</th>
                    <th style={{ ...styles.printTableCell, width: '10%' }}>Issues</th>
                    <th style={{ ...styles.printTableCell, width: '12%' }}>Judgement</th>
                    <th style={{ ...styles.printTableCell, width: '28%' }}>Other Information</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.map((c, i) => (
                    <tr key={i}>
                      <td style={{ ...styles.printTableCell, fontWeight: 'bold' }}>{c.caseNo}</td>
                      <td style={styles.printTableCell}>{c.stage}</td>
                      <td style={styles.printTableCell}>{c.order}</td>
                      <td style={styles.printTableCell}>{c.writtenStatement}</td>
                      <td style={styles.printTableCell}>{c.issue}</td>
                      <td style={styles.printTableCell}>{c.judgement}</td>
                      <td style={styles.printTableCell}>{c.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>__________________________</p>
                  <p style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}>Seal / Signature of Authority</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "sans-serif" },
  topBar: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  calTriggerBtn: { padding: "10px 20px", backgroundColor: "#6f42c1", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  addButton: { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f8f9fa", textAlign: "left" },
  tr: { borderBottom: "1px solid #eee" },
  editBtn: { backgroundColor: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  calendarModalContent: { backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "95vw", height: "90vh", overflowY: "auto" },
  formModalContent: { backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "600px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  calControls: { display: "flex", gap: "10px", alignItems: "center" },
  select: { padding: "8px" },
  navBtn: { padding: "8px 12px", cursor: "pointer" },
  closeBtn: { backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" },
  calendarContainer: { border: "1px solid #ddd" },
  weekHeaderGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", backgroundColor: "#f0f0f0" },
  weekDay: { padding: "10px", textAlign: "center", fontWeight: "bold", borderRight: "1px solid #ddd" },
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" },
  calCell: { borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd", minHeight: "120px", padding: "5px" },
  calCellEmpty: { borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" },
  dayHeader: { display: "flex", justifyContent: "space-between", fontSize: "14px" },
  badgeContainer: { display: "flex", flexDirection: "column", gap: "4px", marginTop: "10px" },
  blueBar: { backgroundColor: "#3a87ad", color: "white", padding: "4px", fontSize: "12px", borderRadius: "3px", cursor: "pointer" },
  darkBlueBar: { backgroundColor: "#2c3e50", color: "white", padding: "4px", fontSize: "12px", borderRadius: "3px", cursor: "pointer" },
  gridForm: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: "12px", fontWeight: "bold", marginBottom: "4px" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
  modalActions: { gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" },
  saveBtn: { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  printContainer: {
    padding: "20px 40px",
    fontFamily: "'Times New Roman', Times, serif",
    color: "black",
    backgroundColor: "white",
    width: "100%",
  },
  printTable: {
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid black",
    tableLayout: "fixed",
  },
  printTableCell: {
    padding: "12px 6px",
    border: "1px solid black",
    textAlign: "center",
    fontSize: "13px",
    wordWrap: "break-word",
    verticalAlign: "middle",
  }
};

export default Kharda;
