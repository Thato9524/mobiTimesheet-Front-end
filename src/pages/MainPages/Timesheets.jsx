import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import TimesheetsTable from "./timesheetsPartials/TimesheetsTable";
import TimesheetProjectTabs from "./timesheetsPartials/TimesheetProjectTabs";
import PaginationClassic from "../../components/PaginationClassic";
import request from "../../handlers/request";
import config from "../../config";
import ModalBasic from "../../components/ModalBasic";
import Banner2 from "../../components/Banner2";
import PreLoader from "../../components/PreLoader";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { format } from "date-fns";
import ModalBlank from "../../components/ModalBlank";
import "./timesheetsPartials/timesheetsTable.css"

function Timesheets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [completedsheetData, setCompletedsheetData] = useState([]);
  const [inputs, setInputs] = useState({});
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [currentTimesheet, setCurrentTimesheet] = useState({});
  const [month, setMonth] = useState("");
  const [declined, setDeclined] = useState("");
  const [timesheetHours, setTimesheetHours] = useState({});
  const navigateTo = useNavigate();
  const { dispatch } = React.useContext(AuthContext);
  const [clientName, setClientName] = useState("");
  const [noProjects, setNoProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [projectLoader, setProjectLoader] = useState(true);
  const [timesheetsLoader, setTimesheetsLoader] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const { key } = useParams();

  let userid = localStorage.getItem("_id");
  let date;

  /* ************************************************************************************************************
   *
   *                                         USE EFFECT: GETTING
   *
   *************************************************************************************************************/

  //USE EFFECT TO GET ALL PROJECTS FOR USER
  useEffect(async () => {
    setProjectLoader(true);

    //GET PROJECTS FOR USER
    let getProjects = await request.get(
      `${config.path.projects.getProjectsFor}/${userid}`
    );

    //SET USESTATES TO DISPLAY TIMESHEETS FOR FIRST PROJECT SHOWN
    if (getProjects.projects.length > 0) {
      setNoProjects(false);
      await setAllProjectsData(getProjects.projects);
      await setSelectedProject(getProjects.projects[0]._id);
      setSelectedProjectName(getProjects.projects[0].projectName);

      //GET FIRST PROJECT THAT WILL BE DISPLAYED AND SET THE CLIENT AND PROJECT NAME AND TIMESHEETS
      ////PROBLEM AREA
      console.log("selectedMonth", selectedMonth);
      console.log(
        "selectedProject",
        `${config.path.timesheet.getTimesheetForUser}/${userid}/${
          selectedMonth ? selectedMonth : key
        }/${getProjects.projects[0]._id}`
      );
      let getTimesheets = await request.get(
        `${config.path.timesheet.getTimesheetForUser}/${userid}/${
          selectedMonth ? selectedMonth : key
        }/${getProjects.projects[0]._id}`
      );

      //GET CLIENT NAME, PROJECT NAME, MONTH NAME
      let getMonth = await request.get(
        `${config.path.timesheet.getMonth}/${key}`
      );

      let getCompletedsheet = await request.get(
        `${config.path.completedsheet.getCompletedsheetForMonth}/${
          selectedProject ? selectedProject : getProjects.projects[0]._id
        }/${key}`
      );

      setCompletedsheetData(getCompletedsheet);
      setMonth(getMonth);

      setTimesheetHours({
        hours: parseFloat(getTimesheets.hours),
        recommended: getTimesheets.recommendedHours,
      });
      console.log(getTimesheets)
      setBreakdown(getTimesheets.breakdown[0]);
      setDeclined(getTimesheets.declined);
      setTimesheetData(getTimesheets.timesheets);
      setClientName(getProjects.projects[0].client.clientName);
    } else {
      setNoProjects(true);
    }

    setProjectLoader(false);
  }, [selectedMonth]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  useEffect(async () => {
    let getMonths = await request.get(`${config.path.timesheet.month}`, true);
    getMonths = getMonths.data;
    setSelectedMonth(key);
    setMonths(getMonths);
  }, [key]);

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

  ////Changes the month in the dropdown and refreshes
  async function handleMonth(e) {
    setSelectedMonth(e.target.value);
    navigateTo(`/timesheet/${e.target.value}`);
  }

  //CLEAR ALL TEXT FIELDS
  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    Array.from(document.querySelectorAll("textarea")).forEach(
      (textarea) => (textarea.value = "")
    );

    Array.from(document.querySelectorAll("select")).forEach(
      (select) => (select.selectedIndex = 0) //reset input
    );
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setSuccess(false);
    setError(false);
    setInputs({});
    clearInputs();
  };

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      // console.log("login out...");
      navigateTo("/signin");
    }
  };

  //EVERY TIME A PROJECT IS SELECTED GET TIMESHEETS AND UPDATE "SELECTED CLIENT" HEADING & HOURS
  const getTimesheetData = async (thisSelectedProject) => {
    setTimesheetsLoader(true);

    console.log("TREST", selectedMonth);
    allProjectsData.forEach((project) => {
      if (project._id == thisSelectedProject) {
        setClientName(project.client.clientName);
      }
    });
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForUser}/${userid}/${
        selectedMonth ? selectedMonth : key
      }/${thisSelectedProject}`
    );
    let getCompletedsheet = await request.get(
      `${config.path.completedsheet.getCompletedsheetForMonth}/${thisSelectedProject}/${key}`
    );

    setCompletedsheetData(getCompletedsheet);
    setBreakdown(getTimesheets.breakdown[0]);

    setTimesheetData(getTimesheets.timesheets);
    setTimesheetHours({
      hours: getTimesheets.hours,
      recommended: getTimesheets.recommendedHours,
    });
    setDeclined(getTimesheets.declined);
    setTimesheetsLoader(false);
  };

  //WHEN A TIMESHEET IS EDITED, REPLACE THE OLD ONE WITH THE NEW ONE AND UPDATE NUMBER OF HOURS WORKED
  const updateTimesheetsList = async (timesheet) => {
    let getTimesheet = await request.get(
      `${config.path.timesheet.getTimesheet}/${timesheet._id}`
    );

    setTimesheetHours({
      ...timesheetHours,
      hours: getTimesheet.monthHours,
    });

    for (let i = 0; i < timesheetData.length; i++) {
      const tms = timesheetData[i];
      if (tms._id == timesheet._id) {
        //UPDATE THE DATA BY REPLACING THE OLD TIMESHEET WITH NEW TIMESHEET
        setTimesheetData((timesheetData) => {
          return [
            ...timesheetData.slice(0, i),
            getTimesheet,
            ...timesheetData.slice(i + 1, timesheetData.length),
          ];
        });
      }
    }
  };

  /* ************************************************************************************************************
   *
   *                                          SUBMIT FORM FUNCTION
   *
   *************************************************************************************************************/

  async function submitForm(){
    //EDIT TIMESHEET
    let req = await request.patch(
      `${config.path.timesheet.editTimesheet}/${currentTimesheet._id}`,
      inputs
    );

    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }

    setSuccess(true);
    setSuccessMessage("Successfully Edited Timesheet.");

    updateTimesheetsList(currentTimesheet);

    setTimeout(() => {
      resetState();
    }, 2000);
  };

  const handleError = async (e, id) => {
    console.log("Testing");
    e.stopPropagation();
    setErrorModalOpen(!errorModalOpen);
  };

  /* ************************************************************************************************************
   *
   *                                                 Edit Timesheet
   *
   *************************************************************************************************************/
  const editTimesheet = async (e, id) => {
    console.log("Testing again");
    e.stopPropagation();

    //open modal
    setFeedbackModalOpen(true);

    //get timesheet details
    let getTimesheet = await request.get(
      `${config.path.timesheet.getTimesheet}/${id}`
    );

    setCurrentTimesheet(getTimesheet);
    date = new Date(getTimesheet.dateAdded);
    setEditDate(format(date, "d MMM"));

    allProjectsData.forEach((project) => {
      if (project._id == selectedProject)
        setEditProjectName(project.projectName);
    });

    document.getElementById("hours").value = getTimesheet.hours;
    document.getElementById("desc").value = getTimesheet.desc;
    setInputs({
      desc: getTimesheet.desc,
      hours: getTimesheet.hours,
    });
  };

  function validate(){
    if(inputs.hours <= 0){
      setErrorMessage("Hours are required.")
      setError(true);
    }else if(!inputs.desc){
      setErrorMessage("Description is required.");
      setError(true);
    }else{
      submitForm();
    }
  }


  /* ************************************************************************************************************
   *
   *                                                RENDERING
   *
   *************************************************************************************************************/

  return (
    <main>
      {projectLoader ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <div>
          {!noProjects ? (
            <div className="overflow-hidden px-4 sm:px-6 lg:px-8 py-2 w-full pb-1">
              {/* Page header */}
              <div className=" flex justify-between sm:flex sm:justify-between sm:items-center mb-4">
                {/* Left: Title */}
                <div className="sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                    Timesheets:{" "}
                    <select
                      id="monthPicker"
                      className="form-select text-md" // w-full mt-2 mb-5"
                      value={selectedMonth}
                      onChange={handleMonth}
                    >
                      {months.map((month, i) => (
                        <option key={i} value={month._id} className="text-sm">
                          {month.desc}
                        </option>
                      ))}
                    </select>
                  </h1>
                  <h2 className="text-xl md:text-xl text-slate-800">
                    Selected Client: {clientName}
                  </h2>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-row-max justify-start sm:justify-end gap-2">
                  {/* Filter button */}
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={(e) => {
                      const current = new Date();
                      const day = current.getDate();
                      const month = current.getMonth() + 1;
                      timesheetData.map((item) => {
                        if (
                          item.day == day &&
                          item.month == month &&
                          (item.leaveDay == undefined
                            ? false
                            : item.leaveDay) == false &&
                          item.desc != "PUBLIC HOLIDAY"
                        ) {
                          editTimesheet(e, item._id);
                        }
                      });
                    }}
                  >
                    Record Today
                  </button>
                  <FilterButton
                    align="right"
                    setSelectedOptions={setSelectedOptions}
                    filterOptions={[
                      "pending",
                      "approved",
                      "declined",
                      "done",
                      "check",
                    ]}
                  />
                  {/* Hours summary*/}
                  <div
                    className="border-zinc-900 bg-zinc-200 text-zinc-600 px-2.5 py-0.5"
                    title={
                      breakdown != "undefined"
                        ? breakdown.map(
                            (item) => `\n${item.projectName} : ${item.hours}`
                          )
                        : ""
                    }
                  >
                    Total Worked Hours: {timesheetHours.hours}
                  </div>
                  <div className="border-green-900 bg-green-100 text-green-600 px-2.5 py-0.5">
                    Recommended Hours: {timesheetHours.recommended}
                  </div>
                  {/* Declined summary*/}
                  <div className="border-rose-900 bg-rose-100 text-rose-600 px-2.5 py-0.5">
                    Declined: {declined}
                  </div>
                </div>
              </div>
              <TimesheetProjectTabs
                allProjectsData={allProjectsData}
                setSelectedProject={setSelectedProject}
                setSelectedProjectName={setSelectedProjectName}
                selectedProject={selectedProject}
                getTimesheetData={getTimesheetData}
              />

              {/* Table */}
              <TimesheetsTable
                timesheetData={timesheetData}
                timesheetsLoader={timesheetsLoader}
                editTimesheet={editTimesheet}
                selectedOptions={selectedOptions}
                completedsheet={completedsheetData}
                month={month}
                project={selectedProject}
                editProjectName={selectedProjectName}
                monthName={month.desc}
                handleError={handleError}
              />
              {/* Pagination 
          <div className="mt-8">
          <PaginationClassic />
          </div>*/}
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {/* Page header */}
              <div className="text-center">
                {/* Message Box*/}
                <div className="inline-flex flex-col max-w-lg px-4 py-4 rounded-sm text-m bg-white shadow-lg border border-slate-200 text-slate-600">
                  <div className="flex w-full">
                    <div className="flex ">
                      <svg
                        className="w-4 h-4 shrink-0 fill-current text-yellow-500 mt-[3px] mr-3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                      </svg>{" "}
                      <div className="text-xl text-slate-800 font-bold">
                        No Projects Found!
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 text-justify">
                    You currently have no projects assigned to you. Please
                    contact Monique to assign projects to you.
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
        </div>
      )}
      {/*
       ********************************************** ADD/EDIT TIMESHEET MODAL **********************************************
       */}
      <ModalBlank
        id="error-modal"
        modalOpen={errorModalOpen}
        setModalOpen={setErrorModalOpen}
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
                  After submitting you are no longer allowed to edit your
                  timesheets. For any assistance please contact Jason Scheepers
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setErrorModalOpen(false);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        }
      </ModalBlank>
      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title={`Edit Log ${editDate} for ${editProjectName}`}
        resetState={resetState}
      >
        {" "}
        {/*
         ********************************************** EDIT TIMESHEET MODAL **********************************************
         */}
        <div className="px-5 py-4">
          <div className="text-lg">
            <div className="font-large text-slate-800 mb-3">
              Please Edit The Following Details
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hours">
                Hours
              </label>
              <input
                id="hours"
                className="form-input w-full px-2 py-1"
                type="number"
                min={0}
                max={20}
                step={0.5}
                precision={2}
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="desc"
                className="form-textarea w-full px-2 py-1"
                rows="4"
                placeholder="Tell us about your day"
                //uncomment to add max characters
                maxLength={400}
                required
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Error message */}
            <Banner2 type="error" open={errors} setOpen={setError}>
              {errorMessage}
            </Banner2>
            {/* On successful registration */}
            <Banner2 type="success" open={success} setOpen={setSuccess}>
              {successMessage}
            </Banner2>
          </div>

          {/* Modal footer */}
          <div className="px-5 py-4 border-t border-slate-200">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
              >
                Cancel
              </button>
              <button
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                onClick={validate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </ModalBasic>
    </main>
  );
}

export default Timesheets;

const validateEditInputs = (obj) => {
  let names = {
    hours: "Hours",
    desc: "Description",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
    if (names[i] == "Hours") {
      if (obj[i] > 24) {
        return { valid: false, msg: `${names[i]} must be less than 24` };
      } else {
        return { valid: true };
      }
    }
  }
  return { valid: true };
};
