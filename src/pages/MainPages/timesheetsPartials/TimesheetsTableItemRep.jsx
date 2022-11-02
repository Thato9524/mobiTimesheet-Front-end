import React, { useState } from "react";
import TimesheetsTableItemItemsRep from "./TimesheetsTableItemItemsRep";

function TimesheetsTableItemRep(props) {
  const [descriptionOpen, setDescriptionOpen] = useState(
    props.descriptionExpanded
  );

  const [otherTimesheetsOpen, setOtherTimesheetsOpen] = useState(
    props.otherTimesheetsOpen
  );

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "declined":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };


  return (
    <tbody className="text-sm">
      {/*
       *
       *
       ************************************************** Table Employee Table **************************************************
       *
       *
       */}
      {/* Row */}
      {}
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <label className="inline-flex">
              <span className="sr-only">Select</span>
              <input
                id={props.id}
                className="form-checkbox"
                type="checkbox"
                onChange={props.handleClick}
                checked={props.isChecked}
              />
            </label>
          </div>
        </td>
        {/*<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center text-zinc-800">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-zinc-100 rounded-full mr-2 sm:mr-3">
              <img
                className="ml-1"
                src={props.image}
                width="20"
                height="20"
                alt={props.timesheet}
              />
            </div>
            <div className="font-medium text-rose-500">{props.timesheet}</div>
          </div>
      </td>*/}
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div>{props.date}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div>{props.dateName}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-zinc-800">{props.consultant}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left ml-5">{props.hours}</div>{" "}
          {/* WAS "text-left"  WITH NO "ml-5"*/}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left ml-5">{props.totalDayHours}</div>{" "}
          {/* WAS "text-left"  WITH NO "ml-5"*/}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center">
            {/*typeIcon(props.type) make it description*/}
            <div>{props.description.substring(0, 15)}</div>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div
            className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
              props.status
            )}`}
          >
            {props.status}
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <button
              onClick={() =>
                props.approveOne(props.id, "approved")
              }
            >
              {" "}
              <img src="https://img.icons8.com/color/24/000000/ok--v1.png" />
            </button>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <button
              onClick={() =>
                props.approveOne(props.id, "declined", props.description, props.date, props.dateName)
              }
            >
              {" "}
              <img src="https://img.icons8.com/color/24/000000/cancel--v1.png" />
            </button>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-zinc-400 hover:text-zinc-500 transform ${
                descriptionOpen && "rotate-180"
              }`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={`description-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      {/*
      Example of content revealing when clicking the button on the right side:
      Note that you must set a "colSpan" attribute on the <td> element,
      and it should match the number of columns in your table
      */}
      <tr
        id={`description-${props.id}`}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex items-center bg-zinc-50 p-3 -mt-3">
            {/* <svg className="w-4 h-4 shrink-0 fill-current text-zinc-400 mr-2">
              <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
            </svg>
            */}
            <div className="italic">{props.description}</div>
          </div>
        </td>
      </tr>
      <tr role="region">
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-0">
          <TimesheetsTableItemItemsRep
            otherTimesheetData={props.otherTimesheetData}
            id={props.id}
            user={props.user}
            day={props.day}
          />
        </td>
      </tr>

      {/*<tr role="region">
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            Other Timesheets
            <button
              className={`text-zinc-400 hover:text-zinc-500 transform ${
                otherTimesheetsOpen && "rotate-180"
              }`}
              aria-expanded={otherTimesheetsOpen}
              onClick={() => {
                setOtherTimesheetsOpen(!otherTimesheetsOpen);
                props.getOtherTimesheets(props.user, props.day);
              }}
              aria-controls={`timesheet-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr
        id={`timesheets-${props.id}`}
        role="region"
        className={`${!otherTimesheetsOpen && "hidden"}`}
      >
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex items-center bg-zinc-50 p-3 -mt-3">
            <table className="table-auto w-full divide-y divide-slate-200">
              {/* Table header 
              <thead className="text-xs uppercase text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Project</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Hours</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Description</div>
                  </th>
                </tr>
              </thead>
              {props.otherTimesheetDataExists ? (
                props.otherTimesheetData.map((timesheet) => {
                  return (
                    <tbody className="text-sm">
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left ml-5">
                          {timesheet.project.projectName}
                        </div>{" "}
                      </td>
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left ml-5">{timesheet.hours}</div>{" "}
                      </td>
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left ml-5">{timesheet.desc}</div>{" "}
                      </td>
                    </tbody>
                  );
                })
              ) : (
                <tbody className="text-sm">
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="text-left ml-5">No timesheet</div>{" "}
                  </td>
                </tbody>
              )}
            </table>{" "}
          </div>
        </td>
      </tr>*/}
    </tbody>
  );
}

export default TimesheetsTableItemRep;
