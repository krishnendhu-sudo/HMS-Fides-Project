import React from "react";

const DaysDropdown = ({ label, section, profile, setProfile }) => {
  const handleToggle = (day, field) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [day]: {
          ...prev[section][day],
          [field]: !prev[section][day][field],
        },
      },
    }));
  };

  const handleTimeChange = (day, period, timeType, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [day]: {
          ...prev[section][day],
          [period]: {
            ...prev[section][day][period],
            [timeType]: value,
          },
        },
      },
    }));
  };

  const days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-bold text-lg mb-4">{label}</h3>
      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day}
            className="flex flex-col gap-2 border-b border-gray-200 pb-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium w-16">{day}</span>

              {/* ✅ Toggle Switch for Active */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile[section][day].active}
                  onChange={() => handleToggle(day, "active")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 transition-all"></div>
                <span className="ml-2 text-sm text-gray-700">
                  {profile[section][day].active ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            {/* ✅ Time Inputs (only visible if active) */}
            {profile[section][day].active && (
              <div className="grid grid-cols-2 gap-2 pl-8">
                <div>
                  <label className="block text-sm text-gray-600">
                    Morning (AM)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={profile[section][day].am?.from || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "am", "from", e.target.value)
                      }
                      className="border rounded-md p-1 w-full"
                    />
                    <input
                      type="time"
                      value={profile[section][day].am?.to || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "am", "to", e.target.value)
                      }
                      className="border rounded-md p-1 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Evening (PM)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={profile[section][day].pm?.from || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "pm", "from", e.target.value)
                      }
                      className="border rounded-md p-1 w-full"
                    />
                    <input
                      type="time"
                      value={profile[section][day].pm?.to || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "pm", "to", e.target.value)
                      }
                      className="border rounded-md p-1 w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysDropdown;
