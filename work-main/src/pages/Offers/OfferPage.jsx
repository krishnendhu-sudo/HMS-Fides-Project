import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const OfferPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch offers from backend with token
  const fetchOffers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/offers/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch offers");
      const data = await response.json();
      setOffers(data); // Backend should include company info in the offer object
    } catch (err) {
      console.error("Error fetching offers:", err);
      alert("❌ Failed to fetch offers. Check login token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEdit = (offer) => navigate("/AddOffer", { state: { offer, mode: "edit" } });
  const handleView = (offer) => navigate("/AddOffer", { state: { offer, mode: "view" } });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/offers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete offer");
      setOffers((prev) => prev.filter((o) => o.id !== id));
      alert("Offer deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddItem = () => navigate("/AddOffer");

  if (loading) return <p className="text-center py-10">Loading offers...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleAddItem}
          className="bg-[#6D94C5] text-2xl px-4 py-2 rounded-full text-white font-semibold"
        >
          + ADD NEW OFFER
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-black text-white h-[70px] text-lg">
            <tr>
              <th className="px-4 py-2 text-left">Offer ID</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Offer Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Valid From</th>
              <th className="px-4 py-2 text-left">Valid To</th>
              <th className="px-4 py-2 text-left">Discount %</th>
              <th className="px-4 py-2 text-left">Eligible Item/Services</th>
              <th className="px-4 py-2 text-left">Eligible Age</th>
              <th className="px-4 py-2 text-left">Eligible Gender</th>
              <th className="px-4 py-2 text-left">Remarks</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {offers.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-5">
                  No offers found.
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="text-lg border-b h-[70px] hover:bg-gray-100">
                  <td className="px-4 py-2">{offer.offer_id}</td>
                  <td className="px-4 py-2">{offer.company?.name || "N/A"}</td>
                  <td className="px-4 py-2">{offer.offer_name}</td>
                  <td className="px-4 py-2">{offer.offer_type}</td>
                  <td className="px-4 py-2">{offer.offer_validfrom}</td>
                  <td className="px-4 py-2">{offer.offer_validto}</td>
                  <td className="px-4 py-2">{offer.offer_discount}%</td>
                  <td className="px-4 py-2">{offer.offer_eligibile_items}</td>
                  <td className="px-4 py-2">
                    {offer.offer_min_eligible} - {offer.offer_max_eligible}
                  </td>
                  <td className="px-4 py-2">{offer.offer_gender}</td>
                  <td className="px-4 py-2">{offer.offer_remarks}</td>
                  <td className="px-2 py-3 flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleView(offer)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEdit(offer)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(offer.id)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferPage;
