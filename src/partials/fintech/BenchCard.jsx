import React from "react";

export default function BenchCard({ user, onClick, imageURL }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200"
    >
      <div className="p-5 flex justify-center">
        <header>
          <div className="flex justify-center">
            <div className="flex items-center">
              <img
                className="w-20 h-20 rounded-full mb-1"
                src={imageURL}
                width="80"
                height="80"
                alt="Avatar"
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              {user.personalInfo.firstName + " " + user.personalInfo.lastName}
            </h3>
          </div>
        </header>
      </div>
    </div>
  );
}
