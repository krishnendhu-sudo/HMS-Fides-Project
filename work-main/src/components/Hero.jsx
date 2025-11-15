import { Link } from "react-router-dom";

const features = [

   {name:"Company",icon:"/icons/Company.png",link:"/CompanyPage"},
  {name:"User",icon:"/icons/user.png",link:"/UserPage"},
  { name: "Appointment", icon: "/icons/Appointment.png", link: "/appointment" },
  
  { name: "Optometry", icon: "/icons/Optometry.png", link: "/ConsultList" },
  { name: "Consultation", icon: "/icons/Consultation.png", link: "/Consultation" },
  { name: "Opticals", icon: "/icons/Opticals.png", link: "/opticals" },
  
  { name: "Doctors", icon: "/icons/Doctors.png", link: "/doctors" },
  { name: "Pharmacy", icon: "/icons/Pharmacy.png", link: "/pharmacy" },
  { name: "Bills", icon: "/icons/Bills.png", link: "/bills" },
  { name: "Counsellor Desk", icon: "/icons/Counsellor-Desk.png", link: "/counsellor-desk" },
  { name: "Insurance", icon: "/icons/Insurance.png", link: "/ForMailing" },
  { name: "Patients", icon: "/icons/Patients.png", link: "/patients" },
  
  { name: "Supplier", icon: "/icons/Supplier.png", link: "/SupplierTable" },
  { name: "Inventory", icon: "/icons/Inventory.png", link: "/InventoryMang" },
  {name: "Analytics", icon: "/icons/Analytics.png", link: "/Analytics"},
  {name: "Offers", icon: "/icons/OfferIcon.png", link: "/OfferPage"},
  {name: "Kitpage", icon: "/icons/kit.jpg", link: "/kitpage"},
  {name: "Profile", icon: "/icons/Profile.jpg", link: "/profile"},
   
];

const roleFeatures = {
  super_admin: [
    "Company", "User", "Appointment", "Consultation", "Optometry", 
    "Patients", "Doctors", "Pharmacy", "Bills", "Opticals", 
    "Insurance", "Counsellor Desk", "Supplier", "Inventory", 
    "Analytics", "Offers","Profile","Kitpage"
  ],
  admin: [
    "User", "Appointment", "Consultation", "Optometry", 
    "Patients", "Doctors", "Pharmacy", "Bills", "Opticals","Insurance", 
    "Counsellor Desk", "Supplier", "Inventory", "Analytics", "Offers","Profile","Kitpage"
  ],
  doctor: ["Appointment", "Consultation", "Optometry", "Patients","Profile","Kitpage"],
  optometrist: ["Optometry","Profile"],
  receptionist: ["Appointment", "Bills", "Patients","Profile"],
  pharmacist: ["Pharmacy","Profile","Kitpage"],
  optician: ["Opticals","Profile"],
  counsellor: ["Counsellor Desk","Profile"],
  accountant: ["Bills", "Analytics", "Insurance","Profile"],
};

// Your Hero component comes after this
export default function Hero() {
  const role = localStorage.getItem("role");
  const visibleFeatures = features.filter(f => roleFeatures[role]?.includes(f.name));

  return (
    <main className="p-6 mt-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleFeatures.map((item, index) => (
          <Link to={item.link} key={index}>
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <img
                src={item.icon}
                alt={item.name}
                className="w-16 h-16 object-contain mb-4"
              />
              <p className="text-lg font-poppins text-gray-800">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}