import React, { useState, useEffect } from "react";
import { RotateCcw, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AddOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { offer, mode } = location.state || {};
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    offer_id: "",
    name: "",
    type: "",
    valid_from: "",
    valid_to: "",
    discount_percent: "",
    eligible_items: "",
    min_age: "",
    max_age: "",
    eligible_gender: "All",
    remarks: "",
    company_id: "",
  });

  const [companies, setCompanies] = useState([]);
  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/companies/", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add this
        },
      });
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Load offer data when editing or viewing
  useEffect(() => {
    if (offer && (mode === "edit" || mode === "view")) {
      setFormData({
        offer_id: offer.offer_id || "",
        name: offer.offer_name || "",
        type: offer.offer_type || "",
        valid_from: offer.offer_validfrom || "",
        valid_to: offer.offer_validto || "",
        discount_percent: offer.offer_discount || "",
        eligible_items: offer.offer_eligibile_items || "",
        min_age: offer.offer_min_eligible || "",
        max_age: offer.offer_max_eligible || "",
        eligible_gender: offer.offer_gender || "All",
        remarks: offer.offer_remarks || "",
        company_id: offer.company_id || "",
      });
    }
  }, [offer, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      offer_id: "",
      name: "",
      type: "",
      valid_from: "",
      valid_to: "",
      discount_percent: "",
      eligible_items: "",
      min_age: "",
      max_age: "",
      eligible_gender: "All",
      remarks: "",
      company_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      offer_id: formData.offer_id,
      offer_name: formData.name,
      offer_type: formData.type,
      offer_validfrom: formData.valid_from,
      offer_validto: formData.valid_to,
      offer_discount: formData.discount_percent,
      offer_eligibile_items: formData.eligible_items,
      offer_max_eligible: formData.max_age,
      offer_min_eligible: formData.min_age,
      offer_gender: formData.eligible_gender,
      offer_remarks: formData.remarks,
      company_id: formData.company_id,
    };

    const method = mode === "edit" ? "PUT" : "POST";
    const url =
      mode === "edit"
        ? `http://127.0.0.1:8000/offers/${offer.id}`
        : "http://127.0.0.1:8000/offers/";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit offer");

      alert(`Offer ${mode === "edit" ? "updated" : "created"} successfully!`);
      navigate("/OfferPage");
    } catch (error) {
      alert(error.message);
    }
  };

  const disabled = mode === "view";

  return (
    <div className="mt-10 mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-semibold mb-6">OFFERS & DISCOUNTS</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-[#CBDCEB] rounded-2xl p-10"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">Company</label>
            <select
              name="company_id"
              value={formData.company_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company_id: parseInt(e.target.value),
                })
              }
              disabled={mode === "view"}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Offer ID"
            name="offer_id"
            value={formData.offer_id}
            onChange={handleChange}
            disabled={disabled}
          />
          <Input
            label="Offer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={disabled}
          />
          <Input
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-6">
          <Input
            type="date"
            label="Valid From"
            name="valid_from"
            value={formData.valid_from}
            onChange={handleChange}
            disabled={disabled}
          />
          <Input
            type="date"
            label="Valid To"
            name="valid_to"
            value={formData.valid_to}
            onChange={handleChange}
            disabled={disabled}
          />
          <Input
            type="number"
            label="Discount %"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-3 gap-6">
          <Input
            label="Eligible Items/Services"
            name="eligible_items"
            value={formData.eligible_items}
            onChange={handleChange}
            disabled={disabled}
          />

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Eligible Age
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                name="min_age"
                value={formData.min_age}
                onChange={handleChange}
                disabled={disabled}
                className="w-1/2 h-[42px] border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number"
                placeholder="Max"
                name="max_age"
                value={formData.max_age}
                onChange={handleChange}
                disabled={disabled}
                className="w-1/2 h-[42px] border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Eligible Gender
            </label>
            <select
              name="eligible_gender"
              value={formData.eligible_gender}
              onChange={handleChange}
              disabled={disabled}
              className="w-full h-[42px] border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Remarks */}
        <Input
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          disabled={disabled}
          width="w-1/3"
        />

        {/* Buttons */}
        {mode !== "view" && (
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
            >
              <Send size={18} /> Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  width = "w-full",
  disabled = false,
}) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${width} h-[42px] border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default AddOffer;
