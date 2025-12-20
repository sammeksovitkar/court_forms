// /frontend/src/Component/BookList.js
import React from 'react';

// 🔑 DISPLAY HEADERS
const headers = ['Class', 'Book Name', 'Writer','Volume', 'Date', 
  // 'Price', 
  'Reader', 'Room', ];
const classOptions = ['All', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII(A)',"VII(B)","VII(C)"];

// 🔑 MAP HEADERS → DATA KEYS
const dataKeyMap = {
  'Class': 'Class',
  'Book Name': 'Book Name',
  'Writer': 'Writer',
  'Volume': 'Volume',
  'Date': 'Date',
  // 'Price': 'Book Price',
  'Reader': 'Reader',
  'Room': 'Room',
  
};

// 🎨 STYLES
const containerStyle = {
  padding: '25px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  fontFamily: 'Inter, sans-serif',
};

const headerBarStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '20px',
};

const buttonBase = {
  padding: '10px 18px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.2s ease',
};

const tableContainerStyle = {
  overflowX: 'auto',
  overflowY: 'auto',
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  maxHeight: '480px',
};

const thStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8fafc',
  textAlign: 'left',
  fontWeight: 600,
  color: '#333',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  fontSize: '14px',
  color: '#444',
};

function BookList({
  books,
  loading,
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleImport,
  handleEditClick,
  handleDelete,
  selectedClass,
  setSelectedClass
}) {

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    handleSearch(newClass, searchTerm);
  };

  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSearch(selectedClass, newSearchTerm);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#222', marginBottom: '15px' }}>📚 Book Inventory <span style={{ color: '#007bff' }}>({books.length} Books)</span></h2>

      {/* Filters and Actions */}
      <div style={headerBarStyle}>
        <select
          value={selectedClass}
          onChange={handleClassChange}
          style={{
            padding: '10px 14px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          {classOptions.map(cls => (
            <option key={cls} value={cls}>
              {cls === 'All' ? 'All Classes' : `Class ${cls}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 Search by name, SrNo, etc."
          value={searchTerm}
          onChange={handleSearchTermChange}
          style={{
            padding: '10px 14px',
            flexGrow: 1,
            minWidth: '200px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />

        <button
          onClick={() => { setSelectedClass('All'); setSearchTerm(''); handleSearch('All', ''); }}
          style={{ ...buttonBase, backgroundColor: '#6c757d', color: 'white' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5a6268'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6c757d'}
        >
          Clear
        </button>

        <button
          onClick={handleImport}
          style={{ ...buttonBase, backgroundColor: '#007bff', color: 'white' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0069d9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          ⬆️ Import
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.1em', padding: '30px', color: '#555' }}>
          ⏳ Loading books... Please wait.
        </p>
      ) : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '60px', textAlign: 'center' }}>S_No</th>
                {headers.map(header => (
                  <th key={header} style={thStyle}>{header}</th>
                ))}
                <th style={{ ...thStyle, width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book, index) => (
                  <tr
                    key={book.SrNo || index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafc',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eef4ff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafc'}
                  >
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{index + 1}</td>
                    {headers.map(header => {
                      const dataKey = dataKeyMap[header];
                      const displayValue = book[dataKey] ?? '';
                      return <td key={header} style={tdStyle}>{displayValue}</td>;
                    })}
                    <td style={{ ...tdStyle, textAlign: 'center' ,display:"flex"}} >
                      <button
                        onClick={() => handleEditClick(book)}
                        style={{
                          ...buttonBase,
                          padding: '6px 10px',
                          backgroundColor: '#ffc107',
                          color: '#000',
                          fontSize: '10px',
                        }}
                      >
                        ✏️ 
                      </button>
                      <button
                        onClick={() => handleDelete(book.SrNo)}
                        style={{
                          ...buttonBase,
                          padding: '6px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          fontSize: '10px',
                          marginLeft: '6px',
                        }}
                      >
                        🗑️ 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length + 2} style={{ textAlign: 'center', padding: '25px', color: '#888' }}>
                    ❌ No books found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookList;
