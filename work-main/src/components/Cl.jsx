import React, { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const Cl = () => {
  const [formData, setFormData] = useState({
    // Left Column
    using_since: "",
    duration: "",
    using_since_a: "",
    solution_name: "",
    cl_clean: "",
    case_clean: "",
    power_re_sph: "",
    power_re_cyl: "",
    power_re_axis: "",
    power_le_sph: "",
    power_le_cyl: "",
    power_le_axis: "",

    // Right Column
    usage_per_day: "",
    ppcl_value: "",
    ppcl_duration: "",
    sleeping_cl_toggle1: false,
    sleeping_cl_toggle2: false,
    sleeping_cl_hrs: "",
    cl_last_used_value: "",
    cl_last_used_duration: "",
    problem_re: "",
    problem_le: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div className="flex text-3xl gap-3 mb-4 flex-wrap">
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full font-semibold">
          CL HISTORY
        </h1>
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full font-semibold">
          KEROMETRY
        </h1>
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full font-semibold">
          CL PRESCRIPTION
        </h1>
      </div>

      {/* CL HISTORY FORM */}
      <div className="bg-[#D9E7F7] p-6 rounded-lg grid grid-cols-1 md:grid-cols-[1.6fr_1.2fr] gap-10 text-sm">
        {/* Left column */}
        <div className="space-y-4">
          {/* Using Contact Lens Since + Duration */}
          <div>
            <label className="block text-xl font-semibold mb-1">
              Using contact lens since
            </label>
            <div className="grid grid-cols-[2fr_1fr] gap-2">
              <input
                name="using_since"
                value={formData.using_since}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-full"
              />
              <input
                name="duration"
                placeholder="Duration"
                value={formData.duration}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-1">
              Using contact lens since
            </label>
            <input
              name="solution_name"
              value={formData.using_since_a}
              onChange={handleChange}
              className="p-2 h-[54px] bg-white rounded w-full"
            />
          </div>

          {/* Name of the solution */}
          <div>
            <label className="block text-xl font-semibold mb-1">
              Name of the solution
            </label>
            <input
              name="solution_name"
              value={formData.solution_name}
              onChange={handleChange}
              className="p-2 h-[54px] bg-white rounded w-full"
            />
          </div>

          {/* Cleaning Contact Lens → CL + Case */}
          <div>
            <label className="block text-xl font-semibold mb-1">
              Cleaning contact lens
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xl font-semibold mb-1">CL</label>
                <input
                  name="cl_clean"
                  value={formData.cl_clean}
                  onChange={handleChange}
                  className="p-2 h-[54px] bg-white rounded w-full"
                />
              </div>
              <div>
                <label className="block text-xl font-semibold mb-1">Case</label>
                <input
                  name="case_clean"
                  value={formData.case_clean}
                  onChange={handleChange}
                  className="p-2 h-[54px] bg-white rounded w-full"
                />
              </div>
            </div>
          </div>

          {/* Power of Contact Lens */}
          <div>
            <h4 className="font-semibold text-xl mb-2">
              Power of Contact Lens
            </h4>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-xl text-left"></th>
                    <th className="px-3 py-2">SPH</th>
                    <th className="px-3 py-2">CYL</th>
                    <th className="px-3 py-2">AXIS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 text-xl font-semibold">RE</td>
                    <td className="px-3 py-2">
                      <input
                        name="power_re_sph"
                        value={formData.power_re_sph}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="power_re_cyl"
                        value={formData.power_re_cyl}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="power_re_axis"
                        value={formData.power_re_axis}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xl font-semibold">LE</td>
                    <td className="px-3 py-2">
                      <input
                        name="power_le_sph"
                        value={formData.power_le_sph}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="power_le_cyl"
                        value={formData.power_le_cyl}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        name="power_le_axis"
                        value={formData.power_le_axis}
                        onChange={handleChange}
                        className="p-2 h-[54px] bg-white rounded w-full"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Usage per day */}
          <div>
            <label className="block text-xl font-semibold mb-1">
              Usage a day (hrs)
            </label>
            <input
              name="usage_per_day"
              value={formData.usage_per_day}
              onChange={handleChange}
              className="p-2 h-[54px] bg-white rounded w-full"
            />
          </div>

          {/* PPCL */}
          <div>
            <label className="block text-xl font-semibold mb-1">PPCL</label>
            <div className="flex gap-2">
              <input
                name="ppcl_value"
                value={formData.ppcl_value}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-full"
              />
              <select
                name="ppcl_duration"
                value={formData.ppcl_duration}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-32"
              >
                <option>SELECT DURATION</option>
                <option>Weeks</option>
                <option>Months</option>
                <option>Years</option>
              </select>
            </div>
          </div>

          {/* Sleeping with CL */}
          {/* Sleeping with CL */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              Sleeping with contact lens
            </label>
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                {/* Toggle 1 */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="sleeping_cl_toggle1"
                    checked={formData.sleeping_cl_toggle1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sleeping_cl_toggle1: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition"></div>
                  <div className="absolute left-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-8 transition"></div>
                </label>

                {/* Toggle 2 */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="sleeping_cl_toggle2"
                    checked={formData.sleeping_cl_toggle2}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sleeping_cl_toggle2: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition"></div>
                  <div className="absolute left-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-8 transition"></div>
                </label>
              </div>

              {/* Hrs box */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="sleeping_cl_hrs"
                  value={formData.sleeping_cl_hrs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sleeping_cl_hrs: e.target.value,
                    }))
                  }
                  className="p-2 px-5 h-[54px] bg-white rounded w-32 text-center"
                />
                <span className="font-bold text-xl text-white">hrs</span>
              </div>
            </div>
          </div>

          {/* CL last used */}
          <div>
            <label className="block text-xl font-semibold mb-1">
              CL last used
            </label>
            <div className="flex gap-2">
              <input
                name="cl_last_used_value"
                value={formData.cl_last_used_value}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-full"
              />
              <select
                name="cl_last_used_duration"
                value={formData.cl_last_used_duration}
                onChange={handleChange}
                className="p-2 h-[54px] bg-white rounded w-32"
              >
                <option>SELECT DURATION</option>
                <option>Weeks ago</option>
                <option>Months ago</option>
              </select>
            </div>
          </div>

          {/* Any Problem with CL */}
          <div>
            <h4 className="font-semibold text-xl">Any Problem with CL</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-xl mb-1">RE</label>
                <input
                  name="problem_re"
                  value={formData.problem_re}
                  onChange={handleChange}
                  className="p-2 h-[54px] bg-white rounded w-full"
                />
              </div>
              <div>
                <label className="block text-xl mb-1">LE</label>
                <input
                  name="problem_le"
                  value={formData.problem_le}
                  onChange={handleChange}
                  className="p-2 h-[54px] bg-white rounded w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cl;
