import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";

import OnboardingImage from "../../images/onboarding-image.jpg";
import OnboardingDecoration from "../../images/auth-decoration.png";
import Banner2 from "../../components/Banner2";
import config from "../../config";
import request from "../../handlers/request";
import { AuthContext } from "../../App";
import { ChipList } from "@progress/kendo-react-buttons";

function Onboarding04() {
  const navigateTo = useNavigate();
  const [inputs, setInputs] = useState([]);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [success, setSuccess] = useState(false);
  const { dispatch } = React.useContext(AuthContext);

  const handleNext = async () => {
    //    e.preventDefault();
    // console.log("handle");

    let validate = await validateInputs(inputs);
    if (!validate.valid) {
      setError(true);
      setErrorMessage(validate.msg);
      return;
    }
    let uploadData = await localStorage.getItem("onboarding");
    /*await localStorage.setItem(
      "onboarding",
      JSON.stringify({
        ...JSON.parse(uploadData),
        strengthInfo: inputs,
      })
    );*/
    // console.log("uploadData: ", uploadData);

    uploadData = { ...JSON.parse(uploadData), ...inputs };
    // console.log("uploadData: ", uploadData);

    let names = uploadData.loginDetails.name.replace(/\s\s+/g, " ");
    let cleanData = {
      type: uploadData.type,
      techId: uploadData.techId,
      personalInfo: {
        firstName: names.split(" ")[0],
        lastName: names.split(" ")[1], //
        about: uploadData.personalInfo.about,
        birthDate: uploadData.personalInfo.birthDate,
        joinedDate: uploadData.personalInfo.joinedDate,
        title: uploadData.personalInfo.title,
        city: uploadData.personalInfo.city,
      },
      race: uploadData.race,
      id: uploadData.id,
      gender: uploadData.gender,
      start: uploadData.start,
      end: uploadData.end,
      strengthInfo: inputs,
      email: uploadData.loginDetails.user,
    };

    // console.log("cleanData: ", cleanData);

    //REGISTER NEW USER WITH DATA COLLECTED
    let upload = await request.post(config.path.register, cleanData, false);

    // console.log("upload------:", upload);

    if (upload.err) {
      setError(true);
      setErrorMessage(upload.error.message);
      return;
    }
    setSuccess(true);
    setError(false);

    //LOGIN THE NEW USER TO GET DATA AND
    let login = await request.post(
      config.path.loginMicrosft,
      uploadData.loginDetails,
      false
    );
    //SET THE DATA TO LOCAL STORAGE
    localStorage.setItem("auth-token", login.token);
    localStorage.setItem("_id", login._id);
    localStorage.setItem("adminTag", login.adminTag);
    localStorage.setItem("repTag", login.repTag);

    //AUTOMATICALLY LOGIN
    setTimeout(() => {
      dispatch({
        type: "LOGIN",
        payload: {
          user: uploadData.loginDetails.user,
          token: uploadData.loginDetails.token,
        },
      });
    }, 2000);

    navigateTo("/");
  };
  useEffect(async () => {
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
  }, []);

  return (
    <main className="bg-white">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo 
                <Link className="block" to="/">*/}
                <img
                  //className="rounded-full"
                  src="https://i.ibb.co/fvGBWTW/c3-small-dark.png"
                  width="80"
                  height="80"
                  alt=""
                />{" "}
                {/* 
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient
                        x1="28.538%"
                        y1="20.229%"
                        x2="100%"
                        y2="108.156%"
                        id="logo-a"
                      >
                        <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                        <stop stopColor="#A5B4FC" offset="100%" />
                      </linearGradient>
                      <linearGradient
                        x1="88.638%"
                        y1="29.267%"
                        x2="22.42%"
                        y2="100%"
                        id="logo-b"
                      >
                        <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                        <stop stopColor="#38BDF8" offset="100%" />
                      </linearGradient>
                    </defs>
                    <rect fill="#6366F1" width="32" height="32" rx="16" />
                    <path
                      d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                      fill="#4F46E5"
                    />
                    <path
                      d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                      fill="url(#logo-a)"
                    />
                    <path
                      d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                      fill="url(#logo-b)"
                    />
                  </svg>
                </Link>*/}
                {/*<div className="text-sm">
                  Have an account?{" "}
                  <Link
                    className="font-medium text-rose-500 hover:text-rose-600"
                    to="/signin"
                  >
                    Sign In
                  </Link>
              </div>*/}
              </div>

              {/* Progress bar */}
              <div className="px-4 pt-12 pb-8">
                <div className="max-w-md mx-auto w-full">
                  <div className="relative">
                    <div
                      className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-zinc-200"
                      aria-hidden="true"
                    ></div>
                    <ul className="relative flex justify-between w-full">
                      <li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-rose-500 text-white"
                          to="/onboarding-01"
                        >
                          1
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-rose-500 text-white"
                          to="/onboarding-02"
                        >
                          2
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-rose-500 text-white"
                          to="/onboarding-03"
                        >
                          3
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-rose-500 text-white"
                          to="/onboarding-04"
                        >
                          4
                        </Link>
                      </li>
                      {/*<li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500"
                          to="/onboarding-05"
                        >
                          5
                        </Link>
                </li>*/}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-8">
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl text-zinc-800 font-bold mb-6">
                  Strength Finder
                </h1>
                {/* htmlForm */}
                <form>
                  <div className="space-y-4 mb-8">
                    {/* Strengths */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="strength1"
                      >
                        Please Select Your Strengths
                      </label>
                      <Multiselect
                        className=" w-full mt-2"
                        id="strengths"
                        name="strengths"
                        showArrow
                        options={strengths}
                        value={strengths}
                        isObject={false}
                        selectionLimit={5}
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
                      {/*<div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="strength5"
                      >
                        5th Strength
                      </label>
                      <input
                        id="strength5"
                        className="form-input w-full"
                        type="text"
                        onChange={handleChange}
                      />
                       </div>*/}
                    </div>
                  </div>
                  <div className="pb-5">
                    <Banner2 type="error" open={errors} setOpen={setError}>
                      {errorMessage}
                    </Banner2>
                    <Banner2 type="success" open={success} setOpen={setSuccess}>
                      You have successfully registered
                    </Banner2>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      className="text-sm underline hover:no-underline"
                      to="/onboarding-03"
                    >
                      &lt;- Back
                    </Link>
                    <a
                      className="cursor-pointer btn bg-rose-500 hover:bg-rose-600 text-white ml-auto"
                      onKeyPress={(e) => {
                        e.key === "Enter" && e.preventDefault();
                      }}
                      onClick={handleNext}
                    >
                      Register -&gt;
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={OnboardingImage}
            width="760"
            height="1024"
            alt="Onboarding"
          />
          {/* 
          <img
            className="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block"
            src={OnboardingDecoration}
            width="218"
            height="224"
            alt="Authentication decoration"
          />*/}
        </div>
      </div>
    </main>
  );
}

export default Onboarding04;

const validateInputs = (arr) => {
  if (arr.length < 5) {
    return { valid: false, msg: `At least 5 strengths are required` };
  } else if (arr.length > 5) {
    return { valid: false, msg: `A max of 5 strengths are required` };
  }
  return { valid: true };
};
