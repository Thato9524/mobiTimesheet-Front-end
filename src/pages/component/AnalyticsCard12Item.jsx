import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
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
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

const KendokaLogo = "https://i.ibb.co/Y3MH7k9/C3-Dark.png";
function AnalyticsCard12Item(props) {
  const [info, setInfo] = useState({});
  const [timesheetData, setTimesheetData] = useState([]);
  const pdfExportComponent = useRef(null);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [show, setShow] = useState(true);
  let approve = true;
  const getDataForTable = async (clientsData, projectData) => {
    setLoading(true);
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${projectData._id}/${props.month}`
    );
    let cleanTimesheet = [];
    getTimesheets.timesheets.forEach((timesheet) => {
      timesheet.changed && cleanTimesheet.push(timesheet);
    });
    setTimesheetData(cleanTimesheet);

    //GET CLIENT NAME, chosenProject NAME, MONTH NAME
    let project = await request.get(
      `${config.path.projects.getProject}/${projectData._id}`
    );
    let client = await request.get(
      `${config.path.clients.getClient}/${clientsData.client._id}`
    );

    let getMonth = await request.get(
      `${config.path.timesheet.getMonth}/${props.month}`,
      true
    );

    setInfo({
      project: project.projectName,
      client: client.clientName,
      month: getMonth.desc,
    });

    setLoading(false);
  };

  const ddData = [
    { text: "A4", value: "size-a4" },
    { text: "Letter", value: "size-letter" },
    { text: "Executive", value: "size-executive" },
  ];
  useEffect(() => {
    getDataForTable(props.client, props.project);
  }, []);
  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });
  const statusColor = (status) => {
    switch (status) {
      case "true":
        return "bg-green-100 text-green-600";
      case "false":
        return "bg-red-100 text-red-600";
      default:
        return "bg-zinc-100 text-zinc-500";
    }
  };
  const handleExportWithComponent = async (event, client) => {
    pdfExportComponent.current.save();
    let req = await request.patch(
      `${config.path.projects.editProject}/${props.project._id}`,
      { pdfDownload: "true" }
    );

    props.refreshClient();
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  return (
    <tbody className="text-sm divide-y divide-slate-100">
      <tr>
        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {props.client.client.clientName}
              {/* client.client.clientName */}
            </div>
          </div>
        </td>

        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* Projects */}

              <div>{props.project.projectName}</div>
            </div>
          </div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* Projects Manager*/}

              <div>{dayjs(props.project.dateAdded).format("YYYY-MM-DD")}</div>
            </div>
          </div>
        </td>

        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* Hours */}
              <div>{props.project.completionDate}</div>
            </div>
          </div>
        </td>

        <td>
          {props.project.pdfDownload ? (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-green-100 text-green-600`}
            >
              Already Done
            </div>
          ) : (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-red-100 text-red-600`}
            >
              Still Need to Download
            </div>
          )}
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-zinc-400 hover:text-zinc-500 transform ${
                descriptionOpen && "rotate-180"
              }`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={`description-${props.client.client._id}`}
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
        id={`description-${props.client.client._id}`}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex-colum items-center bg-zinc-50 p-3 -mt-3">
            {/* <svg className="w-4 h-4 shrink-0 fill-current text-zinc-400 mr-2">
              <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
            </svg>
            */}
            {timesheetData.map((item) => {
              item.approval === "pending" ? (approve = false) : null;
            })}
            <div>
              {approve ? (
                <div></div>
              ) : (
                <div className="text-red-600 font-bold text-l">
                  pending timesheet approvals
                </div>
              )}
            </div>
            {loading ? (
              `PDF is loading. Please wait...`
            ) : (
              <div>
                {" "}
                <div>
                  <Button
                    primary={true}
                    onClick={() => handleExportWithComponent()}
                  >
                    Export
                  </Button>
                </div>
                <div className="page-container hidden-on-narrow">
                  <PDFExport
                    ref={pdfExportComponent}
                    fileName={`Convergenc3_Timesheet_${info.project}/${
                      props.project.consultants.length === 1
                        ?  props.project.consultants[0].consultant.personalInfo
                            .firstName +
                          props.project.consultants[0].consultant.personalInfo
                            .lastName +
                          "_" : ""
                    }${info.month}`}
                    paperSize="A4"
                  >
                    <div className={`pdf-page ${layoutSelection.value}`}>
                      <div class="p-5">
                        <div class="flex justify-between m-auto items-center ">
                          <img
                            src={KendokaLogo}
                            alt="Kendoka Company Logo"
                            class="w-40"
                          />{" "}
                          <div>
                            <h3 class="font-bold text-lg">{info.month}</h3>
                          </div>
                        </div>
                        <div class="flex justify-between pt-5">
                          <div>
                            <h3 class="font-bold text-lg">{info.client}</h3>
                            <p class="text-s ">
                              {info.project}
                              {/* <br />
                    Project */}
                            </p>
                            <br />
                            <p class="text-xs">
                              Summary:
                              <div class=" pt-2 shadow-md rounded-md">
                                <table class="min-w-full">
                                  <thead class="bg-gray-500">
                                    <tr>
                                      <th
                                        scope="col"
                                        class=" px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Employee
                                      </th>

                                      <th
                                        scope="col"
                                        class=" px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Hours
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.project.consultants.map((item, i) =>
                                      item.hours == 0 ? (
                                        <tr></tr>
                                      ) : (
                                        <tr class="bg-white border-b ">
                                          <td class="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap ">
                                            {
                                              item.consultant.personalInfo
                                                .firstName
                                            }{" "}
                                            {
                                              item.consultant.personalInfo
                                                .lastName
                                            }
                                          </td>
                                          <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                                            {item.totalHours}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              {/* <br />
                    Project */}
                            </p>
                          </div>
                          {/* <div>
                  <h3 class="font-bold text-lg">Consultants</h3>
                  <p class="text-xs">
                    Maarten <br />
                    Jason
                  </p>
                </div> */}
                        </div>

                        <div class="flex pt-5 break-after-page">
                          <div class="w-full">
                            <div class="inline-block py-3 min-w-full align-middle">
                              <div class=" shadow-md rounded-md">
                                <table class="min-w-full">
                                  <thead class="bg-gray-500 ">
                                    <tr>
                                      <th
                                        scope="col"
                                        class="py-2 px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Date
                                      </th>
                                      <th
                                        scope="col"
                                        class="py-2 px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Consultant
                                      </th>
                                      <th
                                        scope="col"
                                        class="py-2 px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Hours
                                      </th>

                                      <th
                                        scope="col"
                                        class="py-2 px-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {timesheetData.map((item, i) =>
                                      item.hours == 0 ? (
                                        <tr></tr>
                                      ) : (
                                        <tr class="bg-white border-b ">
                                          <td class="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap ">
                                            {item.day}/{item.month}
                                          </td>
                                          <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                                            {item.user.personalInfo.firstName}{" "}
                                            {item.user.personalInfo.lastName}
                                          </td>
                                          <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                                            {item.hours}
                                          </td>

                                          <td class="py-2 px-3 text-xs text-gray-500 flex flex-wrap">
                                            {item.desc}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>

                                  {/*TO BE USED ONLY FOR SHOWING TOTALS ON THE BOTTOM OF THE PDF*/}
                                  {/* <tfoot>{props.data.map((item, i) => {
                           
                           item.hours > 0 ? hour = parseInt(hour) + parseInt(item.hours) : {}
                             
                       })}
                       <tr class="bg-white border-b ">
                               <td class="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap ">
                                
                               </td>
                               <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                                 Total:
                               </td>
                               <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                               { parseInt(hour)}
                               </td>
                               <td class="py-2 px-3 text-xs text-gray-500 whitespace-nowrap ">
                               
                               </td>
                               <td class="py-2 px-3 text-xs text-gray-500 flex flex-wrap">
                              
                               </td>
                             </tr></tfoot> */}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PDFExport>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AnalyticsCard12Item;
