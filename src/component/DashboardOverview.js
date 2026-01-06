import React, { useEffect } from 'react';
import { Gavel, MapPin, RotateCcw } from 'lucide-react';

const DashboardOverview = ({ courtConfig = {}, setCourtConfig }) => {
    const { 
        language = 'marathi', 
        courtLevel = '', 
        courtVillage = '', 
        taluka = '', 
        district = '', 
        policeStation = '' ,
        fullOfficeName = ''
    } = courtConfig;

    const courtLevels = [
        { mr: "प्रमुख जिल्हा व सत्र न्यायालय", en: "Principal District & Sessions Court" },
        { mr: "अतिरिक्त जिल्हा व सत्र न्यायालय", en: "Additional District & Sessions Court" },
        { mr: "अपर जिल्हा व अतिरिक्त सत्र न्यायालय", en: "Ad-hoc District & Additional Sessions Court" },
        { mr: "तदर्थ जिल्हा व अतिरिक्त सत्र न्यायालय", en: "Joint District & Additional Sessions Court" },
        { mr: "दिवाणी न्यायालय वरिष्ठ स्तर", en: "Civil Judge Senior Division Court" },
        { mr: "मुख्य न्यायदंडाधिकारी", en: "Chief Judicial Magistrate Court" },
        { mr: "दिवाणी न्यायालय वरिष्ठ स्तर, व अतिरीक्त मुख्य न्यायदंडाधिकारी", en: "Civil Judge Senior Division, & Additional Chief Judicial Magistrate" },
        { mr: "दिवाणी न्यायालय कनिष्ठ स्तर, व न्यायदंडाधिकारी प्रथम वर्ग", en: "Civil Judge Junior Division, & Judicial Magistrate, First Class Court" },
        { mr: "न्यायदंडाधिकारी प्रथम वर्ग, लोहमार्ग न्यायालय", en: "Judicial Magistrate First Class, Railway Court" },
        { mr: "न्यायदंडाधिकारी प्रथम वर्ग, मोटर वाहन न्यायालय", en: "Judicial Magistrate , First Class, Motor Vehicle Court" },
    ];

    const prefixes = {
        marathi: "पोलीस निरीक्षक, पोलीस स्टेशन ",
        english: "Police Inspector, Police Station "
    };

    // This handles switching languages while attempting to preserve the station name
    const handleLanguageChange = (newLang) => {
        const oldPrefix = prefixes[language];
        const newPrefix = prefixes[newLang];
        let updatedPs = policeStation;

        // If the current text starts with the old prefix, swap it.
        // Otherwise, if it's empty, just use the new prefix.
        if (policeStation.startsWith(oldPrefix)) {
            updatedPs = policeStation.replace(oldPrefix, newPrefix);
        } else if (!policeStation) {
            updatedPs = newPrefix;
        }

        setCourtConfig({ 
            ...courtConfig, 
            language: newLang, 
            policeStation: updatedPs 
        });
    };

    useEffect(() => {
        const match = courtLevels.find(l => l.mr === courtLevel || l.en === courtLevel);
        const displayLevel = match ? (language === 'marathi' ? match.mr : match.en) : courtLevel;

        const tLabel = language === 'marathi' ? "ता. " : "Tal. ";
        const dLabel = language === 'marathi' ? "जि. " : "Dist. ";
        
        let parts = [];
        if (displayLevel) parts.push(displayLevel);
        if (courtVillage) parts.push(courtVillage);
        if (taluka) parts.push(`${tLabel}${taluka}`);
        if (district) parts.push(`${dLabel}${district}`);
        
        const newHeading = parts.join(', ');

        if (newHeading !== fullOfficeName) {
            setCourtConfig({ 
                ...courtConfig, 
                fullOfficeName: newHeading 
            });
        }
    }, [courtLevel, courtVillage, taluka, district, language, fullOfficeName, setCourtConfig]);

    const handleReset = () => {
        setCourtConfig({
            language: language,
            courtLevel: '',
            courtVillage: '',
            taluka: '',
            district: '',
            policeStation: prefixes[language],
            fullOfficeName: ''
        });
    };

    // UPDATED: Completely free typing allowed
    const handlePsChange = (e) => {
        setCourtConfig({ 
            ...courtConfig, 
            policeStation: e.target.value 
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-600">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Gavel className="text-indigo-600" /> 
                        {language === 'marathi' ? 'न्यायालयीन सेटिंग्ज' : 'Court Settings'}
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">
                            <RotateCcw size={14} />
                            {language === 'marathi' ? 'रिसेट' : 'Reset'}
                        </button>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => handleLanguageChange('marathi')} className={`px-4 py-1 rounded-md transition text-sm font-bold ${language === 'marathi' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}> मराठी </button>
                            <button onClick={() => handleLanguageChange('english')} className={`px-4 py-1 rounded-md transition text-sm font-bold ${language === 'english' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}> English </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">
                            {language === 'marathi' ? 'न्यायालयाचा स्तर' : 'Court Level'}
                        </label>
                        <input 
                            list="court-level-options"
                            className="border p-2 rounded-lg bg-gray-50 focus:bg-white outline-none ring-indigo-200 focus:ring-2"
                            value={courtLevel} 
                            placeholder={language === 'marathi' ? "निवडा किंवा टाइप करा..." : "Select or type..."}
                            onChange={(e) => setCourtConfig({ ...courtConfig, courtLevel: e.target.value })}
                        />
                        <datalist id="court-level-options">
                            {courtLevels.map((lvl, i) => (
                                <option key={i} value={language === 'marathi' ? lvl.mr : lvl.en} />
                            ))}
                        </datalist>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'न्यायालय गाव' : 'Court Village'}</label>
                        <input type="text" className="border p-2 rounded-lg outline-none ring-indigo-200 focus:ring-2" value={courtVillage} onChange={(e) => setCourtConfig({ ...courtConfig, courtVillage: e.target.value })} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'तालुका' : 'Taluka'}</label>
                        <input type="text" className="border p-2 rounded-lg outline-none ring-indigo-200 focus:ring-2" value={taluka} onChange={(e) => setCourtConfig({ ...courtConfig, taluka: e.target.value })} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'जिल्हा' : 'District'}</label>
                        <input type="text" className="border p-2 rounded-lg outline-none ring-indigo-200 focus:ring-2" value={district} onChange={(e) => setCourtConfig({ ...courtConfig, district: e.target.value })} />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                        <label className="text-sm font-semibold text-gray-600">{language === 'marathi' ? 'पोलीस स्टेशन' : 'Police Station'}</label>
                        <input 
                            type="text" 
                            className="border p-2 rounded-lg outline-none ring-indigo-200 focus:ring-2" 
                            value={policeStation} 
                            onChange={handlePsChange} 
                        />
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <MapPin size={14} /> {language === 'marathi' ? 'जनरेट केलेले शीर्षक' : 'Generated Heading'}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold">
                            {fullOfficeName || (language === 'marathi' ? "कृपया माहिती भरा..." : "Please fill details...")}
                        </h3>
                        {policeStation && (
                            <p className="mt-2 text-indigo-100 opacity-90 font-medium border-t border-white/20 pt-2">
                                {policeStation}
                            </p>
                        )}
                    </div>
                    <Gavel size={120} className="absolute -right-4 -bottom-4 text-white opacity-10" />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
