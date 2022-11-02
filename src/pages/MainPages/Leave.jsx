import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";
import Banner2 from "../../components/Banner2";
import request from "../../handlers/request";
import config from "../../config";
import PreLoader from "../../components/PreLoader";
import Hours from "../../data/Hours";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";

function Leave() {
  const [leave, setLeave] = useState([]);
  const [leaveInfo, setLeaveInfo] = useState({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Leave");
  const [modalButton, setModalButton] = useState("Add");
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState({});
  const [addingLeave, setAddingLeave] = useState(false);
  const [loading, setLoading] = useState(true);
  const { dispatch } = React.useContext(AuthContext);

  let clicks = 0;
  let timer = setTimeout(() => {}, 500);
  let dateClicked = "";

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      navigateTo("/signin");
    }
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setInfoModalOpen(false);
    setSuccess(false);
    setError(false);
    setSuccessModalOpen(false);
    setModalTitle("Add Leave");
    setModalButton("Add");
    setFile({});
    setAddingLeave(false);
    setInputs({
      title: "",
      start: "",
      end: "",
    });
    setLeaveInfo({
      title: "",
      start: "",
      end: "",
      id: "",
      managerApproval: [],
      adminApproval: "",
      attachment: "",
    });
    clearInputs();
  };

  //CLEAR ALL TEXT FIELDS
  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );

    Array.from(document.querySelectorAll("select")).forEach(
      (select) => (select.selectedIndex = 0) //reset input
    );
  };

  //STORE INPUTS FROM FORMS INPUTS
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const validateHalfDay = () => {
    if (inputs.date) {
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    //ADD A NEW LEAVE
    if (modalButton == "Add") {
      setAddingLeave(true);
      const userId = localStorage.getItem("_id");
      let validate, finalInputs;

      if (inputs.type !== "Half Day Leave") {
        validate = validateInputs(inputs);
        if (!validate.valid) {
          setError(true);
          setErrorMessage(validate.msg);
          setAddingLeave(false);
          return;
        }
      } else {
        if (!inputs.start) {
          setError(true);
          setErrorMessage("Date is required.");
          setAddingLeave(false);
        }
      }
      setError(false);

      finalInputs = inputs;

      //GET UPLOADED FILE IF AVAILABLE

      if (JSON.stringify(file) !== "{}") {
        let formData = new FormData();
        formData.append("file", file);

        let fileSubmitted = await request.post(
          config.path.s3.uploadFile,
          formData,
          true
        );

        finalInputs = {
          ...finalInputs,
          fileKey: !fileSubmitted.err ? fileSubmitted.fileKey : "",
        };

        let req = await request.post(
          config.path.leave.addLeave + "/" + userId,
          finalInputs,
          true
        );

        if (req.err) {
          setError(true);
          setErrorMessage(req.error.message);
          setAddingLeave(false);
          return;
        }
        setAddingLeave(false);
        setSuccess(true);
        setSuccessMessage("Successfully Added Leave.");

        getLeaveData();

        setTimeout(() => {
          resetState();
        }, 2000);
      } else {
        if (inputs.type === "Half Day Leave") {
          finalInputs = {
            ...finalInputs,
            end: inputs.start,
            fileKey: "",
          };
        } else {
          finalInputs = {
            ...finalInputs,
            fileKey: "",
          };
        }

        let req = await request.post(
          config.path.leave.addLeave + "/" + userId,
          finalInputs,
          true
        );

        if (req.err) {
          setError(true);
          setErrorMessage(req.error.message);
          setAddingLeave(false);
          return;
        }

        setAddingLeave(false);
        setSuccess(true);
        setSuccessMessage("Successfully Added Leave.");

        getLeaveData();

        setTimeout(() => {
          resetState();
        }, 2000);
      }
    }
    //EDIT A LEAVE
    else {
      e.stopPropagation();

      let validate = validateInputs(inputs);
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      }
      setError(false);

      setSuccessModalOpen(true);
    }
  };

  const getLeaveData = async () => {
    checkToken();
    setLoading(true);

    const userId = localStorage.getItem("_id");

    let leaveData = await request.get(
      config.path.leave.getAllLeave + "/" + userId
    );

    setLeave(leaveData);
    setLoading(false);
  };

  //ADDITIONAL STYLING
  const renderEventContent = (e) => {
    // // console.log(e);
    //  <i>{e.event.title}</i>
    return (
      <>
        <b>{e.event.extendedProps.type}</b>
      </>
    );
  };

  //CREATE LEAVE
  const addEventOnClick = (e) => {
    let date = e.date;
    date = new Date(date).setDate(new Date(date).getDate() + 1);
    date = new Date(date);
    // console.log("date: ", date);

    //SET THE CLICKED ON DATE IN THE INPUTS
    (document.getElementById("start").value = date.toISOString().split("T")[0]),
      (document.getElementById("end").value = date.toISOString().split("T")[0]),
      setInputs({
        start: date.toISOString().split("T")[0],
        end: date.toISOString().split("T")[0],
      });
    setFeedbackModalOpen(true);
  };

  //SELECTING WITH DRAGGING
  const selectWithDagging = (e) => {
    let start = e.start;
    let end = e.end;

    start = new Date(start).setDate(new Date(start).getDate() + 1);
    start = new Date(start);

    //SET THE CLICKED ON DATE IN THE INPUTS
    (document.getElementById("start").value = start
      .toISOString()
      .split("T")[0]),
      (document.getElementById("end").value = end.toISOString().split("T")[0]),
      setInputs({
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      });
    setFeedbackModalOpen(true);
  };

  const openLeave = (e) => {
    setInfoModalOpen(true);

    setLeaveInfo({
      type: e.event.extendedProps.type,
      start: new Date(e.event.start).toString(),
      end: e.event.end
        ? new Date(e.event.end).toString()
        : new Date(e.event.start).toString(), //FOR SOME REASON THE END DATE OF EVENTS THAT START & END ON THE SAME DAY IS NULL
      id: e.event.extendedProps._id,
      managersApproval: e.event.extendedProps.managersApproval,
      adminApproval: e.event.extendedProps.adminApproval,
      attachment: e.event.extendedProps.fileKey
        ? e.event.extendedProps.fileKey
        : "",
    });
  };

  //EDIT ON DROP OR RESIZING OF EVENT
  const editOnDropOrResize = async (e) => {
    let id = e.event.extendedProps._id;

    let data = {
      start: e.event.start,
      end: e.event.end
        ? new Date(
            new Date(e.event.end).setDate(new Date(e.event.end).getDate() - 1)
          )
        : e.event.start, //IF MORE THAN ONE DAY THE END DATE IS LONGER BY A DAY FOR SOME REASON
    };

    let approvalSatus = "other";
    if (
      e.event.extendedProps.managersApproval.every(
        (obj) => obj.approval === "pending"
      ) &&
      e.event.extendedProps.adminApproval === "pending"
    ) {
      approvalSatus = "pending";
    } else if (
      e.event.extendedProps.managersApproval.every(
        (obj) => obj.approval === "approved"
      ) &&
      e.event.extendedProps.adminApproval === "approved"
    ) {
      approvalSatus = "approved";
    }

    let req = await request.patch(
      config.path.leave.editLeave + "/" + id,
      { inputs: data, approvalSatus },
      true
    );

    if (req.err) {
      setError(true);
      setErrorMessage(req.msg);
      setTimeout(() => {
        getLeaveData();
        resetState();
      }, 2500);
      return;
    }
    /*setSuccess(true);
    setSuccessMessage("Successfully Edited LEAVE.");
    setTimeout(() => {
      resetState();
    }, 2000);*/
  };

  //RESET DOUBLE CLICKS
  const resetClicks = () => {
    clicks = 0;
    clearTimeout(timer);
    dateClicked = "";
  };

  //DOUBLE CLICK ON CALENDAR DATE
  const handleDoubleClick = (e) => {
    clicks++;
    if (clicks === 1) {
      dateClicked = e.dateStr;
      timer = setTimeout(() => {
        // alert(`Single ${e.dateStr}`);
        resetClicks();
      }, 500);
    } else {
      if (dateClicked === e.dateStr) {
        addEventOnClick(e);
        //alert(`Double ${e.dateStr}`);
      }
      resetClicks();
    }
    // console.log("arg: ", e);
  };

  const deleteLeave = async (e) => {
    e.preventDefault();

    let req = await request.delete(
      `${config.path.leave.deleteLeave}/${leaveInfo.id}`
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Deleted Leave.");

    getLeaveData();

    setTimeout(() => {
      resetState();
      setDangerModalOpen(false);
    }, 1000);
  };

  const editLeave = async (e) => {
    e.stopPropagation();

    let startDate = new Date(leaveInfo.start).setDate(
      new Date(leaveInfo.start).getDate() + 1
    ); //MUST ADD OFF SET

    document.getElementById("type").value = leaveInfo.type;
    document.getElementById("start").value = new Date(startDate)
      .toISOString()
      .split("T")[0];
    document.getElementById("end").value = new Date(leaveInfo.end)
      .toISOString()
      .split("T")[0];

    setInputs({
      type: leaveInfo.type,
      start: leaveInfo.start,
      end: leaveInfo.end,
    });

    setModalTitle("Edit Leave");
    setModalButton("Update");

    setFeedbackModalOpen(true);
    setInfoModalOpen(false);
  };

  const updateLeave = async (e) => {
    //e.stopPropagation();
    //console.log("leave: ", leaveInfo);

    let req = await request.patch(
      config.path.leave.editLeave + "/" + leaveInfo.id,
      { inputs },
      true
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Edited Leave.");

    getLeaveData();

    setTimeout(() => {
      resetState();
    }, 2000);
  };

  function updateFile(event) {
    setFile(event.target.files[0]);
  }

  useEffect(() => {
    getLeaveData();
  }, []);

  return (
    <div>
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            {/* Left: Title */}
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Apply For Leave
              </h1>
            </div>
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              {/* Left: Title */}
              {/* Filters and view buttons */}
              <div className="sm:flex sm:justify-between sm:items-center mb-4">
                {/* Filters  */}
                <div className="mb-4 sm:mb-0 mr-2">
                  <ul className="flex flex-wrap items-center -m-1">
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div className="w-1 h-3.5 bg-rose-500 shrink-0"></div>
                        <span className="ml-1.5">Admin Declined</span>
                      </button>
                    </li>
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div
                          className="w-1 h-3.5 shrink-0"
                          style={{ backgroundColor: "rgb(249 115 22)" }}
                        ></div>
                        <span className="ml-1.5">Manager Declined</span>
                      </button>
                    </li>
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div className="w-1 h-3.5 bg-emerald-500 shrink-0"></div>
                        <span className="ml-1.5">Fully Approved</span>
                      </button>
                    </li>
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div className="w-1 h-3.5 bg-yellow-500 shrink-0"></div>
                        <span className="ml-1.5">Manager Approved</span>
                      </button>
                    </li>
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div className="w-1 h-3.5 bg-indigo-500 shrink-0"></div>
                        <span className="ml-1.5">
                          Partially Manager Approved
                        </span>
                      </button>
                    </li>
                    <li className="m-1">
                      <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                        <div className="w-1 h-3.5 bg-zinc-400 shrink-0"></div>
                        <span className="ml-1.5">Pending</span>
                      </button>
                    </li>
                    {/* <li className="m-1">
                    <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-indigo-500">
                      +Add New
                    </button>
                  </li>*/}
                  </ul>
                </div>

                {/* View buttons (requires custom integration) 
              <div className="flex flex-nowrap -space-x-px">
                <button className="btn bg-slate-50 border-slate-200 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r">
                  Month
                </button>
                <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-600 rounded-none first:rounded-l last:rounded-r">
                  Week
                </button>
                <button className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-600 rounded-none first:rounded-l last:rounded-r">
                  Day
                </button>
              </div> */}
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <hr className="w-px h-full bg-slate-200 mx-1" />
                {/* Create event button */}
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedbackModalOpen(true);
                  }}
                >
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Add Leave</span>
                </button>
              </div>
            </div>

            {/* Error messages */}
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              {/* Error message */}
              <Banner2 type="error" open={errors} setOpen={setError}>
                {errorMessage}
              </Banner2>
            </div>

            {/* Calendar table */}
            {loading ? (
              <div>
                <PreLoader />
              </div>
            ) : (
              <div className="bg-white p-3 rounded-sm shadow overflow-hidden">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  dateClick={handleDoubleClick}
                  height="auto"
                  //dayCellContent={injectCellContent}
                  selectable={true}
                  eventContent={renderEventContent}
                  weekends={false}
                  events={leave}
                  select={selectWithDagging}
                  eventDrop={editOnDropOrResize}
                  eventClick={openLeave}
                  eventResize={editOnDropOrResize}
                />
              </div>
            )}
          </div>

          {/*
           ********************************************** ADD/EDIT/VIEW LEAVE MODAL **********************************************
           */}
          <ModalBasic
            id="feedback-modal"
            modalOpen={feedbackModalOpen}
            setModalOpen={setFeedbackModalOpen}
            title={modalTitle}
            resetState={resetState}
          >
            <div className="px-5 py-4">
              <div className="text-lg">
                <div className="font-large text-slate-800 mb-3">
                  Please Enter The Following Details:
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="type"
                  >
                    Leave Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="type"
                    className="form-select w-full"
                    onChange={handleChange}
                  >
                    <option disabled selected value>
                      Select Leave
                    </option>
                    <option value="Half Day Leave">Half Day Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Family Leave">Family Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Maternity Leave">Study Leave</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="start"
                  >
                    {inputs && inputs.type !== "Half Day Leave"
                      ? "Start Date"
                      : "Date"}{" "}
                    {/*<span className="text-rose-500">*</span>*/}
                  </label>
                  <input
                    id="start"
                    className="form-input w-full"
                    type="date"
                    onChange={handleChange}
                  />
                </div>
                {inputs && inputs.type === "Half Day Leave" ? (
                  <>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="start"
                      >
                        Timeslot
                        {/*<span className="text-rose-500">*</span>*/}
                      </label>
                      <select
                        id="slot"
                        className="form-select w-full"
                        onChange={handleChange}
                      >
                        <option disabled selected value>
                          Select a Start Time
                        </option>
                        {Hours.filter((hour) => parseInt(hour) + 4 <= 17).map(
                          (hour) => (
                            <option value={hour}>{`${hour}:00`}</option>
                          )
                        )}
                      </select>
                      {inputs && inputs.slot !== "" ? (
                        <select
                          id="slot2"
                          className="mt-3 form-select w-full"
                          value={
                            inputs && inputs.slot
                              ? parseInt(inputs.slot) + 4
                              : null
                          }
                          disabled={true}
                        >
                          <option disabled selected value>
                            Select a Start Time To Display
                          </option>
                          {Hours.map((hour) => (
                            <option value={hour}>{`${hour}:00`}</option>
                          ))}
                        </select>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {inputs && inputs.type !== "Half Day Leave" ? (
                  <>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="end"
                      >
                        End Date {/*<span className="text-rose-500">*</span>*/}
                      </label>
                      <input
                        id="end"
                        className="form-input w-full"
                        type="date"
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="mb-2">
                  <label
                    className="mt-1 block text-sm font-medium mb-1"
                    htmlFor="upload"
                  >
                    Supporting Documents (Optional):
                  </label>
                  <div>
                    <input
                      type="file"
                      id="myfile"
                      name="upload"
                      accept="*"
                      onChange={updateFile}
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

              <div className="px-5 py-4" hidden={!addingLeave}>
                Saving Info...
                {/*                   <PreLoader />
                 */}{" "}
              </div>

              {/* Modal footer */}
              <div className="px-5 py-4 border-t border-slate-200">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    disabled={addingLeave}
                    className={`${
                      addingLeave
                        ? "btn-sm border-slate-300 bg-slate-300 text-slate-200"
                        : "btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetState();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={addingLeave}
                    className={`${
                      addingLeave
                        ? "btn-sm border-slate-300 bg-slate-300 text-slate-200"
                        : "btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                    onClick={submitForm}
                  >
                    {modalButton}
                  </button>
                </div>
              </div>
            </div>
          </ModalBasic>
          {/*
           ********************************************** Info Modal **********************************************
           */}
          <ModalBlank
            id="info-modal"
            modalOpen={infoModalOpen}
            setModalOpen={setInfoModalOpen}
          >
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-indigo-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                </svg>
              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-2">
                  <div className="text-lg font-semibold text-slate-800">
                    Leave: {leaveInfo.type}
                  </div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-10 mt-15">
                  <div className="space-y-2">
                    <p>
                      Starts: {new Date(leaveInfo.start).toLocaleDateString()}
                    </p>
                    <p>
                      Ends:{" "}
                      {new Date(
                        new Date(leaveInfo.end).setDate(
                          new Date(leaveInfo.end).getDate() - 1
                        )
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Manager Approval Status:{" "}
                      {leaveInfo.managersApproval
                        ? leaveInfo.managersApproval.map((manager) => {
                            console.log(manager);
                            return (
                              <>
                                <p className="text-xs ml-5">
                                  {manager.manager.personalInfo.firstName}{" "}
                                  {manager.manager.personalInfo.lastName}:{" "}
                                  {manager.approval}
                                </p>
                              </>
                            );
                          })
                        : ""}
                    </p>
                    <p>Admin Approval Status: {leaveInfo.adminApproval}</p>{" "}
                    {leaveInfo.attachment != "" && (
                      <div
                        class="border border-slate-200 hover:border-slate-300 mx-0 my-6 p-3 rounded-md"
                        style={{
                          width: "200px",
                        }}
                      >
                        <a
                          //href={`${config.url}/upload/${leaveInfo.attachment}`}
                          href={`${config.url}/file/${leaveInfo.attachment}`}
                          target="_blank"
                          className="flex items-center h-10"
                        >
                          <div>
                            <img
                              src="https://i.ibb.co/RpYzvq6/pdf-icon.png"
                              style={{
                                width: "40px",
                                height: "40px",
                                color: "rgb(113 113 122)",
                                margin: "auto",
                              }}
                            />
                          </div>
                          <div className="my-2 ml-3 py-2 text-sm">
                            Open Attachment
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalOpen(false);
                      resetState();
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={(e) => {
                      editLeave(e);
                    }}
                  >
                    Edit Leave
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDangerModalOpen(true);
                    }}
                  >
                    Delete Leave
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
          {/*
           ********************************************** Success Modal **********************************************
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
                  <div className="text-lg font-semibold text-zinc-800">
                    Are you sure you want update this leave?
                  </div>
                  {/* Error message */}
                  <Banner2 type="error" open={errors} setOpen={setError}>
                    {errorMessage}
                  </Banner2>
                  {/* On successful registration */}
                  <Banner2 type="success" open={success} setOpen={setSuccess}>
                    {successMessage}
                  </Banner2>{" "}
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
                    Cancel
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={updateLeave}
                  >
                    Yes, Update it
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
          {/*
           ********************************************** Danger Modal **********************************************
           */}
          <ModalBlank
            id="danger-modal"
            modalOpen={dangerModalOpen}
            setModalOpen={setDangerModalOpen}
          >
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-rose-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                </svg>
              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-5">
                  <div className="text-lg font-semibold text-zinc-800">
                    Are you sure you want to delete this leave?
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
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDangerModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={deleteLeave}
                  >
                    Yes, Delete it
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
        </main>
      </div>
    </div>
  );
}

export default Leave;

const validateInputs = (obj) => {
  // console.log("obj: ", obj);
  let names = {
    type: "Type",
    start: "Start Date",
    end: "End Date",
  };
  for (let i in obj) {
    console.log("I: ", i);
    if (obj[i] === "") {
      return { valid: false, msg: `The ${names[i]} is required` };
    } else if (i == "start") {
      let date = new Date(obj[i]);
      console.log("DATE: ", date.getDay());
      if (date.getDay() == 0 || date.getDay() == 6)
        return {
          valid: false,
          msg: `The ${names[i]} cannot be a weekend day`,
        };
    } else if (i == "end") {
      let startDate = new Date(obj.start);
      let date = new Date(obj[i]);
      console.log("DATE: ", date.getDay());
      if (date.getDay() == 0 || date.getDay() == 6)
        return {
          valid: false,
          msg: `The ${names[i]} cannot be a weekend day`,
        };
      if (date < startDate)
        return {
          valid: false,
          msg: `The End Date cannot be before the Start Date`,
        };
    }
  }
  return { valid: true };
};
