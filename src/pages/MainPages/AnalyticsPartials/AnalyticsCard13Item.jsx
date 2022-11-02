import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import request from "../../../handlers/request";
import config from "../../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../../App";
import PreLoader from "../../../components/PreLoader";

const KendokaLogo = "https://i.ibb.co/Y3MH7k9/C3-Dark.png";

function AnalyticsCard13Item(props) {
  const pdfExportComponent = useRef(null);
  const [managersData, setManagersData] = useState([]);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const { dispatch } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);

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

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  console.log(props);

  return (
    <tbody className="text-sm divide-y divide-slate-100">
      <tr>
        <td className="p-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="font-medium text-slate-800">
              {

              props.manager.firstName +
                " " +
                props.manager.lastName}
              {/* MANAGER NAME */}
            </div>
          </div>
        </td>

        <td className="p-2 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-zinc-400 hover:text-zinc-500 transform ${
                descriptionOpen && "rotate-180"
              }`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={props._id}
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
        id={props._id}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className=" items-center bg-indigo-100 p-3 -mt-3">
            {/* EXPANDABLE INNER TABLE flex*/}
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Employee</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Projects</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 bg-slate-50">
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-slate-800">
                        {/* Consultant */}
                        {props.manager.consultants.map((consultant) => {
                          return (
                            <div>
                              {consultant.personalInfo.firstName +
                                " " +
                                consultant.personalInfo.lastName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-slate-800">
                        {/* Project */}
                        {
                        props.manager.consultants.map((consultant) => {
                          console.log(props.consultants)

                          return (
                            <div>
                               {consultant.projects.map((project) => {
                                return project.projectName + "," + " ";
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                </tbody>
              </table>
            </div>{" "}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AnalyticsCard13Item;
