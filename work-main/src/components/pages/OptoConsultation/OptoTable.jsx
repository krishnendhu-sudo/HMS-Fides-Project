import React from "react";

export default function OPtoTable({ headers, patients }) {
  return (
    <div className="overflow-x-auto w-screen"> 
      <table className="w-screen border-collapse"> 
        <thead>
          <tr className="bg-[#000000C2] text-white text-base">
            {headers.map((head, i) => (
              <th key={i} className="px-6 py-3 text-left">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr
              key={i}
              className="bg-[#0B9C73] text-white text-base hover:bg-[#087a58] transition"
            >
              <td className="px-6 py-3">{p.opNumber}</td>
              <td className="px-6 py-3">{p.name}</td>
              <td className="px-6 py-3">{p.age}</td>
              <td className="px-6 py-3">{p.sex}</td>
              <td className="px-6 py-3">{p.inTime}</td>
              <td className="px-6 py-3">{p.token}</td>
              <td className="px-6 py-3">{p.waiting}</td>
              <td className="px-6 py-3">{p.type}</td>
              <td className="px-6 py-3">{p.fee}</td>
              <td className="px-6 py-3">{p.scheme}</td>
              <td className="px-6 py-3">{p.category}</td>
              <td className="px-6 py-3">{p.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
