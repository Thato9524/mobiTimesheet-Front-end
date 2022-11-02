import React, { useState, useEffect } from "react";
import ModalBlank from "../../../components/ModalBlank";
import TimesheetsItems from "./TimesheetsTableItem";
import PreLoader from "../../../components/PreLoader";
import request from "../../../handlers/request";
import config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./timesheetsTable.css"

function TimesheetsTable(props) {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  let userid = localStorage.getItem("_id");
  useEffect(() => {
    setSubmitted(false);
  }, [props.timesheetData]);
  function filterTimesheets(timesheets) {
    return timesheets.filter((timesheet) => {
      if (!props.selectedOptions.length) {
        return timesheet;
      } else if (
        props.selectedOptions.includes(timesheet.changed) ||
        props.selectedOptions.includes(timesheet.approval.toLowerCase())
      ) {
        return timesheet;
      }
    });
  }

  async function submitTimesheet() {
    let req = await request.post(
      `${config.path.completedsheet.createCompletedsheet}/${userid}/${props.month._id}/${props.project}`,
      { user: userid },
      true
    );
    setSubmitted(true);
  }

  /* ************************************************************************************************************
   *
   *                                         RENDERING:
   *
   *************************************************************************************************************/

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="relative overflow-hidden">
        {/* Table */}
        <div className="relative h-17 overflow-y-auto overflow-clip">
          <table className="table-auto w-full divide-y divide-slate-200">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-t border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Day</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Project Hours</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total Hours</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Description</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Approval</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold"></div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
              </tr>
            </thead>
            {props.timesheetsLoader ? (
              <div className="w-full">
                <PreLoader />
              </div>
            ) : (
              filterTimesheets(props.timesheetData).map((timesheet, i) => {
                return (
                  <TimesheetsItems
                    key={i}
                    id={timesheet._id}
                    timesheet={i + 1}
                    date={timesheet.day + "/" + timesheet.month}
                    fullDate={
                      timesheet.year +
                      "-" +
                      timesheet.month +
                      "-" +
                      timesheet.day
                    }
                    dayName={timesheet.dayName}
                    hours={parseFloat(timesheet.hours)}
                    totalHours={parseFloat(timesheet.dailyHours)}
                    approval={timesheet.approval}
                    status={timesheet.changed}
                    description={timesheet.desc}
                    day={timesheet.day}
                    editTimesheet={props.editTimesheet}
                    editable={
                      props.completedsheet.length > 0
                        ? props.completedsheet.some(
                            (item) =>
                              submitted ||
                              (item.user === userid &&
                                item.month === props.month._id &&
                                item.project === props.project)
                          )
                          ? false
                          : true
                        : true
                    }
                    handleError={props.handleError}
                    leaveDay={timesheet.leaveDay}
                  />
                );
              })
            )}
          </table>
        </div>
        <div className="mt-auto grid grid-flow-col sm:auto-cols-max justify-start p-1 sm:justify-end gap-2 ">
            {props.completedsheet.length > 0 ? (
              props.completedsheet.some(
                (item) =>
                  submitted ||
                  (item.user === userid &&
                    item.month === props.month._id &&
                    item.project === props.project)
              ) ? (
                <button
                  disabled={true}
                  className="btn-sm bg-gray-400 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuccessModalOpen(true);
                  }}
                >
                  Submit Timesheets
                </button>
              ) : (
                <button
                  disabled={submitted}
                  className={
                    submitted
                      ? "btn-sm bg-gray-400 text-white"
                      : "btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuccessModalOpen(true);
                  }}
                >
                  Submit Timesheets
                </button>
              )
            ) : (
              <button
                disabled={submitted}
                className={
                  submitted
                    ? "btn-sm bg-gray-400 text-white"
                    : "btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSuccessModalOpen(true);
                }}
              >
                Submit Timesheets
              </button>
            )}
            <div>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="p-2"
                size="lg"
                onClick={() => {
                  setInfoModalOpen(true);
                }}
              />
            </div>
          </div>
        <ModalBlank
          id="success-modal"
          modalOpen={successModalOpen}
          setModalOpen={setSuccessModalOpen}
        >
          {
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                </svg>
              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-5">
                  <div className="text-lg font-semibold text-zinc-800">
                    Are you sure you want to submit your full timesheet for{" "}
                    <a className="font-bold"> {props.monthName}</a> and project{" "}
                    <a className="font-bold"> "{props.editProjectName}"</a>?
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSuccessModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={(e) => {
                      submitTimesheet();
                      e.stopPropagation();
                      setSuccessModalOpen(false);
                    }}
                  >
                    Yes, Submit it
                  </button>
                </div>
              </div>
            </div>
          }
        </ModalBlank>
        <ModalBlank
          id="info-modal"
          modalOpen={infoModalOpen}
          setModalOpen={setInfoModalOpen}
        >
          {
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                </svg>
              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-5">
                  <div className="text-lg font-semibold text-zinc-800">
                    This button is used to submit all your timesheet entries for{" "}
                    {props.editProjectName} in {props.monthName}.
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalOpen(false);
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          }
        </ModalBlank>
      </div>
    </div>
  );
}

export default TimesheetsTable;
