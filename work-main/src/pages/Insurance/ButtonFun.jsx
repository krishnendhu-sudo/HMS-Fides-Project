import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TopGreenButtons = () => {
  const navigate = useNavigate();
  const location = useLocation(); // gives current path

  const buttons = [
    { label: "Pre Authorization", path: "/PreAuthorization" },
    { label: "Insurance Settlement", path: "/InsuranceSettlement" },
    { label: "Insurance Provider", path: "/InsuranceProvider" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {buttons.map((item, idx) => (
        <button
          key={idx}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-2 bg-[#48D56D] px-4 py-2 rounded-full hover:bg-[#0B9C73] cursor-pointer"
        >
          {/* Circle Indicator */}
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white">
            {location.pathname === item.path && (
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
            )}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TopGreenButtons;
