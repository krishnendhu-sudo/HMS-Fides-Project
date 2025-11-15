// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogOut } from "lucide-react";
import HospO from "../assets/hosp.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/home");

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between bg-[#7E4363] 
      px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4 
      rounded-2xl sm:rounded-3xl shadow-md w-full relative"
    >
      {/* Left Icon */}
      <FaArrowLeft
        className="text-xl sm:text-xl md:text-2xl lg:text-3xl cursor-pointer text-white"
        onClick={goBack}
      />

      {/* Logo / Title */}
      <h1 className="text-base sm:text-xl md:text-3xl lg:text-3xl font-kinghood text-white flex items-center">
        <span>H</span>
        <img
          src={HospO}
          alt="o"
          className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-7 lg:h-7 object-contain"
        />
        <span>sp</span>
        <span>Ease</span>
      </h1>

      {/* Right Icons */}
      <div className="flex items-center gap-3 sm:gap-4 relative" ref={menuRef}>
        {/* Home Icon */}
        <FaHome
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer text-white"
          onClick={goHome}
        />

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
            >
              <button
                onClick={() => {
                  navigate("/Userprofile");
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-[#7E4363]/10 hover:text-[#7E4363]"
              >
                <User className="w-4 h-4" /> Profile
              </button>

              <button
                onClick={() => {
                  navigate("/changepassword");
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-[#7E4363]/10 hover:text-[#7E4363]"
              >
                <Lock className="w-4 h-4" /> Change Password
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
