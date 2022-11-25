import  { useState, useEffect } from "react";
import React from "react";

import Image from "../../images/user-avatar-80.png";
import ModalBlank from "../../components/ModalBlank";
import {
  Box,
  createTheme,
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  ThemeProvider,
} from "@mui/material";
import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import Multiselect from "multiselect-react-dropdown";
import Banner2 from "../../components/Banner2";
import config from "../../config";
import { Refresh } from "@mui/icons-material";
import UserAvatar from "../../images/avatar-001.png";
import genders from "../../data/Gender";
import races from "../../data/Race";
const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#f33f5f",
      dark: "#ad2d44",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

function AccountPanel() {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [location, setLocation] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inputs, setInputs] = useState([]);
  const [about, setAbout] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [personalData, setPersonalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [Imageurl, setImageurl] = useState("");
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");

  const resetState = () => {
    setFile({});
    setUpdateModalOpen(false);
    setEnsureModalOpen(false);
    setError(false);
    setSuccess(false);
  };

  async function RefreshAccount(){
    setLoading(true);
    // console.log(localStorage.getItem("_id"));
    let getData = await request.get(
      `${config.path.profile.getProfile}`,
      true
    );
    setPersonalData(getData);
    setInputs(getData.strengthInfo);
    setAbout(getData.personalInfo.about);
    setRace(getData.race ? getData.race : "");
    setId(getData.id ? getData.id : "");
    setGender(getData.gender ? getData.gender : "");
    setIsSubscribed(getData.isSubscribed);
    resetState();
    setLoading(false);
  }

  const updateIsSubscribed = (event) => {
    setIsSubscribed(event.target.checked);
  };
  const submitForm = async () => {
    console.log(personalData);
    let req = {
      about: about,
      city: location,
      strengthInfo: inputs,
      race: race,
      gender: gender,
      id: id,
      isSubscribed: isSubscribed,
    };

    const response = await request.patch(
      config.path.profile.updateProfile.concat(`/${personalData._id}`),
      req,
      true
    );

    if (response.err) {
      setEnsureModalOpen(false);
      setErrorMessage(response.message);
      setErrorModalOpen(true);
      return;
    } else {
      setSuccessMessage("Successfully Updated Profile");
      setSuccess(true);
    }
  };
  useEffect(async () => {
    setLoading(true);
    let _id = localStorage.getItem("_id");
    let getData = await request.get(
      `${config.path.profile.getProfile}/${_id}`,
      true
    );
    let getStrengths = await request.get(config.path.getStrengths);
    setStrengths(
      [].concat.apply(
        //remove []
        [],
        [
          getStrengths.strengths[0].strategicThinking,
          getStrengths.strengths[0].executing,
          getStrengths.strengths[0].influencing,
          getStrengths.strengths[0].relationshipBuilding,
        ]
      )
    );
    setPersonalData(getData);
    setAbout(getData.personalInfo.about);
    setLocation(getData.personalInfo.city);
    setRace(getData.race);
    setId(getData.id);
    setGender(getData.gender);
    setInputs(getData.strengthInfo);
    setIsSubscribed(getData.isSubscribed);
    if(getData.profilePictureKey !== "none"){
      setImageurl(`${config.url}/${config.path.s3.getFile}/${getData.profilePictureKey}`);
    }
    setLoading(false);
  }, [request]);

  const handleChangeUpdate = async (e) => {
    if(e.target.id === "about"){
      setAbout(e.target.value);
    }

    if(e.target.id === "id"){
      setId(e.target.value);
    }

    if(e.target.id === "gender"){
      setGender(e.target.value);
    }

    if(e.target.id === "race"){
      setRace(e.target.value);
    }
    
  };

  const validateForm = () => {
    const validId = new RegExp(
      "/(((d{2}((0[1-9]|[12]d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]d|30)|02(0[1-9]|1d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(d{4})( |-)(d{3})|(d{7}))$"
    );
    if(!id){
      setError(true);
      setErrorMessage("ID is required.");
      return;
    }else if(!about){
      setError(true);
      setErrorMessage("About is required.");
      return;
    }else if(!race){
      setError(true);
      setErrorMessage("Race is required.");
      return;
    }else if(!gender){
      setError(true);
      setErrorMessage("Gender is required.");
      return;
    }else if(!validId.test(id) && id.length !== 13){
      setError(true);
      setErrorMessage("Invalid ID");
      return;
    }else if (about.length < 5) {
      setError(true);
      setErrorMessage("About cannot be less than 5 characters");
      return;
    } else if (inputs.length < 5) {
      setError(true);
      setErrorMessage("Strengths cannot be less than 5");
      return;
    } else {
      setEnsureModalOpen(true);
      return;
    }
  };
  async function updateFile(event) {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    
    await submitPicture(event.target.files[0]);
  }

  async function submitPicture(file) {
    setLoading(true);
    //MAKE PDF OR IMAGE FORM DATA
    const _id = localStorage.getItem("_id");
    let formData = new FormData();
    formData.append("file", file);
    let fileSubmitted = await request.post(
      config.path.s3.uploadFile,
      formData,
      true
      
    );
    if (!fileSubmitted.err) {
      let fileKey = fileSubmitted.fileKey;
      setImageurl(`${config.url}/${config.path.s3.getFile}/${fileKey}`)

      var req = {
        user: _id,
        profilePictureKey: fileKey,   
      };

      const response = await request.post(
        config.path.users.updateProfilePicture,
        req,
        true,
      );
      if (!response.err) {
        setLoading(false);
        setMessage("Updated profile picture");
        console.log(response);
      } else {
        setLoading(false);
        setMessage("unable to update profile picture try again please");
        setErrorModalOpen(true);
      }
    } else {
      setLoading(false);
      setMessage(fileSubmitted.message);
      setErrorModalOpen(true);
    }
  }
  function updateHistory() {
    setHistory(!history);
  }
  


  return (
    <div className="grow">
      {/* Panel body */}
      {loading ? <PreLoader/> :<div className="p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Update Profile</h2>
        {/* Picture */}
        <section>
          <div className="flex items-center">
            <div className="mr-4">
              <img
                className="w-20 h-20 rounded-full"
                src={Imageurl ? Imageurl: UserAvatar}
                width="80"
                height="80"
                alt="User upload"
              />
            </div>
            <div >
            <input type="file" onChange={updateFile} />
            <div>
            (Max File Size: <span className="text-red-500 font-bold">10</span> MB)
            </div>
            </div>
           
          </div>
          <div>Click 'Choose File' to update your profile picture.</div>
        </section>
        {/* Business Profile */}
        <section>
          {/* <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">
            Update Profile
          </h2> */}
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <ThemeProvider theme={theme}>
                <div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="birthDate"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      defaultValue={location}
                      className="form-select w-full"
                      onChange={(e) => {
                        setLocation(e.target.value);
                        // console.log(e.target.value);
                      }}
                    >
                      <option value="Johannesburg">Johannesburg</option>
                      <option value="Cape Town">Cape Town</option>
                      <option value="Sydney">Sydney</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="about"
                      >
                        About Me
                      </label>
                      <textarea
                        id="about"
                        value={about}
                        className="form-input w-full px-2 py-1"
                        required
                        onChange={handleChangeUpdate}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="id"
                      >
                        ID Number
                      </label>
                      <input
                        id="id"
                        placeholder="eg. 1234567890123"
                        value={id ? id : null}
                        className="form-input w-full px-2 py-1"
                        type={"text"}
                        onChange={handleChangeUpdate}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="gender"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        className="form-select w-full"
                        onChange={handleChangeUpdate}
                        value={gender ? gender : null}
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
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="gender"
                      >
                        Race
                      </label>
                      <select
                        id="race"
                        className="form-select w-full"
                        onChange={handleChangeUpdate}
                        value={race ? race : null}
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
                  </div>
                  <div className="grid grid-cols-1 gap-2 mb-2">
                    <div>
                      <label
                        className="mt-1 block text-sm font-medium mb-1"
                        htmlFor="about"
                      >
                        Strengths
                      </label>
                      <Multiselect
                        className=" w-full mt-2"
                        id="strengths"
                        name="strengths"
                        style={{ chips: { background: "#f43f5e" } }}
                        showArrow
                        options={strengths}
                        value={strengths}
                        isObject={false}
                        selectedValues={inputs}
                        selectionLimit={5}
                        hidePlaceholder={true}
                        onKeyPressFn={(e) => {
                          e.key === "Enter" && e.preventDefault();
                        }}
                        onSelect={(e) => {
                          setInputs(e);
                          // console.log("inputs: ", inputs);
                        }}
                        onRemove={(e) => {
                          setInputs(e);
                          // console.log("inputs: ", inputs);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Banner2 type="error" open={error} setOpen={setError}>
                      {errorMessage}
                    </Banner2>
                  </div>
                </div>
              </ThemeProvider>
              <ModalBlank
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
                        Are you sure you want update your profile ?
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
                        Yes, Update it
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBlank>
              <ModalBlank
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
                        Error: {errorMessage}
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={() => setErrorModalOpen(false)}
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
                        {successMessage}
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={RefreshAccount}
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBlank>
            </div>
          </div>
        </section>
      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button
              className="btn border-slate-200 hover:border-slate-300 text-slate-600"
              onClick={resetState}
            >
              Cancel
            </button>
            <button
              className="btn bg-rose-500 hover:bg-rose-600 text-white ml-3"
              onClick={() => {
                validateForm(about, inputs);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </footer>
      </div>}
    </div>
  );
}

export default AccountPanel;
