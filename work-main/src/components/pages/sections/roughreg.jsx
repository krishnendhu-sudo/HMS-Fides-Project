// ============================================
// CHANGES TO MAKE IN YOUR RegistrationForm.jsx
// ============================================

// 1. REMOVE THESE STATE VARIABLES (around line 75-76)
// ❌ DELETE THIS LINE:
// const [profileImage, setProfileImage] = useState(null);

// 2. ADD TOKEN GENERATION STATE (add after other useState declarations)
// ✅ ADD THIS:
const [generatedToken, setGeneratedToken] = useState("");

// 3. REMOVE IMAGE HANDLER FUNCTION (around line 180)
// ❌ DELETE THIS ENTIRE FUNCTION:
/*
const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setProfileImage(e.target.files[0]);
  }
};
*/

// 4. ADD TOKEN GENERATOR FUNCTION (add where handleImageChange was)
// ✅ ADD THIS:
const generateToken = () => {
  // Generate a unique token (you can customize the format)
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  const newToken = `TKN-${timestamp}-${random}`;
  setGeneratedToken(newToken);
  
  // Update formData with the token
  setFormData((prev) => ({
    ...prev,
    token: newToken
  }));
};

// 5. UPDATE formData INITIAL STATE (around line 25)
// ✅ ADD 'token' field to formData:
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
  company_id: userCompanyId,
  token: "", // ✅ ADD THIS LINE
});

// 6. UPDATE useEffect FOR APPOINTMENT (around line 50)
// ✅ ADD token field:
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
      token: appointment.token || "", // ✅ ADD THIS LINE
    });

    // ... rest of the code
  }
}, [appointment]);

// 7. REMOVE IMAGE UPLOAD LOGIC IN handleSubmit (around line 240-255)
// ❌ DELETE THIS ENTIRE SECTION:
/*
let uploadedImagePath = null;

if (profileImage) {
  try {
    const form = new FormData();
    form.append("file", profileImage);
    const up = await fetch(`${API_BASE}/patients/upload/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    if (up.ok) {
      const upj = await up.json();
      uploadedImagePath = upj.file_path;
    }
  } catch (err) {
    console.warn("Image upload error", err);
  }
}
*/

// 8. UPDATE patientPayload IN handleSubmit (around line 290)
// ❌ REMOVE THIS LINE:
// image: uploadedImagePath,

// ✅ ADD THIS LINE INSTEAD:
const patientPayload = {
  patient_type: formData.patientType,
  fullName: formData.fullName,
  gender: formData.gender,
  dob: formData.dob,
  age: parseInt(formData.age) || 0,
  bloodGroup: formData.bloodGroup,
  mobile: formData.mobile,
  alternateNumber: formData.alternateNumber,
  email: formData.email,
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
  token: generatedToken || formData.token, // ✅ ADD THIS LINE (instead of image)
  registrationFee: parseInt(billing.registrationFee) || 0,
  consultationFee: parseInt(billing.consultationFee) || 0,
  Discount: parseInt(billing.Discount) || 0,
  totalAmount: parseInt(billing.totalAmount) || 0,
  paymentStatus: billing.paymentStatus,
  paymentMethod: billing.paymentMethod,
  amountPaid: parseInt(billing.amountPaid) || 0,
  returnAmount: billing.returnAmount,
  transactionId: billing.transactionId,
  transactionDate: billing.transactionDate,
  company_id: finalCompanyId,
  company_name: finalCompanyName,
};

// 9. REPLACE THE IMAGE UPLOAD SECTION IN JSX (around line 570-590)
// ❌ DELETE THIS ENTIRE SECTION:
/*
<div className="flex justify-center md:justify-end items-start w-full">
  <label className="relative w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
    {profileImage ? (
      <img
        src={URL.createObjectURL(profileImage)}
        alt="Profile"
        className="w-full h-full object-cover rounded-xl"
      />
    ) : (
      <span className="text-gray-500 text-center text-sm">Upload Profile</span>
    )}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
      disabled={mode === "view"}
    />
  </label>
</div>
*/

// ✅ REPLACE WITH THIS TOKEN DISPLAY SECTION:
<div className="flex justify-center md:justify-end items-start w-full">
  <div className="w-full space-y-4 bg-white border-2 border-gray-200 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-700">Patient Token</h3>
    
    {generatedToken || formData.token ? (
      <div className="space-y-3">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Token Number</p>
          <p className="text-2xl font-bold text-green-700 tracking-wider">
            {generatedToken || formData.token}
          </p>
        </div>
        <button
          type="button"
          onClick={generateToken}
          disabled={mode === "view"}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Regenerate Token
        </button>
      </div>
    ) : (
      <div className="space-y-3">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-3">No token generated yet</p>
          <button
            type="button"
            onClick={generateToken}
            disabled={mode === "view"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Token
          </button>
        </div>
      </div>
    )}
    
    <p className="text-xs text-gray-500 text-center">
      Token will be used for patient identification
    </p>
  </div>
</div>

// 10. OPTIONAL: Auto-generate token on form load (add to useEffect)
// ✅ ADD THIS useEffect:
useEffect(() => {
  // Auto-generate token for new registrations (not for edit mode)
  if (!appointment && !generatedToken && mode !== "view") {
    generateToken();
  }
}, []);

// ============================================
// SUMMARY OF CHANGES
// ============================================
/*
✅ REMOVED:
  - profileImage state
  - handleImageChange function
  - Image upload UI section
  - Image upload logic in handleSubmit
  - image field in patientPayload

✅ ADDED:
  - generatedToken state
  - generateToken function
  - token field in formData
  - Token display UI with generate button
  - token field in patientPayload
  - Auto-generation on mount (optional)

✅ TOKEN FORMAT:
  TKN-1730123456789-ABC123X
  (Timestamp + Random alphanumeric)
*/