import React, { useEffect, useRef, useState } from "react";

import Image01 from "../../images/user-28-01.jpg";
import Image02 from "../../images/user-28-02.jpg";
import Image03 from "../../images/user-28-03.jpg";
import Image04 from "../../images/user-28-04.jpg";
import Image05 from "../../images/user-28-05.jpg";
import Image06 from "../../images/user-28-06.jpg";
import Image07 from "../../images/user-28-07.jpg";
import Image09 from "../../images/user-28-09.jpg";
import Image11 from "../../images/user-28-11.jpg";
import dayjs from "dayjs";
import request from "../../handlers/request";
import config from "../../config";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
//import AnalyticsCard12Item from "../../pages/MainPages/AnalyticsPartials/AnalyticsCard12Item";
import AnalyticsCard12Item from "../../pages/MainPages/AnalyticsPartials/AnalyticsCard12Item";
import { set } from "date-fns";

const KendokaLogo = "https://i.ibb.co/Y3MH7k9/C3-Dark.png";

function AnalyticsCard12(props) {
  const [info, setInfo] = useState({});
  const [timesheetData, setTimesheetData] = useState([]);
  const pdfExportComponent = useRef(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  // console.log("props", props);
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="col-span-full bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Performance</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Client Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Project Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Project Start</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Project End</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Approved</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Downloaded</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left"></div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            {/* Row */}
            {props.clientsData.clientInfo
              .filter((client) => {
                if (props.searchTerm == "") {
                  return client;
                } else if (
                  client.client.clientName
                    .toLowerCase()
                    .includes(props.clientSearchTerm.toLowerCase())
                ) {
                  return client;
                }
              })
              .map((client) => {
                return client.projects
                  .filter((project) => {
                    if (
                      project.projectName
                        .toLowerCase()
                        .includes(props.projectSearchTerm.toLowerCase())
                    ) {
                      return project;
                    }
                  })
                  .map((project) => {
                    return (
                      <AnalyticsCard12Item
                        client={client}
                        project={project}
                        descriptionOpen={descriptionOpen}
                        refreshClient={props.refreshClient}
                        selectedMonth={props.selectedMonth}
                        droppedTab={props.droppedTab}
                        setDroppedTab={props.setDroppedTab}
                      />
                    );
                  });
              })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard12;
