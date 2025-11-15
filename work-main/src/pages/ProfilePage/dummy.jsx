import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { FaUpload } from "react-icons/fa";
import Select from "react-select";
import DaysDropdown from "./DayDropdown";

const DoctorEditing = () => {
  const [profile, setProfile] = useState({
    company: "Hospease Health Systems Pvt Ltd",
    userType: "Doctor",
    name: "Dr. John Mathew",
    regId: "HSP-2025-012",
    gender: "Male",
    dob: "1980-04-12",
    bloodGroup: "O+",
    age: "45",
    phone: "9876543210",
    altPhone: "9998877766",
    email: "johnmathew@hospease.com",
    address: "123, Green Avenue, Kochi, Kerala, India",
    emergencyName: "Mary Mathew",
    emergencyNumber: "9898989898",
    education: "MBBS, MS - General Surgery",
    profilePhoto: "/icons/profile.jpg",

    // Doctor fields
    specialization: "General Surgery",
    licenseNo: "KL/MC/2025/001",
    issuingCouncil: "Kerala Medical Council",
    consultationFee: "800",
    languages: [],
    certifications: null,
    years: "15",
    previous: "Aster Hospital",
    Designation: "Senior Surgeon",
    Duration: "10 Years",
    awards: "Best Surgeon 2023",
    experienceCertificate: null,

    // ✅ Availability fields
    availableDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
    teleconsultationDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
    onCallDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
  });

  const [showDays, setShowDays] = useState(false);
  const [showTeleconsultation, setShowTeleconsultation] = useState(false);
  const [showOnCall, setShowOnCall] = useState(false);

  const languagesList = [
    { value: "English", label: "English" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Hindi", label: "Hindi" },
    { value: "Tamil", label: "Tamil" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile({ ...profile, [name]: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setProfile({ ...profile, profilePhoto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h1 className="font-bold text-4xl m-10">Profile Editing</h1>
      <div className="max-w-8xl md:m-10 bg-[#F7DACD] mx-auto p-8 rounded-2xl mt-8">
        {/* HEADER ROW */}
        <div className="grid md:grid-cols-3 gap-6 items-center mb-8">
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">Company Name</label>
              <input
                type="text"
                value={profile.company}
                disabled
                className="w-full border bg-gray-100 text-gray-700 font-semibold rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">User Type</label>
              <input
                type="text"
                value={profile.userType}
                disabled
                className="w-full border bg-gray-100 text-gray-700 font-semibold rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Registration ID
              </label>
              <input
                type="text"
                name="regId"
                value={profile.regId}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={profile.profilePhoto}
                alt="Profile"
                className="w-44 h-56 rounded-md object-cover bg-gray-100 shadow-md"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                <Pencil size={14} />
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* MAIN DETAILS */}
        <div className="p-6 space-y-6">
          {/* Gender, DOB, Blood Group, Age */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Alternate Number
              </label>
              <input
                type="text"
                name="altPhone"
                value={profile.altPhone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full border bg-gray-100 text-gray-700 rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold text-gray-700">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 h-20 resize-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Emergency + Qualification */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700">
                Emergency Contact Person
              </label>
              <input
                type="text"
                name="emergencyName"
                value={profile.emergencyName}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Emergency Contact Number
              </label>
              <input
                type="text"
                name="emergencyNumber"
                value={profile.emergencyNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                name="education"
                value={profile.education}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>
   
       {/* --- PROFESSIONAL INFORMATION --- */}
          <h2 className="text-3xl md:m-10 font-bold mt-12">Professional Information*</h2>
          <div className="bg-[#F7DACD] md:m-10 p-10 rounded-xl grid md:grid-cols-4 gap-4">
            <div>
              <label>Specialization / Department*</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Medical Registration Number*</label>
              <input
                type="text"
                name="licenseNo"
                value={profile.licenseNo}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Issuing Medical Council*</label>
              <input
                type="text"
                name="issuingCouncil"
                value={profile.issuingCouncil}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Consultation Fee*</label>
              <input
                type="text"
                name="consultationFee"
                value={profile.consultationFee}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Languages Spoken*</label>
              <Select
                isMulti
                name="languages"
                options={languagesList}
                className="w-60 text-sm"
                value={profile.languages}
                onChange={(selected) =>
                  setProfile({ ...profile, languages: selected })
                }
                placeholder="Select languages..."
              />
            </div>
            <div>
              <label>Certifications (BLS/ACLS, etc.)*</label>
              <label className="flex items-center justify-between w-60 h-20 px-3 border rounded text-sm text-gray-600 cursor-pointer bg-white hover:bg-gray-100">
                <span>Upload file</span>
                <FaUpload className="text-gray-500" />
                <input
                  type="file"
                  name="certifications"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {profile.certifications && (
                <p className="mt-2 text-sm text-gray-600">
                  {profile.certifications.name}
                </p>
              )}
            </div>
          </div>

          {/* --- WORK EXPERIENCE --- */}
          <h2 className="text-3xl md:m-10 font-bold mt-12">Work Experience*</h2>
          <div className="bg-[#F7DACD] md:m-10 p-10 rounded-xl grid md:grid-cols-4 gap-4">
            <div>
              <label>Total Years of Experience*</label>
              <input
                type="text"
                name="years"
                value={profile.years}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Previous Hospital / Organization*</label>
              <input
                type="text"
                name="previous"
                value={profile.previous}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Designation Held*</label>
              <input
                type="text"
                name="Designation"
                value={profile.Designation}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Duration*</label>
              <input
                type="text"
                name="Duration"
                value={profile.Duration}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Awards / Recognitions*</label>
              <input
                type="text"
                name="awards"
                value={profile.awards}
                onChange={handleChange}
                className="w-60 h-20 p-2 rounded-lg border text-sm resize-none"
              />
            </div>
            <div>
              <label>Upload Experience Certificate*</label>
              <label className="flex items-center justify-between w-60 h-20 px-3 border rounded text-sm text-gray-600 cursor-pointer bg-white hover:bg-gray-100">
                <span>Upload file</span>
                <FaUpload className="text-gray-500" />
                <input
                  type="file"
                  name="experienceCertificate"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {profile.experienceCertificate && (
                <p className="mt-2 text-sm text-gray-600">
                  {profile.experienceCertificate.name}
                </p>
              )}
            </div>
          </div>


      {/* Availability Section */}
      <h2 className="text-3xl md:m-10 font-bold mt-12">Availability*</h2>
      <div className="bg-[#F7DACD] md:m-10 p-10 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <DaysDropdown
          label="Available Days"
          section="availableDays"
          show={showDays}
          setShow={setShowDays}
          profile={profile}
          setProfile={setProfile}
        />
        <DaysDropdown
          label="Teleconsultation Availability"
          section="teleconsultationDays"
          show={showTeleconsultation}
          setShow={setShowTeleconsultation}
          profile={profile}
          setProfile={setProfile}
        />
        <DaysDropdown
          label="On-Call Availability"
          section="onCallDays"
          show={showOnCall}
          setShow={setShowOnCall}
          profile={profile}
          setProfile={setProfile}
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="text-right pt-8 md:m-10">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DoctorEditing;
