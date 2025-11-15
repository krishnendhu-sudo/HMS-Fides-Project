import React, { useState, useEffect } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import MedicinKit from "./Medicinkit";
// import Instruction from "./Instruction";

const PrescribeMedi = ({ onClose }) => {
  const [selectedHeader, setSelectedHeader] = useState("");
  const [showKitModal, setShowKitModal] = useState(false);
  const [showInstructionPopup, setShowInstructionPopup] = useState(false); // ✅ added missing state
  const [category, setCategory] = useState("ALL");
  const [dosage, setDosage] = useState("");
  const [itemName, setItemName] = useState("");
  const [form, setForm] = useState({
    frequency: "",
    duration: "",
    route: "",
    quantity: "",
    startDate: "",
    endDate: "",
  });

  const [medicines, setMedicines] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const headers = ["Medicine", "Kit", "Special instruction"];
  const categories = [
    "ALL",
    "NSAID",
    "ANTI BACTERIAL",
    "VITAMINS",
    "GLAUCOMA",
    "LUBRICANT",
    "ANTIOXIDANT",
  ];
  const dosages = [
    "2 TIME TILL ONE BOTTLE",
    "3 TIMES LIFE LONG",
    "3-2-0",
    "3 TIMES ONE TEASPOON",
    "2-2-0",
    "1-1-0",
    "NIGHT ONE TUBE",
  ];

  // const navigate = useNavigate();

  // ✅ Manage background scroll for both modals
  useEffect(() => {
    document.body.style.overflow =
      showKitModal || showInstructionPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showKitModal, showInstructionPopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    if (!itemName || !dosage || !form.duration || !form.route || !form.quantity) {
      alert("Please fill all required fields!");
      return;
    }

    const newMedicine = {
      category,
      itemName,
      dosage,
      frequency: form.frequency,
      duration: form.duration,
      route: form.route,
      quantity: form.quantity,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    if (editIndex !== null) {
      const updated = [...medicines];
      updated[editIndex] = newMedicine;
      setMedicines(updated);
      setEditIndex(null);
    } else {
      setMedicines([...medicines, newMedicine]);
    }

    setCategory("ALL");
    setDosage("");
    setItemName("");
    setForm({
      frequency: "",
      duration: "",
      route: "",
      quantity: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleEdit = (index) => {
    const med = medicines[index];
    setCategory(med.category);
    setDosage(med.dosage);
    setItemName(med.itemName);
    setForm({
      frequency: med.frequency,
      duration: med.duration,
      route: med.route,
      quantity: med.quantity,
      startDate: med.startDate,
      endDate: med.endDate,
    });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const close = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      // navigate(-1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
      {/* Background Blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-gray-300/30 z-0"
        onClick={close}
      />

      {/* Main Modal */}
      <div
        className="relative z-10 w-full max-w-8xl p-6 bg-white rounded-2xl overflow-y-auto max-h-[90vh] space-y-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PRESCRIBE MEDICINE</h1>
          <button
            type="button"
            onClick={close}
            className="text-gray-600 hover:text-red-600 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full max-w-3xl mb-6">
          {headers.map((header) => (
            <div
              key={header}
              onClick={() => {
                setSelectedHeader(header);
                if (header === "Kit") setShowKitModal(true);
                if (header === "Special instruction") setShowInstructionPopup(true);
              }}
              className={`flex-1 text-center px-4 py-2 cursor-pointer text-base md:text-xl font-semibold border rounded-full transition-all ${
                selectedHeader === header
                  ? "bg-[#F7DACD]"
                  : "bg-white text-black"
              }`}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-6 bg-[#F7DACD] rounded-2xl space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold mb-1">CATEGORY</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-semibold mb-1">ITEM NAME</p>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              />
            </div>
            <div>
              <p className="font-semibold mb-1">DOSAGE</p>
              <select
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              >
                <option value="">Select dosage</option>
                {dosages.map((dose) => (
                  <option key={dose} value={dose}>
                    {dose}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["frequency", "duration", "route"].map((key) => (
              <div key={key}>
                <p className="font-semibold mb-1">{key.toUpperCase()}</p>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${key}`}
                  className="w-full bg-white rounded-full px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["quantity", "startDate", "endDate"].map((key) => (
              <div key={key}>
                <p className="font-semibold mb-1">
                  {key.replace("Date", " DATE").toUpperCase()}
                </p>
                <input
                  type={key.includes("Date") ? "date" : "text"}
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                  placeholder={key === "quantity" ? "Enter quantity" : ""}
                  className="w-full bg-white rounded-full px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <button
            type="button"
            onClick={handleAddMedicine}
            className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 text-sm md:text-base"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={close}
            className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 text-sm md:text-base"
          >
            Cancel
          </button>
        </div>

        {/* Medicine Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full rounded-lg text-sm md:text-base border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                {[
                  "MEDICINE",
                  "DOSAGE",
                  "DURATION",
                  "QUANTITY",
                  "ROUTE",
                  "START DATE",
                  "END DATE",
                  "ACTION",
                ].map((head) => (
                  <th key={head} className="px-4 py-2">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No medicines added yet.
                  </td>
                </tr>
              ) : (
                medicines.map((med, index) => (
                  <tr key={index} className="text-center border-t">
                    <td className="px-4 py-2">{med.itemName}</td>
                    <td className="px-4 py-2">{med.dosage}</td>
                    <td className="px-4 py-2">{med.duration}</td>
                    <td className="px-4 py-2">{med.quantity}</td>
                    <td className="px-4 py-2">{med.route}</td>
                    <td className="px-4 py-2">{med.startDate}</td>
                    <td className="px-4 py-2">{med.endDate}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Kit Popup Modal */}
      {showKitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md bg-black/40">
          <div className="relative w-[95%] md:w-[900px] bg-white rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setShowKitModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <h1 className="text-3xl font-bold mb-6 text-start text-gray-800">
              Select Kit
            </h1>
            <div className="w-full flex justify-start">
              <select className="w-[80%] border border-gray-300 rounded-lg p-4 text-lg focus:ring-2 focus:ring-[#7E4363] outline-none">
                <option value="">Select a kit</option>
                <option value="Basic">Basic Kit</option>
                <option value="Post Surgery">Post Surgery Kit</option>
                <option value="Glaucoma">Glaucoma Kit</option>
                <option value="Pediatric">Pediatric Kit</option>
              </select>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowKitModal(false)}
                className="bg-gray-800 text-white px-12 py-3 rounded-full text-lg font-semibold hover:bg-black transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Special Instruction Popup */}
      {showInstructionPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] md:w-[900px] max-h-[90vh] rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <button
              onClick={() => setShowInstructionPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X size={22} />
            </button>

            <h1 className="text-xl md:text-2xl font-bold mb-4">
              SPECIAL INSTRUCTION
            </h1>

            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 p-4 rounded-lg">
                  {[
                    "AVOID DUST",
                    "CONTROL OF DIABETES",
                    "SHAKE WELL",
                    "COTTON",
                    "HOT FOMENTATION",
                    "INJ 1",
                    "BRING MEDICINE PRESCRIPTION IN NEXT VISIT",
                    "DO NOT RUB EYES",
                    "CAUTIONED ABOUT STEROIDS",
                    "WARM FOMENTATION",
                    "PET ANIMALS",
                    "CHALAZION",
                    "MORNING 10 OR EVENING 5",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        className="mr-2 w-5 h-5 accent-green-600"
                      />
                      <label>{item}</label>
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-1/2 p-4 rounded-lg">
                  {[
                    "INJ2",
                    "HOT FOMENTATION",
                    "USE PROTECTION GLASSES",
                    "MASSAGE",
                    "PLANT",
                    "ALLERGY",
                    "MORNING 9",
                    "ALLERGY ENG",
                    "LID MASSAGE",
                    "CONTINUE OTHER PRESCRIBED MEDICINES",
                    "OINTMENT",
                    "DUST",
                    "COOL EYE MASK",
                    "3 TIMES HALF TEASPOON",
                    "COLD FOMENTATION",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        className="mr-2 w-5 h-5 accent-green-600"
                      />
                      <label>{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowInstructionPopup(false)}
                className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowInstructionPopup(false)}
                className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescribeMedi;
