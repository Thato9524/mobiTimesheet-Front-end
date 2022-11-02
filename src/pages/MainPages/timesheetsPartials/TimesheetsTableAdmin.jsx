import React, { useState, useEffect } from "react";
import TimesheetsTableItem from "./TimesheetsTableItemAdmin";
import { useParams } from "react-router-dom";

import Image03 from "../../../images/icon-03.svg";

//function TimesheetsTable({ setSelectedItems}) {
function TimesheetsTableAdmin(props) {

  const { key } = useParams();

  //useEffect(async () => {

  //}, [data.loading]);


  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  //const [list, setList] = useState([]);

  /* ************************************************************************************************************
   *
   *                                         USE EFFECT:
   *
   *************************************************************************************************************/

  useEffect(() => {
    //setList(orders);
    //setList(props.timesheetData);
    setIsCheck([]);
    setSelectAll(false);
    
  }, [props.timesheetData]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
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
          Add Rates to Timesheets{" "}
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
                  <div className="font-semibold text-left">Day Count</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Consultant</div>
                </th>

               {/*  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Project</div>
                </th>*/}
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                <div className="font-semibold text-left">Rate</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Project Hours</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total Hours</div>
                </th>
                
                {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Description</div>
                </th>*/}
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
            {/* Table body {list.map((order) => { */}
            {props.timesheetData.map((timesheet, i) => {
                  return (
                    <TimesheetsTableItem
                      key={i}
                      id={timesheet._id}
                      timesheet={i + 1}
                      image={Image03}
                      date={timesheet.day + "/" + timesheet.month}
                      consultant={timesheet.user.personalInfo.firstName + " " + timesheet.user.personalInfo.lastName}
                      rates={"R" + timesheet.rates}
                      status={timesheet.approval}
                      hours={parseFloat(timesheet.hours)}
                      totalDayHours={parseFloat(timesheet.totalDayHours)}
                      description={timesheet.desc}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(timesheet._id)}
                      editTimesheet={props.editTimesheet}
                    />
                  );
                })}
          </table>
          </div>
      </div>
    </div>
  );
}

export default TimesheetsTableAdmin;
