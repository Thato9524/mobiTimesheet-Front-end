import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  CardActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import Banner2 from "../../../components/Banner2";
import ModalBlank from "../../../components/ModalBlank";
import ReaModal from "../../../components/ReaModal";
import config from "../../../config";
import request from "../../../handlers/request";
import History from "./histories/History";
import { validNumberInput } from "./Regex";

export default function TravelAllowance() {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [privateError, setPrivateError] = useState(false);
  const [businessError, setBusinessError] = useState(false);
  const [rangeError, setRangeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vehicleRange, setVehicleRange] = useState("");
  const [privateKilo, setPrivateKilo] = useState("");
  const [businessKilo, setBusinessKilo] = useState("");
  const [shouldEmail, setShouldEmail] = useState(true);
  const [history, setHistory] = useState(false);

  const required = <span className="text-rose-500">*</span>;

  //UPDATE FUNCTIONS FOR FIELDS
  function updatePrivateKilo(event) {
    setPrivateKilo(event.target.value);
  }
  function updateBusinessKilo(event) {
    setBusinessKilo(event.target.value);
  }
  function updateShouldEmail(event) {
    setShouldEmail(event.target.checked);
  }
  function updateVehicleRange(event) {
    setVehicleRange(event.target.value);
    console.log(event.target.value);
  }

  //VALIDATE FORM FIELDS
  function validate() {
    if (!vehicleRange) {
      setRangeError(true);
      setErrorMessage("Please select a price range");
      console.log(errorMessage, " ", vehicleRange);
    } else if (!privateKilo) {
      setPrivateError(true);
      setErrorMessage("Please enter a value.");
    } else if (!businessKilo) {
      setBusinessError(true);
      setErrorMessage("Please enter a value.");
    } else if (!validNumberInput.test(privateKilo)) {
      setPrivateError(true);
      setErrorMessage("Value must a be number.");
    } else if (!validNumberInput.test(businessKilo)) {
      setPrivateError(true);
      setErrorMessage("Value must a be number.");
    } else {
      setEnsureModalOpen(true);
    }
  }

  function resetState() {
    setVehicleRange("0-95000");
    setPrivateKilo("");
    setBusinessKilo("");
    setShouldEmail(false);
    setSuccess(false);
    updateHistory();
  }

  //SUBMIT FORM
  async function submitForm() {
    let totalMonthlyKilos = 0,
    totalAnnualKilos = 0;
    totalMonthlyKilos = parseInt(privateKilo) + parseInt(businessKilo);
    totalAnnualKilos = totalMonthlyKilos * 12;

    const _id = localStorage.getItem("_id");

    const req = {
      user: _id,
      vehicleRange: vehicleRange,
      privateKilos: privateKilo,
      businessKilos: businessKilo,
      totalMonthlyKilos: totalMonthlyKilos.toString(),
      totalAnnualKilos: totalAnnualKilos.toString(),
      emailed: shouldEmail,
      created: new Date(),
    };

    try{
    const response = await request.post(
      config.path.profile.requestAllowance,
      req,
      true
    );
    
    if (!response.err) {
      setEnsureModalOpen(false);
      setMessage("Successfully Submitted Request.");
      setSuccess(true);
    } else {
      setEnsureModalOpen(false);
      setMessage(err.message);
      setErrorModalOpen(true);
    }
  }catch(ex){
    setEnsureModalOpen(false);
    setMessage(ex.message);
    setErrorModalOpen(true);
  }
  }
  function closeModal() {
    setEnsureModalOpen(false);
    setErrorModalOpen(false);
    setHistory(true);
  }
  function updateHistory() {
    setHistory(!history);
  }
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
        <History form={"travelAllowance"} />
      ) : (
        <div className="flex justify-center">
          <div className="w-1/2">
            <Card variant="outlined">
              <CardContent>
                <div className="mb-3 pb-4 rounded">
                  <div>Required {required}</div>
                </div>
                <div>
                  <FormControl>
                    <label
                      className="mt-1 block text-sm font-medium mb-1"
                      htmlFor="vehicle-value-range"
                      id="vehicle-value-range"
                    >
                      1. The determined value of your vehicle (the original
                      purchase price including VAT but excluding finance charges
                      and interest) {required}
                    </label>
                    <RadioGroup
                      aria-labelledby="vehicle-value-range"
                      name="vehicle-value-range"
                      onChange={updateVehicleRange}
                    >
                      <FormControlLabel
                        value="0 - 95000"
                        control={<Radio />}
                        label="R 0 - R 95 000"
                      />
                      <FormControlLabel
                        value="95001 - 190000"
                        control={<Radio />}
                        label="R 95 001 - R 190 000"
                      />
                      <FormControlLabel
                        value="190001 - 285000"
                        control={<Radio />}
                        label="R 190 001 - R 285 000"
                      />
                      <FormControlLabel
                        value="285001 - 380000"
                        control={<Radio />}
                        label="R 285 001 - R 380 000"
                      />
                      <FormControlLabel
                        value="380001 - 475000"
                        control={<Radio />}
                        label="R 380 001 - R 475 000"
                      />
                      <FormControlLabel
                        value="475001 - 570000"
                        control={<Radio />}
                        label="R 475 001 - R 570 000"
                      />
                      <FormControlLabel
                        value="570001 - 665000"
                        control={<Radio />}
                        label="R 570 001 - R 665 000"
                      />
                      <FormControlLabel
                        value="> 665000"
                        control={<Radio />}
                        label="Exceeding R 665 000"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <Banner2
                    type="error"
                    open={rangeError}
                    setOpen={setRangeError}
                  >
                    {errorMessage}
                  </Banner2>
                </div>
                <div>
                  <label
                    className="mt-1 block text-sm font-medium mb-1"
                    htmlFor="private-kilometers"
                  >
                    2. Estimated monthly private kilometers {required}
                  </label>
                  <input
                    id="private-kilometers"
                    value={privateKilo}
                    className="form-input w-full px-2 py-1 mb-5"
                    required
                    onChange={updatePrivateKilo}
                  />
                </div>
                <div>
                  <Banner2
                    type="error"
                    open={privateError}
                    setOpen={setPrivateError}
                  >
                    {errorMessage}
                  </Banner2>
                </div>
                <div>
                  <label
                    className="mt-1 block text-sm font-medium mb-1"
                    htmlFor="business-kilometers"
                  >
                    3. Estimated monthly business kilometers {required}
                  </label>
                  <input
                    id="business-kilometers"
                    value={businessKilo}
                    className="form-input w-full px-2 py-1"
                    required
                    onChange={updateBusinessKilo}
                  />
                </div>
                <div>
                  <Banner2
                    type="error"
                    open={businessError}
                    setOpen={setBusinessError}
                  >
                    {errorMessage}
                  </Banner2>
                </div>
                <div className="mt-6">
                  <div className="ml-1">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={shouldEmail}
                          onChange={updateShouldEmail}
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
              </CardContent>
            </Card>
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
                    <div className="text-lg font-semibold text-zinc-800">
                      Are you sure you want to submit these details ?
                    </div>
                    <div className="mt-3">
                      <div>
                        1. Vehicle Value Range:
                        <div className="ml-5 font-semibold text-rose-600">
                          {vehicleRange === "> 665000"
                            ? "More than R 665000"
                            : `R ${vehicleRange}`}
                        </div>
                      </div>
                      <div>
                        2. Estimated montly private kilometers:
                        <div className="ml-5 font-semibold text-rose-600">
                          {privateKilo}
                        </div>
                      </div>
                      <div>
                        3. Estimated monthly business kilometers:
                        <div className="ml-5 font-semibold text-rose-600">
                          {businessKilo}
                        </div>
                      </div>
                    </div>
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
    //         "https://forms.office.com/Pages/ResponsePage.aspx?id=LAlId_hUlUasn9YRQhbBlE-TqUysT6lNuxogIT1-rmtUMjlEUEdNV1BaOTU0NkQ2MFFKQUZSV09LOC4u",
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
