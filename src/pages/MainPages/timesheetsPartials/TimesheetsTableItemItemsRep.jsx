import React, { useState } from "react";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../../App";
import request from "../../../handlers/request";
import config from "../../../config";
import { useParams, useNavigate } from "react-router-dom";
import PreLoader from "../../../components/PreLoader";

function TimesheetsTableItemItemsRep(props) {
  const [otherTimesheetsOpen, setOtherTimesheetsOpen] = useState(false);
  const [otherTimesheetData, setOtherTimesheetData] = useState([]);
  const [otherTimesheetDataExists, setOtherTimesheetDataExists] =
    useState(false);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();
  const { key } = useParams();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  //FUNCTION TO OTHER PROJECT TIMESHEESTS FOR THAT DAY
  const getOtherTimesheets = async (user, day) => {
    setLoading(true);

    checkToken();
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForUserDay}/${user}/${id}/${key}/${day}`
    );

    if (getTimesheets.length > 0) {
      setOtherTimesheetDataExists(true);
    } else {
      setOtherTimesheetDataExists(false);
    }

    // console.log("getTimesheets", getTimesheets);
    setOtherTimesheetData(getTimesheets);
    setLoading(false);
  };

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    // console.log("checkToken()");
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      // console.log("experied");
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      // console.log("login out...");
      navigateTo("/signin");
    }
  };

  return (
    <table className="text-sm w-full">
      <tbody className="text-sm w-full">
        {/* Row */}
        <tr role="region" className="text-sm  ">
          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
            <div className="flex items-center font-medium text-center px-2.5 py-0.5 bg-indigo-100 text-zinc-600">
              Other Timesheets
              <button
                className={`text-zinc-400 hover:text-zinc-500 transform ${
                  otherTimesheetsOpen && "rotate-180"
                }`}
                aria-expanded={otherTimesheetsOpen}
                onClick={() => {
                  setOtherTimesheetsOpen(!otherTimesheetsOpen);
                  //if((`timesheets-${props.id}`).attr('aria-expanded') === "false")
                  getOtherTimesheets(props.user, props.day);
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
        {loading ? (
          <div className="p-3 -mt-3 ">
            <PreLoader />
          </div>
        ) : otherTimesheetDataExists ? (
          <tr
            id={`timesheets-${props.id}`}
            role="region"
            className={`${!otherTimesheetsOpen && "hidden"}`}
          >
            <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3  w-full">
              <div className="flex items-center bg-indigo-100 p-3 -mt-3 ">
                <table className="table-auto w-full divide-y divide-slate-200">
                  {/* Table header */}
                  <thead className="text-xs uppercase text-slate-500 bg-indigo-100">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Project</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Hours</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          Description
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {otherTimesheetData.map((timesheet) => {
                    return (
                      <tr className="text-sm">
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">
                            {timesheet.project.projectName}
                          </div>{" "}
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left px-4">
                            {timesheet.hours}
                          </div>{" "}
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">{timesheet.desc}</div>{" "}
                        </td>
                      </tr>
                    );
                  })}
                </table>{" "}
              </div>
            </td>
          </tr>
        ) : (
          <tr
            id={`timesheets-${props.id}`}
            role="region"
            className={`${!otherTimesheetsOpen && "hidden"}`}
          >
            <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
              <div className="flex items-center bg-zinc-50 p-3 -mt-3 ">
                No other timesheets were logged
              </div>{" "}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TimesheetsTableItemItemsRep;
