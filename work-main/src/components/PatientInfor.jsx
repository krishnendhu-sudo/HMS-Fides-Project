import React from "react";
import patient from "../assets/patient.jpg";

const PatientInfo = () => {
  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      {/* Heading */}
      <h2 className="text-4xl md:text-3xl font-bold">
        Patient Information
      </h2>

      {/* Patient Card */}
      <div className="bg-[#F7DACD] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        {/* Left - Details */}
        <div className="space-y-2 font-medium text-2xl w-full md:w-2/3">
          <p>
            <span className="font-bold">Name:</span> SACHIN
          </p>
          <p>
            <span className="font-bold">Age:</span> 55 YEARS
          </p>
          <p>
            <span className="font-bold">Gender:</span> Male
          </p>
          <p>
            <span className="font-bold">MR Number:</span> 196615
          </p>
          <p>
            <span className="font-bold">Visit Date:</span> 2025-08-28
          </p>
          <p>
            <span className="font-bold">Visit Type:</span> NEW GUEST | GENERAL CONSULTATION
          </p>
          <p>
            <span className="font-bold">Doctor:</span> DOCTOR
          </p>
        </div>

        {/* Right - Image */}
        <div className="flex-shrink-0">
          <img
            src={patient}
            alt="Patient"
            className="w-[208px] h-[210px] object-cover rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
