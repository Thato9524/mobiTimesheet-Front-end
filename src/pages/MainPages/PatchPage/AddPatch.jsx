import { Card, CardContent } from "@mui/material";
import React from "react";
import { useState } from "react";
import PreLoader from "../../../components/PreLoader";
import ModalBlank from "../../../components/ModalBlank";
import config from "../../../config";
import request from "../../../handlers/request";
import { NavLink } from "react-router-dom";

export default function AddPatch() {
  //FUNCTIONAL STATE VARIABLES
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //VALUE-BASED STATE VARIABLES
  const today = new Date().toISOString().substring(0, 10);
  const [headerIndex, setHeaderIndex] = useState(0);
  const [changeIndex, setChangeIndex] = useState(0);
  const [version, setVersion] = useState("");
  const [date, setDate] = useState(today);
  const [patches, setPatches] = useState([
    {
      id: headerIndex,
      header: "",
      changes: [{ id: `${changeIndex} ${headerIndex}`, message: "" }],
    },
  ]);

  //UPDATE VERSIONS
  function updateVersion(e) {
    setVersion(e.target.value);
  }

  //UPDATE DATE
  function updateDate(e) {
    setDate(e.target.value);
  }

  //UPDATE PATCH
  function updateHeader(e) {
    let _patches = [...patches];
    const index = patches.findIndex(
      (patch) => patch.id === parseInt(e.target.id)
    );
    _patches[index].header = e.target.value;
    setPatches(_patches);
  }

  //UPDATE PATCH CHANGE INPUT
  function updateInput(e) {
    const id = e.target.id;
    const headerId = parseInt(id.substring(id.lastIndexOf(" ") + 1, id.length));

    const pIndex = patches.findIndex((patch) => patch.id === headerId);
    const cIndex = patches[pIndex].changes.findIndex(
      (change) => change.id === id.toString()
    );

    let _patches = [...patches];
    _patches[pIndex].changes[cIndex].message = e.target.value;
    setPatches(_patches);
  }

  //ADD A NEW PATCH
  function addPatch() {
    let _patches = [...patches];
    setHeaderIndex(headerIndex + 1);
    setChangeIndex(changeIndex + 1);
    _patches.push({
      id: headerIndex + 1,
      header: "",
      changes: [
        {
          id: `${changeIndex + 1} ${headerIndex + 1}`,
          message: "",
        },
      ],
    });
    setPatches(_patches);
  }

  //ADD A NEW PATCH CHANGE
  function addChange(e) {
    const id = e.currentTarget.id;
    let _patches = [...patches];
    const headerId = parseInt(id.substring(id.lastIndexOf(" ") + 1, id.length));

    setChangeIndex(changeIndex + 1);
    const index = patches.findIndex((patch) => patch.id === headerId);

    _patches[index].changes.push({
      id: `${changeIndex + 1} ${_patches[index].id}`,
      message: "",
    });
    setPatches(_patches);
  }

  //REMOVE A PATCH
  function removePatch(e) {
    const patchId = parseInt(e.currentTarget.id);
    if (patches.length !== 1) {
      let _patches = [...patches];
      _patches = _patches.filter((patch) => patch.id !== patchId);
      setPatches(_patches);
    }
  }

  //REMOVE A PATCH CHANGE
  function removeChange(e) {
    const id = e.currentTarget.id;
    const patchId = parseInt(id.substring(id.lastIndexOf(" ") + 1, id.length));
    const changeId = parseInt(id.substring(0, id.lastIndexOf(" ")));

    const pIndex = patches.findIndex((patch) => patch.id === patchId);
    const cIndex = patches[pIndex].changes.findIndex(
      (change) => change.id === changeId
    );

    if (patches[pIndex].changes.length !== 1) {
      let _patches = [...patches];
      _patches[pIndex].changes.splice(_patches[pIndex].changes[cIndex], 1);
      setPatches(_patches);
    }
  }

  function validate() {
    let valid = true;
    if (!version) {
      setError(true);
      setMessage(`Validation Error: Version is empty.`);
      return;
    } else if (!date) {
      setError(true);
      setMessage(`Validation Error: Date is required.`);
      return;
    } else {
      patches.forEach((patch) => {
        if (!patch.header || patch.header.length < 5) {
          setError(true);
          setMessage(
            `Validation Error: Patch header id: "${patch.id}" is either empty or invalid.`
          );
          return (valid = false);
        }
        if (!valid) {
          return;
        }

        patch.changes.forEach((change) => {
          if (!change.message || change.message.length < 5) {
            setError(true);
            setMessage(
              `Validation Error: Change under ${patch.header} is either empty or invalid.`
            );
            return (valid = false);
          }
        });
        if (!valid) {
          return;
        }
      });
      if (!valid) {
        return;
      }
      submitPatch();
    }
  }

  async function submitPatch() {
    const req = {
      version: version,
      releaseDate: new Date(date),
      data: patches,
    };
    const response = await request.post(
      config.path.patchNotes.addPatch,
      req,
      true
    );

    if (response.err) {
      setError(true);
      setMessage("Error: Internal Server Error. Please Try Again");
    } else {
      setSuccess(true);
      setMessage(response);
    }
  }

  function resetState() {
    setLoading(true);
    setError(false);
    setMessage("");
    setVersion("");
    setDate(today);
    setHeaderIndex(0);
    setChangeIndex(0);
    setPatches([
      {
        id: 0,
        header: "",
        changes: [{ id: `${0} ${0}`, message: "" }],
      },
    ]);
    setSuccess(false);
    setLoading(false);
  }
  return (
    <div>
      {loading ? (
        <PreLoader />
      ) : (
        <div>
          <ModalBlank
            id="error-modal"
            modalOpen={error}
            setModalOpen={setError}
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
                    onClick={() => setError(false)}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
          <ModalBlank
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
                  <NavLink
                    end
                    to={`/patchNotes/${version}`}
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Okay
                  </NavLink>
                </div>
              </div>
            </div>
          </ModalBlank>
          <div className="px-2 sm:px-4 lg:px-8 py-4 mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
              Add Patch Notes
            </h1>
          </div>
          <div className="flex justify-center mt-5 w-full">
            <Card variant="outlined">
              <CardContent>
                <div>
                  <label
                    className="mt-3 block text-sm font-medium mb-1"
                    htmlFor="version"
                  >
                    Version
                  </label>
                  <div className="flex items-stretch items-center">
                    <input
                      type={"input"}
                      placeholder="eg. 1.3.3"
                      id="releaseDate"
                      className="form-input w-1/2 px-2 py-0.5"
                      onChange={updateVersion}
                    />
                  </div>
                  <label
                    className="mt-3 block text-sm font-medium mb-1"
                    htmlFor="releaseDate"
                  >
                    Release Date
                  </label>
                  <div className="flex items-stretch items-center">
                    <input
                      type={"date"}
                      min={date}
                      id="releaseDate"
                      className="form-input w-1/2 px-2 py-0.5"
                      onChange={updateDate}
                    />
                  </div>
                </div>
                {patches.map((patch) => (
                  <div
                    key={patch.id}
                    className="grid grid-cols-2 gap-4 items-center"
                  >
                    <div>
                      <label
                        className="mt-3 block text-sm font-medium mb-1"
                        htmlFor="header"
                      >
                        Header
                      </label>
                      <div className="flex items-stretch items-center">
                        <input
                          type="input"
                          id={patch.id}
                          placeholder="eg. Dashboard"
                          name="header"
                          className="form-input w-full px-2 py-0.5"
                          onChange={updateHeader}
                        />
                        <div className="shrink items-center ml-2">
                          <button
                            className="p-1 btn bg-rose-500 hover:bg-rose-600 text-white"
                            onClick={addPatch}
                          >
                            <svg
                              className="w-4 h-4 shrink-0 fill-current text-white"
                              viewBox="0 0 24 24"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            >
                              <path d="M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm.5 10h6v1h-6v6h-1v-6h-6v-1h6v-6h1v6z" />
                            </svg>
                          </button>
                        </div>
                        <div className="shrink items-center ml-2">
                          <button
                            id={patch.id}
                            className={`p-1 btn bg-rose-500 hover:bg-rose-600 text-white`}
                            onClick={removePatch}
                            disabled={patches.length === 1 ? true : false}
                          >
                            <svg
                              className="w-4 h-4 shrink-0 fill-current text-white"
                              viewBox="0 0 24 24"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            >
                              <path
                                d={`M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm-6.5 10h13v1h-13v-1z`}
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {patch.changes.map((change) => (
                        <React.Fragment>
                          <div>
                            <label
                              className="mt-3 block text-sm font-medium mb-1"
                              htmlFor="issue"
                            >
                              Change
                            </label>
                            <div className="flex inline items-center">
                              <textarea
                                id={change.id}
                                name="review"
                                placeholder="eg. Fixed something"
                                className="form-input w-full px-2 py-0.5 mt-2"
                                onChange={updateInput}
                              />
                              <div className="shrink items-center ml-2">
                                <button
                                  id={change.id}
                                  className="p-1 btn bg-rose-500 hover:bg-rose-600 text-white"
                                  onClick={addChange}
                                >
                                  <svg
                                    className="w-4 h-4 shrink-0 fill-current text-white"
                                    viewBox="0 0 24 24"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                  >
                                    <path d="M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm.5 10h6v1h-6v6h-1v-6h-6v-1h6v-6h1v6z" />
                                  </svg>
                                </button>
                              </div>
                              <div className="shrink items-center ml-2">
                                <button
                                  id={change.id}
                                  className={`p-1 btn bg-rose-500 hover:bg-rose-600 text-white`}
                                  onClick={removeChange}
                                >
                                  <svg
                                    className="w-4 h-4 shrink-0 fill-current text-white"
                                    viewBox="0 0 24 24"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                  >
                                    <path
                                      d={`M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm-6.5 10h13v1h-13v-1z`}
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-2">
                  <button
                    className={`p-1 btn bg-rose-500 hover:bg-rose-600 text-white`}
                    onClick={validate}
                  >
                    Submit
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
