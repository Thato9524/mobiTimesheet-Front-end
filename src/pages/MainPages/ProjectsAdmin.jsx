import React, { useEffect, useState, useRef } from "react";
//import { Multiselect } from "multiselect-react-dropdown";
import { MultiSelect } from "react-multi-select-component";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SearchForm from "../../partials/actions/SearchForm";
import UsersTabsCardProjects from "../../partials/community/UsersTabsCardProjects";
import ModalBasic from "../../components/ModalBasic";
import request from "../../handlers/request";
import Banner2 from "../../components/Banner2";
import ModalBlank from "../../components/ModalBlank";
import PreLoader from "../../components/PreLoader";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
//import Box from '@mui/material/Box';

import config from "../../config";

function UsersTabsAdmin() {
  const { key } = useParams();
  const [data, setData] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [consultantsData, setConsultantsData] = useState([]);
  const [repData, setRepData] = useState({});
  const [consultants, setConsultants] = useState([{ id: 0 }]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false); //SHOULD BE FALSE???????
  const navigateTo = useNavigate();
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitButton, setSubmitButton] = useState("Add");
  const [projectInputs, setProjectInputs] = useState({}); //INPUTS FOR NEW INFO
  const [currentProject, setCurrentProject] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const multiselectRef = useRef();
  const [selectedConsultants, setSelectedConsultants] = useState([]);
  const { dispatch } = React.useContext(AuthContext);

  /* ************************************************************************************************************
   *
   *                                                 INPUT FIELD SET UP
   *
   *************************************************************************************************************/

  //STORE INPUTS FROM FORMS INPUTS
  const handleChangeProjects = (e) => {
    setProjectInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  //STORE CONSULTANTS INTO ARRAY
  const handleChangeConsultantsSelect = (e) => {
    let consultantsArr = [];
    e.forEach((element) => {
      consultantsArr.push(element.value);
    });
    //UPDATE INPUTS TO INCLUDE CONSULTANTS ARR
    setProjectInputs((inputSelect) => ({
      ...inputSelect,
      consultants: consultantsArr,
    }));
  };

  //ADD EMPLOYEE DROPDOWN OPTIONS - CONSULTANTS
  /*const handleAddCon = (e) => {
    setConsultants([...consultants, { id: consultants.length - 1 }]);
  };*/

  //CLEAR ALL TEXT FIELDS
  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    Array.from(document.querySelectorAll("textarea")).forEach(
      (textarea) => (textarea.value = "")
    );

    Array.from(document.querySelectorAll("select")).forEach(
      (select) => (select.selectedIndex = 0) //reset input
    );
    //multiselectRef.current.resetSelectedValues();
    //setConsultants([{ id: 0 }]); //reset number of selects to 1 with non matching employee id Z
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setSuccessModalOpen(false);
    setSuccess(false);
    setError(false);
    setProjectInputs({
      projectName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      businessRep: "",
      consultants: [],
      dueDate: "",
    });
    clearInputs();
    setSelectedConsultants([]);
    resetModalProjects();
  };

  //RESET MODAL TO ADD OPTIONS FOR PROJECTS
  const resetModalProjects = () => {
    setLoading(true);
    setSubmitButton("Add");
    setData({
      ...data,
      title: "Add New Project",
    });
    setLoading(false);
  };

  //FUNCTION TO REFRESH Projects COMPONENTS
  const refreshProjects = async () => {
    checkToken();
    setLoading(true);
    //GET ALL PROJECTS FOR SPECIF CLIENT
    let getProjects = await request.get(
      `${config.path.projects.getProjects}/${key}`
    );
    setProjectData(getProjects);
    setLoading(false);
  };

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      navigateTo("/signin");
    }
  };

  /* ************************************************************************************************************
   *
   *                         USE EFFECT: GETTING PROJECTS AND CLIENTS
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);
    setSubmitButton("Add");
    //GET ALL PROJECTS FOR SPECIF CLIENT
    let getProjects = await request.get(
      `${config.path.projects.getProjects}/${key}`
    );
    let getEmployees = await request.get(config.path.users.getAll);
    let getCurretClient = await request.get(
      `${config.path.clients.getClient}/${key}`
    );

    let employeeArr = [];

    getEmployees.forEach((employee) => {
      let employeeObj = {
        label:
          employee.personalInfo.firstName +
          " " +
          employee.personalInfo.lastName,
        value: employee._id,
      };
      employeeArr.push(employeeObj);
    });

    setProjectData(getProjects);
    setRepData(getEmployees);
    setConsultantsData(employeeArr);

    //DATA FOR "ADD" BUTTON, TITLE AND URL
    setData({
      //add: "Add New Project",
      title: "Add New Project",
      company: getCurretClient.clientName,
      //addUrl: `${config.path.projects.createProject}/${key}`,
    });

    setLoading(false);
  }, [key]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  //USE EFFECT TO UPDATE
  useEffect(async () => {
    let consultantsArr = [];

    selectedConsultants.forEach((selectedConsultant) => {
      consultantsArr.push(selectedConsultant.value);
    });

    setProjectInputs((inputSelect) => ({
      ...inputSelect,
      consultants: consultantsArr,
    }));

    console.log(projectInputs)
  }, [selectedConsultants]);

  /* ************************************************************************************************************
   *
   *                                          SUBMIT FORM FUNCTION
   *
   *************************************************************************************************************/

  const submitForm = async (e) => {
    e.preventDefault();

    ///////////////////////////////////  ADDING A NEW PROJECT  ///////////////////////////////////
    if (submitButton == "Add") {
      //VALIDATE Project INPUTS
      let validate = validateProjectInputs(projectInputs); // await validateProjectInputs(projectInputs);
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      }
      setError(false);

      /////////////////////////////////// POST REQUEST TO CREATE NEW ROJECT  ///////////////////////////////////

      let req = await request.post(
        `${config.path.projects.createProject}/${key}`,
        projectInputs,
        true
      );
      if (req.err) {
        setError(true);
        setErrorMessage(req.error.message);
        return;
      }
      setSuccess(true);
      setSuccessMessage("Successfully Created Project.");

      setTimeout(() => {
        resetState();
        refreshProjects();
      }, 1000);
    }

    ///////////////////////////////////  UPDATING A NEW PROJECT  ///////////////////////////////////
    else {
      e.stopPropagation();

      //VALIDATE Project INPUTS
      let validate = validateProjectInputs(projectInputs); // await validateProjectInputs(projectInputs);
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      } else {
        setError(false);
        //open modal
        setSuccessModalOpen(true);
      }
    }
  };

  /* ************************************************************************************************************
   *
   *                                          EDIT PROJECT FUNCTION
   *
   *************************************************************************************************************/
  const editProject = async (e, id) => {
    e.stopPropagation();
    //set submit button
    setSubmitButton("Update");
    setData({
      ...data,
      title: "Edit Project",
    });

    //get current project
    let project = await request.get(`${config.path.projects.getProject}/${id}`);
    setCurrentProject(project);

    //add current project details text input
    document.getElementById("projectName").value = project.projectName;
    document.getElementById("firstName").value = project.contactInfo.firstName;
    document.getElementById("lastName").value = project.contactInfo.lastName;
    document.getElementById("email").value = project.contactInfo.email;
    document.getElementById("phoneNumber").value =
      project.contactInfo.phoneNumber;
    document.getElementById("businessRep").value = project.businessRep;

    //GET CURRENT CONSULTANTS AND THEIR ID AND VALUE(NAMES)
    let consArr = [];
    project.consultants.forEach((id) => {
      consArr.push(
        consultantsData.find((consultObj) => {
          if (consultObj.value === id) {
            return true;
          }
          return false;
        })
      );
    });
    //SET THEM AS SELECTED CONSULTANTS
    setSelectedConsultants(consArr);
    document.getElementById("dueDate").value = project.completionDate;

    setProjectInputs({
      projectName: project.projectName,
      firstName: project.contactInfo.firstName,
      lastName: project.contactInfo.lastName,
      email: project.contactInfo.email,
      phoneNumber: project.contactInfo.phoneNumber,
      businessRep: project.businessRep,
      consultants: project.consultants,
      dueDate: project.completionDate,
    });

    //open modal
    setFeedbackModalOpen(true);
  };

  /////////////////////////////////// UPDATE REQUEST TO UPDATE EXISTING PROJECT  ///////////////////////////////////

  const updateProject = async (e) => {
    let req = await request.patch(
      `${config.path.projects.editProject}/${currentProject._id}`,
      projectInputs
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Editted Project.");

    setTimeout(() => {
      resetState();
      refreshProjects();
    }, 1000);
  };

  /* ************************************************************************************************************
   *
   *                                                 Delete Project
   *
   *************************************************************************************************************/
  const openModalProject = async (e, id) => {
    // e.preventDefault();
    e.stopPropagation();

    //get current client
    let thisProject = await request.get(
      `${config.path.projects.getProject}/${id}`
    );

    setCurrentProject(thisProject);

    ///open confirmation modal
    setDangerModalOpen(true);
  };
  /////////////////////////////////// DELETE REQUEST TO DELETE EXISTING PROJECT  ///////////////////////////////////

  const deleteProject = async (e) => {
    e.preventDefault();

    let req = await request.patch(
      `${config.path.projects.softDeleteProject}/${currentProject._id}`,
      { active: false }
    );
    if (req.err) {
      return;
    }

    refreshProjects();

    setTimeout(() => {
      setDangerModalOpen(false);
    }, 1000);
  };

  /* ************************************************************************************************************
   *
   *                                          RENDERING
   *
   *************************************************************************************************************/
  return (
    <main>
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-zinc-800 font-bold">
                {data.company}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Search form 
              <SearchForm />
              {/* Add member button */}
              {/* Send Feedback */}
              {/* Start */}

              <button
                className="btn bg-rose-500 hover:bg-rose-600 text-white"
                aria-controls="feedback-modal"
                onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="hidden xs:block ml-2"> Add New Project</span>
              </button>
              {/*
               ********************************************** ADD/UPDATE MODAL **********************************************
               */}
              <ModalBasic
                id="feedback-modal"
                modalOpen={feedbackModalOpen}
                setModalOpen={setFeedbackModalOpen}
                title={data.title}
                resetState={resetState}
              >
                <div className="px-5 py-4">
                  {/* Project Details */}
                  <div className="text-large mt-5">
                    <div className="font-medium text-zinc-800 mb-3">
                      Please Enter Project Details:
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="name"
                      >
                        Project Name
                      </label>
                      <input
                        id="projectName"
                        className="form-input w-full px-2 py-1 mb-5"
                        type="text"
                        required
                        onChange={handleChangeProjects}
                      />
                    </div>
                    {/* Project Owner Details */}
                    {/*<div className="text-large mt-5">
                        <div className="font-medium text-zinc-800 mb-3">
                          Please Enter Project Owner's Details:
                        </div>
                </div>*/}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          className="form-input w-full px-2 py-1"
                          type="text"
                          required
                          onChange={handleChangeProjects}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          className="form-input w-full px-2 py-1"
                          type="text"
                          required
                          onChange={handleChangeProjects}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        className="form-input w-full px-2 py-1"
                        type="email"
                        required
                        onChange={handleChangeProjects}
                      ></input>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="phoneNumber"
                      >
                        Contact Number
                      </label>
                      <input
                        id="phoneNumber"
                        className="form-input w-full px-2 py-1 mb-5"
                        type="text"
                        required
                        onChange={handleChangeProjects}
                      ></input>
                    </div>

                    {/* Business Rep Details */}
                    <div className="text-md">
                      <div className="font-medium text-zinc-800 mb-3">
                        Please Select A Project Manager:
                      </div>
                    </div>

                    <div>
                      <select
                        id="businessRep"
                        name="businessRep"
                        className="form-select w-full mt-2 mb-5"
                        onChange={handleChangeProjects}
                      >
                        <option disabled selected value>
                          Select a Project Manager
                        </option>

                        {repData.map((employee, i) => (
                          <option key={i} value={employee._id}>
                            {employee.personalInfo.firstName}{" "}
                            {employee.personalInfo.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Consultants Details */}
                    <div className="text-medium">
                      <div className="font-medium text-zinc-800 mb-3">
                        Please Select Consultants:
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="consultants"
                      >
                        Consultants
                      </label>

                      <MultiSelect
                        id="consultants"
                        options={consultantsData}
                        value={selectedConsultants}
                        onChange={setSelectedConsultants}
                        labelledBy="Select"
                      />
                      {/* <Multiselect
                        className="border border-slate-200 w-full h-100 mt-2 overflow-y-auto"
                        id="consultants"
                        showArrow={true}
                        options={consultantsData}
                        displayValue="label"
                        closeOnSelect={false}
                        placeholder="Search for Consultants"
                        onSelect={handleChangeConsultantsSelect}
                        onRemove={handleChangeConsultantsSelect}
                        selectedValues={selectedConsultants}
                        customArrow={
                          <img
                            src="https://img.icons8.com/ios-filled/50/000000/expand-arrow--v1.png"
                            style={{
                              //margin: "5px",
                              // background: "pink",
                              position: "absolute",
                              right: "1px",
                              top: "20%",
                              width: "11px",
                              height: "11px",
                              color: "rgb(113 113 122)",
                            }}
                          />
                        }
                        style={{
                          height: "100px",

                          multiselectContainer: {
                            // To change css for multiselect (Width,height,etc..)
                            height: "100px",
                            hover: {
                              background: "red",
                              color: "red",
                            },
                          },
                          chips: {
                            background: "rgb(225 29 72)",
                            fontSize: "small",
                          }, //individual option
                          option: {
                            color: "rgb(39 39 42)",
                            height: "22px",
                            paddingTop: "0px",
                            paddingBottom: "0px",
                            paddingLeft: "20px",
                          }, //option selects
                          optionContainer: {
                            // To change css for option container
                            border: "0.5px solid rgb(212 212 216)",
                            boxShadow: "10px 10px 10px rgb(244 244 245);",
                            fontSize: "small",
                            background: " rgb(236 229 227)",
                            //paddingLeft: "6px",
                            //paddingRight: "6px",
                            input: {
                              border: "none",
                            },
                            /*zIndex: "1",
                            position: "absolute",
                            left: "0px",
                            top: "0px",*
                          },
                          searchBox: {
                            // To change search box element look
                            border: "none",
                            fontSize: "x-small",
                            height: "50px",
                            background: "white",
                            margin : "0px",
                            //padding: "0px",
                          },
                          inputField: {
                            // To change input field position or margin
                            margin: "5px",
                            fontSize: "small",
                            color: "rgb(39 39 42)",
                            //background: "yellow",
                            height: "30px",
                            border: "none",
                            padding: "1px",
                          },
                        }}
                        ref={multiselectRef}
                      /> */}
                      {/* <input
                        id="addConsultant"
                        className="form-input w-full px-2 py-1"
                        type="text"
                        onChange={addConsultant}
                      /> */}

                      {/* for each consultant make a select input 
                        {consultants.map((consultant, i) => (
                          <select
                            key={i}
                            id="consultants"
                            name="consultants"
                            className="form-select w-full mt-2"
                            onChange={handleChangeConsultantsSelect}
                          >
                            <option selected value>
                              Select an Employee
                            </option>
                            {/* print out all employees as options 
                            {consultantsData.map((employee, i) => (
                              <option
                                key={i}
                                value={employee._id}
                                //make selected true if consults for current project matches anyone on the employee list
                                selected={employee._id === consultant.id}
                              >
                                {employee.personalInfo.firstName}{" "}
                                {employee.personalInfo.lastName}
                              </option>
                            ))}
                          </select>
                        ))}
                        <button
                          onClick={handleAddCon}
                          className="form-select w-full mt-2 mb-5"
                        >
                          +
                        </button>*/}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="dueDate"
                      >
                        End Date {/*<span className="text-rose-500">*</span>*/}
                      </label>
                      <input
                        id="dueDate"
                        className="form-input w-full"
                        type="date"
                        onChange={handleChangeProjects}
                      />
                    </div>
                  </div>
                  {/* Modal footer */}
                  <div className="px-5 py-4 border-t border-zinc-200">
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetState();
                          //resetModalProjects();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={submitForm}
                      >
                        {submitButton}
                      </button>
                    </div>
                  </div>
                  {/* Error message */}
                  <Banner2 type="error" open={errors} setOpen={setError}>
                    {errorMessage}
                  </Banner2>
                  {/* On successful registration */}
                  <Banner2 type="success" open={success} setOpen={setSuccess}>
                    {successMessage}
                  </Banner2>
                </div>
              </ModalBasic>
              {/*
               ********************************************** Danger Modal **********************************************
               */}
              <ModalBlank
                id="danger-modal"
                modalOpen={dangerModalOpen}
                setModalOpen={setDangerModalOpen}
              >
                <div className="p-5 flex space-x-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100">
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-rose-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <div>
                    {/* Modal header */}
                    <div className="mb-5">
                      <div className="text-lg font-semibold text-zinc-800">
                        Are you sure you want to delete{" "}
                        {currentProject.projectName}?
                      </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDangerModalOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={deleteProject}
                      >
                        Yes, Delete it
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBlank>
              {/*
               ********************************************** Success Modal **********************************************
               */}
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
                        Are you sure you want update{" "}
                        {currentProject.projectName}?
                      </div>
                    </div>
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
                        onClick={updateProject}
                      >
                        Yes, Update it
                      </button>
                    </div>
                  </div>
                </div>
                {/* Error message */}
                <Banner2 type="error" open={errors} setOpen={setError}>
                  {errorMessage}
                </Banner2>
                {/* On successful registration */}
                <Banner2 type="success" open={success} setOpen={setSuccess}>
                  {successMessage}
                </Banner2>
              </ModalBlank>
            </div>
          </div>

          {/*
           ********************************************** PROJECT CARDS  **********************************************
           */}
          <div className="grid grid-cols-12 gap-6">
            {projectData.projects &&
              projectData.projects.map((project, i) => (
                <UsersTabsCardProjects
                  openModalProject={openModalProject}
                  editProject={editProject} //pass function to component
                  key={project._id}
                  id={project._id}
                  name={project.projectName} // let projName = projectData.projects[0].projectName; project.projects[project].projectName
                  contactInfo={{
                    name: `${project.contactInfo.firstName} ${project.contactInfo.lastName}`,
                    email: project.contactInfo.email,
                  }}
                  link={`/clients/${key}/projects/${project._id}`} //LINK TO TIMESHEET OF PROJECT /clients/clientID/projects/:key/ ----> UsersTilesAdmin File
                  businessRep={{
                    name: `${project.businessRep.personalInfo.firstName} ${project.businessRep.personalInfo.lastName}`,
                    email: project.businessRep.email,
                  }}
                  consultants={project.consultants}
                  active={project.active}

                  /*
                 consultants={project.consultants.map(
                    (consultant) => consultant.personalInfo.firstName
                  )}*/
                />
              ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default UsersTabsAdmin;

{
  /*
   ********************************************** INPUT VALIDATIONS  **********************************************
   */
}

const validateProjectInputs = (obj) => {
  let names = {
    projectName: "Project Name",
    firstName: "Project Owner's First Name ",
    lastName: "Project Owner's Last Name ",
    email: "Email",
    phoneNumber: "Contact Number",
    businessRep: "Project Manager",
    consultants: "Consultants",
    dueDate: "End Date",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
    if (names[i] == "Contact Number") {
      var pattern = new RegExp(/^[0-9\b]+$/);

      if (!pattern.test(obj[i])) {
        return {
          valid: false,
          msg: `Please enter a valid number for the Contact Number.`,
        };
      } else if (obj[i].length != 10) {
        return { valid: false, msg: `Please enter valid phone number.` };
      }
    }
  }
  return { valid: true };
};
