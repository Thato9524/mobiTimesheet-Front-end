import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import DeleteButton from "../../partials/actions/DeleteButton";
import DateSelect from "../../components/DateSelect";
import FilterButton from "../../components/DropdownFilter";
import TimesheetsTableAdmin from "./timesheetsPartials/TimesheetsTableAdmin";
import PaginationClassic from "../../components/PaginationClassic";
import request from "../../handlers/request";
import config from "../../config";
import ModalBasic from "../../components/ModalBasic";
import Banner2 from "../../components/Banner2";
import ModalBlank from "../../components/ModalBlank";
import PreLoader from "../../components/PreLoader";
import Invoice from "../../partials/invoices/Invoice";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";

function OrdersAdmin(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState({ loading: false });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [timesheetData, setTimesheetData] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentTimesheet, setCurrentTimesheet] = useState({});
  const [projectData, setProjectData] = useState({});
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();
  const { key } = useParams();
  const { id } = useParams();
  const { clientID } = useParams();
  function compareFirstNames(a, b) {
    if (a.user.personalInfo.lastName < b.user.personalInfo.lastName) {
      return -1;
    }
    if (a.user.personalInfo.lastName > b.user.personalInfo.lastName) {
      return 1;
    }
    return 0;
  }

  //const handleSelectedItems = (selectedItems) => {
  //setSelectedItems([...selectedItems]);
  //};

  /* ************************************************************************************************************
   *
   *                                         INPUT SETUP
   *
   *************************************************************************************************************/

  //STORE INPUTS FROM FORMS INPUTS
  const handleChange = (e) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setSuccessModalOpen(false);
    setInputs({});
  };

  //FUNCTION TO REFRESH COMPONENTS
  const refresh = async () => {
    setLoading(true);
    checkToken();
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${key}/${id}`
    );
    let cleanTimesheet = [];
    getTimesheets.timesheets.forEach((timesheet) => {
      timesheet.changed && cleanTimesheet.push(timesheet);
    });

    await cleanTimesheet.sort(compareFirstNames);
    setTimesheetData(cleanTimesheet);
    setLoading(false);
  };

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

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  /* ************************************************************************************************************
   *
   *                                         USE EFFECT: GETTING
   *
   *************************************************************************************************************/
  useEffect(async () => {
    setLoading(true);

    let projectData = await request.get(
      `${config.path.projects.getProjectDetails}/${key}/${id}`
    );
    // console.log("projectData:", projectData);
    setProjectData(projectData);
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${key}/${id}`
    );
    let cleanTimesheet = [];
    getTimesheets.timesheets.forEach((timesheet) => {
      timesheet.changed && cleanTimesheet.push(timesheet);
    });
    await cleanTimesheet.sort(compareFirstNames);
    setTimesheetData(cleanTimesheet);

    //GET CLIENT NAME, PROJECT NAME, MONTH NAME
    let project = await request.get(
      `${config.path.projects.getProject}/${key}`
    );
    let client = await request.get(
      `${config.path.clients.getClient}/${clientID}`
    );

    let getMonth = await request.get(
      `${config.path.timesheet.getMonth}/${id}`,
      true
    );
    setInfo({
      project: project.projectName,
      client: client.clientName,
      month: getMonth.desc,
    });

    setLoading(false);
  }, [data.loading]);

  /* ************************************************************************************************************
   *
   *                                                 ADD RATES TO TIMESHEET
   *
   *************************************************************************************************************/
  const editTimesheet = async (e, id) => {
    e.stopPropagation();

    //open modal
    setFeedbackModalOpen(true);

    //get timesheet details
    let getTimesheet = await request.get(
      `${config.path.timesheet.getTimesheet}/${id}`
    );

    setCurrentTimesheet(getTimesheet);

    document.getElementById("rates").value = getTimesheet.rates;
  };

  /////////////////////////////////// ADD RATES TO TIMESHEET  ///////////////////////////////////

  const addRates = async (e) => {
    //EDIT TIMESHEET
    let req = await request.patch(
      `${config.path.timesheet.addRates}/${key}/${id}/${currentTimesheet._id}`, //:project/:month/:timesheet
      inputs
    );

    // console.log("req: ", req);

    refresh(); // REFRESH COMPONENT

    setTimeout(() => {
      resetState();
    }, 1000);
  };

  /* ************************************************************************************************************
   *
   *                                                RENDERING
   *
   *************************************************************************************************************/

  return (
    <main>
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Timesheets: {info.month}
              </h1>
              <h2 className="text-xl md:text-xl text-slate-800">
                {info.client}
              </h2>
              {info.project}
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/*  Delete button 
            <DeleteButton
              selectedItems={selectedItems}
              setDangerModalOpen=""
            />*/}
              {/* Dropdown 
            <DateSelect />
            {/* Filter button 
            <FilterButton align="right" />

            {/* Create CSV button 
            <button
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
             {/* <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg> 
              <span className="hidden xs:block ml-2">Generate CSV</span>
            </button>*/}
            </div>
          </div>

          {/*
           ********************************************** TABLE COMPONENT **********************************************
           */}

          {/* Table */}
          <TimesheetsTableAdmin
            setSelectedItems={setSelectedItems}
            timesheetData={timesheetData}
            editTimesheet={editTimesheet}
          />
          <Invoice data={timesheetData} projectData={projectData} info={info} />

          {/* Pagination 
        <div className="mt-8">
          <PaginationClassic />
        </div>*/}
        </div>
      )}
      {/*
       ********************************************** ADD RATES TIMESHEET MODAL **********************************************
       */}
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title="Timesheet Rate"
        resetState={resetState}
      >
        <div className="px-5 py-4">
          <div className="text-lg">
            <div className="font-large text-slate-800 mb-3">
              Please Fill in the Rate:
            </div>
          </div>
          <div className="space-y-3">
            <div>
              {/*<label className="block text-sm font-medium mb-1" htmlFor="rates">
                Rates
      </label>*/}
              <input
                id="rates"
                className="form-input w-full px-2 py-1"
                type="text"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-5 py-4 border-t border-slate-200">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(false);
                  resetState();
                }}
              >
                Cancel
              </button>
              <button
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSuccessModalOpen(true);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ModalBasic>

      {/*
       *
       *
       ********************************************** Success Modal **********************************************
       *
       *
       */}
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
              <div className="text-lg font-semibold text-slate-800">
                Are you sure you want update this timesheet?
              </div>
            </div>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setSuccessModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                onClick={addRates}
              >
                Yes, Update it
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </main>
  );
}

export default OrdersAdmin;
