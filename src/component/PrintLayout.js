import React from 'react';

const PrintLayout = ({ data }) => {

  const formatDdMmYyyy = (dateString) => {
    // 1. इनपुट '2025-11-13' तपासा
    if (!dateString) return '';

    // 2. '-' (डॅश) वापरून विभाजित करा
    const parts = dateString.split('-'); // परिणाम: ['2025', '11', '13']
    
    // 3. आवश्यक भाग उपलब्ध आहेत का ते तपासा
    if (parts.length !== 3) {
      return dateString;
    }

    // 4. [दिन, महिना, वर्ष] या क्रमाने जोडा
    // parts[2] = '13' (दिन)
    // parts[1] = '11' (महिना)
    // parts[0] = '2025' (वर्ष)
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // परिणाम: '13/11/2025'
  };

  const renderCaseNumber = (label, value) => {
    // value रिकामी, null किंवा undefined नसेल तरच ते दर्शवा
    if (value && value.trim() !== '') {
      return <p>{label} <span className="data-placeholder">{value}</span></p>;
    }
    return null; // नसल्यास काहीही दर्शवू नका
  };

  const renderWitnessRows = () => {
    if (data.witnesses.length === 0) {
      return (<tr><td colSpan="3" style={{ textAlign: 'center' }}>साक्षीदार उपलब्ध नाही</td></tr>);
    }

    return data.witnesses.map((witness, index) => (
      <tr key={index + 1}>
        <td style={{ textAlign: 'center', width: '5%' }}>{index + 1}</td>
        <td style={{ width: '40%' }}>
          <span className="data-placeholder">{witness.name}</span>
        </td>
        <td style={{ width: '55%' }}>
          <span className="data-placeholder">{witness.address}</span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="a4-page" style={{fontSize:"16px",marginTop:"100px"}}>
      {/* शीर्षलेख */}
      <p className="align-center court-title" style={{ fontWeight: "bold", fontSize: "18px" }}>
        <span className="data"></span>
         {/* न्यायदंडाधिकारी प्रथमवर्ग,  */}
         {data.court}
         <span className="data">{data.courtLocation}</span>  यांचे न्यायालयात,
      </p>
      <p className="align-center" style={{ marginTop: '0' }}>
        (न्यायालय क्रमांक १)
      </p>
      <h2 className="align-center court-slogan">साक्षीदारास समन्स</h2>

      <div style={{ marginBottom: '10px', width: '100%', textAlign: 'right' }}>


        {renderCaseNumber('R.C.C. No.', data.rccNo)}
        {renderCaseNumber('S.C.C. No.', data.sccNo)}
      </div>

      {/* प्राप्तकर्ता पत्ता */}
      <div style={{ marginTop: '10px', marginBottom: '10px', lineHeight: "1.6" }}>
        <p style={{ marginBottom: '0' }}>प्रति,</p>
        <p style={{ marginBottom: '0' }}>पोलीस निरीक्षक,</p>
        <p style={{  marginTop: '0' }}><span className="data">{data.policeStation}</span> पोलीस स्टेशन, यांना बजावणीसाठी अग्रेषीत</p>
      </div>

      {/* साक्षीदारांची यादी */}
      <div style={{ marginTop: '10px' }}>
        <p style={{ marginBottom: '5px' }}>साक्षीदारांचे नांव</p>
        <table className="witness-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>अ.क्र</th>
              <th style={{ width: '40%' }}>साक्षीदाराचे नांव</th>
              <th style={{ width: '55%' }}>राहणार</th>
            </tr>
          </thead>
          <tbody>{renderWitnessRows()}</tbody>
        </table>
      </div>

      {/* समन्सचा मुख्य भाग - तारीख निश्चित केली आहे */}
      <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
        <p className="body-paragraph">
          &nbsp;&nbsp;  &nbsp;&nbsp; ज्या अर्थी (आरोपीचे नांव) <span className="data-placeholder">{data.accusedName} </span>  याने कायदा <span className="data-placeholder">{data.lawSection}</span>
          प्रमाणे अपराध केला आहे अशी माझ्याकडे फिर्याद देण्यात आली आहे आणि मला असे दिसुन येते की, फिर्यादीपक्षातर्फे तुम्ही महत्वाचा पुरावा देण्याची शक्यता आहे.
        </p>

        <p className="body-paragraph">
          &nbsp;&nbsp;  &nbsp;&nbsp; म्हणुन तुम्हाला याव्दारे या न्यायालयापुढे येत्या दिनांक <span className="data-placeholder">{formatDdMmYyyy(data.summonDate)}</span> रोजी सकाळी ठिक ११:०० वाजता उक्त फिर्यादीसंबंधाने तुम्हाला जे माहित आहे त्या बद्दल साक्ष देण्यासाठी उपस्थित होण्याचे आणि न्यायालयाचे परवानगीवाचून निघुन न जण्याचे समन्स पाठवण्यात येत आहे.
        </p>
        <p className="body-paragraph">
          &nbsp;&nbsp;  &nbsp;&nbsp; या कामी रास्त सबबीशिवाय हयगय केली तर, तुम्हाला हजर राहण्याची सक्ती करण्यासाठी वॉरंट काढले जाईल.
        </p>
      </div>
      <p className="date-line">
        आज दिनांक <span className="data-placeholder">{data.currentDate}</span>
      </p>
      {/* तळटीप/स्वाक्षरी ब्लॉक - आजची तारीख निश्चित केली आहे */}
      <div className="footer-section">
        <p className="date-line">
          {/* आज दिनांक <span className="data-placeholder">{data.currentDate}</span> */}
        </p>

        <div className="signature-block align-right" style={{ lineHeight: 1.6 }}>
          <p style={{ marginBottom: '0', marginTop: '0', textAlign: 'center' }}>सहाय्यक अधिक्षक</p>
          <p style={{ marginBottom: '0', marginTop: '0', textAlign: 'center' }}>दिवाणी व फौजदारी न्यायालय,</p>
          <p style={{ marginBottom: '0', marginTop: '0', textAlign: 'center' }}><span className="data-placeholder">{data.courtLocation}</span> </p>
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;