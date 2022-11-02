import React from "react";

// sm:col-span-4 xl:col-span-4

function DashboardCard01({ client }) {
  return (
    <div className="flex flex-col  sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-md">
      <div className="px-5 pt-5">
        <h1 className="text-lg font-semibold text-slate-800 mb-2">
          {client?.clientName}
        </h1>
        <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
          Hours
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2 pb-3">
            {client?.hours}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
