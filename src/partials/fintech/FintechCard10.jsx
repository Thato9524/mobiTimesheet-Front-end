import React from "react";
import { Link } from "react-router-dom";

function FintechCard10({ client, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200"
    >
      <div className="p-5">
        <header>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-1">
            <span className="text-slate-800">{client?.clientName}</span>
          </h3>
          <div className="text-2xl font-bold text-slate-800 mb-1">
            {client?.hours}
          </div>
        </header>
      </div>
    </div>
  );
}

export default FintechCard10;
