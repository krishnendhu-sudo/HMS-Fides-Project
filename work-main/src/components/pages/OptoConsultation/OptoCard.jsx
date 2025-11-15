import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function OptoCards({ cards, onCardClick, }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mr-6 ml-12 mb-8 justify-start">
      {cards.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onCardClick(item.label)}
          className={`${item.color} relative rounded-lg shadow-md cursor-pointer flex flex-col justify-center items-center
            w-full h-[202px] transition-all duration-200 p-6`}
        >
          {/* Arrow at top-right */}
          <ArrowUpRight className="absolute top-4 right-4 w-10 h-10 text-black bg-white rounded-full" />

          {/* Centered text */}
          <div className="text-center">
            <p className="text-4xl font-bold text-black">{item.count}</p>
            <p className="text-lg font-semibold">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
