import React from 'react';

// Staff Data (including the new record and N/A dates)
const staffData = [
  { akr: 1, name: "श्री व्ही.बी. पाटील", designation: "सहारूयक अधिक्षक", joiningDate: "N/A", mobile: "9922441858", dob: "N/A" },
  { akr: 2, name: "श्री टी.पी सोनार", designation: "सहाय्यक अधिक्षक", joiningDate: "N/A", mobile: "9579055375", dob: "N/A" },
  { akr: 3, name: "श्री व्ही.जे माेरे", designation: "लघुलेखक", joiningDate: "N/A", mobile: "N/A", dob: "N/A" },
  { akr: 4, name: "श्री एस.एस महाले", designation: "वरिष्ठ लिपिक", joiningDate: "N/A", mobile: "9175605886", dob: "N/A" },
  { akr: 5, name: "श्री एम.सी. उबाळे", designation: "वरिष्ठ लिपिक", joiningDate: "N/A", mobile: "9960110652", dob: "N/A" },
  { akr: 6, name: "श्री बी.जी.निकम", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9850451540", dob: "N/A" },
  { akr: 7, name: "श्री एल.एम. साळुंखे", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9764266102", dob: "N/A" },
  { akr: 8, name: "श्री एस.ए. शेलार", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "8888952626", dob: "N/A" },
  { akr: 9, name: "श्री एच.ए. सोनवणे", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "7588736378", dob: "N/A" },
  { akr: 10, name: "श्री एस.पी. सोवितकर", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "8855802085", dob: "N/A" },
  { akr: 11, name: "श्री डी.जे. वाघ", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "8600974976", dob: "N/A" },
  { akr: 12, name: "श्री इ.एस. खैरणार", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9422353561", dob: "N/A" },
  { akr: 13, name: "श्री एस.डी. मेश्राम", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "8208902417", dob: "N/A" },
  { akr: 14, name: "श्री व्ही.एस. विसपुते", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9890455132", dob: "N/A" },
  { akr: 15, name: "श्री एम.आर. काथार", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9552976876", dob: "N/A" },

  { akr: 16, name: "श्री एस.जे. येवले", designation: "कनिष्ठ लिपिक", joiningDate: "N/A", mobile: "9028961411", dob: "N/A" },
  { akr: 17, name: "श्री एन.डी. निकम ", designation: "हेड बेलीफ", joiningDate: "N/A", mobile: "8624914169", dob: "N/A" },

  { akr: 18, name: "श्री एस.व्ही. बारे ", designation: "बेलीफ", joiningDate: "N/A", mobile: " 9623293004", dob: "N/A" },
  { akr: 19, name: "श्री एस.के. जाधव", designation: "शिपाई-पहारेकरी", joiningDate: "N/A", mobile: "9657358758", dob: "N/A" },
  { akr: 20, name: "श्री ए.टी. गांगुर्डे", designation: "शिपाई-पहारेकरी", joiningDate: "N/A", mobile: "9637493917", dob: "N/A" },
  { akr: 21, name: "श्री डी.बी.हिरे", designation: "शिपाई-पहारेकरी", joiningDate: "N/A", mobile: "8983322788", dob: "N/A" },
  { akr: 22, name: "श्री बी.एन.घोडके", designation: "सफाईगार", joiningDate: "N/A", mobile: "8788160136", dob: "N/A" },
   { akr: 23, name: "श्री एन.एस.पाटील", designation: "शिपाई-पहारेकरी", joiningDate: "N/A", mobile: "9130555620", dob: "N/A" },
];


const StaffInformationTable = () => {
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        🏢 कर्मचारी माहिती सारणी (Staff Information Table)
      </h2>
      
      {/* 1. Outer Container for Shadow and Responsive Scroll */}
      <div className="shadow-2xl rounded-xl border border-gray-200 overflow-x-auto">
        
        {/* 2. Inner wrapper to enforce max height and vertical scroll */}
        <div className="max-h-[75vh] overflow-y-auto">
          
          <table className="min-w-full divide-y divide-indigo-200 bg-white">
            
            {/* Table Header (Use the 'table-header-group' and 'sticky' for scroll) */}
            <thead className="bg-indigo-600 text-white sticky top-0 z-10">
              <tr>
                <th scope="col" className="w-16 py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                  अ.क्र.
                </th>
                <th scope="col" className="w-64 px-3 py-3.5 text-left text-sm font-semibold">
                  कर्मचारीचे नांव
                </th>
                <th scope="col" className="w-40 px-3 py-3.5 text-left text-sm font-semibold hidden md:table-cell">
                  पदनाम (Designation)
                </th>
                <th scope="col" className="w-40 px-3 py-3.5 text-left text-sm font-semibold hidden lg:table-cell">
                  Date of Joining
                </th>
                <th scope="col" className="w-40 px-3 py-3.5 text-left text-sm font-semibold">
                  मोबाईल नंबर
                </th>
                <th scope="col" className="w-40 px-3 py-3.5 text-left text-sm font-semibold hidden lg:table-cell">
                  जन्म दिनांक
                </th>
              </tr>
            </thead>
            
            {/* Table Body - Data Rows */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {staffData.map((staff, index) => (
                <tr 
                  key={staff.akr} 
                  className={index % 2 === 0 ? 'bg-white hover:bg-indigo-50 transition duration-150' : 'bg-gray-50 hover:bg-indigo-50 transition duration-150'}
                >
                  {/* अ.क्र. */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {staff.akr}
                  </td>
                  
                  {/* कर्मचारीचे नांव */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    <div className="font-semibold">{staff.name}</div>
                    <div className="text-gray-500 text-xs md:hidden">{staff.designation}</div>
                  </td>

                  {/* पदनाम (Designation) */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {staff.designation}
                  </td>
                  
                  {/* Date of Joining (N/A) */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    <span className="text-gray-400">{staff.joiningDate}</span>
                  </td>
                  
                  {/* मोबाईल नंबर */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600 font-semibold">
                    {staff.mobile !== 'N/A' ? (
                      <a href={`tel:${staff.mobile}`} className="hover:text-indigo-800">
                        📞 {staff.mobile}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  
                  {/* जन्म दिनांक (N/A) */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    <span className="text-gray-400">{staff.dob}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Fallback/Empty state */}
          {staffData.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              माहिती उपलब्ध नाही. (No data available.)
            </div>
          )}
        </div>
      </div>

    
    </div>
  );
};

export default StaffInformationTable;