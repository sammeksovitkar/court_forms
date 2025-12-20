import React, { useState } from 'react';
import axios from 'axios';

// 🌟 MODERN OVERLAY STYLE
const MODAL_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease-out',
};

// 🌟 FORM CARD
const FORM_CARD_STYLE = {
  backgroundColor: '#fff',
  padding: '35px',
  borderRadius: '14px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  width: '95%',
  maxWidth: '700px',
  fontFamily: 'Inter, sans-serif',
};

// 🌟 GRID
const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '20px',
};

const FIELD_STYLE = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '14px',
  transition: '0.3s',
  outline: 'none',
};

const SUBMIT_BUTTON_STYLE = {
  width: '100%',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '10px',
  transition: 'background-color 0.2s',
};

// 🧩 FORM DATA DEFAULTS
const BASE_INITIAL_STATE = {
  'Class': '',
  'SrNo': '',
  'Book Name': '',
  'Volume': '',
  'Date': '',
  'Book Price': '',
  'Room': '',
  'Kapat': '',
  'other1': '',
  'Reader': '',
};

const REQUIRED_FIELDS = ['Class', 'Book Name', 'Book Price'];
const CLASS_OPTIONS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII(A)','VII(B)','VII(C)'];

// 🔧 Date utilities
const formatDateForBackend = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateString;
};
const formatDateForInput = (dateString) => {
  if (!dateString || !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return '';
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// 🌟 MAIN COMPONENT
export function BookForm({ initialBook = null, onBookAdded, onClose, onBookUpdated }) {
  const isEditMode = !!initialBook;
  const api = process.env.REACT_APP_BACKEND_URL;

  const initialState = initialBook
    ? { ...BASE_INITIAL_STATE, ...initialBook, Date: formatDateForInput(initialBook.Date) }
    : BASE_INITIAL_STATE;

  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formTitle = isEditMode ? `✏️ Edit Book (SrNo: ${initialBook.SrNo})` : '📚 Add New Book';
  const buttonText = isEditMode ? '💾 Save Changes' : '➕ Add Book';

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? e.target.value : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = REQUIRED_FIELDS.filter((f) => !formData[f]);
    if (missing.length) {
      setMessage(`⚠️ Please fill: ${missing.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setMessage(isEditMode ? 'Updating book...' : 'Adding book...');

    const dataToSend = { ...formData };
    if (dataToSend.Date) dataToSend.Date = formatDateForBackend(dataToSend.Date);

    try {
      if (isEditMode) {
        await axios.put(`${api}/api/books/${formData.SrNo}`, dataToSend);
        setMessage('✅ Book updated successfully!');
        onBookUpdated && onBookUpdated(); // 🔥 ensure list refreshes
      } else {
        delete dataToSend.SrNo;
        await axios.post(`${api}/api/books`, dataToSend);
        setMessage('✅ Book added successfully!');
        setFormData(BASE_INITIAL_STATE);
        onBookAdded && onBookAdded(); // 🔥 ensure list refreshes
      }

      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Server error'}`);
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={FORM_CARD_STYLE}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
          paddingBottom: '10px',
        }}
      >
        <h2 style={{ margin: 0, color: '#222' }}>{formTitle}</h2>
        <button
          onClick={onClose}
          style={{ border: 'none', background: 'none', fontSize: '26px', color: '#888', cursor: 'pointer' }}
        >
          &times;
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div style={GRID_STYLE}>
          {Object.keys(BASE_INITIAL_STATE).map((key) => {
            if (key === 'SrNo' && !isEditMode) return null;

            const isRequired = REQUIRED_FIELDS.includes(key);

            return (
              <div key={key}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px', color: '#333' }}>
                  {key}{' '}
                  {isRequired && <span style={{ color: 'red' }}>*</span>}
                  {!isRequired && <span style={{ color: '#999', fontWeight: 400 }}> (Optional)</span>}
                </label>

                {key === 'Class' ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={FIELD_STYLE}
                    disabled={isSubmitting}
                    required={isRequired}
                  >
                    <option value="">Select Class</option>
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        Class {cls}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      key === 'Volume' || key === 'Book Price' || key === 'SrNo'
                        ? 'number'
                        : key === 'Date'
                        ? 'date'
                        : 'text'
                    }
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    style={{
                      ...FIELD_STYLE,
                      backgroundColor: key === 'SrNo' ? '#f3f3f3' : '#fff',
                      color: '#333',
                    }}
                    readOnly={key === 'SrNo'}
                    placeholder={`Enter ${key}`}
                    required={isRequired}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          style={{ ...SUBMIT_BUTTON_STYLE, opacity: isSubmitting ? 0.6 : 1 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : buttonText}
        </button>

        {message && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '15px',
              color: message.startsWith('✅') ? 'green' : message.startsWith('⚠️') ? '#e67e22' : 'red',
              fontWeight: 'bold',
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

// 🌟 Add Button + Modal Wrapper
export function AddBookButton({ onBookAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '14px 28px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'block',
          margin: '20px auto',
          boxShadow: '0 4px 10px rgba(40,167,69,0.3)',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
      >
        ➕ Add New Book
      </button>

      {isModalOpen && (
        <div style={MODAL_STYLE}>
          <BookForm
            onBookAdded={() => {
              onBookAdded();
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}

export default BookForm;
