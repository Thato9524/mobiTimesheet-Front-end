import React from "react";

export default function TaHistoryCard(props) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full ">
        {/* Card top */}
        <div className="grow p-5">
          {/* Project name and contact details*/}
          <header>
            <div title={props.form.created} className="text-center mb-5">
              <div className="inline-flex text-slate-800 hover:text-slate-900">
                <h2 className="text-xl leading-snug justify-center font-semibold">
                  {new Date(props.form.created).toDateString()}
                </h2>
              </div>
            </div>
          </header>
          {/* Contact Info */}
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">Value of vehicle</div>
            <div className="text-sm col-span-5">
              {props.form.vehicleRange === "> 665000"
                ? "More than R 665000"
                : "R " + props.form.vehicleRange}
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">
              Private Kilometers
            </div>
            <div className="text-sm col-span-5">{props.form.privateKilos} km</div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">
              Business Kilometers
            </div>
            <div className="text-sm col-span-5">{props.form.businessKilos} km</div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">Status</div>
            <div className="text-sm col-span-5">{props.form.approval}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
