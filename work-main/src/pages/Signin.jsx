import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HospO from "../assets/hosp.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid email or password");

      const data = await res.json();

      // Store token and user info
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("company_id", data.company_id);
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_id", data.user_id);


      // Fetch company name if company_id exists
      if (data.company_id) {
        try {
          const companyRes = await fetch(`${API_BASE}/companies/${data.company_id}`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          if (companyRes.ok) {
            const companyData = await companyRes.json();
            localStorage.setItem("company_name", companyData.name);
          }
        } catch (err) {
          console.warn("Could not fetch company name:", err);
        }
      }

      // Navigate based on role
      if (data.role === "super_admin") navigate("/home");
      else if (data.role === "admin") navigate("/home");
      else if (data.role === "doctor") navigate("/home");
      else if (data.role === "optometrist") navigate("/home");
      else if (data.role === "receptionist") navigate("/home");
      else if (data.role === "pharmacist") navigate("/home");
      else if (data.role === "optician") navigate("/home");
      else if (data.role === "counsellor") navigate("/home");
      else if (data.role === "accountant") navigate("/home");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/icons/loginbg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative md:w-[690px] sm:w-[590px] z-10 bg-[#6D94C5] backdrop-blur-md rounded-2xl shadow-lg p-8 h-[671px]">
        {/* Logo / Title */}
        <h1 className="text-base sm:text-lg md:text-3xl lg:text-[32px] font-kinghood text-black flex justify-center items-center">
          <span>H</span>
          <img
            src={HospO}
            alt="o"
            className="w-5 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 object-contain"
          />
          <span>sp</span>
          <span>Ease</span>
        </h1>

        <h2 className="text-[64px] p-4 text-center mb-6 text-white">
          SIGN IN
        </h2>

        {/* Login Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[64px] px-4 item rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[64px] px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-red-200 text-center text-lg font-semibold">
              {error}
            </p>
          )}

          <div className="flex items-center p-5 justify-between">
            <button
              type="submit"
              disabled={loading}
              className="h-[48px] text-3xl px-14 bg-black text-white rounded-full font-semibold disabled:opacity-70"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <label className="flex items-center text-lg cursor-pointer">
              <input type="checkbox" className="mr-2 h-4 w-4 text-blue-700" />
              Remember Password
            </label>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-center text-lg">
          <a href="#" className="hover:underline text-white">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}