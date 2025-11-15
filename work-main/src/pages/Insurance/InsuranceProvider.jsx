import React from 'react'
import ButtonFun from "./ButtonFun";

const InsuranceProvider = () => {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold text-[32px] '>Insurance</h1>
     <ButtonFun/>
     {/* Main container with flexbox */}
        
      {/* Main container with flexbox */}
<div className="flex gap-6 items-start">
  {/* Left Side Box (narrower width, auto height) */}
  <div className="w-1/4 mt-14 bg-[#CBDCEB] p-4 rounded-lg shadow self-start h-auto">
    <h3 className="text-lg font-semibold mb-3">Company Name</h3>
    <p className="whitespace-pre-line  leading-relaxed">
      APOLLO MUNICH INSURANCE{"\n"}
      BAJAJ ALLIANZ GENERAL INSURANCE CO.LTD{"\n"}
      BSNL{"\n"}
      BSNL EMPLOYEES & PENSIONERS{"\n"}
      BSNL EMPLOYEES AND PENSIONERS{"\n"}
      CARE HEALTH INSURANCE LTD{"\n"}
      CGI{"\n"}
      CMCHISTN{"\n"}
      Cholamandalam MS General Insurance{"\n"}
      ECHS
    </p>
  </div>

  {/* Right Side Box (2/3 width) */}
  <div className="w-3/4 mt-8">
   

    {/* 2-column input grid with 20 input boxes */}
    <div className="grid grid-cols-2 gap-4">
      {[
        "Company Name*",
        "Address",
        "City",
        "City",
        "State",
        "Pin code",
        "Contact Person",
        "Phone",
        "Mobile",
        "Fax",
        "Email",
        "Format",
        "Hospital ID",
        "Credit Limit",
        "Insurance Type",
        "Export Code",
        "Service Tax Applicable",
        "TDS Mandatory",
        "Valid From",
        "Valid To",
      ].map((label, idx) => (
        <div key={idx} className="flex flex-col">
          <label className=" text-xl mb-1">{label}</label>
          <input
            type="text"
           
            className="border px-3 py-2 rounded h-[53px] bg-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      ))}
    </div>
  </div>
</div>


    </div>
  )
}

export default InsuranceProvider
