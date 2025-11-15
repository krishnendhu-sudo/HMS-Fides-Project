import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const Company = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // ✅ Fetch users from FastAPI
  // ✅ Fetch users from FastAPI
const fetchUsers = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://127.0.0.1:8000/users/", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    setUsers(data); // only company users if admin
  } catch (err) {
    console.error("Error fetching users:", err);
    alert("❌ Failed to fetch users. Check login token.");
  } finally {
    setLoading(false);
  }
  console.log(token);
};




  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete user
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Delete failed");
    alert("✅ User deleted successfully!");
    setUsers((prev) => prev.filter((u) => u.id !== id));
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete user");
  }
};

  // ✅ Toggle active status
  const toggleActive = async (user) => {
  const token = localStorage.getItem("token");

  try {
    const updated = { ...user, is_active: !user.is_active };
    const res = await fetch(`http://127.0.0.1:8000/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error("Update failed");
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
    );
  } catch (err) {
    console.error("Error updating status:", err);
    alert("❌ Failed to update status");
  }
};

  // ✅ Add new user
  const handleAdd = () => navigate("/AddUser");

const handleEdit = (user) => {
  if (user.user_type?.toLowerCase() === "doctor") {
    navigate(`/doctors/edit/${user.id}`); // pass id in URL
  } else {
    navigate("/AddUser", { state: { user, mode: "edit" } });
  }
};

const handleView = (user) => {
  if (user.user_type?.toLowerCase() === "doctor") {
    navigate(`/doctors/view/${user.id}`); // pass id in URL
  } else {
    navigate("/AddUser", { state: { user, mode: "view" } });
  }
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <button
          onClick={handleAdd}
          className="bg-[#7E4363] text-white text-lg px-10 py-4 rounded-lg shadow-md hover:bg-[#9b5778] transition duration-300"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No users found.</p>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <table className="w-full border-collapse">
            <thead className="bg-[#7E4363] text-white text-lg uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 text-left">User ID</th>
                <th className="px-6 py-5 text-left">Name</th>
                <th className="px-6 py-5 text-left">Company</th>
                <th className="px-6 py-5 text-left">User Type</th>
                <th className="px-6 py-5 text-left">Phone</th>
                <th className="px-6 py-5 text-center">Active</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b transition duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.company_name || "—"}</td>
                  <td className="px-6 py-4 capitalize">
                    {user.user_type || "—"}
                  </td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.is_active}
                        onChange={() => toggleActive(user)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-all">
                        <span
                          className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full transition-all ${
                            user.is_active ? "translate-x-5" : ""
                          }`}
                        ></span>
                      </div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <button
                      onClick={() => handleView(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Company;
