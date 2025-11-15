import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Subima from "../assets/subima.png";
import ArReading from "../components/ArReading";
import Visual from "../components/Visual";
import Pog from "../components/Pog";
import Refraction from "../components/Refraction";
import Retinoscopy from "../components/Retinoscopy";
import Dialated from "../components/Dialated";
import Keratometry from "../components/Keratometry";
import Pachymetry from "../components/Pachymetry";
import Spectacle from "../components/Spectacle";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const PatientInfo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [optometryData, setOptometryData] = useState(null);
  const [doctorName, setDoctorName] = useState("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const tabs = [
    { label: "Readings", path: "/reading" },
    { label: "Examination", path: "/examinationDoc" },
    { label: "Case History", path: "/CaseHistory" },
    { label: "Draw", path: "/Draw" },
  ];

  const mapOptometryData = (data) => {
    if (!data) return null;

    return {
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
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        let patientInfo = navState.patient || navState.appointment;
        let appointmentInfo = navState.appointment || patientInfo?.appointment;

        if (patientInfo) {
          setPatientData(patientInfo);
          let optometryRecord = null;

          if (appointmentInfo?.id) {
            try {
              const optoRes = await fetch(`${API_BASE}/optometrys/by-appointment/${appointmentInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (optoRes.ok) optometryRecord = await optoRes.json();
            } catch {
              console.log("No optometry found by appointment_id");
            }
          }

          if (!optometryRecord && (patientInfo.patient_id || patientInfo.id)) {
            const patientId = patientInfo.patient_id || patientInfo.id;
            try {
              const optoRes = await fetch(`${API_BASE}/optometrys/`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (optoRes.ok) {
                const optoList = await optoRes.json();
                if (Array.isArray(optoList) && optoList.length > 0) {
                  const patientOptometry = optoList
                    .filter((o) => o.patient_id === patientId)
                    .sort((a, b) => (b.id || 0) - (a.id || 0));
                  if (patientOptometry.length > 0)
                    optometryRecord = patientOptometry[0];
                }
              }
            } catch {
              console.log("No optometry found by patient_id");
            }
          }

          if (optometryRecord) {
            const mapped = mapOptometryData(optometryRecord);
            setOptometryData(mapped);
          }

          const doctorId =
            appointmentInfo?.doctor_id ||
            patientInfo?.appointment?.doctor_id ||
            optometryRecord?.doctor_id;
          if (doctorId) {
            try {
              const doctorRes = await fetch(`${API_BASE}/doctors/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (doctorRes.ok) {
                const doctorData = await doctorRes.json();
                setDoctorName(doctorData.full_name || doctorData.name || "-");
              }
            } catch (err) {
              console.error("Error fetching doctor name:", err);
            }
          }
        } else {
          setError("No patient data provided");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, token, API_BASE]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <form className="max-w-8xl mx-auto p-6 space-y-6">
      <h2 className="text-4xl md:text-3xl font-bold text-[#14416D]">
        Patient Information
      </h2>

      {loading && (
        <div className="text-blue-600 font-semibold flex items-center gap-2">
          <FiRefreshCw className="animate-spin" />
          Loading patient data...
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {patientData && (
        <div className="bg-[#F7DACD] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 font-medium text-2xl w-full md:w-2/3">
            <p>
              <span className="font-bold">Name:</span>{" "}
              {patientData.fullName ||
                patientData.full_name ||
                patientData.name ||
                "-"}
            </p>
            <p>
              <span className="font-bold">Age:</span> {patientData.age || "-"}{" "}
              YEARS
            </p>
            <p>
              <span className="font-bold">Gender:</span>{" "}
              {patientData.gender || "-"}
            </p>
            <p>
              <span className="font-bold">MR Number:</span>{" "}
              {patientData.custom_id || patientData.id || "-"}
            </p>
            <p>
              <span className="font-bold">Visit Date:</span>{" "}
              {patientData.visitDate || patientData.visit_date
                ? new Date(
                    patientData.visitDate || patientData.visit_date
                  ).toLocaleDateString()
                : "-"}
            </p>
            <p>
              <span className="font-bold">Visit Type:</span>{" "}
              {patientData.patient_type || "GENERAL CONSULTATION"}
            </p>
            <p>
              <span className="font-bold">Doctor:</span> {doctorName}
            </p>
          </div>
        </div>
      )}

     {/* Tabs */}
      <div className="flex justify-start space-x-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <p
              key={tab.label}
              onClick={() => navigate(tab.path, { state: navState })}
              className={`border px-8 py-2 rounded-full font-bold text-2xl cursor-pointer transition
                ${isActive ? "bg-[#F7DACD] " : "hover:bg-[#F7DACD] "}`}
            >
              {tab.label}
            </p>
          );
        })}
      </div>
     
      {/* Optometry Sections (View-Only) */}
      {optometryData && (
        <>
          <ArReading data={optometryData.arReading || {}} viewOnly />
          <Visual data={optometryData.visual || {}} viewOnly />
          <Pog data={optometryData.pog || {}} viewOnly />
          <Refraction data={optometryData.refraction || {}} viewOnly />
          <Retinoscopy data={optometryData.retinoscopy || {}} viewOnly />
          <Dialated data={optometryData.dialated || {}} viewOnly />
          <Keratometry data={optometryData.keratometry || {}} viewOnly />
          <Pachymetry data={optometryData.pachymetry || {}} viewOnly />
          <Spectacle data={optometryData.spectacle || {}} viewOnly />
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-[900px] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <img
              src={Subima}
              alt="Success"
              className="w-full h-auto mx-auto mb-4"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default PatientInfo;
