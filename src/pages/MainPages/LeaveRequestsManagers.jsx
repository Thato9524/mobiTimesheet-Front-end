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
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";

function LeaveRequests() {
  const [leave, setLeave] = useState([]);
  const [leaveInfo, setLeaveInfo] = useState({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const { dispatch } = React.useContext(AuthContext);

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
    // console.log("reset");
    setInfoModalOpen(false);
    setSuccess(false);
    setError(false);
    setLeaveInfo({
      title: "",
      start: "",
      end: "",
      id: "",
      managersApproval: [],
      adminApproval: "",
      attachment: ""
    });
  };

  const getLeaveData = async () => {
    checkToken();
    setLoading(true);

    const userId = localStorage.getItem("_id");

    let leaveData = await request.get(
      config.path.leave.getAllLeaveForManagers + "/" + userId
    );
    // console.log("leaveData: ", leaveData);

    setLeave(leaveData);
    setLoading(false);
  };

  //ADDITIONAL STYLING
  const renderEventContent = (e) => {
    return (
      <>
        <b>
          {e.event.extendedProps.type}
          {"\n"}
        </b>
        <i>{e.event.extendedProps.user.personalInfo.firstName}</i>
      </>
    );
  };

  const openLeave = (e) => {
    setInfoModalOpen(true);

    console.log(e.event.extendedProps.type);
    console.log(e.event.extendedProps.managersApproval);

    setLeaveInfo({
      user: e.event.extendedProps.user.personalInfo.firstName,
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

  const approveLeave = async (e, status) => {
    e.stopPropagation();

    let req = await request.patch(
      config.path.leave.approveLeave + "/" + leaveInfo.id,
      {
        managersApproval: {
          manager: localStorage.getItem("_id"),
          approval: status,
        },
      }
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Edited Leave.");
    setInfoModalOpen(false);

    getLeaveData();

    setTimeout(() => {
      resetState();
    }, 2000);
  };

  useEffect(() => {
    getLeaveData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            {/* Left: Title */}
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Approve Leave Requests
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
                  height="auto"
                  //dayCellContent={injectCellContent}
                  eventContent={renderEventContent}
                  weekends={false}
                  events={leave}
                  eventClick={openLeave}
                />
              </div>
            )}
          </div>
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
                    Leave Request for {leaveInfo.user}
                  </div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-10 mt-15">
                  <div className="space-y-2">
                    <p>Starts: {new Date(leaveInfo.start).toLocaleDateString()}</p>
                    <p>Ends: {new Date(new Date(leaveInfo.end).setDate(new Date(leaveInfo.end).getDate() - 1)).toLocaleDateString()}</p>
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
                {/* Error message */}
                <Banner2 type="error" open={errors} setOpen={setError}>
                  {errorMessage}
                </Banner2>
                {/* On successful registration */}
                <Banner2 type="success" open={success} setOpen={setSuccess}>
                  {successMessage}
                </Banner2>
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
                    className="btn-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={(e) => {
                      approveLeave(e, "approved");
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={(e) => {
                      approveLeave(e, "declined");
                    }}
                  >
                    Decline
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

export default LeaveRequests;
