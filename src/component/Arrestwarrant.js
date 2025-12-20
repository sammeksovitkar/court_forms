import React, { useState, useEffect } from 'react';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().substring(0, 10);

// ====================================================================================
// --- 1. DEFAULT DATA STRUCTURES ---
// ====================================================================================

// Default data in Marathi 
// important 
const courtInfo = {
    policeStation: {
        mar: 'मनमाड शहर',
        eng: 'Manmad City'
    },
    courtName: {
        mar: 'न्यायदंडाधिकारी, प्रथम वर्ग, मनमाड शहर ता.नांदगाव जिल्हा नाशिक',
        eng: 'Judicial Magistrate First Class, Manmad City, Tal. Nandgaon, Dist. Nashik'
    },
    talukaDist: {
        mar: "ता.नांदगाव, जिल्हा नाशिक",
        eng: "Tal. Nandgaon, Dist. Nashik"
    },
    policeStationTaluka: {
        mar: 'नांदगाव',
        eng: "Nandgaon"
    },
    policeStationDistrict: {
        mar: 'नाशिक',
        eng: "Nashik"
    },
};

// Assuming 'today' is a defined variable (e.g., const today = new Date().toLocaleDateString('en-GB');)

const defaultDataMarathi = {
    courtName: courtInfo.courtName.mar,
    talukaDist: courtInfo.talukaDist.mar,
    warrantType: '', 
    caseType: '',     
    caseNo: '',
    policeStationName: courtInfo.policeStation.mar,
    policeStationTaluka: courtInfo.policeStationTaluka.mar,
    policeStationDistrict: courtInfo.policeStationDistrict.mar,
    accusedName: '',
    accusedAddress: '',
    act: '',
    section: '',
    appearanceDate: today, // Placeholder for the 'today' variable
    personalBondAmount: '', 
    suretyAmount1: '', 
    suretyAmount2: '', 
    issueDate: today, // Placeholder for the 'today' variable
    courtLocationFooter: courtInfo.policeStation.mar, // Using police station name for footer location
    date: "दिनांक : ",
    outWordNo: "जा. क्र :"
};

// Translated default data for English
const defaultDataEnglish = {
    courtName: courtInfo.courtName.eng,
    talukaDist: courtInfo.talukaDist.eng,
    warrantType: '', 
    caseType: '',     
    caseNo: '',
    policeStationName: courtInfo.policeStation.eng,
    policeStationTaluka: courtInfo.policeStationTaluka.eng,
    policeStationDistrict: courtInfo.policeStationDistrict.eng,
    accusedName: '',
    accusedAddress: '',
    act: '',
    section: '',
    appearanceDate: today, // Placeholder for the 'today' variable
    personalBondAmount: '', 
    suretyAmount1: '', 
    suretyAmount2: '', 
    issueDate: today, // Placeholder for the 'today' variable
    courtLocationFooter: courtInfo.policeStation.eng, // Using police station name for footer location
    date: "Date :",
    outWordNo: "O.No :"
};
// ====================================================================================
// --- 2. TRANSLATION MAPS AND UTILITIES ---
// ====================================================================================

const text = {
    Marathi: {
        header: 'पकडण्याचा वॉरंट माहिती भरा (Arrest Warrant Details - CrPC 75)',
        warrantType: '१. वॉरंटचा प्रकार (Warrant Type)',
        typeNBW: 'N.B.W. (Non Bailable Warrant - अजामीनपात्र)',
        typeBW: 'B.W. (Bailable Warrant - जामीनपात्र)',
        typeAW: 'A.W. (Arrest Warrant - अटक)',
        caseType: '२. खटल्याचा प्रकार (Case Type)',
        judicialDetails: '३. न्यायालयीन तपशील',
        courtName: 'न्यायालय/वॉरंट जारी करणारे (Court/Issuing Authority):',
        caseNo: 'खटला क्रमांक (Case No.):',
        courtLocation: 'कोर्टाचे ठिकाण (Court Location):',
        accusedOffenseDetails: '४. आरोपी आणि गुन्हा तपशील',
        accusedName: 'आरोपीचे नांव (Accused Name):',
        accusedAddress: 'आरोपीचा पत्ता (Accused Address):',
        act: 'गुन्हा कायदा (Act):',
        selectOrAddAct: 'निवडा किंवा जोडा (Select or Add Act)',
        section: 'कलम क्रमांक (Section):',
        policeStationName: 'पोलीस स्टेशनचे नांव (Police Station):',
        policeStationTaluka: 'पोलीस स्टेशन तालुका (Taluka):',
        policeStationDistrict: 'पोलीस स्टेशन जिल्हा (District):',
        bailSuretyDetails: '५. तारण/जामीन तपशील (Bail/Surety Details)',
        appearanceDate: 'न्यायालयात हजर होण्याची तारीख (Appearance Date):',
        personalBondAmount: 'स्वतःचे तारण रक्कम (Personal Bond Amount - रु.):',
        suretyAmount1: 'जामीनदार रक्कम (Surety Amount - १ जामीन):',
        suretyAmount2: 'प्रत्येक जामीनदार रक्कम (Surety Amount - २ जामीन):',
        issueDateSection: 'वॉरंट जारी करण्याची तारीख',
        placeholderSection: 'उदा. 302, 138',
        printButton: 'वॉरंट प्रिंट करा (Print Warrant)',
        mandatoryFields: 'कृपया वॉरंट प्रकार, खटला प्रकार, आरोपीचे नांव आणि कलम क्रमांक भरल्याशिवाय प्रिंट करू नका.',
    },
    English: {
        header: 'Arrest Warrant Details (CrPC 75)',
        warrantType: '1. Warrant Type',
        typeNBW: 'N.B.W. (Non Bailable Warrant)',
        typeBW: 'B.W. (Bailable Warrant)',
        typeAW: 'A.W. (Arrest Warrant)',
        caseType: '2. Case Type',
        judicialDetails: '3. Judicial Details',
        courtName: 'Court/Issuing Authority:',
        caseNo: 'Case Number:',
        courtLocation: 'Court Location (Footer):',
        accusedOffenseDetails: '4. Accused and Offense Details',
        accusedName: 'Name of Accused:',
        accusedAddress: 'Address of Accused:',
        act: 'Act:',
        selectOrAddAct: 'Select or Add Act',
        section: 'Section Number:',
        policeStationName: 'Police Station Name:',
        policeStationTaluka: 'Police Station Taluka:',
        policeStationDistrict: 'Police Station District:',
        bailSuretyDetails: '5. Bail/Surety Details',
        appearanceDate: 'Date of Appearance:',
        personalBondAmount: 'Personal Bond Amount (Rs.):',
        suretyAmount1: 'Surety Amount (One Surety):',
        suretyAmount2: 'Surety Amount (Two Sureties, Each):',
        issueDateSection: 'Warrant Issue Date',
        placeholderSection: 'e.g., 302, 138',
        printButton: 'Print Warrant',
        mandatoryFields: 'Please fill in Warrant Type, Case Type, Accused Name, and Section before printing.',
    }
};

const actOptions = [
    { value: "भारतीय दंड संहिता", label: "Indian Penal Code" },
    { value: "फौजदारी प्रक्रिया संहिता", label: "Criminal Procedure Code" },
    { value: "भारतीय न्याय संहिता", label: "Bharatiya Nyaya Sanhita" },
    { value: "भारतीय नागरिक सुरक्षा संहिता", label: "Bharatiya Nagarik Suraksha Sanhita" },
    { value: "Negotiable Instruments Act", label: "Negotiable Instruments Act" },
    { value: "Gambling Act", label: "Gambling Act" },
    // { value: "Bombay Prohibition", label: "Bombay Prohibition" },
    { value: "महाराष्ट्र दारूबंदी अधिनियम", label: "Maharashtra Prohibition Act" },
     { value: "शस्त्रास्त्र कायदा", label: "Arms Act" },
{ value: "महाराष्ट जुगार प्रतिबंध अधिनियम", label: "Bombay Prevention of Gambling Act" },
      
      

    

    
];

const formatDate = (isoDate) => {
    if (!isoDate || isoDate.length !== 10) return '...............';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
};

// Helper to translate fixed court data for the document header/footer
const getTranslatedFixedData = (data, language) => {
    if (language === 'Marathi') {
        return {
            courtName: data.courtName,
            talukaDist: data.talukaDist, 
            courtLocationFooter: data.courtLocationFooter,
            date:data.date,
            outWordNo:data.outWordNo
        };
    }
    
    // Construct English structured names from the data inputs
    const courtLevel = 'Judicial Magistrate First Class,';
    const courtLocation = `${data.courtLocationFooter} City,`;
    const taluka = `Tal. ${data.policeStationTaluka},`;
    const district = `Dist. ${data.policeStationDistrict}`;

    return {
        courtName: `${courtLevel} ${courtLocation} ${taluka} ${district}`,
        talukaDist: `${district}, ${taluka.replace(',', '')}`, 
        courtLocationFooter: data.courtLocationFooter,
        date:data.date,
        outWordNo:data.outWordNo
    };
};

// Utility to merge new language defaults while preserving user input
const mergeData = (currentData, newDefaults) => {
    // Determine the set of defaults the CURRENT data state is based on
    const originalDefaults = currentData.language === 'Marathi' ? defaultDataMarathi : defaultDataEnglish;
    
    const merged = {};
    for (const key in newDefaults) {
        // Condition: If the current value is blank OR if it matches the ORIGINAL default value (meaning user didn't change it),
        // then we apply the new default data value for the new language.
        if (currentData[key] === '' || currentData[key] === originalDefaults[key]) {
             merged[key] = newDefaults[key];
        } else {
             // Otherwise, we keep the user's input
             merged[key] = currentData[key];
        }
    }
    return merged;
};

// --- WARRANT CONTENT GENERATOR (Handles main body translation) ---
const getWarrantContent = (data, language) => {
    const formattedIssueDate = formatDate(data.issueDate);
    const formattedAppearanceDate = formatDate(data.appearanceDate);
    const warrantUserType = data.warrantType === "A.W." ? 
        (language === 'Marathi' ? 'सामनेवाला' : 'the person concerned') : 
        (language === 'Marathi' ? 'आरोपी' : 'the accused');

    const descriptiveWarrant = (type) => {
        if (language === 'Marathi') {
            if (type === 'B.W.') return 'Bailable Warrant (जामीनपात्र अधिपत्र)';
            if (type === "N.B.W.") return 'Non Bailable Warrant (अजामीनपात्र अधिपत्र)';
            if (type === "A.W.") return "Arrest Warrant (पकड वॉरंट)";
        } else {
            if (type === 'B.W.') return 'Bailable Warrant';
            if (type === "N.B.W.") return 'Non Bailable Warrant';
            if (type === "A.W.") return "Arrest Warrant";
        }
        return '';
    };

    const offenseDetail = data.act && data.section
        ? (language === 'Marathi' ? `${data.act} कलम ${data.section}` : `${data.act} Section ${data.section}`)
        : data.act || data.section || '...................';

    // Marathi Content Structure
    if (language === 'Marathi') {
        return {
            language: 'Marathi',
            crpcRef: '(क्रि. प्रो. को. क. ७५ पहा)',
            to: 'प्रति,',
            policeInspector: 'पोलीस निरीक्षक,',
            policeStation: `${data.policeStationName} पोलीस स्टेशन,`,
            talukaDistrict: `ता. ${data.policeStationTaluka} जि. ${data.policeStationDistrict} यांस`,
            mainPara: (
                <p className="warrant-paragraph" style={{ marginBottom: '15px' }}>
                    &nbsp;&nbsp;&nbsp; &nbsp; ज्यापेक्षा {warrantUserType}  नामे <span className="data-placeholder bold-text">{data.accusedName}</span> राह.
                    <span className="data-placeholder bold-text"> &nbsp;{data.accusedAddress} &nbsp;</span> यावर
                    <span className="data-placeholder bold-text"> &nbsp;{offenseDetail}</span>  &nbsp;या अपराधाचा आरोप आलेला आहे,
                    त्यापेक्षा तुम्ही सदरहू  {warrantUserType} <span className="data-placeholder bold-text"> &nbsp;&nbsp;{data.accusedName} &nbsp;&nbsp;</span> यास धरून माझ्यापुढे आणावे असा तुम्हास या वॉरंटद्वारे हुकूम केला आहे.
                    यात लिहिल्याप्रमाणे तुम्ही चुकू नये.
                </p>
            ),
            bailHeader: 'जामीन सूचना (Bail Instruction):',
            bailPara: (
                <p className="warrant-paragraph" style={{ margin: '0' }}>
                    &nbsp;&nbsp;&nbsp; &nbsp;   सदरहू <span className="data-placeholder bold-text"> &nbsp;{data.accusedName} &nbsp;&nbsp;</span> जर तारीख <span className="data-placeholder bold-text">{formattedAppearanceDate}</span>
                    &nbsp; रोजी माझ्यापुढे हजर होण्याविषयी व मी अन्य रितीने हुकूम येईपर्यंत हजर होत राहतील
                    याविषयी आपण स्वतः रु. <span className="data-placeholder bold-text">{data.personalBondAmount}</span> रकमेचे तारण लिहून देऊन
                    रु. <span className="data-placeholder bold-text">{data.suretyAmount1}</span> रकमेचा एक जामीन (अगर रु. <span className="data-placeholder bold-text">{data.suretyAmount2}</span> रकमेचा प्रत्येक असे दोन)
                    द्याल, तर त्यास सोडून द्यावे.
                </p>
            ),
            issueDate: `आज तारीख ${formattedIssueDate}.`,
            magistrate: 'न्यायदंडाधिकारी प्रथम वर्ग,',
            footerTip: <p style={{ marginTop: "100px" }}> <span style={{ fontWeight: "bold" }}>टिप :</span>  सामनेवाल्याने रूपये   <span style={{ fontWeight: "bold" }}>  &nbsp; {data.personalBondAmount}&nbsp;</span> भरल्यास त्यास मुक्त करून रक्कम या न्यायालयाकडे जमा करावी</p>,
            descriptiveWarrant: descriptiveWarrant(data.warrantType),
        };
    }

    // English Content Structure
    return {
        language: 'English',
        crpcRef: '(See Section 75 of CrPC)',
        to: 'To,',
        policeInspector: 'The Police Inspector,',
        policeStation: `${data.policeStationName} Police Station,`,
        talukaDistrict: `Taluka: ${data.policeStationTaluka}, District: ${data.policeStationDistrict}`,
        mainPara: (
            <p className="warrant-paragraph" style={{ marginBottom: '15px' }}>
                &nbsp;&nbsp;&nbsp; &nbsp; Whereas, the {warrantUserType} named <span className="data-placeholder bold-text">{data.accusedName}</span>, resident of
                <span className="data-placeholder bold-text"> &nbsp;{data.accusedAddress} &nbsp;</span>, stands charged with the offense of
                <span className="data-placeholder bold-text"> &nbsp;{offenseDetail}</span>;
                You are hereby directed to arrest the said {warrantUserType} <span className="data-placeholder bold-text"> &nbsp;&nbsp;{data.accusedName} &nbsp;&nbsp;</span> and produce {data.accusedName.includes(' ') ? 'him/her' : 'them'} before me.
                Herein fail not.
            </p>
        ),
        bailHeader: 'Bail Instruction:',
        bailPara: (
            <p className="warrant-paragraph" style={{ margin: '0' }}>
                &nbsp;&nbsp;&nbsp; &nbsp;   The said <span className="data-placeholder bold-text"> &nbsp;{data.accusedName} &nbsp;&nbsp;</span> may be released upon his executing a personal bond for the sum of Rs. <span className="data-placeholder bold-text">{data.personalBondAmount}</span>
                and furnishing one surety for Rs. <span className="data-placeholder bold-text">{data.suretyAmount1}</span> (or two sureties, each for Rs. <span className="data-placeholder bold-text">{data.suretyAmount2}</span>),
                to appear before me on the <span className="data-placeholder bold-text">{formattedAppearanceDate}</span>, and to continue to appear as directed by me thereafter.
            </p>
        ),
        issueDate: `Dated, this ${formattedIssueDate}.`,
        magistrate: 'Judicial Magistrate First Class,',
        footerTip: <p style={{ marginTop: "100px" }}> <span style={{ fontWeight: "bold" }}>Note :</span>  If the person concerned deposits an amount of Rs.   <span style={{ fontWeight: "bold" }}>  &nbsp; {data.personalBondAmount}&nbsp;</span>, he/she may be released and the amount shall be deposited in this Court.</p>,
        descriptiveWarrant: descriptiveWarrant(data.warrantType),
    };
};


// --- DOCUMENT COMPONENT ---
const ArrestWarrantDocument = ({ data, language }) => {

    const content = getWarrantContent(data, language);
    const translatedFixedData = getTranslatedFixedData(data, language); 

    const courtLocationFooterText = translatedFixedData.courtLocationFooter;
    const talukaDistText = translatedFixedData.talukaDist;

    return (
        <div className="printable-area" id="print-warrant-content" style={{ fontFamily: language === 'Marathi' ? 'Lohit Devanagari, Arial Unicode MS, Mangal, sans-serif' : 'Arial, sans-serif' }}>
            <div className="warrant-document">
              {(data.policeStationName !== courtInfo.policeStation.mar && data.policeStationName !== courtInfo.policeStation.eng) ? 
  <div style={{ lineHeight: "1.7", textAlign: "right", marginBottom: "15px" }}>
    <p style={{ textAlign: "right" }}> {translatedFixedData.outWordNo}  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/202</p>
    <p style={{ textAlign: "right" }}>{translatedFixedData.date} &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;  &nbsp; /202</p>
  </div>
:""}
                {/* Court and Heading (FIXED FOR TRANSLATION) */}
                <p className="align-center court-title" style={{ fontSize: "20px", fontWeight: 'bold', textDecoration: "underline", marginBottom: '5px' }}>
                    <span className="data-placeholder">{translatedFixedData.courtName}</span>
                </p>

                {/* Warrant Type and Case Type Display */}
                <div style={{ marginBottom: '15px', width: '100%', lineHeight: '1.2', textAlign: "center" }}>
                    <p style={{ margin: '0 0 2px 0', textAlign: "center", fontWeight: 'bold', fontSize: '1.1rem', color: data.warrantType === 'N.B.W.' ? '#880000' : '#006400' }} >
                        <span className="data-placeholder">{content.descriptiveWarrant}</span>
                    </p>
                    <p style={{ margin: '0', fontSize: '10pt', textAlign: "center" }}>
                        {content.crpcRef}
                    </p>
                </div>
                <p style={{ margin: '0', textAlign: "right", fontSize: '12pt', fontWeight: 'bold' }}>
                    Case No. &nbsp; {data.caseType}: <span className="data-placeholder">{data.caseNo}</span>
                </p>

                {/* To: Police Inspector */}
                <div style={{ marginTop: '10px', marginBottom: '10px', padding: '0 0mm' }}>
                    <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>{content.to}</p>
                    <p style={{ marginBottom: '5px' }}>{content.policeInspector}</p>
                    <p style={{ marginBottom: '5px' }}>
                        {content.policeStation}
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        {content.talukaDistrict}
                    </p>
                </div>

                {/* Main Body of Warrant */}
                <div style={{ marginTop: '20px', textAlign: 'justify' }}>
                    {content.mainPara}

                    {/* Conditional Bail/Surety Clause (Only for Bailable Warrant) */}
                    {/* {data.warrantType === 'B.W.' && ( */}
                        <div className="bail-clause" style={{ marginBottom: '15px', border: '1px dashed #ccc', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                            <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 5px 0' }}>{content.bailHeader}</p>
                            {content.bailPara}
                        </div>
                    {/* )} */}

                    {/* Issue Date */}
                    <p className="warrant-paragraph" style={{ marginTop: '20px', textAlign: 'left', fontWeight: 'bold' }}>
                        {content.issueDate}
                    </p>
                </div>

                {/* Footer/Signature Block */}
                <div className="footer-section" style={{ marginTop: '30px', textAlign: 'right' }}>
                    <div className="signature-block align-right" style={{
                        width: 'auto',
                        display: 'inline-block',
                        paddingTop: '5px',
                        marginRight: '0px'
                    }}>
                        <p style={{ marginBottom: '0', marginTop: '10px', textAlign: 'center', fontWeight: 'bold', }}>
                            {content.magistrate}
                        </p>
                        <p style={{ marginBottom: '0', marginTop: '0', textAlign: 'center' }}>
                            <span className="data-placeholder">{courtLocationFooterText}</span>
                        </p>
                        <p style={{ marginBottom: '0', marginTop: '0', textAlign: 'center' }}>
                            <span className="data-placeholder">{talukaDistText}</span> 
                        </p>
                    </div>
                </div>

                {(data.warrantType === "R.W." || data.warrantType === "A.W.") &&
                    <div className="warrant-document">{content.footerTip}</div>
                }

            </div>
        </div>
    );
};


// ====================================================================================
// --- MAIN APPLICATION COMPONENT (ArrestWarrantApp) ---
// ====================================================================================

const ArrestWarrantApp = () => {
    
    // Start with Marathi defaults and set state accordingly
    const [data, setData] = useState(defaultDataMarathi); 
    const [language, setLanguage] = useState('Marathi');

    // 🌟 CORE LOGIC: Update default data when language changes
    useEffect(() => {
        if (language === 'English') {
            // Merge current user data with English defaults
            setData(prevData => ({
                ...mergeData(prevData, defaultDataEnglish),
                language: 'English' 
            }));
        } else {
            // Merge current user data with Marathi defaults
             setData(prevData => ({
                ...mergeData(prevData, defaultDataMarathi),
                language: 'Marathi'
            }));
        }
    }, [language]); 
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handlePrint = () => {
        const currentText = text[language];
        if (!data.warrantType || !data.caseType || !data.accusedName || !data.section) {
            alert(currentText.mandatoryFields);
            return;
        }
        window.print();
    };

    const currentText = text[language];

    return (
        <div className="summons-container">
            {/* --------------------- CSS STYLES (Includes A4 Print Media Query) --------------------- */}
            <style>
                {`
          /* --- SCREEN VIEW STYLES (Tailwind base) --- */
          .summons-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5rem;
            min-height: 100vh;
            background-color: #f7f7f7;
            font-family: 'Inter', sans-serif;
          }

          .input-form {
            width: 100%;
            max-width: 1140px;
            padding: 2rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .input-form label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
          }
          
          /* Radio Group Styling */
          .radio-group {
              display: flex;
              gap: 1.5rem;
              margin-top: 0.5rem;
              padding: 0.75rem;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              background-color: #f9fafb;
              box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          }
          
          .radio-group label {
              display: flex;
              align-items: center;
              font-weight: normal;
              cursor: pointer;
              margin-bottom: 0;
              color: #1f2937;
              transition: color 0.15s ease-in-out;
          }
          
          .radio-group input[type="radio"] {
              width: auto;
              height: 1.25rem;
              margin-right: 0.6rem;
              cursor: pointer;
              appearance: none;
              border: 2px solid #9ca3af;
              border-radius: 50%;
              transition: all 0.2s;
              outline: none;
              min-width: 1.25rem;
          }
          
          .radio-group input[type="radio"]:checked {
              background-color: #2563eb;
              border-color: #2563eb;
              box-shadow: inset 0 0 0 4px #f9fafb;
          }

          .input-form input:not([type="radio"]), .input-form select, .input-form datalist {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-sizing: border-box;
            transition: border-color 0.15s ease-in-out;
          }
          .input-form input:focus, .input-form select:focus {
            border-color: #2563eb;
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
          }

          .print-button {
            width: 100%;
            padding: 1rem;
            font-size: 1.125rem;
            font-weight: 700;
            cursor: pointer;
            background-color: #ef4444; /* Red for Warrant */
            color: white;
            border: none;
            border-radius: 0.5rem;
            transition: background-color 0.15s ease-in-out, transform 0.1s ease-in-out;
            box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
          }
          .print-button:hover {
            background-color: #dc2626;
            box-shadow: 0 6px 8px rgba(220, 38, 38, 0.4);
          }
          .print-button:active {
            transform: scale(0.99);
          }
          
          /* Print Area (Visible on screen for preview) */
          .printable-area {
            width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            background-color: white;
            padding: 30mm 25mm; 
            box-sizing: border-box;
            /* Use Devanagari friendly fonts */
            font-family: ${language === 'Marathi' ? "'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif" : "Arial, sans-serif"}; 
            font-size: 12pt;
            line-height: 1.5; 
          }

          /* TIGHTER VERTICAL SPACING for the document to fit on one page */
          .warrant-document p, .warrant-document div {
            text-align: justify;
            text-indent: 0;
            margin: 0;
            padding: 0;
          }
          .warrant-document h3 {
            margin-top: 10px; 
            margin-bottom: 8px; 
          }
          .warrant-paragraph {
              margin: 8px 0 !important;
              text-align: justify;
          }


          .align-center {
            text-align: center !important;
          }

          .align-right {
            text-align: right !important;
          }
          .bold-text {
              font-weight: bold;
          }
          
          /* --- PRINT STYLES (CRITICAL FOR A4 FORMAT) --- */
          @media print {
            
            /* 1. Universal Cleanup: Removes all shadows and backgrounds */
            * {
                box-shadow: none !important;
                text-shadow: none !important;
                background: transparent !important;
                border: none !important;
            }

            /* 2. Global Print Cleanup: Ensures white background */
            body, html {
              background-color: white !important;
              overflow: hidden !important; 
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important; 
              height: 100% !important; 
            }
            
            /* 3. Container Cleanup */
            .summons-container {
              background-color: white !important;
              overflow: hidden !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              min-height: auto !important; 
            }
          
            /* Hide the input form and print button */
            .input-form, .print-button {
              display: none !important;
            }

            /* 4. Page Size & Margin */
            @page {
              size: A4 portrait;
              margin: 5mm; /* Minimal symmetrical margin */
            }
            
            /* 5. Printable Area Styling: Ensures the document itself takes over the page */
            .printable-area {
              width: 100% !important; 
              min-height: 100% !important;
              margin: 0 !important;
              border: none !important; 
              box-shadow: none !important; 
              /* IMPORTANT: Use a minimal internal padding */
              padding: 20mm 15mm !important; 
              font-size: 11pt; 
              line-height: 1.7; 
              font-family: ${language === 'Marathi' ? "'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif" : "Arial, sans-serif"} !important;
            }

            /* Apply tighter spacing specifically for printing */
            .warrant-document p, .warrant-document div {
              margin: 0;
            }
            .warrant-document h3 {
              margin-top: 6px; 
              margin-bottom: 4px; 
            }
            .warrant-paragraph {
                margin: 5px 0 !important;
            }
            .footer-section {
                margin-top: 25px !important;
            }
            /* Remove bail border/background for print */
            .bail-clause {
                border: none !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 5px 0 !important;
            }
          }
        `}
            </style>

            {/* --------------------- Input Form Section --------------------- */}
            <div className="input-form">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                    {currentText.header}
                </h2>

                {/* --- LANGUAGE SELECTION --- */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700">भाषा निवडा (Select Language)</h3>
                <div className="radio-group mb-6">
                    <label>
                        <input
                            type="radio"
                            name="language"
                            value="Marathi"
                            checked={language === 'Marathi'}
                            onChange={handleLanguageChange}
                        />
                        **मराठी (Marathi)**
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="language"
                            value="English"
                            checked={language === 'English'}
                            onChange={handleLanguageChange}
                        />
                        **English (इंग्रजी)**
                    </label>
                </div>
                {/* ---------------------------------- */}

                {/* 1. Warrant Type Selection */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-t pt-4">{currentText.warrantType}</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="warrantType"
                            value="N.B.W."
                            checked={data.warrantType === 'N.B.W.'}
                            onChange={handleChange}
                        />
                        {currentText.typeNBW}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="warrantType"
                            value="B.W."
                            checked={data.warrantType === 'B.W.'}
                            onChange={handleChange}
                        />
                        {currentText.typeBW}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="warrantType"
                            value="A.W."
                            checked={data.warrantType === 'A.W.'}
                            onChange={handleChange}
                        />
                        {currentText.typeAW}
                    </label>

                </div>

                {/* 2. Case Type Selection */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">{currentText.caseType}</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="caseType"
                            value="RCC"
                            checked={data.caseType === 'RCC'}
                            onChange={handleChange}
                        />
                        **RCC** (Regular Criminal Case)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="caseType"
                            value="SCC"
                            checked={data.caseType === 'SCC'}
                            onChange={handleChange}
                        />
                        **SCC** (Summary Criminal Case)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="caseType"
                            value="MA"
                            checked={data.caseType === 'MA'}
                            onChange={handleChange}
                        />
                        M.A. (Miscellaneous Appllication)
                    </label>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">{currentText.judicialDetails}</h3>
                <div className="form-grid">
                    <label style={{ gridColumn: 'span 2' }}>
                        {currentText.courtName}
                        {/* data.courtName is automatically updated by useEffect/mergeData */}
                        <input
                            type="text"
                            name="courtName"
                            value={data.courtName} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        {currentText.caseNo}
                        <input
                            type="text"
                            name="caseNo"
                            value={data.caseNo}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        {currentText.courtLocation}
                        <input
                            type="text"
                            name="courtLocationFooter"
                            value={data.courtLocationFooter}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">{currentText.accusedOffenseDetails}</h3>
                <div className="form-grid">
                    <label>
                        {currentText.accusedName}
                        <input
                            type="text"
                            name="accusedName"
                            value={data.accusedName}
                            onChange={handleChange}
                        />
                    </label>
                    <label style={{ gridColumn: 'span 2' }}>
                        {currentText.accusedAddress}
                        <input
                            type="text"
                            name="accusedAddress"
                            value={data.accusedAddress}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        {currentText.act}
                        <input
                            type="text"
                            name="act"
                            list="act-suggestions" // Link the input to the datalist
                            placeholder={currentText.selectOrAddAct}
                            value={data.act}
                            onChange={handleChange} // This will handle both selection and manual entry
                            className="form-control" // Add your styling class here
                        />

                        {/* The <datalist> provides suggestions but allows other input */}
                        <datalist id="act-suggestions">
                            {actOptions.map((option) => (
                                <option key={option.value} value={language === 'Marathi' ? option.value : option.label}>
                                    {language === 'Marathi' ? option.label : option.value}
                                </option>
                            ))}
                        </datalist>
                    </label>
                    <label>
                        {currentText.section}
                        <input
                            type="text"
                            name="section"
                            value={data.section}
                            onChange={handleChange}
                            placeholder={currentText.placeholderSection}
                        />
                    </label>

                    <label>
                        {currentText.policeStationName}
                        <input
                            type="text"
                            name="policeStationName"
                            value={data.policeStationName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        {currentText.policeStationTaluka}
                        <input
                            type="text"
                            name="policeStationTaluka"
                            value={data.policeStationTaluka}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        {currentText.policeStationDistrict}
                        <input
                            type="text"
                            name="policeStationDistrict"
                            value={data.policeStationDistrict}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                {/* 5. Bail/Surety Details (Always shown for input, conditional display in document) */}
                <>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">{currentText.bailSuretyDetails}</h3>
                    <div className="form-grid">
                        <label>
                            {currentText.appearanceDate}
                            <input
                                type="date"
                                name="appearanceDate"
                                value={data.appearanceDate}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            {currentText.personalBondAmount}
                            <input
                                type="text"
                                name="personalBondAmount"
                                value={data.personalBondAmount}
                                onChange={handleChange}
                                placeholder="उदा. 20,000/-"
                            />
                        </label>
                        <label>
                            {currentText.suretyAmount1}
                            <input
                                type="text"
                                name="suretyAmount1"
                                value={data.suretyAmount1}
                                onChange={handleChange}
                                placeholder="उदा. 10,000/-"
                            />
                        </label>
                        <label>
                            {currentText.suretyAmount2}
                            <input
                                type="text"
                                name="suretyAmount2"
                                value={data.suretyAmount2}
                                onChange={handleChange}
                                placeholder="उदा. 10,000/-"
                            />
                        </label>
                    </div>
                </>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">{currentText.issueDateSection}</h3>
                <div className="form-grid">
                    <label>
                        {language === 'Marathi' ? 'वॉरंट जारी करण्याची तारीख:' : 'Warrant Issue Date:'}
                        <input
                            type="date"
                            name="issueDate"
                            value={data.issueDate}
                            onChange={handleChange}
                        />
                    </label>
                    <div style={{ gridColumn: 'span 3' }}></div>
                </div>


                <button className="print-button mt-8" onClick={handlePrint}>
                    {currentText.printButton}
                </button>
            </div>

            {/* --------------------- Printable Document Preview --------------------- */}
            <ArrestWarrantDocument data={data} language={language} />

        </div>
    );
};

export default ArrestWarrantApp;