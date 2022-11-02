import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import TimesheetsTableRep from "./timesheetsPartials/TimesheetsTableRep";
import PaginationClassic from "../../components/PaginationClassic";
import Banner2 from "../../components/Banner2";
import request from "../../handlers/request";
import config from "../../config";
import ModalBasic from "../../components/ModalBasic";
import PreLoader from "../../components/PreLoader";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import SearchForm from "../../partials/actions/SearchForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

function TimesheetsAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [data, setData] = useState({ loading: false });
  const [completedsheetData, setCompletedsheetData] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [declinedTimesheet, setDeclinedTimesheet] = useState({});
  const { dispatch } = React.useContext(AuthContext);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [completeList, setCompleteList] = useState([]);
  const [approved, setApproved] = useState(false);
  let list = [];
  const navigateTo = useNavigate();

  //const handleSelectedItems = (selectedItems) => {
  //setSelectedItems([...selectedItems]);
  //};
  const { key } = useParams();
  const { id } = useParams();

  /* ************************************************************************************************************
   *
   *                                         INPUT SETUP
   *
   *************************************************************************************************************/

  //FUNCTION TO REFRESH COMPONENTS
  const refresh = async () => {
    setLoading(true);
    checkToken();
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${key}/${id}`
    );

    let cleanTimesheets = [];
    getTimesheets.timesheets.forEach((timesheet, i) => {
      timesheet.hours > 0 && cleanTimesheets.push(timesheet);
    });
    setTimesheetData(cleanTimesheets);
    cleanTimesheets.map(async (item) => {
      list[item.user._id] = {
        id: item.user._id,
        name:
          item.user.personalInfo.firstName +
          " " +
          item.user.personalInfo.lastName,
        amount: list[item.user._id]
          ? parseInt(list[item.user._id].amount) + parseInt(item.hours)
          : parseInt(item.hours),
      };
      item.approval == "pending"
        ? cleanTimesheets.map((completedItem) => {
            console.log("completedItem pending", completedItem);
            completedItem.user._id == item.user._id ? setApproved(false) : null;
          })
        : null;
      item.approval == "approved"
        ? cleanTimesheets.map((completedItem) => {
            completedItem.user._id == item.user._id ? setApproved(true) : null;
          })
        : null;
    });

    if (approved) {
      let getCompletedsheet = await request.patch(
        `${config.path.completedsheet.editCompletedsheet}/${key}/${id}`
      );
    }
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

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setSuccess(false);
    setError(false);
  };

  /* ************************************************************************************************************
   *
   *                                         USE EFFECT: GETTING
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);
    //GET TIMESHEETS FOR PROJECT
    let getTimesheets = await request.get(
      `${config.path.timesheet.getTimesheetForProject}/${key}/${id}`
    );

    let cleanTimesheets = [];
    if (getTimesheets.timesheets.length > 0) {
      getTimesheets.timesheets.forEach((timesheet, i) => {
        parseInt(timesheet.hours) > 0 && cleanTimesheets.push(timesheet);
      });
      setTimesheetData(cleanTimesheets);
    }
    let getCompletedsheet = await request.get(
      `${config.path.completedsheet.getCompletedsheetForMonth}/${key}/${id}`
    );
    await setCompletedsheetData(getCompletedsheet);
    //GET CLIENT NAME, PROJECT NAME, MONTH NAME
    let project = await request.get(
      `${config.path.projects.getProject}/${key}`
    );
    let client = await request.get(
      `${config.path.clients.getClient}/${project.client}`
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
    cleanTimesheets.map(async (item) => {
      list[item.user._id] = {
        id: item.user._id,
        name:
          item.user.personalInfo.firstName +
          " " +
          item.user.personalInfo.lastName,
        amount: list[item.user._id]
          ? parseInt(list[item.user._id].amount) + parseInt(item.hours)
          : parseInt(item.hours),
      };
      console.log("item.approval pending", item.approval);
      item.approval == "pending"
        ? cleanTimesheets.map((completedItem) => {
            console.log("completedItem pending", completedItem);
            completedItem.user._id == item.user._id ? setApproved(false) : null;
          })
        : null;
      console.log("item.approval approved", item.approval);
      item.approval == "approved"
        ? cleanTimesheets.map((completedItem) => {
            console.log("completedItem approved", completedItem);
            completedItem.user._id == item.user._id ? setApproved(true) : null;
          })
        : null;
    });
    setCompleteList(await list);
    setLoading(false);
  }, [data.loading]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  useEffect(async () => {}, [timesheetData]);

  /*************************************************************************************************************
   *
   *                                                 ADD APPROVAL TO TIMESHEET
   *
   *************************************************************************************************************/

  const approveMany = async () => {
    //e.preventDefault();

    let input = { approval: "approved" };
    let userId = localStorage.getItem("_id");

    for (let i = 0; i < selectedItems.length; i++) {
      let req = await request.patch(
        `${config.path.timesheet.approveTimesheet}/${selectedItems[i]}/${userId}`,
        input,
        true
      );

      if (req.err) {
        // console.log(req.err.message);
        return;
      }
    }

    refresh();

    setTimeout(() => {
      setSelectedItems([]);
    }, 1000);
  };

  const declineTimesheet = async () => {
    // e.stopPropagation();
    //  e.preventDefault();
    console.log("declineTimesheet: ", declinedTimesheet);
    let input = { ...declinedTimesheet, approval: "declined" };
    console.log(input);
    let userId = localStorage.getItem("_id");

    //EDIT TIMESHEET
    let req = await request.patch(
      `${config.path.timesheet.approveTimesheet}/${declinedTimesheet.id}/${userId}`,
      input
    );
    if (req.err) {
      console.log("ERROR");
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }

    setSuccess(true);
    setSuccessMessage("Successfully Declined Timesheet.");

    setTimeout(() => {
      resetState();
      refresh(); // REFRESH COMPONENT
    }, 2000);
  };

  const approveOne = async (id, status, description, date, dateName) => {
    setDeclinedTimesheet({
      id: id,
      desc: description,
      date: date,
      dateName: dateName,
    });

    if (status == "declined") {
      setFeedbackModalOpen(true);
    } else {
      let input = { approval: status };
      let userId = localStorage.getItem("_id");

      //EDIT TIMESHEET
      let req = await request.patch(
        `${config.path.timesheet.approveTimesheet}/${id}/${userId}`,
        input
      );
      if (req.err) {
        setError(true);
        setErrorMessage(req.error.message);
        return;
      }
      setTimeout(() => {
        resetState();
        refresh(); // REFRESH COMPONENT
      }, 2000);
    }

    // refresh(); // REFRESH COMPONENT
  };

  function userExists(name) {
    return completedsheetData.some(function (el) {
      return el.user === name;
    });
  }
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
              {/* Error message */}
              <Banner2 type="error" open={errors} setOpen={setError}>
                {errorMessage}
              </Banner2>
            </div>

            <div className="mb-4 sm:mb-0 p-2 rounded-lg bg-indigo-200">
              {Object.entries(completeList).map((item) => (
                <div className="flex">
                  <div className="px-2">
                    {userExists(item[1].id) ? (
                      <FontAwesomeIcon icon={faCircle} className="" />
                    ) : (
                      <FontAwesomeIcon icon={faCircleNotch} className="" />
                    )}{" "}
                    {item[1].name} : {item[1].amount}
                  </div>
                </div>
              ))}
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/*  Approve button */}
              <div className={`${selectedItems.length < 1 && "hidden"}`}>
                <div className="flex items-center">
                  <div className="hidden xl:block text-sm italic mr-2 whitespace-nowrap">
                    {/*<span> approve {selectedItems.length}</span> items*/}
                  </div>
                  <button
                    className="btn bg-white border-slate-200 hover:border-slate-300 text-rose-500 hover:text-rose-600"
                    onClick={(e) => {
                      approveMany();
                      setSelectedItems([]);
                    }}
                  >
                    Approve selected {selectedItems.length}
                  </button>
                </div>
              </div>
              {/* Search Form*/}
              <SearchForm placeholder="Search…" setSearchTerm={setSearchTerm} />
              {/* Filter button */}
              <FilterButton
                align="right"
                setSelectedOptions={setSelectedOptions}
                filterOptions={["approved", "declined"]}
              />

              {/* Add timesheet button
            <button
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
              onClick={(e) => {
              }}
            >
              <span className="hidden xs:block ml-2">Approve All</span>
            </button>*/}
            </div>
          </div>

          {/*
           ********************************************** TABLE COMPONENT **********************************************
           */}

          {/* Table */}
          <TimesheetsTableRep
            setSelectedItems={setSelectedItems}
            timesheetData={timesheetData}
            approveOne={approveOne}
            selectedOptions={selectedOptions}
            selectedMonth={id}
            project={key}
            searchTerm={searchTerm}
            info={info}
          />
          <ModalBasic
            id="feedback-modal"
            modalOpen={feedbackModalOpen}
            setModalOpen={setFeedbackModalOpen}
            resetState={resetState}
            title="Declined"
          >
            {/* Modal content */}
            <div className="px-5 py-4">
              <div className="text-sm">
                <div className="font-medium text-slate-800 mb-3">
                  Please Indicate a reason for declining the timesheet.
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="ReasonForDeclining"
                  >
                    Reason for declining{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className="form-input w-full px-2 py-1"
                    type="text"
                    value={declinedTimesheet.message}
                    onChange={(e) => {
                      setDeclinedTimesheet({
                        ...declinedTimesheet,
                        desc: e.target.value,
                      });
                    }}
                  />
                </div>
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
                    setFeedbackModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    declineTimesheet();
                  }}
                >
                  Decline
                </button>
              </div>
              <div className="text-xs mt-3">
                * By declining this entry, an email will be sent to the
                consultant notifying them.
              </div>
            </div>
          </ModalBasic>
          {/* Pagination 
        <div className="mt-8">
          <PaginationClassic />
        </div>*/}
        </div>
      )}
    </main>
  );
}

export default TimesheetsAdmin;
