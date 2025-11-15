import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RegistrationForm({ doctors: parentDoctors, doctorsLoading: parentDoctorsLoading, doctorsError: parentDoctorsError, offers: parentOffers,readOnlyDoctor = false, }) {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

  // Get user info from localStorage
  const userCompanyId = localStorage.getItem("company_id");
  const userCompanyName = localStorage.getItem("company_name") || "";
  const token = localStorage.getItem("token");
  const [companies, setCompanies] = useState([]);
  const userRole = localStorage.getItem("role");
  const [generatedToken, setGeneratedToken] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);

const generateToken = () => {
  // Fetch the current counter from localStorage or start at 1
  const currentCount = parseInt(localStorage.getItem("mn_token_counter") || "0", 10) + 1;

  // Create a token with leading zeros (e.g., MN-01, MN-02, MN-10)
  const newToken = `MN-${String(currentCount).padStart(2, "0")}`;

  // Save the updated counter back to localStorage
  localStorage.setItem("mn_token_counter", currentCount.toString());

  // Update the component state
  setGeneratedToken(newToken);
  // Update formData with the token
  setFormData((prev) => ({
    ...prev,
    token: newToken
  }));
};

  const role = localStorage.getItem("role");
const loggedInUserId = parseInt(localStorage.getItem("user_id"));


  const [formData, setFormData] = useState({
    uhid: "",
    patientType: "General",
    fullName: "",
    gender: "",
    dob: "",
    age: 0,
    bloodGroup: "",
    mobile: "",
    alternateNumber: "",
    email: "",
    address1: "",
    aadhar: "",
    city: "",
    state: "",
    pin: "",
    reference: "",
    valid: "",
    billingType: "",
    registrationDate: today,
    visitDate: today,
    doctorId: "",
    company_id: userCompanyId, // Auto-assign company
    token:"",
  });

  const location = useLocation();
  const { appointment, mode } = location.state || {};

  useEffect(() => {
    if (appointment) {
      setFormData({
        uhid: appointment.uhid || "",
        patientType: appointment.patient_type || "General",
        fullName: appointment.fullName || "",
        gender: appointment.gender || "",
        dob: appointment.dob || "",
        age: appointment.age || "",
        bloodGroup: appointment.bloodGroup || "",
        mobile: appointment.mobile || "",
        alternateNumber: appointment.alternateNumber || "",
        email: appointment.email || "",
        address1: appointment.address1 || "",
        aadhar: appointment.aadhar || "",
        city: appointment.city || "",
        state: appointment.state || "",
        pin: appointment.pin || "",
        reference: appointment.reference || "",
        valid: appointment.valid || "",
        billingType: appointment.billingType || "",
        registrationDate: appointment.registrationDate || today,
        visitDate: appointment.visitDate || today,
        doctorId: appointment.doctor_id || "",
        company_id: userRole === "super_admin" ? appointment.company_id || "" : userCompanyId,
        token:appointment.token || "",
      });

      setBilling({
        registrationFee: appointment.registrationFee || "",
        consultationFee: appointment.consultationFee || "",
        Discount: appointment.Discount || "",
        totalAmount: appointment.totalAmount || 0,
        paymentStatus: appointment.paymentStatus || "Pending",
        paymentMethod: appointment.paymentMethod || "",
        amountPaid: appointment.amountPaid || "",
        returnAmount: appointment.returnAmount || "",
        transactionId: appointment.transactionId || "",
        transactionDate: appointment.transactionDate || "",
      });
    }
  }, [appointment]);

  const [uhidExists, setUhidExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctors, setDoctors] = useState(parentDoctors ?? []);
  const [doctorsLoading, setDoctorsLoading] = useState(!!parentDoctorsLoading);
  const [doctorsError, setDoctorsError] = useState(parentDoctorsError ?? null);
  const [profileImage, setProfileImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [billing, setBilling] = useState({
    registrationFee: "",
    consultationFee: "",
    Discount: "",
    totalAmount: 0,
    paymentStatus: "Pending",
    paymentMethod: "",
    amountPaid: "",
    returnAmount: "",
    transactionId: "",
    transactionDate: "",
  });

  // NEW: Function to fetch city and state from pincode
  const handlePincodeSearch = async (pincode) => {
    // Validate pincode format (6 digits for India)
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return;
    }

    setPincodeLoading(true);
    try {
      // Using Indian Postal Pincode API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District || "",
          state: postOffice.State || "",
        }));
      } else {
        // If pincode not found, clear city and state
        alert("⚠️ Invalid pincode or pincode not found");
        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Pincode lookup error:", error);
      alert("❌ Failed to fetch location details");
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name is required and should be at least 2 characters.";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Contact number is required.";
    } else if (!/^\+?\d{0,4}?[-\s()]?\d{6,15}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      newErrors.mobile = "Phone must be 10–15 digits.";
    }
    return newErrors;
  };

  const dobFromAge = (age) => {
    const years = parseInt(age, 10);
    if (Number.isNaN(years)) return "";
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return d.toISOString().split("T")[0];
  };

  const ageFromDob = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return "";
    const todayDate = new Date();
    let age = todayDate.getFullYear() - birth.getFullYear();
    const m = todayDate.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && todayDate.getDate() < birth.getDate())) {
      age--;
    }
    return String(age >= 0 ? age : 0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "dob") {
        next.age = ageFromDob(value);
      } else if (name === "age") {
        const numeric = value === "" ? "" : value.replace(/[^0-9]/g, "");
        next.age = numeric;
        if (numeric !== "") {
          next.dob = dobFromAge(numeric);
        }
      } else if (name === "pin") {
        // Trigger pincode lookup when pin is entered
        const pincode = value.trim();
        if (pincode.length === 6) {
          handlePincodeSearch(pincode);
        }
      }
      return next;
    });
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => {
      const updated = { ...prev, [name]: value };
      const regFee = parseFloat(updated.registrationFee) || 0;
      const consFee = parseFloat(updated.consultationFee) || 0;
      const discount = parseFloat(updated.Discount) || 0;
      const total = regFee + consFee - discount;


      updated.totalAmount = total;
      if (updated.paymentMethod === "Cash") {
      const amountPaid = parseFloat(updated.amountPaid) || 0;
      updated.returnAmount = amountPaid - total;
    }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUhidSearch = async () => {
    const uhid = formData.uhid?.trim();
    if (!uhid) return;

    try {
      const res = await fetch(`${API_BASE}/patients/uhid/${uhid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          alert("❌ No patient found for this UHID.");
          setUhidExists(false);
        } else {
          alert("⚠️ Error fetching patient data.");
        }
        return;
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        fullName: data.name || "",
        gender: data.gender || "",
        dob: data.dob || "",
        age: data.age || "",
        bloodGroup: data.blood_group || "",
        mobile: data.phone_number || "",
        email: data.email_id || "",
        address1: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pin: data.pincode || "",
        aadhar: data.aadhaar || "",
        reference: data.reference_doctor || "",
      }));

      setUhidExists(true);
      alert("✅ Patient details loaded successfully!");
    } catch (error) {
      console.error("UHID search failed:", error);
      alert("❌ Failed to fetch patient details.");
    }
  };

  const companyId =
  userRole === "super_admin"
    ? Number(formData.company_id) // from dropdown
    : Number(userCompanyId);      // from token/localStorage

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    alert("Please fix validation errors before submitting.");
    return;
  }

  // Check if token exists
  if (!token) {
    alert("❌ You must be logged in to create an appointment.");
    navigate("/login");
    return;
  }

  // ✅ FIX: Properly determine company_id based on user role
  const finalCompanyId = userRole === "super_admin" 
    ? parseInt(formData.company_id) // Use selected company for super_admin
    : parseInt(userCompanyId);       // Use logged-in user's company for others

  // ✅ FIX: Get company name properly
  const finalCompanyName = userRole === "super_admin"
    ? companies.find(c => c.id === finalCompanyId)?.name || ""
    : userCompanyName;

  console.log("Submitting with company_id:", finalCompanyId); // Debug log

  const patientPayload = {
    patient_type: formData.patientType,
    fullName: formData.fullName,
    gender: formData.gender,
    dob: formData.dob,
    age: parseInt(formData.age) || 0,
    bloodGroup: formData.bloodGroup,
    mobile: formData.mobile,
    alternateNumber: formData.alternateNumber,
    email: formData.email?.trim() || null,
    address1: formData.address1,
    city: formData.city,
    state: formData.state,
    pin: formData.pin,
    aadhar: formData.aadhar,
    reference: formData.reference,
    valid: formData.valid,
    billingType: billing.paymentMethod || formData.billingType,
    registrationDate: formData.registrationDate,
    visitDate: formData.visitDate,
    doctor_id: formData.doctorId ? parseInt(formData.doctorId) : null,
    patient_id: null,
    token : generatedToken || formData.token,
    registrationFee: parseInt(billing.registrationFee) || 0,
    consultationFee: parseInt(billing.consultationFee) || 0,
    Discount: parseInt(billing.Discount) || 0,
    totalAmount: parseInt(billing.totalAmount) || 0,
    paymentStatus: billing.paymentStatus,
    paymentMethod: billing.paymentMethod,
    amountPaid: parseInt(billing.amountPaid) || 0,
    returnAmount: billing.returnAmount,
    transactionId: billing.transactionId,
    transactionDate: billing.transactionDate?.trim() || null,
    company_id: finalCompanyId,  // ✅ Use the properly determined company_id
    company_name: finalCompanyName, // ✅ Use the properly determined company_name
  };

  console.log("Full payload:", patientPayload); // Debug log

  try {
    let response;
    const isEdit = !!appointment?.id;

    if (isEdit) {
      response = await fetch(`${API_BASE}/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientPayload),
      });
    } else {
      response = await fetch(`${API_BASE}/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientPayload),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      
      // Better error display
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map(err => 
          `${err.loc?.join(' > ') || 'Field'}: ${err.msg}`
        ).join('\n');
        throw new Error(errorMessages);
      }
      
      throw new Error(errorData.detail || `Failed: ${response.status}`);
    }

    const updatedAppointment = await response.json();
    alert(`✅ Appointment ${isEdit ? "updated" : "created"} successfully!`);
    setSuccess(true);
    navigate("/appointment")

  } catch (error) {
    console.error("Submit error:", error);
    alert("❌ Failed to submit form:\n" + String(error.message || error));
  }
};

  // Fetch doctors if not provided by parent
  useEffect(() => {
    setDoctors(parentDoctors ?? []);
    setDoctorsLoading(!!parentDoctorsLoading);
    setDoctorsError(parentDoctorsError ?? null);
  }, [parentDoctors, parentDoctorsLoading, parentDoctorsError]);

  useEffect(() => {
    if (typeof parentDoctors !== "undefined") return;
    let mounted = true;
    const load = async () => {
      setDoctorsLoading(true);
      try {
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const res = await fetch(`${API_BASE}/doctors/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to load doctors: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Fetched doctors:", data); // Debug log
        
        if (mounted) {
          // Ensure we have an array
          setDoctors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Doctor fetch error:", err);
        if (mounted) setDoctorsError(String(err));
      } finally {
        if (mounted) setDoctorsLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [parentDoctors, token, API_BASE]);

  useEffect(() => {
  if (userRole === "super_admin") {
    let mounted = true;
    const loadCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE}/companies/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch companies: ${res.status}`);
        const data = await res.json();
        if (mounted) setCompanies(data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    loadCompanies();
    return () => (mounted = false);
  }
}, [userRole, token]);

  // Fetch offers
  const [offers, setOffers] = useState(parentOffers ?? []);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState(null);

  useEffect(() => {
    setOffers(parentOffers ?? []);
  }, [parentOffers]);

  useEffect(() => {
    if (typeof parentOffers !== "undefined") return;
    let mounted = true;
    const loadOffers = async () => {
      setOffersLoading(true);
      try {
        const res = await fetch(`${API_BASE}/offers/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to load offers: ${res.status}`);
        const data = await res.json();
        if (mounted) setOffers(data || []);
      } catch (err) {
        if (mounted) setOffersError(String(err));
      } finally {
        if (mounted) setOffersLoading(false);
      }
    };
    loadOffers();
    return () => (mounted = false);
  }, [parentOffers, token]);

  return (
    <form onSubmit={handleSubmit} className="p-8 w-full mx-auto mt-6 space-y-8">
      {/* Section 1: Registration Details */}
      <div className="bg-[#F7DACD] p-6 rounded-xl shadow-sm">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
    Registration Details
  </h2>

  {/* All fields in one line */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
    {/* Registration Date */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">Registration Date:</label>
      <input
        type="date"
        name="registrationDate"
        value={formData.registrationDate}
        readOnly
        className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 bg-gray-100 cursor-not-allowed w-full"
      />
    </div>

    {/* Visit Date */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">Visit Date:</label>
      <input
        type="date"
        name="visitDate"
        value={formData.visitDate}
        onChange={handleChange}
        readOnly={mode === "view"}
        className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 w-full"
      />
    </div>

    {/* Company */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">Company:</label>
      {userRole === "super_admin" ? (
        <select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          disabled={mode === "view"}
          className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 bg-white w-full"
        >
          <option value="">-- Select Company --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={userCompanyName || `Company ID: ${userCompanyId}`}
          readOnly
          className="border rounded-lg px-3 py-2 outline-none bg-gray-100 cursor-not-allowed w-full"
        />
      )}
    </div>

    {/* Doctor */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">Doctor:</label>
      {doctorsLoading ? (
        <div className="px-3 py-2">Loading...</div>
      ) : doctorsError ? (
        <div className="text-red-600 px-3 py-2">Failed to load</div>
      ) : (
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          disabled={mode === "view" || readOnlyDoctor}
          className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 bg-white w-full"
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.user?.name ?? d.name ?? d.registration_no ?? `Doctor ${d.id}`}
            </option>
          ))}
        </select>
      )}
    </div>

    {/* UHID + Search */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">UHID No:</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          name="uhid"
          value={formData.uhid || ""}
          onChange={handleChange}
          onBlur={handleUhidSearch}
          placeholder="Enter UHID and press Tab"
          className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 w-full"
        />
        <button
          type="button"
          onClick={handleUhidSearch}
          className="bg-[#7E4363] text-white px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Section 2: Patient Registration */}
     <div className="bg-[#EFB79D82] p-8 rounded-xl shadow-sm w-full">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b">
    Patient Registration
  </h2>

  {/* ================== Patient Information Section ================== */}
  <div className="w-full space-y-8">
    {/* 🔹 Personal Information */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      <SelectInput
        label="Patient Type*"
        name="patientType"
        value={formData.patientType}
        onChange={handleChange}
        options={(() => {
          const base = ["General", "Camp"];
          if (offersLoading) return base;
          if (offersError) return base;
          const offerNames = (offers || []).map((o) => o.offer_name).filter(Boolean);
          return [...base, ...offerNames];
        })()}
        disabled={mode === "view"}
        bgColor="white"
      />

      <TextInput
        label="Full Name*"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        readOnly={mode === "view"}
        bgColor="white"
        error={errors.fullName}
      />

      <SelectInput
        label="Gender*"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        options={["Male", "Female", "Others", "PreferNotToSay"]}
        disabled={mode === "view"}
        bgColor="white"
        error={errors.gender}
      />

      <TextInput
        label="Age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        readOnly={mode === "view"}
      />
    </div>

    {/* 🔹 Address and Contact */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      <TextInput
        type="date"
        label="Date of Birth*"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        readOnly={mode === "view"}
        bgColor="white"
      />

      <TextInput
        label="Address"
        name="address1"
        value={formData.address1}
        onChange={handleChange}
        readOnly={mode === "view"}
      />

      <div className="relative w-full">
        <TextInput
          label="Pin Code*"
          name="pin"
          value={formData.pin}
          onChange={handleChange}
          readOnly={mode === "view"}
          maxLength={6}
        />
        {pincodeLoading && (
          <div className="absolute right-3 top-9 text-blue-600 text-sm">
            Loading...
          </div>
        )}
      </div>

      <TextInput
        label="City*"
        name="city"
        value={formData.city}
        onChange={handleChange}
        readOnly={mode === "view" || pincodeLoading}
      />

      <TextInput
        label="State*"
        name="state"
        value={formData.state}
        onChange={handleChange}
        readOnly={mode === "view" || pincodeLoading}
      />

      <TextInput
        label="Mobile Number*"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        readOnly={mode === "view"}
        error={errors.mobile}
      />

      <TextInput
        label="Alternate Number"
        name="alternateNumber"
        value={formData.alternateNumber}
        onChange={handleChange}
        readOnly={mode === "view"}
      />

      <TextInput
        label="Reference*"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        readOnly={mode === "view"}
      />

      <TextInput
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        readOnly={mode === "view"}
      />

      
    </div>

    {/* 🔹 Aadhar + Validity */}
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 w-full">

      <TextInput
        label="Blood Group"
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        readOnly={mode === "view"}
      />
      <TextInput
        label="Aadhar No*"
        name="aadhar"
        value={formData.aadhar}
        onChange={handleChange}
        readOnly={mode === "view"}
      />

      <TextInput
        label="Valid Upto*"
        name="valid"
        value={formData.valid}
        onChange={handleChange}
        readOnly={mode === "view"}
      />
    </div>


    {/* ================== Separate Billing Section ================== */}
<div className="bg-white mt-10 rounded-xl p-8 shadow-sm w-full">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">
    Billing Details
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {["registrationFee", "consultationFee", "Discount", "totalAmount"].map((field) => (
      <TextInput
        key={field}
        label={field.replace(/([A-Z])/g, " $1").trim()}
        name={field}
        type="number"
        value={billing[field]}
        onChange={handleBillingChange}
        readOnly={mode === "view" || field === "totalAmount"}
        bgColor="#F7DACD"
      />
    ))}

    <SelectInput
      label="Payment Method"
      name="paymentMethod"
      value={billing.paymentMethod}
      onChange={handleBillingChange}
      options={["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"]}
      disabled={mode === "view"}
    />
  </div>

  {/* 🔹 Conditional Payment Fields */}
  {billing.paymentMethod === "Cash" && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      <TextInput
        label="Amount Paid"
        name="amountPaid"
        type="number"
        value={billing.amountPaid || ""}
        onChange={handleBillingChange}
        readOnly={mode === "view"}
        bgColor="#F7DACD"
      />
      <TextInput
        label="Return Amount"
        name="returnAmount"
        type="number"
        value={billing.returnAmount || ""}
        onChange={handleBillingChange}
        readOnly={mode === "view"}
        bgColor="#F7DACD"
      />
      <TextInput
        label="Transaction Date"
        name="transactionDate"
        type="date"
        value={billing.transactionDate || ""}
        onChange={handleBillingChange}
        readOnly={mode === "view"}
        bgColor="#F7DACD"
      />
    </div>
  )}

  {billing.paymentMethod && billing.paymentMethod !== "Cash" && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      <TextInput
        label="Transaction ID"
        name="transactionId"
        value={billing.transactionId || ""}
        onChange={handleBillingChange}
        readOnly={mode === "view"}
        bgColor="#F7DACD"
      />
      <TextInput
        label="Transaction Date"
        name="transactionDate"
        type="date"
        value={billing.transactionDate || ""}
        onChange={handleBillingChange}
        readOnly={mode === "view"}
        bgColor="#F7DACD"
      />
    </div>
  )}
</div>

    {/* 🔹 Buttons */}
    <div className="flex justify-end gap-4 mt-6">
      {mode === "view" ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Cancel
        </button>
      ) : (
        <>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  </div>
</div>



     
    </form>
  );
}

// Reusable Components
function TextInput({ label, name, value, onChange, type = "text", bgColor, readOnly, error, maxLength }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-sm ${
          bgColor ? "" : "bg-white"
        } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        style={bgColor ? { backgroundColor: bgColor } : {}}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectInput({ label, name, value, onChange, options, bgColor, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-sm ${
          bgColor ? "" : "bg-[#F7DACD]"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        style={bgColor ? { backgroundColor: bgColor } : {}}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}