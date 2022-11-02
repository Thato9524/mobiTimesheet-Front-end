import { Card, CardContent, Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import genders from "../../../data/Gender";
import venues from "../../../data/Venue";
import races from "../../../data/Race";
import PreLoader from "../../../components/PreLoader";
import request from "../../../handlers/request";
import config from "../../../config";
import Banner2 from "../../../components/Banner2";
import ReaModal from "../../../components/ReaModal";
import History from "./histories/History";

export default function SkillsFriday({ trainingDays, user, isTrainingDay }) {
  const [history, setHistory] = useState(false);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [emailed, setEmailed] = useState(true);
  const updateInputs = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const validate = () => {
    const validId = new RegExp(
      "/(((d{2}((0[1-9]|[12]d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]d|30)|02(0[1-9]|1d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(d{4})( |-)(d{3})|(d{7}))$"
    );
    if (!inputs.trainingDay) {
      setMessage("Training Day is required");
      setError(true);
      return;
    } else if (!inputs.gender && !user.gender) {
      setMessage("Gender is required");
      setError(true);
      return;
    } else if (!inputs.race && !user.race) {
      setMessage("Race is required");
      setError(true);
      return;
    } else if (!inputs.id && !user.id) {
      setMessage("ID is required");
      setError(true);
      return;
    } else if (!user.id ? !validId.test(inputs.id) && inputs.id.length !== 13 : !user.id) {
      setMessage("Invalid ID.");
      setError(true);
    } else if (!inputs.attendance) {
      setMessage("Attendance is required");
      setError(true);
      return;
    } else {
      setError(false);
      setEnsureModalOpen(true);
    }
  };
  async function submitForm() {
    setModalLoading(true);
    try {
      let req;
      if(user.id){
        req = {
          ...inputs,
          gender: user.gender,
          race: user.race,
          id: user.id,
          emailed: emailed,
        };
      }else{
       req = {
          ...inputs,
          emailed: emailed,
        };
      }
      
      let response = await request.post(
        config.path.profile.addAttendance,
        req,
        true
      );
      if (response.err) {
        setModalLoading(false);
        setMessage(response.error.message);
        setErrorModalOpen(true);
        return;
      }
      setModalLoading(false);
      setMessage(response);
      setSuccess(true);
    } catch (err) {
      setModalLoading(false);
      setMessage(err.error.message);
      setErrorModalOpen(true);
    }
  }
  const resetState = () => {
    setError(false);
    setSuccess(false);
    setEnsureModalOpen(false);
    setMessage("");
    setInputs({});
    clearInputs();
  };
  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );

    Array.from(document.querySelectorAll("select")).forEach(
      (select) => (select.selectedIndex = 0) //reset input
    );
  };
  const required = <span className="text-rose-500">*</span>;
  const informationIcon = (
      <div className="flex justify-end">
        <Tooltip title="Change details in Account tab of Settings">
        <svg
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          className="w-6 h-6 fill-current text-sky-500"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 6.5c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z"
          />
        </svg>
        </Tooltip>
      </div>
  );
  return (
    <div>
      <div className="flex justify-end mr-5">
        <button
          className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
          onClick={() => setHistory(!history)}
        >
          {!history ? (
            "History"
          ) : (
            <div className="flex justify-center">Back to form</div>
          )}
        </button>
      </div>
      {loading ? (
        <PreLoader />
      ) : history ? (
        <History form="skillsFriday" />
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-1/2">
              <ReaModal
                id={"ensure-modal"}
                modalOpen={ensureModalOpen}
                setModalOpen={setEnsureModalOpen}
              >
                <>
                  {modalLoading ? (
                    <PreLoader />
                  ) : (
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
                                1. Training Day:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.trainingDay &&
                                  inputs.trainingDay.length > 35
                                    ? inputs.trainingDay
                                        .substring(0, 30)
                                        .concat("...")
                                    : inputs.trainingDay}
                                </div>
                              </div>
                              <div>
                                2. Gender:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.gender ? inputs.gender : user.gender}
                                </div>
                              </div>
                              <div>
                                3. Race:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.race ? inputs.race : user.race}
                                </div>
                              </div>
                              <div>
                                4. ID Number:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.id ? inputs.id : user.id}
                                </div>
                              </div>
                              <div>
                                5. Attendance:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.attendance}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5">
                          <Banner2
                            type="error"
                            open={errorModalOpen}
                            setOpen={setErrorModalOpen}
                          >
                            {message}
                          </Banner2>
                        </div>
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
                  )}
                </>
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
              {isTrainingDay ? <Card>
                <CardContent>
                  <div className="mb-3 pb-4 rounded">
                    <div className="flex justify-between">
                      <div>Required {required}</div>
                      {user && user.gender ? informationIcon : ""}
                    </div>
                  </div>
                  <div>
                    <div>
                      <label
                        className="mt-3 block text-sm font-medium mb-1"
                        htmlFor="id"
                      >
                        1. Training Day {required}
                      </label>
                      <select
                        id="trainingDay"
                        className="form-select w-full"
                        onChange={updateInputs}
                      >
                        <option disabled selected value>
                          Select Training Day
                        </option>
                        {trainingDays &&
                          trainingDays.sort().map((trainingDay) => (
                            <>
                              <option value={trainingDay.desc}>
                                {trainingDay.desc}
                              </option>
                            </>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="amount"
                      >
                        2. Gender {required}
                      </label>
                      <select
                        id="gender"
                        className="form-select w-full"
                        onChange={updateInputs}
                        value={user && user.gender ? user.gender : null}
                        disabled={user && user.gender ? true : false}
                      >
                        <option disabled selected value>
                          Select Gender
                        </option>
                        {genders &&
                          genders.sort().map((gender) => (
                            <>
                              <option value={gender}>{gender}</option>
                            </>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="mt-3 block text-sm font-medium mb-1"
                        htmlFor="amount"
                      >
                        3. Race {required}
                      </label>
                      <select
                        id="race"
                        className="form-select w-full"
                        onChange={updateInputs}
                        value={user && user.race ? user.race : null}
                        disabled={user && user.race ? true : false}
                      >
                        <option disabled selected value>
                          Select Race
                        </option>
                        {races &&
                          races.sort().map((race) => (
                            <>
                              <option value={race}>{race}</option>
                            </>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="mt-3 block text-sm font-medium mb-1"
                        htmlFor="id"
                      >
                        4. ID Number {required}
                      </label>
                      <input
                        id="id"
                        placeholder="eg. 0123456789123"
                        type="text"
                        className="appearance-none form-input w-full px-2 py-2"
                        onChange={updateInputs}
                        value={user && user.id ? user.id : null}
                        disabled={user && user.id ? true : false}
                      />
                    </div>
                    <div>
                      <label
                        className="mt-3 block text-sm font-medium mb-1"
                        htmlFor="attendance"
                      >
                        5. Attendance Type {required}
                      </label>
                      <select
                        id="attendance"
                        className="form-select w-full"
                        onChange={updateInputs}
                        value={user && user.attendance ? user.attendance : null}
                        disabled={user && user.attendance ? true : false}
                      >
                        <option disabled selected value>
                          Select Attendance Type
                        </option>
                        <option value="In-Person">In-Person</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                    <div className="mt-6">
                      <Banner2 type="error" open={error} setOpen={setError}>
                        {message}
                      </Banner2>
                    </div>
                    <div className="mt-3">
                      {/* <div className="ml-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="emailed"
                            checked={emailed}
                            onChange={() => setEmailed(!emailed)}
                          />
                        }
                        label="Send me an email reciept of my responses"
                      />
                    </div> */}
                      <div>
                        <button
                          className="mt-5 btn bg-rose-500 hover:bg-rose-600 text-white"
                          onClick={validate}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> : <div className="mt-5 flex justify-center text-zinc-400 text-xl">
                  <h1>No Training Today</h1>
                </div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
