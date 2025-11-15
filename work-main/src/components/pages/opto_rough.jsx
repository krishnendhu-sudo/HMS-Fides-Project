import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import patientImg from "../../assets/Patient.jpg";
import ArReading from "../ArReading";
import Visual from "../Visual";
import Pog from "../Pog";
import Refraction from "../Refraction";
import Retinoscopy from "../Retinoscopy";
import Dialated from "../Dialated";
import Keratometry from "../Keratometry";
import Pachymetry from "../Pachymetry";
import Eye from "../Eye";
import Spectacle from "../Spectacle";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const PatientInfo = () => {
  const { id } = useParams();
  const location = useLocation();
  const navState = location.state || {};
  const navigate = useNavigate();
  const { appointment, viewOnly = false, createNew = false } = navState;
  const [doctorName, setDoctorName] = useState("-");
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  const [notes, setNotes] = useState({
      Complaints: { description: "" },
      History: { description: "" },
      Allergies: { description: "" },
    });



  const tabs = [
    { label: "Case History", path: "/CaseHistory" },

  ];
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    custom_id: "",
    presentingComplaints: "",
    pastHistory: "",
    systemicIllness: "",
    personalHistory: "",
    arReading: {},
    visual: {},
    pog: {},
    refraction: {},
    retinoscopy: {},
    dialated: {},
    keratometry: {},
    pachymetry: {},
    eye: {},
    spectacle: {},
    optometryId: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper function to map optometry data
  const mapOptometryData = (data) => {
    if (!data) return null;

    return {
      fullName: data.fullName || appointment?.fullName || "",
      age: data.age || appointment?.age || "",
      gender: data.gender || appointment?.gender || "",
      custom_id: data.custom_id || appointment?.custom_id || "",
      presentingComplaints: data.presentingComplaints || "",
      pastHistory: data.pastHistory || "",
      systemicIllness: data.systemicIllness || "",
      personalHistory: data.personalHistory || "",

      arReading: {
        ar_od_sph: data.ar_od_sph || "",
        ar_od_cyl: data.ar_od_cyl || "",
        ar_od_axis: data.ar_od_axis || "",
        ar_od_nct: data.ar_od_nct || "",
        ar_od_at: data.ar_od_at || "",
        ar_os_sph: data.ar_os_sph || "",
        ar_os_cyl: data.ar_os_cyl || "",
        ar_os_axis: data.ar_os_axis || "",
        ar_os_nct: data.ar_os_nct || "",
        ar_os_at: data.ar_os_at || "",
      },
      visual: {
        va_od_distant: data.va_od_distant || "",
        va_od_ph: data.va_od_ph || "",
        va_od_near: data.va_od_near || "",
        va_od_color: data.va_od_color || "",
        va_os_distant: data.va_os_distant || "",
        va_os_ph: data.va_os_ph || "",
        va_os_near: data.va_os_near || "",
        va_os_color: data.va_os_color || "",
      },
      pog: {
        od_Distant_sph: data.od_Distant_sph || "",
        od_Distant_cyl: data.od_Distant_cyl || "",
        od_Distant_axis: data.od_Distant_axis || "",
        od_Distant_pg: data.od_Distant_pg || "",
        od_Near_sph: data.od_Near_sph || "",
        od_Near_cyl: data.od_Near_cyl || "",
        od_Near_axis: data.od_Near_axis || "",
        od_Near_pg: data.od_Near_pg || "",
        os_Distant_sph: data.os_Distant_sph || "",
        os_Distant_cyl: data.os_Distant_cyl || "",
        os_Distant_axis: data.os_Distant_axis || "",
        os_Distant_pg: data.os_Distant_pg || "",
        os_Near_sph: data.os_Near_sph || "",
        os_Near_cyl: data.os_Near_cyl || "",
        os_Near_axis: data.os_Near_axis || "",
        os_Near_pg: data.os_Near_pg || "",
        remarks: data.remarks || "",
        loadLastPG: data.loadLastPG || "",
        clear: data.clear || "",
        duration: data.duration || "",
      },
      refraction: {
        ref_od_dist_va: data.ref_od_dist_va || "",
        ref_od_dist_sph: data.ref_od_dist_sph || "",
        ref_od_dist_cyl: data.ref_od_dist_cyl || "",
        ref_od_dist_axis: data.ref_od_dist_axis || "",
        ref_od_near_va: data.ref_od_near_va || "",
        ref_od_near_sph: data.ref_od_near_sph || "",
        ref_od_near_cyl: data.ref_od_near_cyl || "",
        ref_od_near_axis: data.ref_od_near_axis || "",
        ref_os_dist_va: data.ref_os_dist_va || "",
        ref_os_dist_sph: data.ref_os_dist_sph || "",
        ref_os_dist_cyl: data.ref_os_dist_cyl || "",
        ref_os_dist_axis: data.ref_os_dist_axis || "",
        ref_os_near_va: data.ref_os_near_va || "",
        ref_os_near_sph: data.ref_os_near_sph || "",
        ref_os_near_cyl: data.ref_os_near_cyl || "",
        ref_os_near_axis: data.ref_os_near_axis || "",
        ref_distance: data.ref_distance || "",
        ref_remarks: data.ref_remarks || "",
      },
      retinoscopy: {
        ret_od_dry: data.ret_od_dry || "",
        ret_od_wet: data.ret_od_wet || "",
        ret_os_dry: data.ret_os_dry || "",
        ret_os_wet: data.ret_os_wet || "",
      },
      dialated: {
        dia_od: data.dia_od || "",
        dia_os: data.dia_os || "",
      },
      keratometry: {
        k1_od: data.k1_od || "",
        k2_od: data.k2_od || "",
        k1_os: data.k1_os || "",
        k2_os: data.k2_os || "",
      },
      pachymetry: {
        pachy_od: data.pachy_od || "",
        pachy_odiop: data.pachy_odiop || "",
        pachy_os: data.pachy_os || "",
        pachy_osiop: data.pachy_osiop || "",
      },
      eye: {
        pupil_od: data.pupil_od || "",
        cr_od: data.cr_od || "",
        cover_od: data.cover_od || "",
        om_od: data.om_od || "",
        confrontation_od: data.confrontation_od || "",
        covergence_od: data.covergence_od || "",
        pupil_os: data.pupil_os || "",
        cr_os: data.cr_os || "",
        cover_os: data.cover_os || "",
        om_os: data.om_os || "",
        confrontation_os: data.confrontation_os || "",
        covergence_os: data.covergence_os || "",
        pmt: data.pmt || "",
        duochrome: data.duochrome || "",
        wfdt: data.wfdt || "",
      },
      spectacle: {
        lens_type: data.lens_type || "",
        lens_material: data.lens_material || "",
        lens_coating: data.lens_coating || "",
        lens_power_re: data.lens_power_re || "",
        lens_power_le: data.lens_power_le || "",
        cylinder_re: data.cylinder_re || "",
        cylinder_le: data.cylinder_le || "",
        axis_re: data.axis_re || "",
        axis_le: data.axis_le || "",
        addition_near: data.addition_near || "",
      },

      optometryId: data.id || null,
    };
  };

  // Fetch optometry data on component mount
  useEffect(() => {
    if (!appointment) {
      console.warn("No appointment data provided");
      return;
    }

    const fetchOptometry = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        // Check if appointment already has optometryId
        if (!createNew && appointment.optometryId) {
          console.log("Fetching existing optometry:", appointment.optometryId);

          const res = await fetch(
            `http://127.0.0.1:8000/optometrys/${appointment.optometryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) {
            if (res.status === 404) {
              // Optometry not found, create new
              console.log("Optometry not found, initializing new form");
              const mapped = mapOptometryData({});
              setFormData({
                ...mapped,
                fullName: appointment.fullName || "",
                age: appointment.age || "",
                gender: appointment.gender || "",
                custom_id: appointment.custom_id || "",
              });
            } else {
              const errorText = await res.text();
              console.error("Fetch error:", errorText);
              throw new Error(`Failed to fetch optometry: ${res.status}`);
            }
          } else {
            const data = await res.json();
            console.log("Fetched optometry data:", data);

            // If backend returns a list, take the first object
            const record = Array.isArray(data) ? data[0] : data;

            if (record) {
              const mapped = mapOptometryData(record);
              setFormData(mapped);
            } else {
              console.warn("No valid optometry data found");
              const mapped = mapOptometryData({});
              setFormData({
                ...mapped,
                fullName: appointment.fullName || "",
                age: appointment.age || "",
                gender: appointment.gender || "",
                custom_id: appointment.custom_id || "",
              });
            }
          }
        } else {
          // Creating new - prefill with appointment data
          console.log("Creating new optometry record");
          const mapped = mapOptometryData({});
          setFormData({
            ...mapped,
            fullName: appointment.fullName || "",
            age: appointment.age || "",
            gender: appointment.gender || "",
            custom_id: appointment.custom_id || "",
          });
        }
      } catch (err) {
        console.error("Prefill error:", err);
        setError(err.message);
        // Fallback to empty form with appointment data
        const mapped = mapOptometryData({});
        setFormData({
          ...mapped,
          fullName: appointment.fullName || "",
          age: appointment.age || "",
          gender: appointment.gender || "",
          custom_id: appointment.custom_id || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOptometry();
  }, [appointment?.id, appointment?.optometryId, createNew]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchDoctorName = async () => {
    if (!appointment?.doctor_id) return;

    try {
      const res = await fetch(`${API_BASE}/doctors/${appointment.doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch doctor");
      const data = await res.json();

      // Adjust based on your API field (maybe 'name' or 'full_name')
      setDoctorName(data.full_name || data.name || "-");
    } catch (err) {
      console.error("Error fetching doctor name:", err);
      setDoctorName("-");
    }
  };

  fetchDoctorName();
}, [appointment?.doctor_id]);


  const handleChange = (e) => {
    if (viewOnly) return;
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async () => {
    if (viewOnly) {
      alert("Cannot submit in view-only mode");
      return;
    }

    if (!appointment) {
      alert("No appointment data available");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    // Flatten nested objects for API payload
    const payload = {
      appointment_id: appointment.id,
      patient_id: appointment.patient_id,

      // Flatten all nested sections
      ...formData.arReading,
      ...formData.visual,
      ...formData.pog,
      ...formData.refraction,
      ...formData.retinoscopy,
      ...formData.dialated,
      ...formData.keratometry,
      ...formData.pachymetry,
      ...formData.eye,
      ...formData.spectacle,
    };

    // Remove empty strings to avoid unnecessary updates
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        payload[key] = null;
      }
    });

    console.log("Submitting payload:", payload);

    try {
      const isEdit = !!formData.optometryId;
      const url = isEdit
        ? `http://127.0.0.1:8000/optometrys/${formData.optometryId}`
        : "http://127.0.0.1:8000/optometrys/";

      console.log(`${isEdit ? "Updating" : "Creating"} optometry at:`, url);

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("API Error Response:", errText);

        // Try to parse error message
        let errorDetail = errText;
        try {
          const errorJson = JSON.parse(errText);
          errorDetail = errorJson.detail || errText;
        } catch (e) {
          // Keep original error text
        }

        throw new Error(errorDetail);
      }

      const data = await res.json();
      console.log(
        isEdit ? "Updated successfully:" : "Created successfully:",
        data
      );
      alert(`✅ Optometry ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/ConsultList")

      // Update formData with the returned optometry ID
      setFormData((prev) => ({ ...prev, optometryId: data.id }));

      setSuccess(
        `Successfully ${isEdit ? "updated" : "created"} optometry record!`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage = err.message || "Unknown error occurred";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (viewOnly) return;

    const form = document.querySelector("form");
    if (form) form.reset();
    setNotes({
      Complaints: { description: "" },
      History: { description: "" },
      Allergies: { description: "" },
    });

    if (
      window.confirm(
        "Are you sure you want to reset all fields? This will clear all entered data."
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        presentingComplaints: "",
        pastHistory: "",
        systemicIllness: "",
        personalHistory: "",
        arReading: {},
        visual: {},
        pog: {},
        refraction: {},
        retinoscopy: {},
        dialated: {},
        keratometry: {},
        pachymetry: {},
        eye: {},
        spectacle: {},
      }));
    }
  };

  const sections = [
    { component: ArReading, key: "arReading" },
    { component: Visual, key: "visual" },
    { component: Pog, key: "pog" },
    { component: Retinoscopy, key: "retinoscopy" },
    { component: Refraction, key: "refraction" },
    { component: Dialated, key: "dialated" },
    { component: Keratometry, key: "keratometry" },
    { component: Pachymetry, key: "pachymetry" },
    { component: Eye, key: "eye" },
    { component: Spectacle, key: "spectacle" },
  ];

  if (!appointment) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>
            No appointment data available. Please navigate from the appointments
            list.
          </p>
        </div>
      </div>
    );
  }

  const buttonLabels = [
    "Complaints",
    "History",
    "Allergies",
    "Previous visits",
  ];

  return (
    <form className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#14416D]">
          Patient Information
        </h2>
        {loading && (
          <div className="text-blue-600 font-semibold flex items-center gap-2">
            <FiRefreshCw className="animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <div>
            <p className="font-bold">Success!</p>
            <p>{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-700 hover:text-green-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center justify-between">
          <div>
            <p className="font-bold">Warning</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-yellow-700 hover:text-yellow-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Edit Mode Indicator */}
      {formData.optometryId && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="font-semibold">
            📝 Editing existing optometry record (ID: {formData.optometryId})
          </p>
        </div>
      )}

      {/* Patient Card */}
      <div className="bg-[#F7DACD] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 font-medium text-2xl w-full md:w-2/3">
          <p>
            <span className="font-bold">Name:</span>{" "}
            {formData.fullName || appointment.fullName || "-"}
          </p>
          <p>
            <span className="font-bold">Age:</span>{" "}
            {formData.age || appointment.age || "-"} YEARS
          </p>
          <p>
            <span className="font-bold">Gender:</span>{" "}
            {formData.gender || appointment.gender || "-"}
          </p>
          <p>
            <span className="font-bold">MR Number:</span>{" "}
            {formData.custom_id || appointment.custom_id || "-"}
          </p>
          <p>
  <span className="font-bold">Doctor:</span>{" "}
  {doctorName}
</p>
        </div>
        <div className="flex-shrink-0">
          <img
            src={patientImg}
            alt="Patient"
            className="w-[208px] h-[210px] object-cover rounded-lg shadow"
          />
        </div>
      </div>
            <div className="flex justify-start space-x-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path; //  check active tab
          return (
            <p
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`border px-8 py-2 rounded-full font-bold text-2xl cursor-pointer transition
                ${isActive ? "bg-[#F7DACD] text-white" : "hover:bg-[#F7DACD] hover:text-white"}
              `}
            >
              {tab.label}
            </p>
          );
        })}
      </div>
      {/* Sections */}
      {sections.map(({ component: Component, key }) => (
        <Component
          key={key}
          data={formData[key]}
          onChange={(data) =>
            !viewOnly && setFormData((prev) => ({ ...prev, [key]: data }))
          }
          viewOnly={viewOnly}
        />
      ))}

      {/* Buttons */}
      {!viewOnly && (
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            RESET <FiRefreshCw className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                SAVING... <FiRefreshCw className="w-5 h-5 animate-spin" />
              </>
            ) : (
              <>
                {formData.optometryId ? "UPDATE" : "SUBMIT"}{" "}
                <FaCheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default PatientInfo;
