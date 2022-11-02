import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material";
import { isJwtExpired } from "jwt-check-expiration";
import React, { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../../App";
import Banner2 from "../../../components/Banner2";
import ModalBlank from "../../../components/ModalBlank";
import ReaModal from "../../../components/ReaModal";
import config from "../../../config";
import request from "../../../handlers/request";
import History from "./histories/History";

export default function StudyCostFunding() {
  //TODAY STRING CONSTANT
  const today = new Date().toISOString().substring(0, 10);

  //ERROR/SUCCESS AND MESSAGE STATES
  const [success, setSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [endError, setEndError] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [message, setMessage] = useState(false);

  //REQUIRED JSX
  const required = <span className="text-rose-500">*</span>;

  //STATE VARIABLES
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [isPersonal, setIsPersonal] = useState("no");
  const [motivation, setMotivation] = useState("");
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [courseLink, setCourseLink] = useState("");
  const [email, setEmail] = useState(true);
  const [history, setHistory] = useState(false);
  const { dispatch } = React.useContext(AuthContext);

  //STATE UPDATE FUNCTIONS
  function updateCourseName(event) {
    setCourseName(event.target.value);
  }
  function updateCourseDesc(event) {
    setCourseDesc(event.target.value);
  }
  function updateCoursePrice(event) {
    setCoursePrice(event.target.value);
  }
  function updateIsPersonal(event) {
    setIsPersonal(event.target.value);
  }
  function updateMotivation(event) {
    setMotivation(event.target.value);
  }
  function updateStart(event) {
    setStart(event.target.value);
  }
  function updateEnd(event) {
    setEnd(event.target.value);
  }
  function updateCourseLink(event) {
    setCourseLink(event.target.value);
  }
  function updateEmail(event) {
    setEmail(event.target.checked);
  }

  //FORM VALIDATION
  function validate() {
    if (!courseName) {
      setNameError(true);
      setMessage("Course Name is required.");
    } else if (!courseDesc) {
      setDescError(true);
      setMessage("Course Description is required.");
    } else if (coursePrice <= 0) {
      setPriceError(true);
      setMessage("Course Cost is required.");
    } else if (!start) {
      setStartError(true);
      setMessage("Start date is required.");
    } else if (!end) {
      setEndError(true);
      setMessage("End date is required.");
    } else if (!courseLink) {
      setLinkError(true);
      setMessage("Course link is required.");
    } else if (courseName.length < 5) {
      setNameError(true);
      setMessage("Course Name must be more than 5 characters.");
    } else if (courseDesc.length < 5) {
      setNameError(true);
      setMessage("Course Description must be more than 5 characters.");
    } else if (courseLink.length < 5) {
      setNameError(true);
      setMessage("Course link must be more than 5 characters.");
    } else {
      setEnsureModalOpen(true);
    }
  }

  //FUNCTION FOR GETTING THE DURATION
  function getDuration(start, end) {
    start = new Date(start);
    end = new Date(end);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let duration = 0,
      i = 0,
      y = 0,
      lastDay;

    if (years === 0) {
      if (months == 0) {
        duration = end.getDate() - start.getDate() + 1;
      } else {
        for (i; i <= months; i++) {
          if (start.getMonth() + i === start.getMonth()) {
            lastDay = new Date(
              start.getFullYear(),
              start.getMonth() + i + 1,
              0,
              2
            ).getDate();
            duration += lastDay - start.getDate();
          } else if (start.getMonth() + i === end.getMonth()) {
            duration += end.getDate();
          } else {
            lastDay = new Date(
              start.getFullYear(),
              start.getMonth() + i + 1,
              0,
              2
            ).getDate();
            duration += lastDay;
          }
        }
      }
    } else {
      for (y; y <= years; y++) {
        if (y === 0) {
          months = 11 - start.getMonth();
          for (i; i <= months; i++) {
            if (start.getMonth() === 11) {
              duration += 31 - start.getDate();
            } else if (start.getMonth() + i === start.getMonth()) {
              lastDay = new Date(
                start.getFullYear(),
                start.getMonth() + i + 1,
                0,
                2
              ).getDate();
              duration += lastDay - start.getDate();
            } else {
              lastDay = new Date(
                start.getFullYear(),
                start.getMonth() + i + 1,
                0,
                2
              ).getDate();
              duration += lastDay;
            }
          }
        } else {
          if (start.getFullYear() + y === end.getFullYear()) {
            months = end.getMonth();
            for (i = 0; i <= months; i++) {
              if (i === end.getMonth()) {
                duration += end.getDate();
              } else {
                lastDay = new Date(
                  start.getFullYear() + y,
                  i + 1,
                  0,
                  2
                ).getDate();
                duration += lastDay;
              }
            }
          } else {
            for (i = 0; i <= 11; i++) {
              if (i === 11) {
                duration += 31;
              } else {
                lastDay = new Date(
                  start.getFullYear() + y,
                  i + 1,
                  0,
                  2
                ).getDate();
                duration += lastDay;
              }
            }
          }
        }
      }
    }
    return duration;
  }

  function resetState() {
    setCourseName("");
    setCourseDesc("");
    setCoursePrice("");
    setIsPersonal("no");
    setMotivation("");
    setStart(today);
    setEnd(today);
    setCourseLink("");
    setSuccess(false);
    updateHistory();
  }
  function closeModal() {
    setEnsureModalOpen(false);
    setErrorModalOpen(false);
  }

  //SUBMIT FORM FUNCTION
  async function submitForm() {
    const duration = getDuration(start, end);
    const _id = localStorage.getItem("_id");

    const req = {
      user: _id,
      courseName: courseName,
      courseDesc: courseDesc,
      coursePrice: coursePrice,
      isPersonal: isPersonal,
      motivation: motivation,
      start: start,
      end: end,
      duration: duration,
      link: courseLink,
      emailed: email,
      created: new Date(),
    };

    try {
      const response = await request.post(
        config.path.profile.requestFunding,
        req,
        true
      );

      if (!response.err) {
        setEnsureModalOpen(false);
        setMessage("Successfully Submitted Request.");
        setSuccess(true);
      } else {
        setEnsureModalOpen(false);
        setMessage(response.message);
        setErrorModalOpen(true);
      }
    } catch (ex) {
      setErrorModalOpen(true);
      setMessage(ex.message);
      setEnsureModalOpen(false);
    }
  }
  function updateHistory() {
    setHistory(!history);
  }

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
  useEffect(() => {
    checkToken();
  }, [])
  return (
    <div>
      <div className="flex justify-end mr-5">
        <button
          className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
          onClick={updateHistory}
        >
          {!history ? (
            "History"
          ) : (
            <div className="flex justify-center">Back to form</div>
          )}
        </button>
      </div>
      {history ? (
        <History form="studyCostFunding" />
      ) : (
        <div className="flex justify-center">
          <div className="w-1/2">
            <Card variant="outlined">
              <CardContent>
                <div className="mb-3 pb-4 rounded">
                  <div>Required {required}</div>
                </div>
                <div>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="course-name"
                    >
                      1. Course Name {required}
                    </label>
                    <input
                      id="course-name"
                      type={"text"}
                      value={courseName}
                      className="form-input w-full px-2 py-2 mb-3"
                      placeholder="Course Name"
                      onChange={updateCourseName}
                    />
                  </div>
                  <Banner2 type="error" open={nameError} setOpen={setNameError}>
                    {message}
                  </Banner2>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="course-description"
                    >
                      2. Course Description {required}
                    </label>
                    <textarea
                      id="course-description"
                      value={courseDesc}
                      placeholder="Course Description"
                      className="form-input w-full px-2 py-1 mb-3"
                      onChange={updateCourseDesc}
                    />
                  </div>
                  <Banner2 type="error" open={descError} setOpen={setDescError}>
                    {message}
                  </Banner2>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="cost-of-course"
                    >
                      3. Cost of Course(incl. VAT) {required}
                    </label>
                    <input
                      id="cost-of-course"
                      placeholder="Course cost"
                      type="number"
                      min="0"
                      value={coursePrice}
                      className="form-input w-full px-2 py-2 mb-5"
                      onChange={updateCoursePrice}
                    />
                  </div>
                  <Banner2
                    type="error"
                    open={priceError}
                    setOpen={setPriceError}
                  >
                    {message}
                  </Banner2>
                  <div className="pb-3">
                    <FormControl>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="is-personal"
                        id="is-personal"
                      >
                        {" "}
                        4. Was this training identified during your Personal
                        Development session ?
                      </label>
                      <RadioGroup
                        aria-labelledby="is-personal"
                        name="is-personal"
                        value={isPersonal}
                        onChange={updateIsPersonal}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="motivation"
                    >
                      5. Motivation
                    </label>
                    <textarea
                      id="motivation"
                      placeholder="Motivation"
                      value={motivation}
                      className="form-input w-full px-2 py-1 mb-3"
                      onChange={updateMotivation}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="start-date"
                    >
                      6. Course start date {required}
                    </label>
                    <input
                      id="start-date"
                      value={start}
                      className="form-input w-full mb-3"
                      type="date"
                      min={today}
                      onChange={updateStart}
                    />
                  </div>
                  <Banner2
                    type="error"
                    open={startError}
                    setOpen={setStartError}
                  >
                    {message}
                  </Banner2>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="end-date"
                    >
                      7. Course end date {required}
                    </label>
                    <input
                      id="end-date"
                      value={end}
                      className="form-input w-full mb-3"
                      type="date"
                      min={start}
                      onChange={updateEnd}
                    />
                  </div>
                  <Banner2 type="error" open={endError} setOpen={setEndError}>
                    {message}
                  </Banner2>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="private-kilometers"
                    >
                      8. Course Link {required}
                    </label>
                    <input
                      id="private-kilometers"
                      type={"text"}
                      value={courseLink}
                      className="form-input w-full px-2 py-2 mb-3"
                      placeholder="Course Link"
                      onChange={updateCourseLink}
                    />
                  </div>
                  <Banner2 type="error" open={linkError} setOpen={setLinkError}>
                    {message}
                  </Banner2>
                  <div className="ml-1">
                    <FormControlLabel
                      control={
                        <Checkbox checked={email} onChange={updateEmail} />
                      }
                      label="Send me an email reciept of my responses"
                    />
                  </div>
                  <div>
                    <button
                      class="mt-5 btn bg-rose-500 hover:bg-rose-600 text-white"
                      onClick={validate}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </CardContent>
              <ReaModal
                id="ensure-modal"
                modalOpen={ensureModalOpen}
                setModalOpen={setEnsureModalOpen}
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
                      <div>
                        <div className="text-lg font-semibold text-zinc-800">
                          Are you sure you want to submit ?{" "}
                        </div>
                        <div className="mt-3">
                          <div>
                            1. Course Name:
                            <div className="ml-5 font-semibold text-rose-600">
                              {courseName.length > 15
                                ? courseName.substring(0, 15).concat("...")
                                : courseName}
                            </div>
                          </div>
                          <div>
                            2. Course Description:
                            <div className="ml-5 font-semibold text-rose-600">
                              {courseDesc.length > 15
                                ? courseDesc.substring(0, 15)
                                : courseDesc}
                            </div>
                          </div>
                          <div>
                            3. Cost of course:
                            <div className="ml-5 font-semibold text-rose-600">
                              {coursePrice}
                            </div>
                          </div>
                          <div>
                            4. Personally identified:
                            <div className="ml-5 font-semibold text-rose-600">
                              {isPersonal}
                            </div>
                          </div>
                          <div>
                            5. Motivation:
                            <div className="ml-5 font-semibold text-rose-600">
                              {motivation
                                ? motivation.length > 15
                                  ? motivation.substring(0, 15) + "..."
                                  : motivation
                                : "No Motivation Provided"}
                            </div>
                          </div>
                          <div>
                            6. Start:
                            <div className="ml-5 font-semibold text-rose-600">
                              {new Date(start).toDateString()}
                            </div>
                          </div>
                          <div>
                            7. End:
                            <div className="ml-5 font-semibold text-rose-600">
                              {new Date(end).toDateString()}
                            </div>
                          </div>
                          <div>
                            8. Link:
                            <div className="ml-5 font-semibold text-rose-600">
                              {courseLink.length > 15
                                ? courseLink.substring(0, 15).concat("...")
                                : courseLink}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div></div>
                    {/* Modal footer */}
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnsureModalOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={submitForm}
                      >
                        Yes, Submit
                      </button>
                    </div>
                  </div>
                </div>
              </ReaModal>
              <ReaModal
                id="success-modal"
                modalOpen={success}
                setModalOpen={setSuccess}
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
                        onClick={resetState}
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </div>
              </ReaModal>
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
            </Card>
          </div>
        </div>
      )}
    </div>
    // <div className="mt-2 bg-white border text-center border-zinc-200 rounded-sm shadow-sm">
    //   <div className="flex justify-between mb-10 items-center"></div>
    //   {/* Card header */}
    //   <div className="grow flex justify-center text-center truncate  mb-2">
    //     <div className="truncate text-center"> Please click below for the form</div>
    //   </div>
    //   {/* Card content */}

    //   <button
    //     className="text-rose-500"
    //     onClick={() =>
    //       window.open(
    //         "https://forms.office.com/Pages/ResponsePage.aspx?id=LAlId_hUlUasn9YRQhbBlE-TqUysT6lNuxogIT1-rmtUOVRNTURPSTBMRjBOQURJM0RONU1PWTg2Sy4u",
    //         "_blank"
    //       )
    //     }
    //   >
    //     Open
    //   </button>

    //   {/* Card footer */}
    //   <div className="flex justify-between mb-10 items-center"></div>
    // </div>
  );
}
