import React, { useState } from "react";

function RecruitCardItem({ recruit }) {
  return (
    <tbody className="text-sm divide-y divide-slate-100">
      <tr>
        <td className="p-2 whitespace-nowrap">
          <div className="text-m text-left">
            <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5">
              {recruit.name}
            </div>
            {/* {(() => {
              switch (props.employee.statusFlag) {
                case "red":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5  bg-rose-100 text-rose-600">
                      {props.employee.name}
                    </div>
                  );
                case "orange":
                  return (
                    <div
                      className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5"
                      style={{
                        backgroundColor: "rgb(255 237 213)",
                        color: "rgb(234 88 12)",
                      }}
                    >
                      {props.employee.name}
                    </div>
                  );
                case "yellow":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-yellow-100 text-yellow-600">
                      {props.employee.name}
                    </div>
                  );
                case "green":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-green-100 text-green-600">
                      {props.employee.name}
                    </div>
                  );
              }
            })()} */}
          </div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="font-medium text-slate-800">
            <div className="font-medium text-slate-800">{recruit.email}</div>
          </div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div
            className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5"
            style={{
              backgroundColor: "rgb(255 237 213)",
              color: "rgb(234 88 12)",
            }}
          >
            {recruit.seniority.charAt(0).toUpperCase() +
              recruit.seniority.slice(1)}
          </div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div
            className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5"
            style={{
              backgroundColor: "rgba(106, 13, 173, 0.3)",
              color: "rgb(106, 13, 173)",
            }}
          >
            {recruit.stage.charAt(0).toUpperCase() + recruit.stage.slice(1)}
          </div>
        </td>

        {/* <td className="p-2 whitespace-nowrap">
          <div className="text-m text-left">
            {(() => {
              switch (props.employee.utilizationFlag) {
                case "red":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-rose-100 text-rose-600">
                      {props.employee.billableUtilization + "%"}{" "}
                    </div>
                  );
                case "yellow":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-yellow-100 text-yellow-600">
                      {props.employee.billableUtilization + "%"}{" "}
                    </div>
                  );
                case "green":
                  return (
                    <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-green-100 text-green-600">
                      {props.employee.billableUtilization + "%"}{" "}
                    </div>
                  );
              }
            })()}
          </div>
        </td> */}
        {/* <td className="p-2 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-zinc-400 hover:text-zinc-500 transform ${
                descriptionOpen && "rotate-180"
              }`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={props.employee._id}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td> */}
      </tr>
      {/* <tr
        id={props.employee._id}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className=" items-center bg-zinc-50 p-3 -mt-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Project(s)</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Project Manager
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Project Hours
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-slate-800">
                        {props.employee.projectInfo.map((info, index) => {
                          return (
                            <div key={index}>{info.project.projectName}</div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-slate-800">
                        {props.employee.projectInfo.map((info, index) => {
                          return (
                            <div key={index}>
                              {info.project.businessRep.personalInfo.firstName +
                                " " +
                                info.project.businessRep.personalInfo.lastName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>

                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-slate-800">
                        {props.employee.projectInfo.map((info, index) => {
                          return <div key={index}>{info.totalHours}</div>;
                        })}
                      </div>
                    </div>
                  </td>
                </tbody>
              </table>
            </div>{" "}
          </div>
        </td>
      </tr> */}
    </tbody>
  );
}

export default RecruitCardItem;
