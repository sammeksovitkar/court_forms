
// import React, { useState, useMemo, useCallback } from 'react';
import React, { useState, useMemo, useCallback, useEffect } from 'react';

// =================================================================
// Initial Data
// =================================================================

const initialFormData = {
  // New selections
  formType: 'साक्षीदारास समन्स', // Default: साक्षीदारास समन्स
  caseType: 'R.C.C.',        // Default: R.C.C.

  // Data fields
  caseNo: '',
  accusedName: '',
  lawSection: '',
  amount: '',
  summonDate: '',
  currentDate: new Date().toLocaleDateString('en-GB'),
  courtLocation: 'मनमाड शहर न्यायालय, ता.नांदगाव जिल्हा नाशिक ',
  courtLocationEnglish: "Manmad City Court, Tq. Nandgaon Dist Nashik",
  policeStation: 'पोलीस निरीक्षक,पोलीस स्टेशन मनमाड शहर',
  court: "न्यायदंडाधिकारी प्रथमवर्ग,",
  witnesses: [
    { name: '', address: '' },
  ],
};
const actOptions = [
  { value: "भारतीय दंड संहिता", label: "IPC " },
  { value: "फौजदारी प्रक्रिया संहिता", label: "CrPC " },
  { value: "भारतीय न्याय संहिता", label: "BNS " },
  { value: "भारतीय नागरिक सुरक्षा संहिता", label: "BNSS " },
  { value: "Negotiable Instruments Act", label: "NI " },
  { value: "Gambling Act", label: "Gambling Act" },
  { value: "Bombay Prohibition", label: "Bombay Prohibition" },
  { value: "कौटुंबिक हिंसाचारापासून महिलांचे संरक्षण कायदा, २००५, कलम", label: "Protection of Women from Domestic Violence Act, 2005, Section" },


];

// =================================================================
// Translation Constants
// =================================================================

const MARATHI = 'Marathi';
const ENGLISH = 'English';

const translations = {
  // Titles
  'साक्षीदारास समन्स': { [MARATHI]: 'साक्षीदारास समन्स', [ENGLISH]: 'SUMMONS TO WITNESS' },
  'जामीनदारास नोटीस': { [MARATHI]: 'जामीनदारास नोटीस', [ENGLISH]: 'NOTICE TO SURETY' },
  'आरोपीस समन्स': { [MARATHI]: 'आरोपीस समन्स', [ENGLISH]: 'SUMMONS TO ACCUSED' },
  'सामनेवाला यांस नोटीस': { [MARATHI]: 'सामनेवाला यांस नोटीस', [ENGLISH]: 'NOTICE TO RESPONDENT' },
  // Headings
  'court_title': { [MARATHI]: 'न्यायदंडाधिकारी प्रथमवर्ग,', [ENGLISH]: 'Judicial Magistrate First Class,' },
  'court_subtitle': { [MARATHI]: '(न्यायालय क्रमांक १)', [ENGLISH]: '(Court No. 1)' },
  'case_no_label': { [MARATHI]: 'केस क्रमांक', [ENGLISH]: 'Case No.' },
  'current_date_label': { [MARATHI]: 'आज दिनांक', [ENGLISH]: 'Dated this' },
  'to_label': { [MARATHI]: 'प्रति,', [ENGLISH]: 'To,' },
  'forward_label': { [MARATHI]: 'यांना बजावणीसाठी अग्रेषीत', [ENGLISH]: 'For service through' },
  'witness_table_title': { [MARATHI]: 'साक्षीदारांचे नांव', [ENGLISH]: 'Name of Witness' },
  'accused_table_title': { [MARATHI]: 'आराेपी/सामनेवाला नांव', [ENGLISH]: 'Name of Accused/Respondent' },
  'table_header_srno': { [MARATHI]: 'अ.क्र', [ENGLISH]: 'Sr. No.' },
  'table_header_name': { [MARATHI]: 'साक्षीदाराचे नांव', [ENGLISH]: 'Name of Witness' },
  'table_header_address': { [MARATHI]: 'राहणार', [ENGLISH]: 'Resident of (Address)' },
  'table_header_accused_name': { [MARATHI]: 'आराेपी/सामनेवाला नांव', [ENGLISH]: 'Name of Accused/Respondent' },
  'table_header_surety_name': { [MARATHI]: 'जामीनदाराचे नांव', [ENGLISH]: 'Name of Surety' },
  'no_witness': { [MARATHI]: 'साक्षीदार उपलब्ध नाही', [ENGLISH]: 'No witness available' },
  'footer_designation_1': { [MARATHI]: 'सहाय्यक अधिक्षक', [ENGLISH]: 'Assistant Superintendent' },
  'footer_designation_2': { [MARATHI]: 'दिवाणी व फौजदारी न्यायालय,', [ENGLISH]: 'Civil and Criminal Court,' },
};

const getTranslation = (key, lang) => {
  // Use the form type as the key directly for titles
  if (key === 'formTitle') {
    return translations[key] && translations[key][lang] ? translations[key][lang] : key;
  }

  const category = key.replace(/_body_.*$/, '');
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  // Handle form titles directly
  if (Object.keys(translations).includes(key) && translations[key][lang]) {
    return translations[key][lang];
  }
  return key; // Fallback to key if translation is missing
};


// =================================================================
// PrintLayout Component (Internal - Pure JSX/Marathi/English Layout)
// =================================================================

const PrintLayout = React.memo(({ data, printLanguage }) => {
  const {
    formType, caseType, caseNo, accusedName, lawSection, amount,
    summonDate, currentDate, courtLocation, policeStation, court, courtLocationEnglish,
    witnesses, courtVillage,courtLevel
  } = data;

  const lang = printLanguage;
  const t = (key) => getTranslation(key, lang);
  const isMarathi = lang === MARATHI;


  const caseLabel = useMemo(() => {
    const label = isMarathi ? t('case_no_label') : 'Case No.';
    if (caseType === 'R.C.C.' || caseType === 'S.C.C.') {
      return `${caseType}. ${label}`;
    }
    return `${caseType} ${label}`;
  }, [caseType, isMarathi]);


  const formatDdMmYyyy = useCallback((dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      // Assuming 'DD/MM/YYYY' is already in place for currentDate
      return dateString;
    }
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }, []);

  const renderCaseNumber = useCallback((label, value) => {
    if (value && value.trim() !== '') {
      return <p style={{ margin: '0 0 5px 0' }}>{label} <span className="data-placeholder">{value}</span></p>;
    }
    return null;
  }, []);

  const renderWitnessRows = useCallback((type) => {
    const tableHeaderNameKey = type === 'साक्षीदारास समन्स' ? 'table_header_name' : 'table_header_accused_name';
    const parties = witnesses.filter(w => w.name || w.address);
    if (parties.length === 0) {
      return (<tr key="no-witness"><td colSpan="3" style={{ textAlign: 'center' }}>{t('no_witness')}</td></tr>);
    }

    return parties.map((witness, index) => (
      <tr key={index + 1}>
        <td style={{ textAlign: 'center', width: '5%' }}>{index + 1}</td>
        <td style={{ width: '40%' }}>
          <span className="data-placeholder">{witness.name || '.....................'}</span>
        </td>
        <td style={{ width: '55%' }}>
          <span className="data-placeholder">{witness.address || '.....................'}</span>
        </td>
      </tr>
    ));
  }, [witnesses, t]);

  const accusedPlaceholder = accusedName || '.....................';
  const lawPlaceholder = lawSection || '.....................';
  const summonDateFormatted = formatDdMmYyyy(summonDate) || '.....................';
  const currentDateFormatted = currentDate || '.....................';
  const courtLocationPlaceholder = courtLocation || '.....................';
  const policeStationPlaceholder = policeStation || '.....................';
  const caseNoPlaceholder = caseNo || '.....................';


  const titleText = t(formType);
  console.log(formType, "tyep")
  const partyTableTitle = formType === 'साक्षीदारास समन्स' ? t('witness_table_title') : t('accused_table_title');
  let tableHeaderName
  if (formType === 'साक्षीदारास समन्स') {
    tableHeaderName = t('table_header_name')
  } else if (formType === 'जामीनदारास नोटीस') {
    tableHeaderName = t('table_header_surety_name')
  } else {
    tableHeaderName = t('table_header_accused_name')

  }




  // Content based on Form Type 
  const mainContent = useMemo(() => {
    const spaceIndent = <span style={{ whiteSpace: 'pre' }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;

    // साक्षीदारास समन्स (Witness Summons)
    if (formType === 'साक्षीदारास समन्स') {
      if (isMarathi) {
        return (
          <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
            <p className="body-paragraph">
              {spaceIndent}  ज्या अर्थी (आरोपीचे नांव) <span className="data-placeholder">{accusedPlaceholder}</span>  याने कायदा <span className="data-placeholder">{lawPlaceholder}</span>
              प्रमाणे अपराध केला आहे अशी माझ्याकडे फिर्याद देण्यात आली आहे आणि मला असे दिसुन येते की, फिर्यादीपक्षातर्फे तुम्ही महत्वाचा पुरावा देण्याची शक्यता आहे.
            </p>
            <p className="body-paragraph">
              {spaceIndent}  म्हणुन तुम्हाला याव्दारे या न्यायालयापुढे येत्या दिनांक <span className="data-placeholder">{summonDateFormatted}</span> रोजी सकाळी ठिक ११:०० वाजता उक्त फिर्यादीसंबंधाने तुम्हाला जे माहित आहे त्या बद्दल साक्ष देण्यासाठी उपस्थित होण्याचे आणि न्यायालयाचे परवानगीवाचून निघुन न जण्याचे समन्स पाठवण्यात येत आहे.
            </p>
            <p className="body-paragraph">
              {spaceIndent}  या कामी रास्त सबबीशिवाय हयगय केली तर, तुम्हाला हजर राहण्याची सक्ती करण्यासाठी वॉरंट काढले जाईल.
            </p>
            <div style={{ lineHeight: 1.5, }}>
              {renderCaseNumber(t('current_date_label'), currentDateFormatted)}
            </div>
          </div>
        );
      } else { // English Translation for Witness Summons
        return (
          <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
            <p className="body-paragraph">
              {spaceIndent} Whereas a complaint has been made before me that  <span className="data-placeholder">{accusedPlaceholder}</span> has committed an offence punishable under {lawPlaceholder}, and it appears to me that you are likely to give material evidence for the prosecution.
            </p>
            <p className="body-paragraph">
              {spaceIndent} You are hereby commanded to appear in this Court on the <span className="data-placeholder">{summonDateFormatted}</span> at 11:00 AM, to testify what you know concerning the said complaint, and not to depart thence without the permission of the Court.
            </p>
            <p className="body-paragraph">
              {spaceIndent} If you neglect or fail to comply with this Summons without any reasonable excuse, a Warrant shall be issued for compelling your attendance.
            </p>
            <div style={{ lineHeight: 1.5, }}>
              {renderCaseNumber('Dated this', currentDateFormatted)}
            </div>
          </div>
        );
      }
    } else if (formType === 'जामीनदारास नोटीस') {
      if (isMarathi) {
        return (
          <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
            <p className="body-paragraph">
              {spaceIndent} ज्या अर्थी (आरोपीचे नांव) <span className="data-placeholder">{accusedPlaceholder}</span> यास तुम्ही रूपये <span className="data-placeholder">{amount}</span> रक्कमेचे जामीन झाले आहात, सदरहु आरोपी हा वेळोवेळी तारखेस गैरहजर राहिला आहे.
            </p>
            <p className="body-paragraph">
              {spaceIndent} त्यापेक्षा शर्तीनुसार तुमचेकडुन रक्कम रूपये <span className="data-placeholder">{amount}</span> वसुल का करू नये ? या बाबत तुमचे कारण सांगणे कामी तुम्ही <span className="data-placeholder">{summonDateFormatted}</span> रोजी सकाळी ठिक १०:३० वाजता मनमाड शहर न्यायालयात हजर रहावे.
            </p>
            <p className="body-paragraph">
              {spaceIndent} यात कसुर करू नये अन्यथा आपल्या विरूध्द पुढील योग्य ती कार्यवाही करण्यात येईल.
            </p>
            <div style={{ lineHeight: 1.5 }}>
              {renderCaseNumber(t('current_date_label'), currentDateFormatted)}
            </div>
          </div>
        );
      } else { // English Translation for Notice to Surety
        return (
          <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
            <p className="body-paragraph">
              {spaceIndent} Whereas you have bound yourself as surety for (Name of Accused) <span className="data-placeholder">{accusedPlaceholder}</span> in the sum of Rs. <span className="data-placeholder">{amount}</span>, and the said accused has failed to appear in Court on the scheduled dates.
            </p>
            <p className="body-paragraph">
              {spaceIndent} You are hereby required to appear in this Court on the <span className="data-placeholder">{summonDateFormatted}</span> at 10:30 AM to show cause why the said sum of Rs. <span className="data-placeholder">{amount}</span> should not be recovered from you as per the conditions of the bond.
            </p>
            <p className="body-paragraph">
              {spaceIndent} Take notice that in case of default, further legal proceedings will be initiated against you.
            </p>
            <div style={{ lineHeight: 1.5 }}>
              {renderCaseNumber('Dated this', currentDateFormatted)}
            </div>
          </div>
        );
      }
    }

    // आरोपीस समन्स / सामनेवाला यांस नोंटीस (Accused Summons / Respondent Notice)
    if (isMarathi) {
      return (
        <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
          <p className="body-paragraph">
            {spaceIndent} ज्या अर्थी उक्त आरोपीस/सा.वाला/यांस वरील खटल्यात कायदा <span className="data-placeholder">{lawPlaceholder}</span> मध्ये उत्तर देण्याकरीता तुमची उपस्थिती आवश्यक आहे.  त्याअर्थी तुम्ही न्यायदंडाधिकारी प्रथम वर्ग, मनमाड शहर यांचे न्यायालयात दिनांक <span className="data-placeholder">{summonDateFormatted}</span> या दिवशी सकाळी 10:30 वाजता जातीने स्वतः अगर वकीलां मार्फत उपस्थित राहावे.
          </p>
          <p className="body-paragraph">
            {spaceIndent} यात कसुर झाल्यास तुमचे विरूध्द पुढील कार्यवाही करणेत येईल याची नोंद घ्यावी.
          </p>

          <div style={{ lineHeight: 1.5, }}>
            {renderCaseNumber(t('current_date_label'), currentDateFormatted)}
          </div>
        </div>
      );
    } else { // English Translation for Accused Summons / Respondent Notice
      const partyType = formType === 'आरोपीस समन्स' ? 'Accused' : 'Respondent';
      const orderType = formType === 'आरोपीस समन्स' ? 'Summons' : 'Notice';
      return (
        <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
          <p className="body-paragraph">
            {spaceIndent} Whereas your presence is necessary to answer the charge in the above case under {lawPlaceholder}. You are hereby required to appear in the Court of the Judicial Magistrate First Class, Manmad City, either in person or through a Pleader, on the <span className="data-placeholder">{summonDateFormatted}</span> at 10:30 AM.
          </p>
          <p className="body-paragraph">
            {spaceIndent} Take notice that in case of default, further proceedings will be taken against you.
          </p>

          <div style={{ lineHeight: 1.5, }}>
            {renderCaseNumber('Dated this', currentDateFormatted)}
          </div>
        </div>
      );
    }

}, [formType, accusedPlaceholder, lawPlaceholder, summonDateFormatted, isMarathi, t, currentDateFormatted, amount]);


  return (
    <div className="a4-page-content" style={{ fontSize: isMarathi ? "13pt" : "11pt", }}>

      {/* 1. शीर्षक / न्यायालय */}
      {/* Logic: Trim extra spaces and check if "मनमाड" exists in the string */}
{policeStation && (policeStation.trim().includes("मनमाड") || policeStation.toLowerCase().includes("manmad")) ? null : (
  <div style={{ lineHeight: "0.8", textAlign: "right" }}>
    <p>
      {isMarathi ? "जा.क्र." : "O.No"}/&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/202
    </p>
    <p>
      {isMarathi ? "दिनांक :" : "Date :"} &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;  &nbsp; /202
    </p>
  </div>
)}

      <p className="align-center court-title" style={{ fontWeight: "bold", fontSize: isMarathi ? "18pt" : "14pt", marginBottom: '5px' }}>
        {court}
        {/* <span className="data-placeholder">{isMarathi ? courtLocationPlaceholder : courtLocationEnglish}</span> */}
      </p>
      <p className="align-center" style={{ marginTop: '0', marginBottom: '15px', fontSize: '11pt' }}>
        {t('court_subtitle')}
      </p>
      <h2 className="align-center court-slogan" style={{ fontSize: isMarathi ? '18pt' : '16pt', margin: '15px 0 25px 0' }}>{titleText}</h2>

      {/* 2. केस क्रमांक आणि तारीख */}
      <div style={{ lineHeight: 1.5, textAlign: 'right' }}>
        {renderCaseNumber(caseLabel, caseNoPlaceholder)}
      </div>

      {/* 3. प्राप्तकर्ता पत्ता (पोलीस स्टेशन) */}
      <div style={{ marginTop: '10px', marginBottom: '10px', lineHeight: "1.6" }}>
        <p style={{ marginBottom: "3px" }}>{t('to_label')}</p>
        {policeStationPlaceholder.split(",").length > 1 ? policeStationPlaceholder.split(",").map((x) =>
          <p style={{ margin: '0', }}><span className="data-placeholder">{x}</span> </p>) : <p style={{ marginTop: '0' }}><span className="data-placeholder">{policeStationPlaceholder}</span> </p>}
        <p style={{ margin: '0' }}> &nbsp;&nbsp;&nbsp; {t('forward_label')}</p>
      </div>

      {/* 4. साक्षीदार/आरोपी/सामनेवाला यादी */}
      <div style={{ marginTop: '10px', }}>
        <table className="witness-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: isMarathi ? '10pt' : '11pt' }}>
          <thead style={{ fontSize: "15px" }}>
            <tr>
              <th style={{ width: '5%', border: '1px solid black', padding: '4px 6px' }}>{t('table_header_srno')}</th>
              <th style={{ width: '40%', border: '1px solid black', padding: '4px 6px' }}>{tableHeaderName}</th>
              <th style={{ width: '55%', border: '1px solid black', padding: '4px 6px' }}>{t('table_header_address')}</th>
            </tr>
          </thead >
          <tbody style={{ fontSize: "15px" }}>{renderWitnessRows(formType)}</tbody>
        </table>
      </div>

      {/* 5. समन्सचा मुख्य भाग */}
      {mainContent}

      {/* 6. तळटीप/स्वाक्षरी ब्लॉक */}
      {/* <div className="footer-section" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '50px' }}>
        <div className="signature-block align-right" style={{ lineHeight: 1.6, width: '40%', textAlign: 'center' }}>
          <p style={{ marginBottom: '0', marginTop: '0' }}>{t('footer_designation_1')}</p>
          <p style={{ marginBottom: '0', marginTop: '0' }}>{t('footer_designation_2')}</p>
          <p style={{ marginBottom: '0', marginTop: '0' }}><span >{isMarathi ? courtLocation : courtLocationEnglish}</span> </p>
        </div>
      </div> */}

      {/* 
      <div className="footer-section" style={{ marginTop: '30px', textAlign: 'right' }}>
        <div className="signature-block" style={{
          width: 'auto',
          display: 'inline-block',
          paddingTop: '5px',
          marginRight: '0px',
          textAlign: 'center'
        }}>
          {(() => {
            const originalName = data.court || "";

            // 1. Remove data after the last two commas
            const parts = originalName.split(',').map(p => p.trim());

            // Only remove if there are enough parts to remove, otherwise keep it as is
            const trimmedParts = parts.length > 2 ? parts.slice(0, -2) : parts;
            const cleanedName = trimmedParts.join(', ');

            // 2. Split by the first comma for the multi-line layout
            const firstCommaIndex = cleanedName.indexOf(',');

            if (firstCommaIndex !== -1) {
              const designation = cleanedName.substring(0, firstCommaIndex).trim();
              const remainingAddress = cleanedName.substring(firstCommaIndex + 1).trim();

              return (
                <>                                   <p style={{ marginBottom: '0', marginTop: '0' }}>{t('footer_designation_1')}</p>

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
          <p style={{ marginBottom: '0', marginTop: '0' }}>{t('footer_designation_1')}</p>

          {(() => {
            const psText = courtLevel || "";
            // Split by comma and map each part
            return psText.split(',').map((part, index) => (
              <div>
                <p key={index} style={{ margin: 0, padding: 0, fontWeight: index === 0 ? 'bold' : 'normal', textAlign: "center" }}>
                  {part.trim()}
                </p>
              </div>
            ));
          })()}
           <p style={{ margin: 0, padding: 0, textAlign: "center" }}>{courtVillage}</p>
        </div>
      </div>
    </div>
  );
});

// =================================================================
// SummonsFormApp Component (Main App)
// =================================================================

const SummonsFormApp = ({ courtConfig }) => {


  const [formData, setFormData] = useState({ // New selections
    formType: 'साक्षीदारास समन्स', // Default: साक्षीदारास समन्स
    caseType: 'R.C.C.',        // Default: R.C.C.

    // Data fields
    caseNo: '',
    accusedName: '',
    lawSection: '',
    amount: '',
    summonDate: '',
    currentDate: new Date().toLocaleDateString('en-GB'),
    courtLocation: 'मनमाड शहर न्यायालय, ता.नांदगाव जिल्हा नाशिक ',
    courtLocationEnglish: "Manmad City Court, Tq. Nandgaon Dist Nashik",
    policeStation: 'पोलीस निरीक्षक,पोलीस स्टेशन मनमाड शहर',
    court: "न्यायदंडाधिकारी प्रथमवर्ग,",
    witnesses: [
      { name: '', address: '' },
    ],
    courtLevel : '', 
        courtVillage : '', 
  });
  // ✨ NEW STATE FOR PRINT LANGUAGE
  const [printLanguage, setPrintLanguage] = useState(courtConfig.language === 'marathi' ? 'Marathi' : 'English');


  // const [printLanguage, setPrintLanguage] = useState(MARATHI);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWitnessChange = (index, field, value) => {
    const newWitnesses = formData.witnesses.map((witness, i) => {
      if (i === index) {
        return { ...witness, [field]: value };
      }
      return witness;
    });
    setFormData((prev) => ({ ...prev, witnesses: newWitnesses }));
  };

  const handleAddWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', address: '' }]
    }));
  };

  const handleFormTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      formType: type
    }));
  };

  const handleCaseTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      caseType: type,
      caseNo: ''
    }));
  };

  const handlePrintLanguageChange = (lang) => {
    setPrintLanguage(lang);
  };

  const caseLabelText = useMemo(() => {
    const langLabel = printLanguage === MARATHI ? 'क्रमांक' : 'No.';
    if (formData.caseType === 'R.C.C.' || formData.caseType === 'S.C.C.') {
      return `${formData.caseType}. ${langLabel}:`;
    }
    return `${formData.caseType} ${langLabel}:`;
  }, [formData.caseType, printLanguage]);


  // =================================================================
  // Print Handler (Adjusted Styles)
  // =================================================================
  const handlePrint = () => {
    const printContent = document.getElementById('print-area').innerHTML;
    const isMarathiPrint = printLanguage === 'Marathi';

    // 1. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const pri = iframe.contentWindow;

    // 2. Write content to the iframe
    pri.document.open();
    pri.document.write(`
      <html>
        <head>
          <title>Court Document</title>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 15mm 20mm 15mm 20mm; } 
            body { 
                font-family: ${isMarathiPrint ? '"Noto Sans Devanagari", Arial, sans-serif' : 'Arial, sans-serif'};
                font-size: ${isMarathiPrint ? '13pt' : '11pt'};
                line-height: 1.4;
                margin: 0;
                color: #000;
            }
            .a4-page-content { width: 100%; }
            .align-center { text-align: center; }
            .align-right { text-align: right; }
            .court-title { font-size: ${isMarathiPrint ? '16pt' : '14pt'}; font-weight: bold; }
            .court-slogan { font-size: ${isMarathiPrint ? '18pt' : '16pt'}; font-weight: bold; border-bottom: 2px solid #000; margin: 15px 0; }
            .body-paragraph { text-align: justify; margin-bottom: 12px; line-height: 1.6; }
            .data-placeholder { font-weight: bold;  #000; padding: 0 4px; }
            .witness-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            .witness-table th, .witness-table td { border: 1px solid black; padding: 4px 6px; }
            .signature-block { text-align: center; width: 40%; line-height: 1.3; }
            .footer-section { display: flex; justify-content: flex-end; margin-top: 30px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    pri.document.close();

    // 3. Trigger Print after content/fonts load
    setTimeout(() => {
      pri.focus();
      pri.print();
      // 4. Remove the iframe after the print dialog closes
      document.body.removeChild(iframe);
    }, 500);
  };

  // =================================================================
  // UI Rendering
  // =================================================================
  useEffect(() => {
    const isMar = courtConfig.language === 'marathi';
    setPrintLanguage(isMar ? 'Marathi' : 'English');

    setFormData(prev => ({
      ...prev,
      // Mapping from your dashboard config
      court: courtConfig.fullOfficeName || '',
      policeStation: courtConfig.policeStation || '',
       courtLevel : courtConfig.courtLevel, 
        courtVillage : courtConfig.courtVillage,
      //  courtLocationFooter: courtConfig.courtVillage || '',

      // Language specific labels
      //  dateLabel: isMar ? "दिनांक : " : "Date: ",
      //  outWordNo: isMar ? "जा. क्र :" : "Outward No:"
    }));
  }, [courtConfig]);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tailwind and Custom CSS for Form */}
      <style jsx global>{`
        .form-container {
            // max-width: 900px;
            margin: 0 auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }
        .input-group input, .input-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
            margin-bottom: 10px;
            font-size: 1rem;
        }
        .radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .radio-group label {
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
        }
        .radio-group input[type="radio"] {
            display: none; /* Hide default radio button */
        }
        .radio-group input[type="radio"]:checked + span {
            background-color: #3b82f6;
            color: white;
            border-color: #2563eb;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .radio-group label > span {
            padding: 8px 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            display: inline-block;
        }
        .print-button {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 10px;
            transition: background-color 0.3s;
        }
        .print-button:hover {
            background-color: #059669;
        }
        .add-button {
            background-color: #f59e0b;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s;
        }
        .add-button:hover {
            background-color: #d97706;
        }
        .witness-input-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .witness-input-table th, .witness-input-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .witness-input-table input {
            width: 100%;
            border: none;
            padding: 0;
            margin: 0;
            outline: none;
        }
      `}</style>

      <div className="form-container">

        {/* -------------------------------------- */}
        {/* ✨ 0. प्रिंट भाषा निवड (NEW) */}
        {/* -------------------------------------- */}
        {/* Wrapper for the Header Actions */}
        <div className="flex flex-row justify-between items-center mb-6">

          {/* Left Side: Language Toggle */}
          {/* <div className="radio-group !mb-0"> 
    {[MARATHI, ENGLISH].map(lang => (
      <label key={lang} className="mr-2 last:mr-0">
        <input
          type="radio"
          name="printLanguage"
          value={lang}
          checked={printLanguage === lang}
          onChange={() => handlePrintLanguageChange(lang)}
        />
        <span>{lang}</span>
      </label>
    ))}
  </div> */}

          {/* Right Side: Print Button */}
          {/* <button onClick={handlePrint} className="print-button !mb-0">
            प्रिंट करा 🖨️
          </button> */}

        </div>

        {/* -------------------------------------- */}
        {/* 1. फॉर्म प्रकार निवड */}
        {/* -------------------------------------- */}
        {/* Outer wrapper becomes the Flex Container */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">

          {/* Section 1: Document Type */}
          <div className="flex-2">
            <h3 className="text-xl font-semibold mt-4 mb-3 text-indigo-700">१. दस्तऐवजाचा प्रकार निवडा</h3>
            <div className="radio-group">
              {['साक्षीदारास समन्स', 'आरोपीस समन्स', 'सामनेवाला यांस नोटीस', 'जामीनदारास नोटीस'].map(type => (
                <label key={type}>
                  <input
                    type="radio"
                    name="formType"
                    value={type}
                    checked={formData.formType === type}
                    onChange={() => handleFormTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Case Type */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mt-4 mb-3 text-indigo-700">२. केसचा प्रकार निवडा</h3>
            <div className="radio-group">
              {['R.C.C.', 'Cri M.A.', 'D.V.', 'S.C.C.'].map(type => (
                <label key={type}>
                  <input
                    type="radio"
                    name="caseType"
                    value={type}
                    checked={formData.caseType === type}
                    onChange={() => handleCaseTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4 text-green-700">३. मूलभूत माहिती भरा</h3>

        {/* न्यायालय आणि ठिकाणे */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="input-group">
            <label>न्यायालय (उदा: न्यायदंडाधिकारी प्रथमवर्ग,):</label>
            <input type="text" name="court" value={formData.court} onChange={handleInputChange} placeholder="न्यायदंडाधिकारी प्रथमवर्ग," />
          </div>
          <div className="input-group">
            <label>न्यायालयाचे ठिकाण:</label>
            <input type="text" name="courtLocation" value={printLanguage === MARATHI ? formData.courtLocation : formData.courtLocationEnglish} onChange={handleInputChange} placeholder="मनमाड शहर" />
          </div>
          <div className="input-group">
            <label>पोलीस स्टेशनचे ठिकाण:</label>
            <input type="text" name="policeStation" value={formData.policeStation} onChange={handleInputChange} placeholder="मनमाड शहर पोलीस स्टेशन" />
          </div>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="input-group">
            <label>{caseLabelText} (क्रमांक):</label>
            <input type="text" name="caseNo" value={formData.caseNo} onChange={handleInputChange} placeholder="केस क्रमांक / Case Number" />
          </div>
          <div className="input-group">
            <label>समन्सची तारीख (दिनांक):</label>
            <input type="date" name="summonDate" value={formData.summonDate} onChange={handleInputChange} />
          </div>

          {(formData.formType === 'साक्षीदारास समन्स' || formData.formType === 'जामीनदारास नोटीस') &&
            <div className="input-group">
              <label>
                {formData.formType === 'साक्षीदारास समन्स' ? 'आरोपीचे नांव' : 'आरोपीचे/सामनेवाल्याचे नांव'}:
              </label>
              <input
                type="text"
                name="accusedName"
                value={formData.accusedName}
                onChange={handleInputChange}
                placeholder="पूर्ण नांव"
              />
            </div>
          }
          <div className="input-group">
            {formData.formType === 'जामीनदारास नोटीस' ? (
              // Section for जामीनदारास नोटीस
              <div>
                <label>रक्कम/Amount:</label>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            ) : (
              // Section for all other types
              <div className="input-group">
                <label>कायदा/कलम:</label>
                <input
                  type="text"
                  name="lawSection"
                  list="act-suggestions"
                  placeholder="निवडा किंवा जोडा (Select or Add Act)"
                  value={formData.lawSection}
                  onChange={handleInputChange}
                  className="form-control"
                />

                {/* The datalist stays inside this block or outside the ternary */}
                <datalist id="act-suggestions">
                  {actOptions.map((option) => (
                    <option
                      key={option.value}
                      value={printLanguage === MARATHI ? option.value : option.label}
                    >
                      {option.label}
                    </option>
                  ))}
                </datalist>
              </div>

            )}


            {/* The <datalist> provides suggestions but allows other input */}
            <datalist id="act-suggestions">
              {actOptions.map((option) => (
                <option key={option.value} value={printLanguage === MARATHI ? option.value : option.label}>
                  {option.label}
                </option>
              ))}
            </datalist>

          </div>

        </div>


        {/* केस क्रमांक */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
          
        </div> */}


        {/* आरोपी आणि कलम */}


        {/* साक्षदार यादी */}
        <>
          <h3 className="text-xl font-semibold mt-6 mb-4 text-purple-700">४. {formData.formType} नांव</h3>
          <table className="witness-input-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>अ.क्र</th>
                <th style={{ width: '45%' }}>{formData.formType} नांव</th>
                <th style={{ width: '45%' }}>राहणार (पत्ता)</th>
              </tr>
            </thead>
            <tbody>
              {formData.witnesses.map((witness, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={witness.name}
                      onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                      placeholder="साक्षीदाराचे नांव"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={witness.address}
                      onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                      placeholder="पत्ता"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleAddWitness} className="add-button">
            + साक्षदार जोडा
          </button>
        </>

        {/* आजची तारीख */}
        <div className="input-group" style={{ marginTop: '30px' }}>
          <label>आजची तारीख (दिनांक - DD/MM/YYYY):</label>
          <input
            type="text"
            name="currentDate"
            value={formData.currentDate}
            onChange={handleInputChange}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <button onClick={handlePrint} className="print-button mt-6">
          समन्स प्रिंट करा (Print Summons) 🖨️
        </button>

        {/* प्रिंटसाठी लपवलेला भाग - येथे PrintLayout वापरला जातो */}
        <div id="print-area" style={{ display: 'none' }}>
          <PrintLayout data={formData} printLanguage={printLanguage} />
        </div>
      </div>
    </div>
  );
};

export default SummonsFormApp;




