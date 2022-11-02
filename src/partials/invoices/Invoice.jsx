import * as React from "react";
import { useRef, useState, useEffect } from "react";
import "@progress/kendo-theme-material/dist/all.css";

import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";

import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

import sampleData from "./invoice-data.json";
import "./style.css";
const KendokaLogo = "https://i.ibb.co/Y3MH7k9/C3-Dark.png";

function Invoice(props) {
  const ddData = [
    { text: "A4", value: "size-a4" },
    { text: "Letter", value: "size-letter" },
    { text: "Executive", value: "size-executive" },
  ];

  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });

  const updatePageLayout = (event) => {
    setLayoutSelection(event.target.value);
  };

  const pdfExportComponent = useRef(null);

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };
  var hour = 0;
  return (
    <div id="example" class="p-5">
      <div class="flex justify-around py-5">
        <div class="flex-none">
          <h4>Select a Page Size</h4>
          <DropDownList
            data={ddData}
            textField="text"
            dataItemKey="value"
            value={layoutSelection}
            onChange={updatePageLayout}
          />
        </div>
        <div class="flex-none">
          <h4>Export PDF</h4>
          <Button primary={true} onClick={handleExportWithComponent}>
            Export
          </Button>
        </div>
      </div>
      <div className="page-container hidden-on-narrow">
        <PDFExport
          ref={pdfExportComponent}
          fileName={`Convergenc3_Timesheet_${props.info.project}/${
            props.projectData.project.consultants.length === 1
              ? props.projectData.project.consultants[0].consultant.personalInfo
                  .firstName +
                props.projectData.project.consultants[0].consultant.personalInfo
                  .lastName +
                "_"
              : ""
          }${props.info.month}`}
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
                  <h3 class="font-bold text-lg">{props.info.month}</h3>
                </div>
              </div>
              <div class="flex justify-between pt-5">
                <div>
                  <h3 class="font-bold text-lg">{props.info.client}</h3>
                  <p class="text-xs">
                    {props.info.project}
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
                          {/* {console.log("projectData", props.projectData)} */}
                          {props.projectData.project.consultants.map(
                            (item, i) =>
                              item.hours == 0 ? (
                                <tr></tr>
                              ) : (
                                <tr class="bg-white border-b ">
                                  <td class="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap ">
                                    {item.consultant.personalInfo.firstName}{" "}
                                    {item.consultant.personalInfo.lastName}
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
                          {/* {console.log("props.data: ", props.data)} */}
                          {props.data.map((item, i) =>
                            item.hours == 0 ? (
                              <tr></tr>
                            ) : (
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
                                <td class="py-2 pr-3 pl-2  flex-initial w-[80%] text-xs text-gray-500 flex flex-wrap">
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
  );
}

export default Invoice;
