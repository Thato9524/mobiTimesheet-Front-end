import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import dayjs from "dayjs";
import request from "../../../handlers/request";
import config from "../../../config";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../../App";
import PreLoader from "../../../components/PreLoader";
import { set } from "date-fns/esm";
import DashboardCard01 from "../../../partials/dashboard/DashboardCard01";

const KendokaLogo = "https://i.ibb.co/Y3MH7k9/C3-Dark.png";

function AnalyticsCard12Item(props) {
  const [timesheetData, setTimesheetData] = useState([]);
  const pdfExportComponent = useRef(null);
  const [projectData, setProjectData] = useState([]);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [downloadedPDF, setDownloadedPDF] = useState(false);
  const [approvedPDF, setApprovedPDF] = useState(false);
  const { dispatch } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });

  let approve = true;

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    // console.log("checkToken()");
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      // console.log("expired");
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      // console.log("login out...");
      navigateTo("/signin");
    }
  };

  //SORTING NAMES
  function compareFirstNames(a, b) {
    if (a.user.personalInfo.lastName < b.user.personalInfo.lastName) {
      return -1;
    }
    if (a.user.personalInfo.lastName > b.user.personalInfo.lastName) {
      return 1;
    }
    return 0;
  }
  //FUNCTION FETCH PROJECT PDF INFO
  const getDataForTable = async (projectData, monthData) => {
    // console.log("getDataForTable");

    let projectDetails = await request.get(
      `${config.path.projects.getProjectDetails}/${projectData._id}/${monthData}`
    );
    setProjectData(projectDetails);

    setLoading(true);
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${projectDetails.project._id}/${projectDetails.monthID._id}`
    );
    // console.log(getTimesheets);
    let cleanTimesheet = [];
    getTimesheets.timesheets.forEach((timesheet) => {
      timesheet.changed && cleanTimesheet.push(timesheet);
    });
    //console.log("Unsorted", cleanTimesheet);
    cleanTimesheet.sort(compareFirstNames);
    setTimesheetData(cleanTimesheet);
    //console.log("Sorted", cleanTimesheet);

    setLoading(false);
  };

  const handleExportWithComponent = async () => {
    pdfExportComponent.current.save();

    //MARK AS DOWNLOADED
    let downloaded = await request.patch(
      `${config.path.projects.setPdfStatus}/${props.selectedMonth}/${props.project._id}`
    );
    //console.log("downloaded: ", downloaded);

    let approved = await request.patch(
      `${config.path.projects.setPdfApproval}/${props.selectedMonth}/${props.project._id}`
    );

    //console.log("approved: ", approved);

    props.refreshClient(props.selectedMonth);
  };

  //GET PDF DATA
  useEffect(() => {
    // console.log("descriptionOpen");
    getDataForTable(props.project, props.selectedMonth);
  }, [descriptionOpen]);

  //GET THE PDF DOWNLOADED STATUS AND CLOSE ALL OPEN TABS
  useEffect(async () => {
    //console.log("useEffect: props.selectedMonth");
    let getDownloadedPDF = await request.get(
      `${config.path.projects.getPdfStatus}/${props.selectedMonth}/${props.project._id}`
    );
    console.log(
      "getDownloadedPDF-------------------------------------- ",
      getDownloadedPDF.downloaded
    );

    setDownloadedPDF(getDownloadedPDF.downloaded);
    setApprovedPDF(
      getDownloadedPDF.approved ? getDownloadedPDF.approved : false
    );
    setDescriptionOpen(false);
  }, [props.selectedMonth]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

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

  return (
    <tbody className="text-sm divide-y divide-slate-100">
      <tr>
        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {props.client.client.clientName}
              {/* CLIENT NAME */}
            </div>
          </div>
        </td>

        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* PROJECT NAME */}

              <div>{props.project.projectName}</div>
            </div>
          </div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* DATE ADDED*/}

              <div>{dayjs(props.project.dateAdded).format("YYYY-MM-DD")}</div>
            </div>
          </div>
        </td>

        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {/* COMPLETION DATE */}
              <div>
                {dayjs(props.project.completionDate).format("YYYY-MM-DD")}
              </div>
            </div>
          </div>
        </td>
        <td>
          {approvedPDF ? (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
                "true"
              )}`}
            >
              Yes
            </div>
          ) : (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
                "false"
              )}`}
            >
              No
            </div>
          )}
        </td>
        <td>
          {downloadedPDF ? (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
                "true"
              )}`}
            >
              Yes
            </div>
          ) : (
            <div
              className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
                "false"
              )}`}
            >
              No
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
              onClick={(e) => {
                setDescriptionOpen(!descriptionOpen);
                getDataForTable(props.project, props.selectedMonth);
              }} //CALL
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
                    fileName={`Convergenc3_Timesheet_${
                      projectData.project.projectName
                    }/${
                      projectData.project.consultants.length === 1
                        ? projectData.project.consultants[0].consultant
                            .personalInfo.firstName +
                          projectData.project.consultants[0].consultant
                            .personalInfo.lastName +
                          "_"
                        : ""
                    }${projectData.monthID.desc}`}
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
                            <h3 class="font-bold text-lg">
                              {projectData.monthID.name}
                            </h3>
                          </div>
                        </div>
                        <div class="flex justify-between pt-5">
                          <div>
                            <h3 class="font-bold text-lg">
                              {projectData.project.client}
                            </h3>
                            <p class="text-xs">
                              {projectData.project.projectName}
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
                                    {projectData.project.consultants.map(
                                      (item, i) =>
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
                                        class="py-2 pl-3  flex-initial w-[10%] text-xs text-center font-medium tracking-wider text-white uppercase "
                                      >
                                        Date
                                      </th>

                                      <th
                                        scope="col"
                                        class="py-2 pl-2 flex-initial w-[20%] text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Consultant
                                      </th>
                                      <th
                                        scope="col"
                                        class="py-2 px-3 flex-initial w-[10%] text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Hours
                                      </th>
                                      <th
                                        scope="col"
                                        class="py-2 pr-3 pl-2 flex-initial w-[55%] text-xs font-medium tracking-wider text-left text-white uppercase "
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {timesheetData.map((item, i) => (
                                      <tr class="bg-white border-b ">
                                        <td class="py-2 pl-3 pr-3 flex-initial w-[10%] text-xs text-center font-medium text-gray-900 whitespace-nowrap ">
                                          {item.day}/{item.month}
                                          <br />
                                          {item.dayName}
                                        </td>
                                        <td class="py-2 pl-2 flex-initial w-[20%] text-xs text-gray-500 whitespace-nowrap ">
                                          {item.user.personalInfo.firstName}{" "}
                                          {item.user.personalInfo.lastName}
                                        </td>
                                        <td class="py-2 pr-3 flex-initial w-[10%] text-xs text-center text-gray-500 whitespace-nowrap ">
                                          {item.hours}
                                        </td>
                                        <td class="py-2 px-2 flex-initial w-[80%] text-xs text-gray-500 flex flex-wrap">
                                          {item.desc}
                                        </td>
                                      </tr>
                                    ))}
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
