import React, { useState, useEffect } from "react";
import Timesheets from "./TimesheetsTableItemRep";
import { useParams } from "react-router-dom";

import Image03 from "../../../images/icon-03.svg";
import ModalBlank from "../../../components/ModalBlank";
import request from "../../../handlers/request";
import config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

//function TimesheetsTable({ setSelectedItems}) {
function TimesheetsTableRep(props) {
  const { key } = useParams();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState([]);
  const [submittedBool, setSubmittedBool] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  //const [list, setList] = useState([]);

  async function sumbitProject() {
    let req = await request.patch(
      `${config.path.projects.setPdfApproval}/${props.selectedMonth}/${props.project}`
    );
    setSubmittedBool(true);
  }
  useEffect(async () => {
    let req = await request.get(
      `${config.path.projects.getPdfStatus}/${props.selectedMonth}/${props.project}`
    );
    setSubmitted(req);

    console.log("req", req);
  }, []);

  /* ************************************************************************************************************
   *
   *                                         SEARCH & FILTER FUNCTIONALITY:
   *
   *************************************************************************************************************/

  function searchFilter(items) {
    return items.filter((item) => {
      //IF A FILTER HAS BEEN APPLIED
      if (props.selectedOptions.includes(item.approval.toLowerCase())) {
        //CHECK IF A NAME HAS BEEN SEARCHED
        if (
          item.user.personalInfo.firstName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase()) ||
          item.user.personalInfo.lastName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return item;
        }
      }
      //IF NO FILTER HAS BEEN APPLIED
      else if (!props.selectedOptions.length) {
        //CHECK IF A NAME HAS BEEN SEARCHED
        if (
          item.user.personalInfo.firstName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase()) ||
          item.user.personalInfo.lastName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return item;
        }
      }
    });
  }

  /* ************************************************************************************************************
   *
   *                                         USE EFFECT:
   *
   *************************************************************************************************************/

  useEffect(() => {
    //setList(orders);
    //setList(props.timesheetData);
    setIsCheck([]); //RESET CHECK BOX
    setSelectAll(false); //RESET CHECK BOX
  }, [props.timesheetData]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll); //toggle selectAll
    setIsCheck(props.timesheetData.map((timesheet) => timesheet._id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    props.setSelectedItems(isCheck);
  }, [isCheck]);

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">
          Approve Timesheets{" "}
          {/*} <span className="text-slate-400 font-medium">442</span>*/}
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full divide-y divide-slate-200">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-t border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Day</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Consultant</div>
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
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold "></div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
              </tr>
            </thead>
            {/* Table body {list.map((order) => { */}
            {searchFilter(props.timesheetData).map((timesheet, i) => {
              if (timesheet.hours > 0) {
                return (
                  <Timesheets
                    key={i}
                    user={timesheet.user._id}
                    day={timesheet.day}
                    id={timesheet._id}
                    timesheet={i + 1}
                    image={Image03}
                    date={timesheet.day + "/" + timesheet.month}
                    dateName={timesheet.dayName}
                    consultant={
                      timesheet.user.personalInfo.firstName +
                      " " +
                      timesheet.user.personalInfo.lastName
                    }
                    status={timesheet.approval}
                    hours={parseFloat(timesheet.hours)}
                    totalDayHours={parseFloat(timesheet.totalDayHours)}
                    description={timesheet.desc}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(timesheet._id)}
                    approveOne={props.approveOne}
                    descriptionExpanded={true}
                  />
                );
              }
            })}
          </table>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start p-3 sm:justify-end gap-2 ">
          <button
            disabled={submitted.approved}
            className={
              submitted.approved || submittedBool
                ? "btn-sm bg-gray-400 text-white"
                : "btn-sm bg-rose-500 hover:bg-rose-600 text-white"
            }
            onClick={(e) => {
              e.stopPropagation();
              setSuccessModalOpen(true);
            }}
          >
            Complete Approval
          </button>
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
      </div>
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
                  This button is used to indicate that you have approved all the
                  submitted entries and don't require any further adjustments
                  for project "{props.info.project}" in {props.info.month}.
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
                  Are you sure you want to submit approval of your teams full
                  timesheet for project{" "}
                  <a className="font-bold">"{props.info.project}"</a> in{" "}
                  <a className="font-bold">{props.info.month}</a> ?
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
                    sumbitProject();
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
    </div>
  );
}

export default TimesheetsTableRep;
