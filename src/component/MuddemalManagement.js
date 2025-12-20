import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

// --- CONFIGURATION ---
// Base URL for your Node.js/Express backend
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL+'/api/assets'; 

// Field definitions for the form and table, matching your backend API keys
const FIELDS = {
    // Keys match the cleaned up keys used in the frontend and the backend's JSON response
    gmrVmrNo: 'GMR / VMR NO',
    caseNo: 'Case No',
    firyadicheName: 'फिर्यादीचे नांव', // Frontend label adjustment for display
    aropicheName: 'आरोपीचे नांव',
    varnan: 'वर्णन',
    kimmat: 'किंमत',
    nextDate: 'Next Date',
    decidedDate: 'Decided Date',
};

// --- MODAL COMPONENT (Add/Edit Form with Barcode) ---
const MuddemalForm = ({ isModalOpen, currentAsset, onClose, onSaveSuccess }) => {
    // Initialize form state with current asset data or empty values for new asset
    const [formData, setFormData] = useState(currentAsset || {});
    const [qrCodeData, setQrCodeData] = useState(null); // Stores the final ID for QR code
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!currentAsset;

    // Effect to reset/initialize form state when modal opens/closes
    useEffect(() => {
        if (isModalOpen) {
            setFormData(currentAsset || getDefaultFormData());
            // If viewing an existing asset (Show Barcode), set the QR code data immediately
            if (currentAsset && currentAsset.gmrVmrNo) {
                setQrCodeData(currentAsset.gmrVmrNo);
            } else {
                 setQrCodeData(null);
            }
        }
    }, [isModalOpen, currentAsset]);

    const getDefaultFormData = () => ({
        gmrVmrNo: '',
        caseNo: '',
        firyadicheName: '',
        aropicheName: '',
        varnan: '',
        kimmat: '',
        nextDate: '',
        decidedDate: '',
    });

    if (!isModalOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setQrCodeData(null);

        const url = isEditMode 
            ? `${API_BASE_URL}/${formData.gmrVmrNo}`
            : API_BASE_URL;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await axios({ method, url, data: formData });
            // Get the GMR / VMR NO returned by the backend after successful save
            const savedGmrVmrNo = response.data.gmrVmrNo || formData.gmrVmrNo;
            
            // 1. Generate Barcode/QR Code after successful save
            setQrCodeData(savedGmrVmrNo);

            // 2. Notify parent component to refresh the list
            onSaveSuccess();

        } catch (error) {
            console.error('Submission Error:', error.response ? error.response.data : error.message);
            alert(`Failed to save asset: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // The data encoded in the QR code (Assuming a public-facing URL for asset info)
   const qrCodeValue = qrCodeData 
    ? `${window.location.origin}/asset-view/${qrCodeData}` 
    : 'Save the asset to generate QR Code';
    // Simple window print function
    const handlePrint = () => {
        window.print(); 
    };
    
    // Simple inline modal styling (can be moved to a CSS file)
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };
    const contentStyle = {
        maxWidth: '650px',
        width: '90%',
        padding: '25px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        maxHeight: '80vh',
        overflowY: 'auto',
    };
    const formGridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
    };

    return (
        <div className="modal-backdrop" style={modalStyle}>
            <div className="modal-content" style={contentStyle}>
                <h3>{isEditMode ? '📝 Edit Muddemal Asset' : '➕ Add New Muddemal Asset'}</h3>
                
                <form onSubmit={handleSubmit} style={formGridStyle}>
                    
                    {Object.entries(FIELDS).map(([key, label]) => (
                        <div key={key}>
                            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '14px' }}>{label}:</label>
                            <input
                                type={key.includes('Date') ? 'date' : 'text'}
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleInputChange}
                                // GMR/VMR NO and Case No are required, GMR/VMR NO cannot be changed in edit mode
                                required={key === 'gmrVmrNo' || key === 'caseNo'} 
                                disabled={isEditMode && key === 'gmrVmrNo'} 
                                style={{ width: '95%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    ))}
                    
                    <div style={{ gridColumn: '1 / -1', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', minWidth: '150px' }}>
                            {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Asset' : 'Submit & Generate Barcode'}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>

                {/* QR Code Display Section - Conditionally rendered after successful save or when showing existing barcode */}
                {qrCodeData && (
                    <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <h4>{isEditMode ? 'Barcode for Asset:' : '✅ Asset Saved! Print Label for ID:'} **{qrCodeData}**</h4>
                        <QRCodeSVG value={qrCodeValue} size={180} level="H" />
                        <p style={{ fontSize: '12px', wordBreak: 'break-all', marginTop: '10px' }}>Scan to view data: **{qrCodeValue}**</p>
                        <button 
                            onClick={handlePrint} 
                            style={{ marginTop: '15px', padding: '10px 25px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            🖨️ Print Barcode/Label
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- MAIN MANAGEMENT COMPONENT ---
// ----------------------------------------------------------------------
const MuddemalManagement = () => {
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAsset, setCurrentAsset] = useState(null); // Asset data for editing/viewing

    // API call to fetch all assets from the backend
    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_BASE_URL); 
            // The data structure returned by GET /api/assets is { assets: [...] }
            setAssets(response.data.assets || []); 
        } catch (error) {
            console.error('Error fetching assets:', error);
            alert('Failed to fetch assets. Check console and backend API status.');
            setAssets([]); // Clear list on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleAddClick = () => {
        setCurrentAsset(null); // Clear any previous edit data
        setIsModalOpen(true);
    };

    const handleEdit = (asset) => {
        setCurrentAsset(asset);
        setIsModalOpen(true);
    };

    const handleDelete = async (gmrVmrNo) => {
        if (!window.confirm(`Are you sure you want to delete asset ${gmrVmrNo}?`)) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/${gmrVmrNo}`);
            alert(`Asset ${gmrVmrNo} deleted successfully.`);
            fetchAssets(); // Refresh list
        } catch (error) {
            console.error('Deletion Error:', error);
            alert(`Failed to delete asset: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleShowBarcode = (gmrVmrNo) => {
        // Find the asset and pass it to the modal
        const assetToView = assets.find(a => a.gmrVmrNo === gmrVmrNo);
        if (assetToView) {
            setCurrentAsset(assetToView); 
            setIsModalOpen(true); 
        }
    };

    const handleSaveSuccess = () => {
        fetchAssets(); // Reload data after save/update
        // Modal stays open to allow printing the QR code
    };
    
    const tableStyle = {
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left', 
        fontSize: '14px'
    };
    const cellStyle = { 
        padding: '12px 8px', 
        border: '1px solid #ddd', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis'
    };

    if (isLoading) return <div style={{padding: '20px'}}>⏳ Loading Muddemal Assets...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>👮 Muddemal Asset Management</h2>
            <button 
                onClick={handleAddClick} 
                style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                ➕ Add New Muddemal Asset
            </button>

            {/* --- LIST TABLE --- */}
            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            {Object.values(FIELDS).map(label => (
                                <th key={label} style={{ ...cellStyle, fontWeight: 'bold' }}>{label}</th>
                            ))}
                            <th style={{ ...cellStyle, width: '250px', minWidth: '250px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.length === 0 ? (
                            <tr>
                                <td colSpan={Object.keys(FIELDS).length + 1} style={{ ...cellStyle, textAlign: 'center' }}>
                                    No muddemal assets found. Click "Add New Muddemal Asset" to create one.
                                </td>
                            </tr>
                        ) : (
                            assets.map((asset, index) => (
                                <tr key={asset.gmrVmrNo || index} style={{ borderBottom: '1px solid #eee' }}>
                                    {Object.keys(FIELDS).map(key => (
                                        <td key={key} style={cellStyle}>{asset[key]}</td>
                                    ))}
                                    <td style={cellStyle}>
                                        <button onClick={() => handleEdit(asset)} style={{ marginRight: '5px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(asset.gmrVmrNo)} style={{ marginRight: '5px', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
                                        <button onClick={() => handleShowBarcode(asset.gmrVmrNo)} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Barcode</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL FOR ADD/EDIT/BARCODE --- */}
            <MuddemalForm
                isModalOpen={isModalOpen}
                currentAsset={currentAsset}
                onClose={() => setIsModalOpen(false)}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default MuddemalManagement;