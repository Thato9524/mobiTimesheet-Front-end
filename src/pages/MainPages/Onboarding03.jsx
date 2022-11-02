import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OnboardingImage from "../../images/onboarding-image.jpg";
import OnboardingDecoration from "../../images/auth-decoration.png";
import Banner2 from "../../components/Banner2";
import dropdown from "../../components/UsersTable/Dropdown";
import races from "../../data/Race";
import genders from "../../data/Gender";

import c3Image from "../../images/c3-122x69.png";
import { Checkbox, FormControlLabel } from "@mui/material";

function Onboarding03() {
  const navigateTo = useNavigate();
  const [specified, setSpecified] = useState(true);
  const [inputs, setInputs] = useState({
    //firstName: '',
    //lastName: '',
    about: "",
    birthDate: "",
    joinedDate: "",
    title: "",
    id: "",
    race: "",
    gender: "",
    start: "",
    end: "",
  });
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  // console.log(inputs);

  function compare(a, b) {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    return 0;
  }

  async function handleNext() {
    let validate = validateInputs(inputs);
    if (!validate.valid) {
      setError(true);
      setErrorMessage(validate.msg);
      return;
    }
    let city = "Johannesburg";
    if (inputs.city) {
      city = inputs.city;
    }
    let start = inputs.start,
    end = inputs.end,
      race = inputs.race,
      gender = inputs.gender,
      id = inputs.id;

    setInputs((prevState) => ({
      ...prevState,
      ["start"]: "",
      ["race"] : "",
      ["gender"] : "",
      ["id"] : "",
      ["end"]: "",
    }));

    let uploadData = await localStorage.getItem("onboarding");
    localStorage.setItem(
      "onboarding",
      JSON.stringify({
        ...JSON.parse(uploadData),
        personalInfo: {
          ...inputs,
          city,
        },
        start: start,
        race: race,
        gender: gender,
        id: id,
        end: end,
      })
    );

    // console.log("step3:", localStorage.getItem("onboarding"));
    navigateTo("/onboarding-04");
  }
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
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500"
                          to="/onboarding-04"
                        >
                          4
                        </Link>
                      </li>
                      {/*} <li>
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
                  Personal Information
                </h1>
                {/* htmlForm */}
                <form>
                  <div className="space-y-4 mb-8">
                    {/* First Name & Last NAme 
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="firstName"
                        >
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="firstName"
                          className="form-input w-full"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="lastName"
                        >
                          Last Name<span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="lastName"
                          className="form-input w-full"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                    </div>*/}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="about"
                      >
                        About you <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="about"
                        className="form-input w-full"
                        type="text"
                        placeholder="Tell us about yourself"
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                    {/* City and Postal Code */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="birthDate"
                      >
                        Birth Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="birthDate"
                        className="form-input w-full"
                        type="date"
                        min="1900-01-01"
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="joinedDate"
                      >
                        My C3 journey started{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="joinedDate"
                        className="form-input w-full"
                        type="date"
                        min="2019-01-01"
                        onChange={handleChange}
                      />
                    </div>
                    {/* Street Address */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="title"
                      >
                        Job Title
                        <span className="text-rose-500">*</span>
                      </label>
                      {/*} <input
                        id="title"
                        className="form-input w-full"
                        type="text"
                        onChange={handleChange}
                  />*/}
                      <select
                        id="title"
                        className="form-select w-full"
                        onChange={handleChange}
                      >
                        <option disabled selected value>
                          Select Title
                        </option>
                        {dropdown.sort(compare).map((drop) => (
                          <>
                            <option value={drop}>{drop}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="race"
                      >
                        Race
                        <span className="text-rose-500">*</span>
                      </label>
                      {/*} <input
                        id="title"
                        className="form-input w-full"
                        type="text"
                        onChange={handleChange}
                  />*/}
                      <select
                        id="race"
                        className="form-select w-full"
                        onChange={handleChange}
                      >
                        <option disabled selected value>
                          Select a Race
                        </option>
                        {races.sort().map((race) => (
                          <>
                            <option value={race}>{race}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="gender"
                      >
                        Gender
                        <span className="text-rose-500">*</span>
                      </label>
                      {/*} <input
                        id="title"
                        className="form-input w-full"
                        type="text"
                        onChange={handleChange}
                  />*/}
                      <select
                        id="gender"
                        className="form-select w-full"
                        onChange={handleChange}
                      >
                        <option disabled selected value>
                          Select a Gender
                        </option>
                        {genders.sort().map((gender) => (
                          <>
                            <option value={gender}>{gender}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="id"
                      >
                        ID Number <span className="text-rose-500">*</span>
                      </label>
                      {/*} <input
                        id="title"
                        className="form-input w-full"
                        type="text"
                        onChange={handleChange}
                  />*/}
                      <input
                        id="id"
                        className="form-input w-full"
                        type="text"
                        placeholder="eg. 1234567890123"
                        onChange={handleChange}
                      />
                    </div>
                    {/* Country */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="city"
                      >
                        City <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="city"
                        className="form-select w-full"
                        onChange={handleChange}
                      >
                        <option value="Johannesburg">Johannesburg</option>
                        <option value="Cape Town">Cape Town</option>
                        <option value="Sydney">Sydney</option>
                      </select>
                    </div>
                    <div className="ml-1">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="specified"
                            checked={specified}
                            onChange={() => setSpecified(!specified)}
                          />
                        }
                        label="Contract End Specified"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="start"
                      >
                        Contract Start <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="start"
                        className="form-input w-full"
                        type="date"
                        min="2022-01-01"
                        onChange={handleChange}
                      />
                    </div>
                    {specified && <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="end"
                      >
                        Contract End <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="end"
                        className="form-input w-full"
                        type="date"
                        min="2022-01-01"
                        onChange={handleChange}
                      />
                    </div>}
                  </div>
                  <div className="pb-5">
                    <Banner2 type="error" open={errors} setOpen={setError}>
                      {errorMessage}
                    </Banner2>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      className="text-sm underline hover:no-underline"
                      to="/onboarding-02"
                    >
                      &lt;- Back
                    </Link>
                    <a
                      className="cursor-pointer btn bg-rose-500 hover:bg-rose-600 text-white ml-auto"
                      onClick={handleNext}
                    >
                      Next Step -&gt;
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

export default Onboarding03;

const validateInputs = (obj) => {
  const validId = new RegExp(
    "/(((d{2}((0[1-9]|[12]d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]d|30)|02(0[1-9]|1d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(d{4})( |-)(d{3})|(d{7}))$"
  );
  let names = {
    about: "About You",
    birthDate: "Birth Date",
    joinedDate: "C3 Journey started",
    title: "Job Title",
    race: "Race",
    gender: "Gender",
    id: "ID Number",
    city: "City",
    start: "Contract Start",
    end: "Contract End",
  };

  for (let i in obj) {
    if (obj[i] === "" && names[i] !== "Contract End") {
      return { valid: false, msg: ` ${names[i]} is required` };
    }
  }

  if(!validId.test(obj.id) !== obj.id.length === 13){
    return { valid: false, msg: `${names.id} is invalid`};
  }

  return { valid: true };

};
