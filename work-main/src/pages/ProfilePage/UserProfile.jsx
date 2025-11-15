import React, { useState, useEffect } from "react";
import { Pencil, Save, X } from "lucide-react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState(null);
  const [restricted, setRestricted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token"); // assuming JWT token

  // Fetch logged-in user profile
  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        const backendBase = "http://127.0.0.1:8000";
        const fullPhotoURL = data.photo
          ? `${backendBase}/${data.photo.replace(/^\/?/, "")}` // ensure no double slash
          : "/icons/profile.jpg";

        setProfile({
          ...data,
          photo: fullPhotoURL,
        });

        // Restrict editing for doctors if needed
        if (data.user_type?.toLowerCase() === "doctor") setRestricted(true);
      })

      .catch((err) => console.error(err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () =>
      setProfile({ ...profile, profilePhoto: reader.result, photoFile: file });
    reader.readAsDataURL(file);
  }
};


  const handleSave = async () => {
  try {
    const formData = new FormData();

    // Append all fields
    for (const key in profile) {
      if (key !== "photoFile") formData.append(key, profile[key] || "");
    }

    // If a new photo was uploaded, append the file
    if (profile.photoFile) {
      formData.append("photo", profile.photoFile);
    }

    const res = await fetch(`http://127.0.0.1:8000/users/${profile.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();

    setProfile(data);
    setIsEditing(false);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile.");
  }
};


  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (restricted) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          Doctor users are not allowed to edit the profile information.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mx-10 mt-10">
        <h1 className="font-bold text-4xl">Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Pencil size={18} /> Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Save size={18} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="max-w-8xl md:m-10 bg-[#F7DACD] mx-auto p-8 rounded-2xl mt-8">
        <div className="grid md:grid-cols-3 gap-6 items-center mb-8">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={profile.company_name || ""}
                disabled
                className="w-full border bg-gray-100 text-gray-700 font-semibold rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">User Type</label>
              <input
                type="text"
                name="userType"
                value={profile.user_type || ""}
                disabled
                className="w-full border bg-gray-100 text-gray-700 font-semibold rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Registration ID
              </label>
              <input
                type="text"
                name="regId"
                value={profile.id || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-44 h-56 rounded-md object-cover bg-gray-100 shadow-md"
              />

              {isEditing && (
                <>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
                    title="Edit Photo"
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS FORM */}
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={profile.dob || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={profile.blood_group || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
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
                value={profile.phone || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-300"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                readOnly
                className="w-full border bg-gray-100 text-gray-700 rounded-lg p-3 mt-1 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Address & Emergency */}
          <div>
            <label className="font-semibold text-gray-700">Address</label>
            <textarea
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border rounded-lg p-3 mt-1 h-20 resize-none ${
                isEditing
                  ? "focus:ring-2 focus:ring-blue-300"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          

          {/* <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Emergency Contact Person</label>
              <input
                type="text"
                name="emergencyName"
                value={profile.emergencyName || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing ? "focus:ring-2 focus:ring-blue-300" : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Emergency Contact Number</label>
              <input
                type="text"
                name="emergencyNumber"
                value={profile.emergencyNumber || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border rounded-lg p-3 mt-1 ${
                  isEditing ? "focus:ring-2 focus:ring-blue-300" : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
