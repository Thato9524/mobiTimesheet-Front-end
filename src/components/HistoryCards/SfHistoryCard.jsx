import React from "react";

export default function ScfHistoryCard(props) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full ">
        {/* Card top */}
        <div className="grow p-5">
          {/* Project name and contact details*/}
          <header>
            <div title={props.form.dateAdded} className="text-center mb-5">
              <div className="inline-flex text-slate-800 hover:text-slate-900">
                <h2 className="text-xl leading-snug justify-center font-semibold">
                  {new Date(props.form.dateAdded).toDateString()}
                </h2>
              </div>
            </div>
          </header>
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">Training Day</div>
            <div className="text-sm col-span-2 ">{props.form.trainingDay}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">Gender</div>
            <div className="text-sm col-span-2">{props.form.gender}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">
              Race
            </div>
            <div className="text-sm col-span-2">{props.form.race}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">ID Number</div>
            <div className="text-sm col-span-2">{props.form.id}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">Attendance</div>
            <div className="text-sm col-span-2">{props.form.attendance}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-2 font-bold">Venue</div>
            <div className="text-sm col-span-2">{props.form.venue}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
