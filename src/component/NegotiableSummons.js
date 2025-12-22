// import React, { useEffect, useState } from 'react';

// Component for the printable document content (Accused Summons under NI Act 138)
import React, { useEffect, useState } from 'react';

// Component for the printable document content (Accused Summons under NI Act 138)
const AccusedSummonsDocument = ({ data }) => {
    // Determine language from data
    const isMarathi = data.printLanguage === 'marathi';

    // Utility function to convert ISO date (YYYY-MM-DD) to DD/MM/YYYY format
    const formatDateToIndian = (isoDate) => {
        if (!isoDate || isoDate.length !== 10) return isoDate;
        const parts = isoDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return isoDate;
    };

    // Helper function to render S.C.C. number
    const renderCaseNumber = (label, value) => {
        if (value && value.trim() !== '') {
            return <p style={{ margin: '0 0 2px 0', textAlign: "right" }} >{label} <span className="data-placeholder">{value}</span></p>;
        }
        return null;
    };

    return (
        <div className="printable-area" id="print-accused-content">
            <div className="summons-document">
                {/* शीर्षलेख */}
                <p className="align-center court-title" style={{ fontSize: "22px" }}>
                    <span className="data-placeholder">{data.courtName} ,</span>
                </p>
                <p className="align-center" style={{ marginTop: '0' }}>
                    {isMarathi
                        ? "(नमुना-१, अनुसूची-२, फौजदारी प्रक्रिया संहिता-४)"
                        : "(Form-1, Schedule-2, Code of Criminal Procedure-4)"}
                </p>
                <h3 className="align-center court-slogan">
                    {isMarathi ? "आरोपीस समन्स" : "SUMMONS TO ACCUSED"}
                </h3>

                <div style={{ marginBottom: '10px', width: '100%', lineHeight: '1.2' }}>
                    {renderCaseNumber(isMarathi ? 'संक्षिप्त फौ. खटला क्र.' : 'Summ. Crim. Case No.', data.sccNo)}
                </div>

                {/* तक्रारदार आणि आरोपी माहिती */}
                <div style={{ marginTop: '10px', marginBottom: '10px', padding: '0 3mm' }}>
                    <p style={{ marginBottom: '5px', fontWeight: 'bold', textAlign: "right" }}>
                        {isMarathi ? "तक्रारदाराचे नाव व पत्ता: " : "Complainant Name & Address: "}
                        <span className="data-placeholder">{data.complainantName}</span>
                    </p>
                    <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                        {isMarathi ? "प्रति," : "To,"}
                    </p>

                    {/* पोलीस निरीक्षक */}
                    {data.policeStation.split(",").length > 1 ? data.policeStation.split(",").map((x, i) =>
                        <p key={i} style={{ margin: '0' }}><span className="data-placeholder">{x}</span> </p>)
                        : <p style={{ marginTop: '0' }}><span className="data-placeholder">{data.policeStation}</span> </p>}

                    {/* आरोपी */}
                    <p style={{ marginTop: "15px", marginLeft: "50px", fontWeight: 'bold' }}>
                        {isMarathi ? "आरोपी: " : "Accused: "}
                        <span className="data-placeholder">{data.accusedName} , {data.accusedAddress}</span>
                    </p>
                </div>

                {/* सुप्रीम कोर्टाच्या आदेशानुसार अतिरिक्त निर्देश */}
                <div style={{ marginTop: '15px', border: '1px solid black', padding: '10px' }}>
                    <p className="instruction-paragraph" >
                        {isMarathi
                            ? `ज्या अर्थी, परक्राम्य संलेख अधिनियम, १८८१ च्या कलम १३८ सह कलम १४१ खालील दोषारोपास उत्तर देण्यासाठी आपली उपस्थिती आवश्यक असल्याने आपण व्यक्तीशः दिनांक `
                            : `Whereas, your attendance is necessary to answer to a charge under Section 138 read with Section 141 of the Negotiable Instruments Act, 1881, you are hereby required to appear in person on date `}
                        <span className="data-placeholder">{formatDateToIndian(data.summonDate)}</span>
                        {isMarathi
                            ? ` रोजी सकाळी ठिक १०:३० वाजता दिवाणी व फौजदारी न्यायालय, `
                            : ` at 10:30 AM before the Civil & Criminal Court, `}
                        <span className="data-placeholder">{data.courtName}</span>
                        {isMarathi ? `, समोर उपस्थित राहणे आवश्यक आहे. यात कसूर होऊ नये.` : `, Fail not.`}
                    </p>

                    <h4 style={{ fontWeight: 'bold', textDecoration: 'underline', textAlign: 'center', margin: '0 0 10px 0' }}>
                        {isMarathi
                            ? "अधिक निर्देश मा. सर्वोच्च न्यायालयाच्या आदेशानुसार पुढीलप्रमाणे आहेत:"
                            : "Further directions as per the orders of the Hon'ble Supreme Court are as follows:"}
                    </h4>

                    <p className="instruction-paragraph">
                        (अ) {isMarathi
                            ? `तुम्हांस असे स्पष्ट करण्यात येत आहे की, हा समन्स मिळाल्यानंतर त्वरित धनादेशाची रक्कम रु. `
                            : `You are hereby informed that, immediately after receiving this summons, if the cheque amount of Rs. `}
                        <span className="data-placeholder">{data.amountCheque}</span>
                        {isMarathi ? ` व त्यावर न्यायालयीने आकारलेले व्याज/खर्च रक्कम रु. ` : ` and court-awarded interest/cost of Rs. `}
                        <span className="data-placeholder">{data.amountInterest}</span>
                        {isMarathi ? ` असे एकूण रक्कम रु. ` : ` totaling Rs. `}
                        <span className="data-placeholder">{data.amountTotal}</span>
                        {isMarathi
                            ? ` न्यायालयात किंवा फिर्यादी यांच्या ${data.bankName} बँकेतील बँक खाते क्र. ${data.accountNo} यात दिनांक ${formatDateToIndian(data.datePaymentDeadline)} पर्यंत जमा केल्यास तुम्हांला या न्यायालयात पुन्हा आदेशित केल्याशिवाय हजर होण्याची गरज नाही.`
                            : ` is deposited in the Court or in the Complainant's bank account at ${data.bankName}, A/c No. ${data.accountNo} by ${formatDateToIndian(data.datePaymentDeadline)}, you need not appear in this Court unless ordered again.`}
                    </p>

                    <p className="instruction-paragraph">
                        (ब) {isMarathi
                            ? "वरील रक्कम फिर्यादीच्या खात्यात जमा केल्याबद्दल फिर्यादीस व न्यायालयाला कागदपत्री माहिती देणे आवश्यक आहे."
                            : "It is mandatory to provide documentary evidence to the Complainant and the Court regarding the deposit of the above amount."}
                    </p>
                    <p className="instruction-paragraph">
                        (क) {isMarathi
                            ? "तसेच, आपण रक्कम जमा केल्यानंतरही फिर्यादीने हरकत घेतल्यास न्यायालयाने ती हरकत मान्य केली तरच खटला पुढे चालेल, त्यावेळी तुम्हांस न्यायालयात हजर राहावे लागेल."
                            : "Also, if the Complainant raises an objection after the deposit and the Court accepts it, the case will proceed, and you will have to appear in Court."}
                    </p>
                    <p className="instruction-paragraph">
                        (ड) {isMarathi
                            ? "खटला पुढे चालला तर, तुम्हांस या न्यायालयात हजर राहून तुमचा बचाव कसा योग्य आहे हे प्रथम सिद्ध करावा लागेल. त्याकरिता न्यायालय आपणास विशिष्ट प्रश्न विचारू शकते."
                            : "If the trial proceeds, you must appear in Court and first prove how your defense is valid. For this, the Court may ask you specific questions."}
                    </p>
                    <p className="instruction-paragraph">
                        (ई) {isMarathi
                            ? "प्रकरण पुढे चालले तरी प्रकरणादरम्यान आपण तडजोडीची बोलणी करू शकता किंवा 'प्ली बार्गेनिंग' (Plea Bargaining) च्या तरतुदी अनुसरून गुन्हा कबूल करू शकता."
                            : "Even if the case proceeds, you may engage in settlement talks or plead guilty under the provisions of 'Plea Bargaining'."}
                    </p>
                    <p className="instruction-paragraph">
                        {isMarathi ? "आज, दिनांक " : "Today, date "}
                        <span className="data-placeholder" style={{ fontWeight: 'bold' }}>{formatDateToIndian(data.currentDate)}</span>
                        {isMarathi ? " रोजी माझ्या सहीने आणि कोर्टाच्या शिक्क्यानिशी दिले." : " given under my hand and the seal of the Court."}
                    </p>
                </div>

                <p style={{ marginBottom: '0', marginTop: '30px', marginLeft: "550px", marginBottom: "50px" }}>
                    {isMarathi ? "आदेशावरून," : "By Order,"}
                </p>

                {/* <div className="footer-section" style={{ marginTop: '30px', textAlign: 'right' }}>
                    <div className="signature-block" style={{
                        width: 'auto',
                        display: 'inline-block',
                        paddingTop: '5px',
                        marginRight: '0px',
                        textAlign: 'center'
                    }}>
                        {(() => {
                            const originalName = data.courtName || "";
                            const parts = originalName.split(',').map(p => p.trim());
                            const trimmedParts = parts.length > 2 ? parts.slice(0, -2) : parts;
                            const cleanedName = trimmedParts.join(', ');
                            const firstCommaIndex = cleanedName.indexOf(',');

                            if (firstCommaIndex !== -1) {
                                const designation = cleanedName.substring(0, firstCommaIndex).trim();
                                const remainingAddress = cleanedName.substring(firstCommaIndex + 1).trim();

                                return (
                                    <>
                                        <p style={{ marginBottom: '0', marginTop: '0', textAlign: "center" }}>
                                            {isMarathi ? "सहायक अधीक्षक" : "Assistant Superintendent"}
                                        </p>
                                        <p style={{ marginBottom: '0', marginTop: '10px', fontWeight: 'bold' }}>
                                            {designation}
                                        </p>
                                        <p style={{ marginBottom: '0', marginTop: '0', textAlign: "center" }}>
                                            {remainingAddress}
                                        </p>
                                    </>
                                );
                            } else {
                                return (
                                    <div>
                                        <p style={{ marginBottom: '0', marginTop: '10px', fontWeight: 'bold' }}>
                                            {cleanedName}
                                        </p>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div> */}

                <div style={{ marginTop: '10px', marginBottom: '10px', padding: '0 0mm', textAlign: 'right' }}>
                    <div style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        minWidth: '200px' // Adjust width as needed for better centering look
                    }}>
                        <p style={{ marginBottom: '0', marginTop: '0' ,textAlign:"center"}}>  {isMarathi ? "सहायक अधीक्षक" : "Assistant Superintendent"}</p>

                        {(() => {
                            const psText = data.courtLevel || "";
                            // Split by comma and map each part
                            return psText.split(',').map((part, index) => (
                                <div>
                                    <p key={index} style={{ margin: 0, padding: 0, fontWeight: index === 0 ? 'bold' : 'normal', textAlign: "center" }}>
                                        {part.trim()}
                                    </p>
                                </div>
                            ));
                        })()}
                        <p style={{ margin: 0, padding: 0, textAlign: "center" }}>{data.courtVillage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// The main application component
const AccusedSummonsApp = ({ courtConfig }) => {
    // Initial Data specific to NI Act 138 cases
    const initialData = {
        courtName: '',
        sccNo: '',
        complainantName: '',
        accusedName: '',
        accusedAddress: '',
        policeStation: '', // New field
        summonDate: new Date().toISOString().substring(0, 10), // Court Date
        amountCheque: '',
        amountInterest: '',
        amountTotal: '', // Cheque + Interest (Calculated field)
        bankName: '',
        accountNo: '',
        datePaymentDeadline: new Date().toISOString().substring(0, 10), // Payment deadline
        currentDate: new Date().toISOString().substring(0, 10), // Date of Summons Issuance
        printLanguage: "",
        courtLevel: '',
        courtVillage: '',
    };

    const [data, setData] = useState(initialData);
    const [printLanguage, setPrintLanguage] = useState("");



    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            let newData = { ...prev, [name]: value };

            // Auto-calculate total amount if cheque or interest changes
            if (name === 'amountCheque' || name === 'amountInterest') {
                // Ensure values are treated as integers for calculation
                const cheque = parseInt(newData.amountCheque) || 0;
                const interest = parseInt(newData.amountInterest) || 0;
                newData.amountTotal = (cheque + interest).toString();
            }
            return newData;
        });
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper to format currency for display
    const formatAmount = (amount) => {
        const num = parseInt(amount) || 0;
        return num.toLocaleString('en-IN'); // Using Indian locale for number formatting
    };

    useEffect(() => {
        const isMar = courtConfig.language === 'marathi';
        setPrintLanguage(isMar ? 'Marathi' : 'English');

        setData(prev => ({
            ...prev,
            // Mapping from your dashboard config
            courtName: courtConfig.fullOfficeName || '',
            policeStation: courtConfig.policeStation || '',
            printLanguage: courtConfig.language,
            courtLevel: courtConfig.courtLevel,
            courtVillage: courtConfig.courtVillage,
            //  courtNameFooter: courtConfig.courtVillage || '',

            // Language specific labels
            //  dateLabel: isMar ? "दिनांक : " : "Date: ",
            //  outWordNo: isMar ? "जा. क्र :" : "Outward No:"
        }));
    }, [courtConfig]);

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

          .input-form input, .input-form select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-sizing: border-box;
            transition: border-color 0.15s ease-in-out;
          }
          .input-form input:focus {
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
            background-color: #10b981; /* Green */
            color: white;
            border: none;
            border-radius: 0.5rem;
            transition: background-color 0.15s ease-in-out, transform 0.1s ease-in-out;
          }
          .print-button:hover {
            background-color: #059669;
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
            padding: 12mm 12mm; 
            box-sizing: border-box;
            font-family: 'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif; 
            font-size: 12pt;
            line-height: 1.4; 
          }

          /* TIGHTER VERTICAL SPACING for the document to fit on one page */
          .summons-document p, .summons-document div {
            text-align: justify;
            text-indent: 0;
            margin: 0;
            padding: 0;
          }
          .summons-document h3 {
            margin-top: 10px; 
            margin-bottom: 8px; 
          }
          .body-paragraph {
              margin: 10px 0 !important;
              text-align: justify;
          }
          .instruction-paragraph {
              margin: 5px 0 !important;
          }


          .align-center {
            text-align: center !important;
            font-weight: bold;
          }

          .align-right {
            text-align: right !important;
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

            /* 2. Global Print Cleanup: Removes scrollbars, padding, and ensures white background */
            body, html {
              background-color: white !important;
              overflow: hidden !important; 
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important; 
              height: 100% !important; 
            }
            
            /* 3. Container Cleanup: Ensures main app container doesn't interfere */
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
              margin: 3mm; /* Minimal symmetrical margin */
            }
            
            /* 5. Printable Area Styling: Ensures the document itself takes over the page */
            .printable-area {
              width: 100% !important; 
              min-height: 100% !important;
              margin: 0 !important;
              border: none !important; 
              box-shadow: none !important; 
              /* IMPORTANT: Use a minimal internal padding */
              padding: 5mm 8mm !important; 
              font-size: 11pt; 
              line-height: 1.6; 
              font-family: 'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif;
            }

            /* Apply tighter spacing specifically for printing */
            .summons-document p, .summons-document div {
              margin: 0;
            }
            .summons-document h3 {
              margin-top: 6px; 
              margin-bottom: 4px; 
            }
            .body-paragraph, .instruction-paragraph {
                margin: 5px 0 !important;
            }
            .footer-section {
                margin-top: 15px;
            }
          }
        `}
            </style>

            {/* --------------------- Input Form Section --------------------- */}
            <div className="input-form">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                    आरोपीस समन्स माहिती भरा (Accused Summons Details - NI Act 138)
                </h2>
                <div className="form-grid">
                    {/* <label>
                        कोर्टाचे ठिकाण (Court Location):
                        <input
                            type="text"
                            name="courtName"
                            value={data.courtName}
                            onChange={handleChange}
                        />
                    </label> */}
                    <label>
                        संक्षिप्त फौ. खटला क्र. (SCC No.):
                        <input
                            type="text"
                            name="sccNo"
                            value={data.sccNo}
                            onChange={handleChange}
                        />
                    </label>
                    <label >
                        तक्रारदाराचे नांव (Complainant):
                        <input
                            type="text"
                            name="complainantName"
                            value={data.complainantName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        आरोपीचे नांव (Accused Name):
                        <input
                            type="text"
                            name="accusedName"
                            value={data.accusedName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        आरोपीचा पत्ता (Accused Address):
                        <input
                            type="text"
                            name="accusedAddress"
                            value={data.accusedAddress}
                            onChange={handleChange}
                        />
                    </label>
                    {/* <label>
                        पोलीस स्टेशनचे नांव (Police Station):
                        <input
                            type="text"
                            name="policeStation"
                            value={data.policeStation}
                            onChange={handleChange}
                        />
                    </label> */}
                    <label>
                        समन्सची तारीख (Summon Date):
                        <input
                            type="date"
                            name="summonDate"
                            value={data.summonDate}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        आजची तारीख (Current Date):
                        <input
                            type="date"
                            name="currentDate"
                            value={data.currentDate}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">आदेशातील रकमेचा तपशील (Amount Details)</h3>
                <div className="form-grid">
                    <label>
                        धनादेशाची रक्कम (Cheque Amt Rs.):
                        <input
                            type="number"
                            name="amountCheque"
                            value={data.amountCheque}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        व्याज/खर्च रक्कम (Interest/Cost - रु.):
                        <input
                            type="number"
                            name="amountInterest"
                            value={data.amountInterest}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        एकुण रक्कम (Total Amount - रु.):
                        <input
                            type="text"
                            name="amountTotal"
                            value={formatAmount(data.amountTotal)}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                    </label>
                    <label>
                        भरणा करण्याची अंतिम मुदत (Deadline):
                        <input
                            type="date"
                            name="datePaymentDeadline"
                            value={data.datePaymentDeadline}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">बँक तपशील (Complainant's Bank Details)</h3>
                <div className="form-grid">
                    <label>
                        बँकेचे नांव (Bank Name):
                        <input
                            type="text"
                            name="bankName"
                            value={data.bankName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        खाते क्रमांक (Account No.):
                        <input
                            type="text"
                            name="accountNo"
                            value={data.accountNo}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <button onClick={handlePrint} className="print-button mt-6">
                    समन्स प्रिंट करा (Print Summons) 🖨️
                </button>
            </div>

            <hr className="w-full max-w-4xl border-gray-300 my-4" />

            {/* --------------------- Print View Section (A4 Layout) --------------------- */}
            <AccusedSummonsDocument data={data} />
        </div>
    );
};

export default AccusedSummonsApp;
