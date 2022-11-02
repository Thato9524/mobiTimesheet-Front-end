import React, { useState } from "react";
import AnalyticsCardItems from "../../pages/MainPages/AnalyticsPartials/AnalyticsCard13Item";

function AnalyticsCard13(props) {
  /* ************************************************************************************************************
   *
   *                                         SEARCH FUNCTIONALITY:
   *
   *************************************************************************************************************/

  function search(managers) {
    return managers.filter((manager) => {
      if (props.searchTerm == "") {
        console.log("Manager", manager);
        return manager;
      } else if (
        manager.firstName
          .toLowerCase()
          .includes(props.searchTerm.toLowerCase()) ||
        manager.lastName.toLowerCase().includes(props.searchTerm.toLowerCase())
      ) {
        // console.log("employee: ", manager);
        return manager;
      }
      // else if (
      //   manager.consultants.some((info) =>
      //     info.personalInfo.firstName
      //       .toLowerCase()
      //       .includes(props.searchTerm.toLowerCase())
      //   ) ||
      //   manager.consultants.some((info) =>
      //     info.personalInfo.lastName
      //       .toLowerCase()
      //       .includes(props.searchTerm.toLowerCase())
      //   )
      // ) {
      //   return manager;
      // }
    });
  }

  //TODO: FULLWIDTH TABLE
  return (
    <div className="col-span-full bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Project Managers</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Manager</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            {search(props.managersData).map((manager) => {
              return <AnalyticsCardItems manager={manager} />;
            })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard13;
