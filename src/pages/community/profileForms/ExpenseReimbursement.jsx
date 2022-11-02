import { Card, CardContent, Checkbox, FormControlLabel } from "@mui/material";
import { isJwtExpired } from "jwt-check-expiration";
import React from "react";
import { useState } from "react";
import { useFilePicker } from "use-file-picker";
import Banner2 from "../../../components/Banner2";
import ReaModal from "../../../components/ReaModal";
import config from "../../../config";
import request from "../../../handlers/request";
import History from "./histories/History";
import PreLoader from "../../../components/PreLoader"
import { useEffect } from "react";
import { AuthContext } from "../../../App";

export default function ExpenseReimbursement() {
  //TODAY VARIABLE STRING
  const today = new Date().toISOString().substring(0, 10);

  //ERROR/SUCCESS STATE VARIABLES
  const [message, setMessage] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [vatError, setVatError] = useState(false);
  const [transError, setTransError] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  //STATE VARIABLES
  const [emailed, setEmailed] = useState(true);
  const { dispatch } = React.useContext(AuthContext);
  const [inputs, setInputs] = useState([
    {
      transactionDate: "",
      amount: "",
      vat: "",
      reason: "",
    },
  ]);
  const [history, setHistory] = useState(false);
  const [
    openFileSelector,
    { filesContent, loading, errors, plainFiles, clear },
  ] = useFilePicker({
    multiple: true,
    readAs: "ArrayBuffer", // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
    // accept: '.ics,.pdf',
    accept: [".pdf", ".png", ".jpeg", ".jpg"],
    limitFilesConfig: { min: 1, max: 5 },
    // minFileSize: 1, // in megabytes
    maxFileSize: 10,
    // readFilesContent: false, // ignores file content
  });

 //FUNCTION TO CHECK TOKENS
 const checkToken = async () => {
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

useEffect(()=>{
  checkToken();
}, [])
  //UPDATE FUNCTIONS
  function updateInputs(e) {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const updateEmailed = (e) => {
    setEmailed(e.target.checked);
  };

  function resetState() {
    setInputs([
      {
        transactionDate: "",
        amount: "",
        vat: "",
        reason: "",
      },
    ]);
    clear();
    setEnsureModalOpen(false);
    setSuccess(false);
    updateHistory();
  }
  function closeModal() {
    setErrorModalOpen(false);
  }
  //BUTTON FUNCTIONS
  function validate() {
    if (inputs.amount <= 0) {
      setAmountError(true);
      setMessage("Amount is required.");
    } else if (!inputs.transactionDate) {
      setTransError(true);
      setMessage("Date is required.");
    } else if (inputs.vat < 0 || !inputs.vat) {
      setVatError(true);
      setMessage("VAT is required.");
    } else if (!inputs.reason) {
      setReasonError(true);
      setMessage("Reason is required.");
    } else if (inputs.reason.length < 5) {
      setReasonError(true);
      setMessage("Reason must be 5 or more charachters.");
    } else if (!plainFiles.length) {
      setFileError(true);
      setMessage("File is required.");
    } else {
      setEnsureModalOpen(true);
    }
  }
  async function submitForm() {
    setModalLoading(true);
    //MAKE PDF OR IMAGE FORM DATA
    const _id = localStorage.getItem("_id");
    let fileKeys = [];
    let id = 0;

    try {
      for (const file of plainFiles) {
        let formData = new FormData();
        formData.append("file", file);
        let fileSubmitted = await request.post(
          config.path.s3.uploadFile,
          formData,
          true
        );
        if (!fileSubmitted.err) {
          fileKeys.push({
            id: id++,
            fileName: fileSubmitted.fileName,
            fileKey: fileSubmitted.fileKey
          });
        } else {
          setMessage(fileSubmitted.message);
          setErrorModalOpen(true);
          throw new Error(fileSubmitted.message);
        }
      }
      var req = {
        user: _id,
        transactionDate: inputs.transactionDate,
        amount: inputs.amount,
        vat: inputs.vat,
        reason: inputs.reason,
        fileKeys: fileKeys,
        emailed: emailed,
        created: new Date(),
      };

      const response = await request.post(
        config.path.profile.requestReimbursement,
        req,
        true
      );
      if (!response.err) {
        setModalLoading(false);
        setMessage(response.message);
        setSuccess(true);
      } else {
        setModalLoading(false);
        setMessage(response.message);
        setErrorModalOpen(true);
      }
    } catch (ex) {
      setModalLoading(false);
      setErrorModalOpen(true);
      setMessage(ex.message);
      setEnsureModalOpen(false);
    }
  }
  function updateHistory() {
    setHistory(!history);
  }

  //JSX FOR REQUIRED
  const required = <span className="text-rose-500">*</span>;

  //FILEPICKER STUFF
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
        <History form="expenseReimbursement" />
      ) : (
        <div className="flex justify-center">
          <div className="w-1/2">
            <Card variant="outlined">
              <CardContent>
                <div className="mb-3 pb-4 rounded">
                  <div>Required {required}</div>
                </div>
                <div className="mb-1">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="transactionDate"
                    >
                      1. Date of transaction {required}
                    </label>
                    <input
                      id="transactionDate"
                      className="form-input w-full mb-2"
                      type="date"
                      max={today}
                      onChange={updateInputs}
                    />
                  </div>
                  <Banner2
                    type="error"
                    open={transError}
                    setOpen={setTransError}
                  >
                    {message}
                  </Banner2>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="amount"
                    >
                      2. Amount requested for reimbursement {required}
                    </label>
                    <input
                      id="amount"
                      placeholder="eg. 25"
                      type="number"
                      min="0"
                      className="appearance-none form-input w-full px-2 py-2 mb-5"
                      onChange={updateInputs}
                    />
                  </div>
                  <div>
                    <Banner2
                      type="error"
                      open={amountError}
                      setOpen={setAmountError}
                    >
                      {message}
                    </Banner2>
                  </div>
                  <div className="mb-1">
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="vat"
                    >
                      3. VAT amount (if applicable) {required}
                    </label>
                    <input
                      id="vat"
                      placeholder="eg. 1"
                      type="number"
                      className="form-input w-full px-2 py-2 mb-5"
                      onChange={updateInputs}
                    />
                  </div>
                  <div>
                    <Banner2 type="error" open={vatError} setOpen={setVatError}>
                      {message}
                    </Banner2>
                  </div>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="reason"
                    >
                      4. Reason for purchase {required}
                    </label>
                    <textarea
                      id="reason"
                      placeholder="eg. C3 related event"
                      className="form-input w-full px-2 py-1 mb-3"
                      onChange={updateInputs}
                    />
                  </div>
                  <div>
                    <Banner2
                      type="error"
                      open={reasonError}
                      setOpen={setReasonError}
                    >
                      {message}
                    </Banner2>
                  </div>
                  <div>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="upload"
                    >
                      5. Upload a copy of your invoice/receipt (Max files: <span className="text-red-500 font-bold">5</span>) (Max File Size: <span className="text-red-500 font-bold">10</span> MB):
                    </label>
                    <div className="custom-file-upload">
                      {!errors.length ? (
                        <>
                          <div>
                            <button
                              className="bg-zinc-200 p-1 rounded mr-3"
                              onClick={() => openFileSelector()}
                            >
                              Select files
                            </button>
                            {plainFiles.length > 0 && <button
                              className="bg-zinc-200 p-1 rounded"
                              onClick={() => clear()}
                            >
                              Clear
                            </button>}
                            {/* If readAs is set to DataURL, You can display an image */}
                            <div  className="flex flex-row">
                              {plainFiles.length > 0 ? (
                                <div className="mt-3 p-1">Selected Files: </div>
                              ) : (
                                ""
                              )}
                              <div className="mt-3">
                                {plainFiles.map((file) => (
                                  <div
                                    key={file.name}
                                    className="p-1 rounded-full bg-rose-500 text-white text-sm w-fit mb-1 mr-2"
                                  >
                                    {file.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <button className="bg-zinc-200 p-1 rounded mr-3" onClick={() => openFileSelector()}>
                              Retry{" "}
                            </button>
                            {errors[0].readerError &&
                              "Problem occured while reading file!"}
                            {errors[0].fileSizeToolarge && 'File size is too large!'}
                            {errors[0].maxLimitExceeded && "Too many files selected"}
                            {errors[0].minLimitNotReached && "Not enough files"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <Banner2
                      type="error"
                      open={fileError}
                      setOpen={setFileError}
                    >
                      {message}
                    </Banner2>
                  </div>
                  <div className="mt-6">
                    <div className="ml-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="emailed"
                            checked={emailed}
                            onChange={updateEmailed}
                          />
                        }
                        label="Send me an email reciept of my responses"
                      />
                    </div>
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
                                1. Date of transaction:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {new Date(
                                    inputs.transactionDate
                                  ).toDateString()}
                                </div>
                              </div>
                              <div>
                                2. Amount:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.amount}
                                </div>
                              </div>
                              <div>
                                3. VAT:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.vat}
                                </div>
                              </div>
                              <div>
                                4. Reason:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {inputs.reason && inputs.reason.length > 15
                                    ? inputs.reason
                                        .substring(0, 15)
                                        .concat("...")
                                    : inputs.reason}
                                </div>
                              </div>
                              <div>
                                5. Files:
                                <div className="ml-5 font-semibold text-rose-600">
                                  {plainFiles.map((file) => <div>{file.name}</div>)}
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
              <ReaModal
                id="error-modal"
                modalOpen={errorModalOpen}
                setModalOpen={setErrorModalOpen}
              >
                <div className="p-5 flex space-x-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-5">
                      <div className="text-lg font-semibold text-zinc-800">
                        {message}
                      </div>
                    </div>
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
    //     <div className="truncate text-center">
    //       Please click below for the form
    //     </div>
    //   </div>
    //   {/* Card content */}

    //   <button
    //     className="text-rose-500"
    //     onClick={() =>
    //       window.open(
    //         "https://forms.office.com/Pages/ResponsePage.aspx?id=LAlId_hUlUasn9YRQhbBlE-TqUysT6lNuxogIT1-rmtUQ0ExUVY0UDk5SEdSRUxWM0ozNFZaWFgwMC4u",
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
