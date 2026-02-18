import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
    Menu, BarChart2, ChevronDown, ClipboardList, LogOut, 
    UserCircle, Lock, Gavel, Users
} from 'lucide-react'; 

// Component Imports
import SummonsFormInput from './component/SummonsFormInput';
import Placeholder from './component/Placeholder';
import DashboardOverview from './component/DashboardOverview';
import Liabrary from './component/Liabrary';
import NegotiableSummons from './component/NegotiableSummons';
import ArrestWarrantApp from './component/Arrestwarrant';
import MuddemalManagement from './component/MuddemalManagement';
import StaffInformationTable from './component/StaffInformationTable';
import AssetViewPage from './component/AssetViewPage'; 
import Kharda from './component/Kharda';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Access Route */}
                <Route path="/asset-view/:id" element={<AssetViewPage />} />
                {/* Main App Route */}
                <Route path="/" element={<MainDashboardLayout />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

const MainDashboardLayout = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
const [courtConfig, setCourtConfig] = useState({
        language: 'marathi',
        courtLevel: '',
        courtVillage: '',
        taluka: '',
        district: '',
        policeStation: '',
        fullOfficeName:''
    });
    const navItems = [
        { id: 'dashboard', name: 'मुख्य डॅशबोर्ड (Dashboard)', icon: <BarChart2 size={20} /> },
        { id: 'applications', name: 'अर्ज व्यवस्थापन (Applications)', icon: <ClipboardList size={20} /> },
        { id: 'stats', name: 'Kharda', icon: <BarChart2 size={20} /> },
        // { id: 'staff', name: 'कर्मचारी व्यवस्थापन (Staff)', icon: <BarChart2 size={20} /> },
        // { id: 'muddemal', name: 'मुद्देमाल व्यवस्थापन (Muddemal)', icon: <Users size={20} /> },
    ];

    const applicationForms = [
        { id: 'summons', name: 'समन्स / नोटीस (Summons/Notice)', component: SummonsFormInput },
        { id: 'warrant', name: 'समन्स अर्ज (NI 138)', component: NegotiableSummons },
        { id: 'warrant2', name: 'वॉरंट अर्ज (Warrant Application)', component: ArrestWarrantApp },
        // { id: 'muddemal', name: 'मुद्देमाल व्यवस्थापन (Muddemal)', component: MuddemalManagement },
    ];

    if (!isLoggedIn) {
        return <LoginPage onLogin={setIsLoggedIn} />;
    }
const updateCourtConfig = (newData) => {
        setCourtConfig(prev => ({ ...prev, ...newData }));
    };
   const renderContent = () => {
    const appForm = applicationForms.find(form => form.id === currentPage);
    
    // 1. Check if the current page is one of the Application forms
    if (appForm) {
        const FormComponent = appForm.component;
        return (
            <FormComponent 
                title={appForm.name} 
                courtConfig={courtConfig} 
                setCourtConfig={updateCourtConfig} // Pass function here!
            />
        );
    }
    
    // 2. Check other main pages
    switch (currentPage) {
        case 'dashboard': 
            return (
                <DashboardOverview 
                    courtConfig={courtConfig} 
                    setCourtConfig={updateCourtConfig} 
                />
            );
        case 'stats': 
            return <Kharda />;
        case 'staff': 
            return <StaffInformationTable title="कर्मचारी व्यवस्थापन" />;
        case 'muddemal': 
            return <MuddemalManagement title="मुद्देमाल व्यवस्थापन" />;
        default: 
            return (
                <DashboardOverview 
                    courtConfig={courtConfig} 
                    setCourtConfig={updateCourtConfig} 
                />
            );
    }
};

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('dashboard');
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans flex text-gray-800"> 
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .summons-content { font-family: 'Tinos', serif; }
                @media print {
                    @page { size: A4; margin: 15mm; }
                    .no-print { display: none !important; }
                    .a4-page { width: 100% !important; box-shadow: none !important; border: none !important; }
                }
            `}`</style>

            <div className={`fixed lg:relative w-64 min-h-screen bg-indigo-800 text-white z-20 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl`}>
                <div className="p-6 text-2xl font-extrabold border-b border-indigo-700 tracking-wider flex items-center bg-indigo-900">
                    <Gavel className="mr-3 text-teal-400" size={28} /> न्यायालय
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <React.Fragment key={item.id}>
                            <button onClick={() => { if (item.id === 'applications') setCurrentPage('summons'); else setCurrentPage(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center p-3 rounded-xl transition duration-200 text-left ${(currentPage === item.id && item.id !== 'applications') || (item.id === 'applications' && applicationForms.some(form => form.id === currentPage)) ? 'bg-teal-500 text-white shadow-lg font-bold' : 'hover:bg-indigo-700 text-indigo-100 hover:text-white'}`}>
                                {item.icon} <span className="ml-3 text-lg">{item.name}</span>
                                {item.id === 'applications' && <ChevronDown size={16} className="ml-auto" />}
                            </button>
                            {item.id === 'applications' && applicationForms.some(form => form.id === currentPage) && (
                                <div className="ml-6 mt-1 border-l-2 border-indigo-500 space-y-1">
                                    {applicationForms.map(form => (
                                        <button key={form.id} onClick={() => { setCurrentPage(form.id); setIsSidebarOpen(false); }}
                                            className={`w-full text-left p-2 rounded-r-lg transition duration-200 text-base ${currentPage === form.id ? 'bg-indigo-600 text-yellow-300 font-semibold' : 'hover:bg-indigo-700 text-indigo-200'}`}>
                                            <span className="ml-1">- {form.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    <div className="absolute bottom-4 w-full p-4">
                         <button className="w-full flex items-center p-3 rounded-xl transition duration-200 text-left hover:bg-indigo-700 text-indigo-200" onClick={handleLogout}>
                             <LogOut size={20} /> <span className="ml-3 text-lg">बाहेर पडा (Logout)</span>
                         </button>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow-lg p-4 sticky top-0 z-10 flex items-center justify-between no-print border-b border-gray-200">
                    <button className="lg:hidden p-2 rounded-lg text-indigo-600 hover:bg-gray-100 transition" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={28} /></button>
                    <h2 className="text-2xl font-bold text-gray-700 sm:ml-4">{navItems.find(item => item.id === currentPage)?.name || applicationForms.find(form => form.id === currentPage)?.name || 'मनमाड कोर्ट डॅशबोर्ड'}</h2>
                    <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition">
                        <UserCircle size={28} className="text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">उपयोगकर्ता (User ID)</span>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8">{renderContent()}</main>
                {/* <footer className="bg-white text-center p-3 text-xs text-gray-400 border-t mt-auto no-print"> &copy; {new Date().getFullYear()} </footer> */}
                            <footer className="bg-white text-center p-3 text-xs text-gray-400 border-t mt-auto no-print">Developed By Sammek Sovitkar (JR Clark Manmad City)</footer>

            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
};

// --- RESTORED ORIGINAL LOGIN PAGE DESIGN ---
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Uses your env variables or admin/admin default
        const validUser = process.env.REACT_APP_USER_NAME || "admin";
        const validPass = process.env.REACT_APP_PASSWORD || "admin";

        if (username === validUser && password === validPass) {
            setTimeout(() => {
                setIsLoading(false);
                onLogin(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setIsLoading(false);
                setError('अवैध वापरकर्तानाव किंवा पासवर्ड (Invalid username or password)');
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-indigo-700 text-white text-center rounded-t-3xl">
                    <Gavel className="mx-auto mb-3 text-teal-400" size={48} />
                    <h1 className="text-3xl font-extrabold tracking-wider">न्यायालयीन प्रणाली</h1>
                    <p className="text-indigo-200 mt-1">वॉरंट / समन्स / नोटीस तयार करणे </p>
                </div>
                
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">प्रवेश करा (Login)</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">वापरकर्ता ID (User ID)</label>
                        <div className="relative">
                            <UserCircle size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                            <input 
                                type="text" 
                                placeholder="Admin ID / User ID"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड (Password)</label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                            <input 
                                type="password" 
                                placeholder="●●●●●●●●"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-md 
                            ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'प्रवेश करत आहे...' : 'प्रवेश करा'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
