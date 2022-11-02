import React, { useState, useEffect, button } from "react";

import Datepicker from "../components/Datepicker";
import FintechCard07 from "../partials/fintech/FintechCard07";
import FintechCard09 from "../partials/fintech/FintechCard09";
import FintechCard10 from "../partials/fintech/FintechCard10";
import config from "../config";
import request from "../handlers/request";
import PreLoader from "../components/PreLoader";
import DashboardCard04 from "../partials/dashboard/DashboardCard04";
import ClientSideModal from "./MainPages/Dashboard/ClientSideModal";
import { isJwtExpired } from "jwt-check-expiration";
import dayjs from "dayjs";

import BenchCard from "../partials/fintech/BenchCard";
import UserAvatar from "../images/avatar-001.png";
import BenchWarmerModal from "./MainPages/Dashboard/BenchWarmerModal";
import OrganogramComponent from "../components/OrganogramComponent";
import ReaModal from "../components/ReaModal";
import ModalBlank from "../components/ModalBlank";

function Fintech() {
  const [employeesData, setEmployeesData] = useState([]);
  const [employeesHistoricalData, setEmployeesHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [clientHours, setClientHours] = useState([]);
  const [benchWarmers, setBenchWarmers] = useState([]);
  const [projectInputs, setProjectInputs] = useState({}); //INPUTS FOR NEW INFO
  const [organogram, setOrganogram] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBenchModal, setShowBenchModal] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [allClientHours, setAllClientHours] = useState(false);

  const [id, setId] = useState("");
  const [date, setDate] = useState([]);
  const [repData, setRepData] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  //////TABS WHEN ADDING TAB PLEASE ADD TO CLEAR ALL AND SET TO FALSE///////////////////
  const [current, setCurrent] = useState(true);
  const [historical, setHistorical] = useState(false);
  const [structure, setStructure] = useState(false);
  const [manager, setManager] = useState({});
  const [employee, setEmployee] = useState({});

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                          //
  //                                                      Use Effects                                                                         //
  //                                                                                                                                          //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(async () => {
    setHistorical(false);
    setLoading(true);

    let organograms = await request.get(`${config.path.organogram.get}`);
   
    setOrganogram(organograms);
    let getBenchWarmers = await request.get(config.path.users.getBenchWarmers);
    if (!getBenchWarmers.err) {
      setBenchWarmers(getBenchWarmers);
    }
    let getEmployees = await request.get(config.path.users.getAll);

    let employeeArr = [];

    getEmployees.forEach((employee) => {
      let employeeObj = {
        label:
          employee.personalInfo.firstName +
          " " +
          employee.personalInfo.lastName,
        value: employee._id,
      };
      employeeArr.push(employeeObj);
    });

    setRepData(getEmployees);
    let employees = await request.get(
      `${config.path.users.getAllEmployees}/current`
    );

    if (!employees.err) {
      await setEmployeesData(employees);
    }

    let clientHrs = await request.get(
      `${config.path.clients.getClientHours}/current`
    );

    if (clientHrs.length >= 4) {
      setClientHours(clientHrs.slice(0, 4));
    } else {
      setClientHours(clientHrs);
    }

    setLoading(false);
  }, [, message]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                          //
  //                                                          Functions                                                                       //
  //                                                                                                                                          //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  ///////USED TO RESET TAB STATE TO EMPTY TO SHORTEN CHECKS FOR ACTIVE TAB
  const clearAllTabs = async () => {
    setStructure(false);
    setHistorical(false);
    setCurrent(false);
  };

  const fetchTopClientHours = async () => {
    setLoading(true);
    setAllClientHours(false);
    let clientHrs = await request.get(
      `${config.path.clients.getClientHoursFor}/current`
    );
    if (clientHrs.length >= 4) {
      setClientHours(clientHrs.slice(0, 4));
    } else {
      setClientHours(clientHrs);
    }
    setLoading(false);
  };

  const fetchAllClientHours = async () => {
    setLoading(true);
    setAllClientHours(true);
    let clientHrs = await request.get(
      `${config.path.clients.getClientHoursFor}/current`
    );
    setClientHours(clientHrs);
    setLoading(false);
  };

  /////////LOADS THE DATA OF THE CURRENT MONTH FROM THE FIRST TO TODAY
  const loadCurrent = async () => {
    setLoading(true);

    let employees = await request.get(
      `${config.path.users.getAllEmployees}/current`
    );
    if (!employees.err) {
      setEmployeesData(employees);
    }

    let clientHrs = await request.get(
      `${config.path.clients.getClientHours}/current`
    );

    if (clientHrs.length >= 4) {
      setClientHours(clientHrs.slice(0, 4));
    } else {
      setClientHours(clientHrs);
    }

    clearAllTabs();
    setCurrent(true);
    setLoading(false);
  };

  /////////LOADS THE C3 STRUCTURE TAB WITH THE ORGAONGRAM///////////
  const loadStructure = async () => {
    setLoading(true);
    clearAllTabs();
    setStructure(true);
    setLoading(false);
  };

  ////////LOADS THE HISTORICAL DATA FROM THE SELECTED MONTH
  const loadHistorical = async () => {
    setLoading(true);
    let employees = await request.get(
      `${config.path.users.getAllEmployeesFor}/${dayjs(
        date.length === 0
          ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          : date[0]
      ).format("YYYY-MM-DD")} ${dayjs(
        date.length === 0 ? new Date() : date[1]
      ).format("YYYY-MM-DD")}`
    );
    if (!employees.err) {
      setEmployeesHistoricalData(employees);
    }

    let clientHrs = await request.get(
      `${config.path.clients.getClientHoursFor}/${dayjs(
        date.length === 0
          ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          : date[0]
      ).format("YYYY-MM-DD")} ${dayjs(
        date.length === 0 ? new Date() : date[1]
      ).format("YYYY-MM-DD")}`
    );

    if (clientHrs.length >= 4) {
      setClientHours(clientHrs.slice(0, 4));
    } else {
      setClientHours(clientHrs);
    }
    clearAllTabs();
    setHistorical(true);
    setLoading(false);
  };

  const fetchClientDetails = (id) => {
    setId(id);
    setShowModal(true);
  };

  async function submitForm() {
    const req = {
      user: employee._id,
      number: organogram.length + 1,
      parent: manager.number,
    };

    try {
      const response = await request.post(
        config.path.organogram.addOrganogram,
        req,
        true
      );
      console.log("response", response);
      if (response.err) {
        setMessage(response.message);
        setErrorModalOpen(true);
      } else {
        setMessage(response.message);
        setSuccessModalOpen(true);
      }
    } catch (ex) {
      setMessage(ex.message);
      setErrorModalOpen(true);
    }
  }

  async function EditUser() {
    const req = {
      user: employee._id,
      parent: manager.number,
    };

    try {
      const response = await request.patch(
        config.path.organogram.editOrganogram,
        req,
        true
      );
      console.log("response", response);
      if (response.err) {
        setMessage(response.message);
        setErrorModalOpen(true);
      } else {
        setMessage(response.message);
        setSuccessModalOpen(true);
      }
    } catch (ex) {
      setMessage(ex.message);
      setErrorModalOpen(true);
    }
  }

  //STORE INPUTS FROM FORMS INPUTS
  function handleChangeEmployees(data) {
    const selectedIndex = data.target.selectedOptions[0].index - 1;
    setEmployee(repData[selectedIndex]);
  }
  function handleChangeManager(data) {
    const selectedIndex = data.target.selectedOptions[0].index - 1;
    setManager(organogram[selectedIndex]);
  }
  const handleChange = async (e) => {
    setLoading(true);
    let employees = await request.get(
      `${config.path.users.getAllEmployeesFor}/${dayjs(e[0]).format(
        "YYYY-MM-DD"
      )} ${dayjs(e[1]).format("YYYY-MM-DD")}`
    );
    if (!employees.err) {
      setEmployeesHistoricalData(employees);
    }

    let clientHrs = await request.get(
      `${config.path.clients.getClientHoursFor}/${dayjs(e[0]).format(
        "YYYY-MM-DD"
      )} ${dayjs(e[1]).format("YYYY-MM-DD")}`
    );

    if (clientHrs.length >= 4) {
      setClientHours(clientHrs.slice(0, 4));
    } else {
      setClientHours(clientHrs);
    }

    setLoading(false);
  };
  function closeModal() {
    setErrorModalOpen(false);
  }
  const getBenchUserDetails = (id) => {
    setUserId(id);
    setShowBenchModal(true);
    //console.log("Show Modal for:", id);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {showModal && (
            <ClientSideModal id={id} changeState={() => setShowModal(false)} />
          )}
          {showBenchModal && (
            <BenchWarmerModal
              id={userId}
              changeState={() => setShowBenchModal(false)}
            />
          )}
          {loading ? (
            <div>
              <PreLoader />
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                    Overview
                  </h1>
                </div>

                <div className="grid grid-flow-col w-1/2 sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {historical && (
                    <div className=" flex">
                      <Datepicker
                        selected={startDate}
                        handleChange={async (e) => {
                          if (e.length > 1 && e[1] !== undefined) {
                            handleChange(e);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4 border-b border-slate-200">
                <ul className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                  <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                    <div
                      onClick={loadCurrent}
                      className={`${
                        current === true ? "text-indigo-500" : "text-slate-500"
                      } whitespace-nowrap cursor-pointer`}
                    >
                      Current Month
                    </div>
                  </li>
                  <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                    <div
                      onClick={loadHistorical}
                      className={`${
                        historical === true
                          ? "text-indigo-500"
                          : "text-slate-500"
                      } whitespace-nowrap cursor-pointer`}
                    >
                      Historical
                    </div>
                  </li>
                  <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                    <div
                      onClick={loadStructure}
                      className={`${
                        structure === true
                          ? "text-indigo-500"
                          : "text-slate-500"
                      } whitespace-nowrap cursor-pointer`}
                    >
                      C3 Structure
                    </div>
                  </li>
                </ul>
              </div>

              {/* Cards */}
              {structure && (
                <div>
                  <table className="table-auto border-spacing-y-2">
                    <tr>
                      <td>
                        <div className="flex float-left">
                          <select
                            id="businessRep"
                            name="businessRep"
                            className="form-select mt-2 mb-2"
                            onChange={handleChangeEmployees}
                          >
                            <option disabled selected value>
                              Select a Employee
                            </option>

                            {repData.map((employee, i) => (
                              <option key={i} value={employee}>
                                {" "}
                                {employee.personalInfo.firstName}{" "}
                                {employee.personalInfo.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>{" "}
                      <td>
                        <div className="w-5"></div>
                      </td>
                      <td>
                        <div className="align-center">Reports to</div>
                      </td>{" "}
                      <td>
                        <div className="w-5"></div>
                      </td>
                      <td>
                        <div className="flex float-left">
                          <select
                            id="businessRep"
                            name="businessRep"
                            className="form-select mt-2 mb-2"
                            onChange={handleChangeManager}
                          >
                            <option disabled selected value>
                              Select a Manager
                            </option>
                            {organogram.map((employee, i) => (
                              <option
                                key={i}
                                value={employee.obj}
                                data-index={i}
                              >
                                {employee.firstName} {employee.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>{" "}
                      <td>
                        <div className="w-5"></div>
                      </td>
                      <td>
                        <button
                          className={
                            Object.keys(manager).length !== 0
                              ? "btn-sm bg-rose-500 text-white w-50 self-center my-5 flex float-left"
                              : "btn-sm bg-gray-400 text-black w-50 self-center my-5 flex float-left"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            submitForm();
                          }}
                        >
                          {Object.keys(manager).length !== 0
                            ? "Add user to report to " + manager.firstName
                            : "Please select to add"}
                        </button>
                      </td>
                      <td>
                        <div className="w-5"></div>
                      </td>
                      <td>
                        <button
                          className={
                            Object.keys(manager).length !== 0
                              ? "btn-sm bg-rose-500 text-white w-50 self-center my-5 flex float-left"
                              : "btn-sm bg-gray-400 text-black w-50 self-center my-5 flex float-left"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            EditUser();
                          }}
                        >
                          {" "}
                          {Object.keys(manager).length !== 0
                            ? "Reassign user to " + manager.firstName
                            : "Please select to add"}
                        </button>
                      </td>
                    </tr>
                  </table>
                </div>
              )}
              {structure && (
                
                <div className="flex justify">
                  <>
                    <OrganogramComponent
                      
                      setUserId={setUserId}
                      setShowBenchModal={setShowBenchModal}
                      organogramData={organogram}
                      options={{
                        width: 600,
                        height: 300,
                        zoom: 0.2,
                      }}
                    />
                  </>
                </div>
              )}
              <div className="grid grid-cols-12 gap-6">
                {current && (
                  <>
                    <DashboardCard04 data={employeesData && employeesData[1]} />
                    <FintechCard09 data={employeesData && employeesData[2]} />
                  </>
                )}
                {historical && <FintechCard07 data={employeesHistoricalData} />}
                {!structure && (
                  <div className="mb-4 sm:mb-0 col-span-full flex items-center">
                    <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mr-3">
                      Top Clients
                    </h1>
                    <span
                      className="text-blue-600 text-sm cursor-pointer"
                      onClick={
                        !allClientHours
                          ? fetchAllClientHours
                          : fetchTopClientHours
                      }
                    >
                      {!allClientHours ? "view all" : "collapse"}
                    </span>
                  </div>
                )}
                {!structure &&
                  clientHours &&
                  !loading &&
                  clientHours.map((client, index) => (
                    <FintechCard10
                      client={client}
                      key={index}
                      onClick={() => fetchClientDetails(client._id)}
                    />
                  ))}
                {!structure && (
                  <div className="mb-4 sm:mb-0 col-span-full flex items-center">
                    <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mr-3">
                      Bench Warmers
                    </h1>
                  </div>
                )}
                {!structure &&
                  clientHours &&
                  !loading &&
                  benchWarmers.map((user, index) => (
                    <BenchCard
                      key={index}
                      user={user}
                      imageURL={
                        user.profilePictureKey !== "none" &&
                        user.profilePictureKey !== ""
                          ? `${config.url}${config.path.s3.getFile}/${user.profilePictureKey}`
                          : UserAvatar
                      }
                      onClick={() => getBenchUserDetails(user._id)}
                    />
                  ))}
              </div>
              
            </div>
          )}
        </main>
        <ModalBlank
          id="success-modal"
          modalOpen={successModalOpen}
          setModalOpen={setSuccessModalOpen}
        >
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
                  Organogram updated
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
                  Ok
                </button>
                
              </div>
            </div>
          </div>
        </ModalBlank>
        <ReaModal
          id="error-modal"
          modalOpen={errorModalOpen}
          setModalOpen={setErrorModalOpen}
        >
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
                  {message}
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={closeModal}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
      </div>
    </div>
  );
}

export default Fintech;
