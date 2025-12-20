import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookList from './BookList';
import AddBookButton from './AddBookButton';
import BookForm from './BookForm';

// Helper function to perform local filtering (copied from the conceptual parent component)
const performLocalFilter = (data, classFilter, searchTerm) => {
    let filtered = data;
    const lowerSearch = searchTerm ? searchTerm.toLowerCase() : '';

    // 1. Class Filter
    if (classFilter && classFilter !== 'All') {
        filtered = filtered.filter(book => 
            // Ensures safety when comparing class values
            String(book.Class || '').toLowerCase() === classFilter.toLowerCase()
        );
    }

    // 2. General Search Filter (Local Search)
    if (lowerSearch) {
        filtered = filtered.filter(book => 
            // Check all relevant values for the search term
            Object.values(book).some(value => 
                String(value || '').toLowerCase().includes(lowerSearch)
            )
        );
    }

    return filtered;
};

function Liabrary() {
    // 🔑 NEW STATE: Holds the full, unfiltered dataset from the server (The local cache)
    const [allBooks, setAllBooks] = useState([]); 
    
    // Existing State: Now holds the currently filtered list being displayed
    const [books, setBooks] = useState([]); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);
    const api = process.env.REACT_APP_BACKEND_URL;

    // 🔑 UPDATED: Fetch Books Function - Fetches ALL books (no filters)
    const fetchBooks = useCallback(async () => { 
        setLoading(true);
        try {
            // CRITICAL CHANGE: Remove the query parameters. Fetch the FULL data list.
            // The backend MUST be updated to return the full list when no params are given.
            const response = await axios.get(api + `/api/books`);
           
            const fullData = response.data;
            setAllBooks(fullData); // Cache the full data
            
            // Apply current filters locally to display initially filtered data
            const initialFiltered = performLocalFilter(
                fullData, 
                selectedClass, 
                searchTerm
            );
            setBooks(initialFiltered);
            
        } catch (error) {
            console.error('Error fetching books:', error);
            setAllBooks([]); // Clear data on failure
            setBooks([]);
        } finally {
            setLoading(false);
        }
    // Only dependent on API URL. Search/Class filtering runs after the fetch.
    }, [api]); 

    // Initial load: Fetch the full list
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);
    
    // 🔑 NEW: Search Handler - Filters the local `allBooks` state, does NOT call the API.
    const handleSearch = (classQ, searchT) => { 
        // 1. Update the state for the selectors/inputs to reflect the change
        setSelectedClass(classQ);
        setSearchTerm(searchT); 
        
        // 2. Perform the filtering on the full cached data
        const filteredResult = performLocalFilter(allBooks, classQ, searchT);
        
        // 3. Update the display list
        setBooks(filteredResult);
    };

    // 🗑️ DELETE Handler
    const handleDelete = async (srNo) => {
        if (!window.confirm(`Are you sure you want to delete the book with SrNo: ${srNo}?`)) {
            return;
        }
        try {
            await axios.delete(api+`/api/books/${srNo}`);
            alert(`Book ${srNo} deleted successfully!`);
            // 🔑 CRITICAL FIX: Re-fetch ALL books to refresh the cache after modification
            fetchBooks(); 
        } catch (error) {
            alert(`Error deleting book: ${error.response?.data?.message || 'Server error.'}`);
            console.error('Delete error:', error);
        }
    };
    
    // ✏️ EDIT Handlers
    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditing(true);
    };

    const handleSaveEdit = async (updatedData) => {
        console.log(updatedData,"sdf")
        try {
            await axios.put(api+`/api/books/${updatedData.SrNo}`, updatedData);
            alert(`Book ${updatedData.SrNo} updated successfully!`);
            setIsEditing(false);
            setBookToEdit(null);
            // 🔑 CRITICAL FIX: Re-fetch ALL books to refresh the cache after modification
            fetchBooks(); 
            console.log("ccc")
        } catch (error) {
            //  alert(`Error updating book: ${error.response?.data?.message || 'Server error.'}`);
             console.error('Update error:', error);
        }
    };
    
    // ➕ Placeholder for Import
    const handleImport = () => {
        alert('The Import facility is currently a placeholder. It requires backend support.');
    };
    
    // Function to run after a new book is added (via AddBookButton/BookForm)
    const handleBookAdded = () => {
        // 🔑 CRITICAL FIX: Re-fetch ALL books to refresh the cache after addition
        fetchBooks();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <hr style={{ border: '1px solid #ddd' }}/>
            
            {/* ADD BOOK BUTTON AT THE TOP */}
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                {/* 🔑 Pass the new refresh handler */}
                <AddBookButton onBookAdded={handleBookAdded} /> 
            </div>

            {/* BOOK LIST COMPONENT */}
            <BookList
                books={books} // This is the filtered list
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                handleSearch={handleSearch} // This is the new local search function
                handleImport={handleImport}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
            />

            {/* Edit Modal remains here */}
            {isEditing && bookToEdit && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                }}>
                    <BookForm
                        initialBook={bookToEdit}
                        onBookUpdated={handleSaveEdit}
                        onClose={() => setIsEditing(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default Liabrary;