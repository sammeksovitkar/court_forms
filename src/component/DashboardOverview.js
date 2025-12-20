import React from 'react';
import { BarChart2, Gavel, MapPin } from 'lucide-react';

// Added default empty object to avoid destructuring error
const DashboardOverview = ({ courtConfig = {}, setCourtConfig }) => {
    
    // Safety: If courtConfig is missing, use defaults to prevent crash
    const { 
        language = 'marathi', 
        courtLevel = '', 
        courtVillage = '', 
        taluka = '', 
        district = '', 
        policeStation = '' 
    } = courtConfig;

    const courtLevels = [
        { mr: "प्रमुख जिल्हा व सत्र न्यायाधिश", en: "Principal District & Sessions Judge" },
        { mr: "अतिरिक्त जिल्हा व सत्र न्यायाधिश", en: "Additional District & Sessions Judge" },
        { mr: "अपर जिल्हा व अतिरिक्त सत्र न्यायाधिश", en: "Ad-hoc District & Additional Sessions Judge" },
        { mr: "तदर्थ जिल्हा व अतिरिक्त सत्र न्यायाधिश", en: "Joint District & Additional Sessions Judge" },
        { mr: "दिवाणी न्यायाधिश वरिष्ठ स्तर", en: "Civil Judge Senior Division" },
        { mr: "मुख्य न्यायदंडाधिकारी", en: "Chief Judicial Magistrate" },
        { mr: "दिवाणी न्यायाधिश वरिष्ठ स्तर व अतिरीक्त मुख्य न्यायदंडाधिकारी", en: "Civil Judge Senior Division & Additional Chief Judicial Magistrate" },
        { mr: "दिवाणी न्यायाधिश कनिष्ठ स्तर व न्यायदंडाधिकारी प्रथम वर्ग", en: "Civil Judge Junior Division & Judicial Magistrate First Class" },
        { mr: "न्यायदंडाधिकारी प्रथम वर्ग, लोहमार्ग न्यायालय", en: "Judicial Magistrate First Class, Railway Court" },
        { mr: "न्यायदंडाधिकारी प्रथम वर्ग, मोटर वाहन न्यायालय", en: "Judicial Magistrate First Class, Motor Vehicle Court" },
    ];

    const getOutputString = () => {
        if (!courtLevel) return language === 'marathi' ? "कृपया माहिती भरा..." : "Please fill details...";
        const tLabel = language === 'marathi' ? "तालुका " : "Taluka ";
        const dLabel = language === 'marathi' ? "जिल्हा " : "District ";
        
        let output = courtLevel;
        if (courtVillage) output += `, ${courtVillage}`;
        if (taluka) output += `, ${tLabel}${taluka}`;
        if (district) output += `, ${dLabel}${district}`;
        return output;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-600">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Gavel className="text-indigo-600" /> {language === 'marathi' ? 'न्यायालयीन सेटिंग्ज' : 'Court Settings'}
                    </h2>
                    
                    {/* Language Switcher */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setCourtConfig({ language: 'marathi' })} 
                            className={`px-4 py-1 rounded-md transition ${language === 'marathi' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500'}`}
                        > मराठी </button>
                        <button 
                            onClick={() => setCourtConfig({ language: 'english' })} 
                            className={`px-4 py-1 rounded-md transition ${language === 'english' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500'}`}
                        > English </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Court Selector */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'न्यायालयाचा स्तर' : 'Court Level'}</label>
                        <select 
                            className="border p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 ring-indigo-200 outline-none"
                            value={courtLevel} 
                            onChange={(e) => setCourtConfig({ courtLevel: e.target.value })}
                        >
                            <option value="">-- {language === 'marathi' ? 'निवडा' : 'Select'} --</option>
                            {courtLevels.map((lvl, i) => (
                                <option key={i} value={language === 'marathi' ? lvl.mr : lvl.en}>{language === 'marathi' ? lvl.mr : lvl.en}</option>
                            ))}
                        </select>
                    </div>

                    {/* Village */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'न्यायालय गाव' : 'Court Village'}</label>
                        <input type="text" className="border p-2 rounded-lg focus:ring-2 ring-indigo-200 outline-none" value={courtVillage} onChange={(e) => setCourtConfig({ courtVillage: e.target.value })} />
                    </div>

                    {/* Taluka */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'तालुका' : 'Taluka'}</label>
                        <input type="text" className="border p-2 rounded-lg focus:ring-2 ring-indigo-200 outline-none" value={taluka} onChange={(e) => setCourtConfig({ taluka: e.target.value })} />
                    </div>

                    {/* District */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'जिल्हा' : 'District'}</label>
                        <input type="text" className="border p-2 rounded-lg focus:ring-2 ring-indigo-200 outline-none" value={district} onChange={(e) => setCourtConfig({ district: e.target.value })} />
                    </div>

                    {/* PS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'पोलीस स्टेशन' : 'Police Station'}</label>
                        <input type="text" className="border p-2 rounded-lg focus:ring-2 ring-indigo-200 outline-none" value={policeStation} onChange={(e) => setCourtConfig({ policeStation: e.target.value })} />
                    </div>
                </div>

                {/* Final Preview Output */}
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <MapPin size={14} /> {language === 'marathi' ? 'जनरेट केलेले शीर्षक' : 'Generated Heading'}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold">{getOutputString()}</h3>
                        {policeStation && <p className="mt-2 text-indigo-100 opacity-90">{language === 'marathi' ? 'पोलीस स्टेशन' : 'Police Station'}: {policeStation}</p>}
                    </div>
                    {/* Decorative Background Icon */}
                    <Gavel size={120} className="absolute -right-4 -bottom-4 text-white opacity-10" />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;