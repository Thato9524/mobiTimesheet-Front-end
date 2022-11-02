import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OnboardingImage from "../../images/onboarding-image.jpg";
import OnboardingDecoration from "../../images/auth-decoration.png";
import Banner2 from "../../components/Banner2";
import request from "../../handlers/request";
import config from "../../config";
import PuffLoader from "react-spinners/PuffLoader";

import c3Image from "../../images/c3-122x69.png";

function Onboarding05() {
  const navigateTo = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

  const handleNext = async () => {
    setLoading(true);
    let validate = await validateInputs(inputs);
    if (!validate.valid) {
      setError(true);
      setErrorMessage(validate.msg);
      setLoading(false);

      return;
    }
    let uploadData = await localStorage.getItem("onboarding");
    uploadData = { ...JSON.parse(uploadData), ...inputs };

    let upload = await request.post(config.path.register, uploadData, false);
    // console.log(upload);

    if (upload.err) {
      setError(true);
      setErrorMessage(upload.msg);
      setLoading(false);

      return;
    }
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      navigateTo("/signin");
    }, 2000);

    // navigateTo('/onboarding-03');
  };
  return (
    <main className="bg-white">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
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
                  </svg>*/}
                </Link>
                <div className="text-sm">
                  Have an account?{" "}
                  <Link
                    className="font-medium text-rose-500 hover:text-rose-600"
                    to="/signin"
                  >
                    Sign In
                  </Link>
                </div>
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
                      {/* <li>
                        <Link
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-rose-500 text-white"
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
                  Register
                </h1>
                {/* htmlForm */}
                <form>
                  <div className="space-y-4 mb-8">
                    {/* First Name & Last NAme */}

                    <div>
                      {/* Email */}
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        className="form-input w-full"
                        type="email"
                        name="email" // TO add
                        onChange={handleChange} // TO add
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="flex items-center relative">
                        <input
                          id="password"
                          className="form-input w-full -mr-10"
                          type={passwordShow ? "text" : "password"}
                          autoComplete="on"
                          onChange={handleChange}
                        />

                        <div
                          className="absolute right-1 px-1 mr-2 rounded rounded-ful bg-slate-200 text-slate-400 text-xs hover:bg-slate-100 cursor-pointer"
                          onClick={() => {
                            setPasswordShow(!passwordShow);
                          }}
                        >
                          show
                        </div>
                      </div>
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
                      to="/onboarding-04"
                    >
                      &lt;- Back
                    </Link>
                    <a
                      className={`cursor-pointer btn bg-rose-500 ${
                        !loading && " hover:bg-rose-600"
                      } text-white ml-auto`}
                      onClick={!loading && handleNext}
                    >
                      {loading ? (
                        <PuffLoader color="white" size={20} />
                      ) : (
                        "Register"
                      )}
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

export default Onboarding05;

const validateInputs = (obj) => {
  let names = {
    email: "Email",
    password: "Password",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
  }
  return { valid: true };
};
