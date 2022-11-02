import React, { useState } from "react";
import Avatar from "avataaars";
import { generateRandomAvatarOptions } from "../../utils/avatar";

import ProfileBg from "../../images/profile-bg.jpg";
import ModalBasic from "../../components/ModalBasic";
// import UserAvatar from "../../images/user-128-01.jpg";
// import Icon02 from "../../images/icon-02.svg";
import updateIcon from "../../images/update-business-user-svgrepo-com (2).svg";
import Icon03 from "../../images/icon-03.svg";
// import UserImage01 from "../../images/avatar-01.jpg";
// import UserImage02 from "../../images/avatar-02.jpg";
// import UserImage03 from "../../images/avatar-03.jpg";
// import UserImage04 from "../../images/avatar-04.jpg";
// import UserImage05 from "../../images/avatar-05.jpg";
// import UserImage06 from "../../images/avatar-06.jpg";
import Banner2 from "../../components/Banner2";
import ModalBlank from "../../components/ModalBlank";
import request from "../../handlers/request";
import config from "../../config";

function ProfileBody({
  profileSidebarOpen,
  setProfileSidebarOpen,
  personalData,
  projectsData,
}) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [about, setAbout] = useState(personalData.personalInfo.about);

  ///////////////////////////////////  SUBMIT FORM FUNCTION  ///////////////////////////////////
  const submitForm = async () => {
    let req = {
      _id: personalData._id,
      about: about,
    };

    const response = await request.patch(
      config.path.profile.updateProfile,
      req
    );

    if (response.err) {
      setSuccessModalOpen(false);
      setErrorModalOpen(true);
      setErrorMessage(response.err);
      return;
    } else {
      resetState();
      setSuccess(true);
      // console.log("Successfully Updated Profile");
      //TODO: MAKE A BETTER WAY TO REFRESH CONTENT
      refreshProfile();
    }
  };

  // VALIDATE UPDATE FORM
  const validateForm = (obj) => {
    obj = obj.trim();
    if (obj !== "") {
      if (obj.length < 5) {
        setError(true);
        setErrorMessage("About cannot be less than 5 characters");
        return;
      } else {
        setSuccessModalOpen(true);
        return;
      }
    } else {
      setError(true);
      setErrorMessage("About cannot be left empty");
      return;
    }
  };

  // HANDLE CHANGE TO FIELDS IN THE FORM
  const handleChangeUpdate = async (value) => {
    setAbout(value);
  };

  const resetState = () => {
    setUpdateModalOpen(false);
    setSuccessModalOpen(false);
    setError(false);
    setSuccess(false);
    setAbout(personalData.personalInfo.about);
  };

  

  return (
    <div
      className={`grow flex flex-col md:translate-x-0 transform transition-transform duration-300 ease-in-out ${
        profileSidebarOpen ? "translate-x-1/3" : "translate-x-0"
      }`}
    >
      {/* Profile background */}
      <div className="relative h-56 bg-zinc-200">
        <img
          className="object-cover h-full w-full"
          src={ProfileBg}
          width="979"
          height="220"
          alt="Profile background"
        />
        {/* Close button */}
        <button
          className="md:hidden absolute top-4 left-4 sm:left-6 text-white opacity-80 hover:opacity-100"
          onClick={() => setProfileSidebarOpen(!profileSidebarOpen)}
          aria-controls="profile-sidebar"
          aria-expanded={profileSidebarOpen}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 pb-8">
        {/* Pre-header */}
        <div className="-mt-16 mb-6 sm:mb-3">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
            {/* Avatar */}
            <div className="inline-flex -ml-1 -mt-1 mb-4 sm:mb-0">
              <Avatar
                style={{ width: "100px", height: "100px" }}
                avatarStyle="Circle"
                {...generateRandomAvatarOptions()}
                alt="Avatar"
              />
              {/*} <img
                className="rounded-full border-4 border-white"
                src={UserAvatar}
                width="128"
                height="128"
                alt="Avatar"
    />*/}
            </div>

            {/* Actions 
            <div className="flex space-x-2 sm:mb-2">
              <button className="p-1.5 shrink-0 rounded border border-zinc-200 hover:border-zinc-300 shadow-sm">
                <svg
                  className="w-4 h-1 fill-current text-zinc-400"
                  viewBox="0 0 16 4"
                >
                  <circle cx="8" cy="2" r="2" />
                  <circle cx="2" cy="2" r="2" />
                  <circle cx="14" cy="2" r="2" />
                </svg>
              </button>
              <button className="p-1.5 shrink-0 rounded border border-zinc-200 hover:border-zinc-300 shadow-sm">
                <svg
                  className="w-4 h-4 fill-current text-rose-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z" />
                </svg>
              </button>
              <button className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">
                <svg
                  className="fill-current shrink-0"
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                >
                  <path d="m.457 4.516.969-.99 2.516 2.481L9.266.702l.985.99-6.309 6.284z" />
                </svg>
                <span className="ml-2">Following</span>
              </button>
            </div>*/}
          </div>
        </div>

        {/* Header */}
        <header className="text-center sm:text-left mb-6">
          {/* Name */}
          <div className="flex justify-between mb-2">
            <div className="inline-flex">
              <h1 className="text-2xl text-zinc-800 font-bold">
                {personalData.personalInfo.firstName}{" "}
                {personalData.personalInfo.lastName}
              </h1>
              <svg
                className="w-4 h-4 fill-current shrink-0 text-yellow-500 ml-2"
                viewBox="0 0 16 16"
              >
                <path d="M13 6a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5A.75.75 0 0 1 13 6ZM6 16a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 1 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
              </svg>
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button
                className="btn bg-rose-500 hover:bg-rose-600 text-white"
                aria-controls="feedback-modal"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateModalOpen(true);
                }}
              >
                <img
                  className="w-4 h-4 opacity-100 shrink-0"
                  src={updateIcon}
                />

                <span className="hidden xs:block ml-2">Update Profile</span>
              </button>
              <ModalBasic
                id="profile-modal"
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                title={"Update Profile"}
                resetState={resetState}
              >
                <div className="px-5 py-4">
                  {/* Project Details */}
                  <div className="text-large mt-5">
                    <div className="font-medium text-zinc-800 mb-3">
                      Update Profile
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="about"
                      >
                        About Me
                      </label>
                      <textarea
                        id="about"
                        value={about}
                        className="form-input w-full px-2 py-1"
                        required
                        onChange={(e) => handleChangeUpdate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Banner2 type="error" open={error} setOpen={setError}>
                      {errorMessage}
                    </Banner2>
                  </div>
                  <div className="px-5 py-4 border-t border-zinc-200">
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                        onClick={(e) => {
                          // console.log("cancel");
                          e.stopPropagation();
                          resetState();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          validateForm(about);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBasic>
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
                        Are you sure you want update your 'About me' section ?
                      </div>
                    </div>
                    <div></div>
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
            </div>
          </div>
          {/* Bio 
          <div className="text-sm mb-3">
            Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP
            Lover.
          </div>*/}
          <div className="text-sm mb-3">{personalData.type}</div>
          {/* Meta */}
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 fill-current shrink-0 text-zinc-400"
                viewBox="0 0 16 16"
              >
                <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap text-zinc-500 ml-2">
                {personalData.personalInfo.city}
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 fill-current shrink-0 text-zinc-400"
                viewBox="0 0 16 16"
              >
                <path d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z" />
              </svg>
              <a
                className="text-sm font-medium whitespace-nowrap text-rose-500 hover:text-rose-600 ml-2"
                href="#0"
              >
                {personalData.email}
              </a>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="relative mb-6">
          <div
            className="absolute bottom-0 w-full h-px bg-zinc-200"
            aria-hidden="true"
          ></div>
          <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
            <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
              <a
                className="block pb-3 text-rose-500 whitespace-nowrap border-b-2 border-rose-500"
                href="#0"
              >
                General
              </a>
            </li>
            {/* <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
              <a
                className="block pb-3 text-zinc-500 hover:text-zinc-600 whitespace-nowrap"
                href="#0"
              >
                Connections
              </a>
            </li>
            <li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
              <a
                className="block pb-3 text-zinc-500 hover:text-zinc-600 whitespace-nowrap"
                href="#0"
              >
                Contributions
              </a>
            </li> */}
          </ul>
        </div>

        {/* Profile content */}
        <div className="flex flex-col xl:flex-row xl:space-x-16">
          {/* Main content */}
          <div className="space-y-5 mb-8 xl:mb-0">
            {/* About Me */}
            <div>
              <h2 className="text-zinc-800 font-semibold mb-2">About Me</h2>
              <div className="text-sm space-y-2">
                <p>{personalData.personalInfo.about}</p>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h2 className="text-zinc-800 font-semibold mb-2">Projects</h2>
              {/* Cards */}
              <div className="grid xl:grid-cols-2 gap-4">
                {/* Card */}

                {projectsData.map((project) => (
                  <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-sm w-80">
                    {/* Card header */}
                    <div className="grow flex items-center truncate mb-2">
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-zinc-700 rounded-full mr-2">
                        <img
                          className="ml-1"
                          src={Icon03}
                          width="14"
                          height="14"
                          alt="Icon 03"
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-zinc-800">
                          {project.projectName}
                        </span>
                      </div>
                    </div>
                    {/* Card content */}
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        Client:
                      </div>
                      <div className="text-sm col-span-5">
                        {project.client.clientName}
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        Client Rep:
                      </div>
                      <div className="text-sm col-span-5">
                        <a href={`mailto:${project.contactInfo.email}`}>
                          {" "}
                          {project.contactInfo.firstName}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        C3 Rep:
                      </div>
                      <div className="text-sm col-span-5">
                        {project.businessRep.personalInfo.firstName +
                          " " +
                          project.businessRep.personalInfo.lastName}{" "}
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        End Date:
                      </div>
                      <div className="text-sm col-span-5">
                        {project.completionDate}{" "}
                      </div>
                    </div>

                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">Team:</div>
                      <div className="text-sm col-span-5">
                        {project.consultants.length} Members
                        {/*project.consultants.map((consultant) => (
                          <div>
                            {consultant.personalInfo.firstName +
                              " " +
                              consultant.personalInfo.lastName}
                          </div>
                            ))*/}{" "}
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex justify-between items-center">
                      {/* Avatars group
                      <div className="flex -space-x-3 -ml-0.5">
                        <img
                          className="rounded-full border-2 border-white box-content"
                          src={UserImage02}
                          width="24"
                          height="24"
                          alt="Avatar"
                        />
                        <img
                          className="rounded-full border-2 border-white box-content"
                          src={UserImage03}
                          width="24"
                          height="24"
                          alt="Avatar"
                        />
                        <img
                          className="rounded-full border-2 border-white box-content"
                          src={UserImage04}
                          width="24"
                          height="24"
                          alt="Avatar"
                        />
                        <img
                          className="rounded-full border-2 border-white box-content"
                          src={UserImage05}
                          width="24"
                          height="24"
                          alt="Avatar"
                        />
                      </div> */}
                      {/* Link 
                      <div>
                        <a
                          className="text-sm font-medium text-rose-500 hover:text-rose-600"
                          href="#0"
                        >
                          View -&gt;
                        </a>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History 
            <div>
              <h2 className="text-zinc-800 font-semibold mb-2">
                Work History
              </h2>
              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-sm">
                <ul className="space-y-3">
                  {/* Item 
                  <li className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:grow flex items-center text-sm">
                      {/* Icon 
                      <div className="w-8 h-8 rounded-full shrink-0 bg-yellow-500 my-2 mr-3">
                        <svg
                          className="w-8 h-8 fill-current text-yellow-50"
                          viewBox="0 0 32 32"
                        >
                          <path d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
                        </svg>
                      </div>
                      {/* Position 
                      <div>
                        <div className="font-medium text-zinc-800">
                          {data.personalInfo.title}
                        </div>
                        <div className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">
                          <div>Remote</div>
                          <div className="text-zinc-400">·</div>
                          <div>April, 2020 - Today</div>
                        </div>
                      </div>
                    </div>
                    {/* Tags 
                    <div className="sm:ml-2 mt-2 sm:mt-0">
                      <ul className="flex flex-wrap sm:justify-end -m-1">
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            Marketing
                          </button>
                        </li>
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            +4
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>

                  {/* Item 
                  <li className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:grow flex items-center text-sm">
                      {/* Icon 
                      <div className="w-8 h-8 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                        <svg
                          className="w-8 h-8 fill-current text-rose-50"
                          viewBox="0 0 32 32"
                        >
                          <path d="M8.994 20.006a1 1 0 0 1-.707-1.707l4.5-4.5a1 1 0 0 1 1.414 0l3.293 3.293 4.793-4.793a1 1 0 1 1 1.414 1.414l-5.5 5.5a1 1 0 0 1-1.414 0l-3.293-3.293L9.7 19.713a1 1 0 0 1-.707.293Z" />
                        </svg>
                      </div>
                      {/* Position 
                      <div>
                        <div className="font-medium text-zinc-800">
                          Product Designer
                        </div>
                        <div className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">
                          <div>{data.personalInfo.city}</div>
                          <div className="text-zinc-400">·</div>
                          <div>April, 2018 - April 2020</div>
                        </div>
                      </div>
                    </div>
                    {/* Tags 
                    <div className="sm:ml-2 mt-2 sm:mt-0">
                      <ul className="flex flex-wrap sm:justify-end -m-1">
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            Marketing
                          </button>
                        </li>
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            +4
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>

                  {/* Item 
                  <li className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:grow flex items-center text-sm">
                      {/* Icon 
                      <div className="w-8 h-8 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                        <svg
                          className="w-8 h-8 fill-current text-rose-50"
                          viewBox="0 0 32 32"
                        >
                          <path d="M8.994 20.006a1 1 0 0 1-.707-1.707l4.5-4.5a1 1 0 0 1 1.414 0l3.293 3.293 4.793-4.793a1 1 0 1 1 1.414 1.414l-5.5 5.5a1 1 0 0 1-1.414 0l-3.293-3.293L9.7 19.713a1 1 0 0 1-.707.293Z" />
                        </svg>
                      </div>
                      {/* Position 
                      <div>
                        <div className="font-medium text-zinc-800">
                          Product Designer
                        </div>
                        <div className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">
                          <div>{data.personalInfo.city}</div>
                          <div className="text-zinc-400">·</div>
                          <div>April, 2018 - April 2020</div>
                        </div>
                      </div>
                    </div>
                    {/* Tags 
                    <div className="sm:ml-2 mt-2 sm:mt-0">
                      <ul className="flex flex-wrap sm:justify-end -m-1">
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            Marketing
                          </button>
                        </li>
                        <li className="m-1">
                          <button className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-zinc-200 hover:border-zinc-300 shadow-sm bg-white text-zinc-500 duration-150 ease-in-out">
                            +4
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>*/}
          </div>

          {/* Sidebar */}
          <aside className="xl:min-w-56 xl:w-56 space-y-3">
            <div className="text-sm">
              <h3 className="font-medium text-zinc-800">Title</h3>
              <div>{personalData.personalInfo.title}</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-zinc-800">Location</h3>
              <div>{personalData.personalInfo.city} - Remote</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-zinc-800">Email</h3>
              <div>{personalData.email}</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-zinc-800">Birthdate</h3>
              <div>{personalData.personalInfo.birthDate}</div>
            </div>
            <div className="text-sm">
              <h3 className="font-medium text-zinc-800">Joined C3</h3>
              <div>{personalData.personalInfo.joinedDate}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
