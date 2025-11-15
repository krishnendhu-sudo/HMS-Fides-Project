import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function MedicineKitTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch kits from backend
  useEffect(() => {
    const fetchKits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/kits", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch kits: ${res.status}`);
        }
        const data = await res.json();

        // 🧠 Optional: calculate total medicine quantity for display
        const processed = data.map((kit) => ({
          ...kit,
          quantity: kit.medicines
            ? kit.medicines.reduce((sum, m) => sum + Number(m.medQuantity || 0), 0)
            : 0,
        }));

        setRows(processed);
      } catch (error) {
        console.error("Error fetching kits:", error);
        alert("Failed to fetch kits.");
      } finally {
        setLoading(false);
      }
    };

    fetchKits();
  }, []);



const handleEdit = (kitId) => {
  navigate(`/addkit`, { state: { mode: "edit", kitId } });
};

const handleView = (kitId) => {
  navigate(`/addkit`, { state: { mode: "view", kitId } });
};



  const handleDelete = async (kitId) => {
    if (!window.confirm("Are you sure you want to delete this kit?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/kits/${kitId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Delete failed: ${errText}`);
      }

      alert("Kit deleted successfully!");
      setRows((prev) => prev.filter((kit) => kit.id !== kitId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete kit: " + err.message);
    }
  };

  const handleAddKit = () => {
    navigate("/addkit");
  };

  if (loading) return <div className="p-6 text-xl">Loading kits...</div>;

  return (
    <div className="max-w-8xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Medicine Kit Details</h2>
        <button
          onClick={handleAddKit}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
        >
          + Add Kit
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full text-lg bg-white border-collapse">
          <thead className="bg-black text-white text-center">
            <tr>
              <th className="p-3">Kit ID</th>
              <th className="p-3">Kit Name</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 text-center hover:bg-gray-50 transition-all"
                >
                  <td className="p-3 text-gray-700 font-medium">{row.id}</td>
                  <td className="p-3 text-gray-700">{row.kitName}</td>
                  <td className="p-3 text-gray-700">{row.reason}</td>
                  <td className="p-3 text-gray-700">{row.quantity}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(row.id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                    <button
                      onClick={() => handleView(row.id)}
                      className="text-gray-600 hover:text-gray-800 transition"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  No kits found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
