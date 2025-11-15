import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const Company = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/companies/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch companies: ${errorText}`);
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      setCompanies(data);
    } else {
      console.error("❌ Unexpected data format:", data);
      setCompanies([]); // prevent `.map` crash
    }

  } catch (err) {
    console.error("❌ Error fetching companies:", err);
    alert("Failed to fetch companies");
  }
};


  const handleView = (company) => {
    navigate("/AddCompany", { state: { company, viewOnly: true } });
  };

  const handleEdit = (company) =>
    navigate("/AddCompany", { state: { company } });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/companies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("Company deleted!");
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const toggleActive = async (company) => {
    const newStatus = company.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Optimistic UI update
    setCompanies((prev) =>
      prev.map((c) => (c.id === company.id ? { ...c, status: newStatus } : c))
    );

    try {
      const res = await fetch(`http://127.0.0.1:8000/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...company, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
      // revert UI if backend failed
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id ? { ...c, status: company.status } : c
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Companies</h1>
        <button
          onClick={() => navigate("/AddCompany")}
          className="bg-[#7E4363] text-white text-xl px-4 py-4 rounded-lg hover:bg-[#9b5778]"
        >
          + Add Company
        </button>
      </div>

      <table className="w-full bg-white  rounded-lg overflow-hidden text-left">
        <thead className="bg-[#7E4363] text-xl  text-white">
          <tr>
            <th className="px-6 py-6">ID</th>
            <th className="px-6 py-6">Name</th>
            <th className="px-6 py-6">Admin</th>
            <th className="px-6 py-6">Phone</th>
            <th className="px-6 py-6">Status</th>
            <th className="px-6 py-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b text-lg hover:bg-gray-100">
              <td className="px-6 py-6">{c.id}</td>
              <td className="px-6 py-6">{c.name}</td>
              <td className="px-6 py-6">{c.admin}</td>
              <td className="px-6 py-6">{c.phone}</td>
              <td className="px-6 py-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={c.status === "ACTIVE"}
                    onChange={() => toggleActive(c)}
                  />
                  <div
                    className={`relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-[#7E4363]
        peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px]
        after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
        peer-checked:bg-[#7E4363]`}
                  ></div>
                  <span className="ml-2 text-sm text-gray-700">
                    {c.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </label>
              </td>

              <td className="px-6 py-3 space-x-2">
                <button onClick={() => handleView(c)}>
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(c)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(c.id)}>
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Company;
