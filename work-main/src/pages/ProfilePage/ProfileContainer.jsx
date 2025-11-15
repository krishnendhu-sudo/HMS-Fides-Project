import React, { useState, useEffect } from "react";
import ProfileEdit from "./UserProfile";
import DoctorEditing from "./DoctorEditing";

const ProfileContainer = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
        setUserType(data.user_type?.toLowerCase()); // store user type
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Render DoctorEditing if user is a doctor, otherwise ProfileEdit
  if (userType === "doctor") {
    return <DoctorEditing />;
  }

  return <ProfileEdit />;
};

export default ProfileContainer;
