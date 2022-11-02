import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";
import Banner2 from "../../components/Banner2";
import request from "../../handlers/request";
import config from "../../config";
import PreLoader from "../../components/PreLoader";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import venues from "../../data/Venue"
import DateTimePicker from "react-datetime-picker";

function Events() {
  const [events, setEvents] = useState([]);
  const [eventInfo, setEventInfo] = useState({});

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [calView, setCalView] = useState("dayGridMonth");

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create New Event");
  const [modalButton, setModalButton] = useState("Add");
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const { dispatch } = React.useContext(AuthContext);
  let clicks = 0;
  let timer = setTimeout(() => {}, 500);
  let dateClicked = "";

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

  const handleStartSelect = (value) => {
    setStart(value);

    end < start && setEnd(value);

    // setEnd(value);
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    // console.log("reset");
    setFeedbackModalOpen(false);
    setInfoModalOpen(false);
    setSuccess(false);
    setError(false);
    setSuccessModalOpen(false);
    setModalTitle("Add New Event");
    setModalButton("Add");
    setInputs({
      title: "",
      desc: "",
      desc: "",
      venue: "",
      start: "",
      end: "",
    });
    setEventInfo({
      title: "",
      desc: "",
      venue: "",
      start: "",
      end: "",
      id: "",
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

  const submitForm = async (e) => {
    e.preventDefault();
    let validate;

    // console.log(start);
    // console.log(end);
    // console.log(title);

    //ADD A NEW EVENT
    if (modalButton == "Add") {
      validate = valid();
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      }
      setError(false);

      let req = await request.post(
        config.path.events.addEvent,
        inputs,
        //{ title, start: `${start.toISOString()}`, end: `${end.toISOString()}` },
        true
      );
      if (req.err) {
        setError(true);
        setErrorMessage(req.error.message);
        return;
      }
      setSuccess(true);
      setSuccessMessage("Successfully Created Event.");

      getEventData();

      setTimeout(() => {
        resetState();
      }, 2000);
    }
    //EDIT A EVENT
    else {
      e.stopPropagation();

      validate = valid();
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      }
      setError(false);
      // console.log("first");

      setSuccessModalOpen(true);
    }
  };

  const getEventData = async () => {
    checkToken();
    setLoading(true);

    let eventData = await request.get(config.path.events.getAllEvents);
    /* let eventData = [
      {
        id: 'a',
        title: 'my event',
        //start: "ISODate('Mon Jul 18 2022 02:00:00 GMT+0200 (South Africa Standard Time)')"
        start: '2022-07-10T00:00:00.000Z'
      }
    ] */
    setEvents(eventData);
    console.log("eventData------: ", eventData);
    setLoading(false);
  };

  const getTime = (date) => {
    const dateObj = new Date(date);
    // console.log(dateObj.getHours());
    return `${dateObj.getHours()}:${dateObj.getMinutes()}`;
  };

  //ADDITIONAL STYLING
  const renderEventContent = (e) => {
    // console.log(e.event);
    //  <i>{e.event.title}</i>
    return (
      <>
        <b>{e.event.title}</b>
        <p>{getTime(e.event.start)}</p>
      </>
    );
  };

  //SINGLE CLICKING ON DATE
  const injectCellContent = (args) => {
    return (
      <div>
        <button
          onClick={() => {
            addEventOnClick(args);
          }}
        >
          {args.dayNumberText}
        </button>
      </div>
    );
  };

  //CREATE EVENT
  const addEventOnClick = (e) => {
    let date = e.date;
    date = new Date(date).setDate(new Date(date).getDate() + 1);
    date = new Date(date);
    // console.log("date: ", date);

    //SET THE CLICKED ON DATE IN THE INPUTS
    (document.getElementById("start").value = date.toISOString().split("T")[0]),
      (document.getElementById("end").value = date.toISOString().split("T")[0]),
      setInputs({
        start: start.toISOString(),
        end: end.toISOString(),
      });
    // setInputs({
    //   start: date.toISOString().split("T")[0],
    //   end: date.toISOString().split("T")[0],
    // });
    setFeedbackModalOpen(true);
  };

  const openEvent = (e) => {
    setInfoModalOpen(true);
    console.log(e.event.extendedProps.desc);

    setEventInfo({
      title: e.event.title,
      start: new Date(e.event.start).toString(),
      desc: e.event.extendedProps.desc,
      venue: e.event.extendedProps.venue,
      end: e.event.end
        ? new Date(e.event.end).toString()
        : new Date(e.event.start).toString(), //FOR SOME REASON THE END DATE OF EVENTS THAT START & END ON THE SAME DAY IS NULL
      id: e.event.extendedProps._id,
      editable: e.event.startEditable,
    });
  };

  //EDIT ON DROP OR RESIZING OF EVENT
  const editOnDropOrResize = async (e) => {
    let id = e.event.extendedProps._id;
    // console.log(id);
    let data = {
      start: e.event.start,
      end: e.event.end ? e.event.end : e.event.start,
    };
    // console.log(data);

    let req = await request.patch(
      config.path.events.editEvent + "/" + id,
      data,
      true
    );

    if (req.err) {
      setError(true);
      setErrorMessage(req.msg);
      setTimeout(() => {
        getEventData();
        resetState();
      }, 2500);
      return;
    }
    /*setSuccess(true);
    setSuccessMessage("Successfully Edited Event.");
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

  //SELECTING WITH DRAGGING
  const selectWithDagging = (e) => {
    let start = e.start;
    let end = e.end;

    start = new Date(start).setDate(new Date(start).getDate() + 1);
    start = new Date(start);
    console.log("start: ", start);
    console.log("end: ", end);

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

  const deleteEvent = async (e) => {
    e.preventDefault();

    let req = await request.delete(
      `${config.path.events.deleteEvent}/${eventInfo.id}`
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Deleted Event.");

    getEventData();

    setTimeout(() => {
      resetState();
      setDangerModalOpen(false);
    }, 1000);
  };

  const editEvent = async (e) => {
    e.stopPropagation();

    let startDate = new Date(eventInfo.start).setDate(
      new Date(eventInfo.start).getDate() + 1
    ); //MUST ADD OFF SET

    document.getElementById("title").value = eventInfo.title;
    document.getElementById("desc").value = eventInfo.desc;
    document.getElementById("venue").value = eventInfo.venue;
    document.getElementById("start").value = new Date(startDate)
      .toISOString()
      .split("T")[0];
    document.getElementById("end").value = new Date(eventInfo.end)
      .toISOString()
      .split("T")[0];

    setInputs({
      title: eventInfo.title,
      desc: eventInfo.desc,
      venue: eventInfo.venue,
      start: eventInfo.start,
      end: eventInfo.end,
    });

    setModalTitle("Edit Event");
    setModalButton("Update");

    setFeedbackModalOpen(true);
    setInfoModalOpen(false);
  };

  const updateEvent = async (e) => {
    //e.stopPropagation();
    let req = await request.patch(
      config.path.events.editEvent + "/" + eventInfo.id,
      inputs,
      true
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Edited Event.");

    getEventData();

    setTimeout(() => {
      resetState();
    }, 2000);
  };

  useEffect(() => {
    getEventData();
  }, []);

  const valid = () => {
    let names = {
      title: "Title",
      desc: "Description",
      venue: "Venue",
      start: "Start Date",
      end: "End Date",
    }

    if (!inputs.title){
      return { valid: false, msg: `The ${names.title} is required` };
    }else if(inputs.title === "Training Day"){
      if(!inputs.desc){
        return { valid: false, msg: `The ${names.desc} is required` };
      }else if(!inputs.venue){
        return { valid: false, msg: `The ${names.venue} is required` };
      }else if(!inputs.start){
        return { valid: false, msg: `The ${names.start} is required` };
      }
      else if(!inputs.end){
        return { valid: false, msg: `The ${names.end} is required` };
      }
      else{
        return { valid: true };
      }
    }else if(!inputs.start){
      return { valid: false, msg: `The ${names.start} is required` };
    }else if(!inputs.end){
      return { valid: false, msg: `The ${names.end} is required` };
    }else{
      return { valid: true };
    }
  }

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
                Events
              </h1>
            </div>
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              {/* Filters  */}
              <div className="mb-4 sm:mb-0 mr-2">
                <ul className="flex flex-wrap items-center -m-1">
                  <li className="m-1">
                    <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                      <div className="w-1 h-3.5 bg-sky-500 shrink-0"></div>
                      <span className="ml-1.5">Exo</span>
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                      <div className="w-1 h-3.5 bg-emerald-500 shrink-0"></div>
                      <span className="ml-1.5">Public Holidays</span>
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                      <div className="w-1 h-3.5 bg-indigo-500 shrink-0"></div>
                      <span className="ml-1.5">Training Days</span>
                    </button>
                  </li>
                  <li className="m-1">
                    <button className="btn-sm bg-white border-slate-200 hover:border-slate-300 text-slate-500">
                      <div className="w-1 h-3.5 bg-yellow-500 shrink-0"></div>
                      <span className="ml-1.5">Misc</span>
                    </button>
                  </li>
                </ul>
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
                  <span className="hidden xs:block ml-2">Create Event</span>
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
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  //initialView="dayGridMonth"
                  initialView={calView}
                  dateClick={handleDoubleClick}
                  height="auto"
                  selectable={true}
                  select={selectWithDagging}
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "today,timeGridDay,timeGridWeek,dayGridMonth",
                  }}
                  //dayCellContent={injectCellContent}
                  eventContent={renderEventContent}
                  //weekends={false}
                  //defaultAllDay="false"
                  events={events}
                  eventDrop={editOnDropOrResize}
                  eventClick={openEvent}
                  eventResize={editOnDropOrResize}
                />
              </div>
            )}
          </div>

          {/*
           ********************************************** ADD/EDIT/VIEW EVENT MODAL **********************************************
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
                    htmlFor="title"
                  >
                    Event <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="title"
                    className="form-select w-full"
                    onChange={handleChange}
                  >
                    <option disabled selected value>
                      Select Event
                    </option>
                    <option value="Training Day">Training Day</option>
                    <option value="Exo Day">Exo Day</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="desc"
                  >
                    Description {/*<span className="text-rose-500">*</span>*/}
                  </label>
                  <input
                    id="desc"
                    placeholder="Description"
                    className="form-input w-full"
                    type="text"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="venue"
                  >
                    Venue {/*<span className="text-rose-500">*</span>*/}
                  </label>
                  <select
                    id="venue"
                    className="form-select w-full"
                    onChange={handleChange}
                  >
                    <option disabled selected value>
                      Select A Venue
                    </option>
                    {venues && venues.map((venue) => (<>
                      <option key={venue} value={venue}>{venue}</option>
                    </>))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="start"
                  >
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="start"
                    className="form-input w-full"
                    type="date"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="end"
                  >
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="end"
                    className="form-input w-full"
                    type="date"
                    onChange={handleChange}
                  />
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
                    Event: {eventInfo.title}
                  </div>
                  <div className="text-md font-semibold text-slate-700">
                    {eventInfo.desc ? `${eventInfo.desc} at ${eventInfo.venue}` : ""}
                  </div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-10">
                  <div className="space-y-2">
                    <p>Starts: {eventInfo.start}</p>
                    <p>Ends: {eventInfo.end}</p>
                  </div>
                </div>
                {/* Modal footer */}
                {eventInfo.editable ? (
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
                        editEvent(e);
                      }}
                    >
                      Edit Event
                    </button>
                    <button
                      className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDangerModalOpen(true);
                      }}
                    >
                      Delete Event
                    </button>
                  </div>
                ) : (
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
                  </div>
                )}
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
                    Are you sure you want update this event?
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
                    onClick={updateEvent}
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
                    Are you sure you want to delete this event?
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
                    onClick={deleteEvent}
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

export default Events;

const validateInputs = (obj) => {
  // console.log("obj: ", obj);
  let names = {
    title: "Title",
    desc: "Description",
    venue: "Venue",
    start: "Start Date",
    end: "End Date",
  }

  for (let i in obj) { 
    if (obj[i] === "") {
      return { valid: false, msg: `The ${names[i]} is required` };
    }
  }
  return { valid: true };
};


