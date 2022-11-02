import React, { useEffect, useState, useRef } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SearchForm from "../../partials/actions/SearchForm";
import UsersTabsCard from "../../partials/community/UsersTabsCard";
import UsersTabsCardProjects from "../../partials/community/UsersTabsCardProjects";
import ModalBasic from "../../components/ModalBasic";
import request from "../../handlers/request";
import Banner2 from "../../components/Banner2";
import ModalBlank from "../../components/ModalBlank";
import PreLoader from "../../components/PreLoader";

import Image01 from "../../images/user-64-01.jpg";
// import Image02 from "../../images/user-64-02.jpg";
// import Image03 from "../../images/user-64-03.jpg";
// import Image04 from "../../images/user-64-04.jpg";
// import Image05 from "../../images/user-64-05.jpg";
// import Image06 from "../../images/user-64-06.jpg";
// import Image07 from "../../images/user-64-07.jpg";
// import Image08 from "../../images/user-64-08.jpg";

// import Image09 from "../../images/user-64-09.jpg";
// import Image10 from "../../images/user-64-10.jpg";
// import Image11 from "../../images/user-64-11.jpg";
// import Image12 from "../../images/user-64-12.jpg";
import config from "../../config";

function UsersTabs() {
  const { key } = useParams();
  const [data, setData] = useState({});
  const [clientData, setClientData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [consultantsData, setConsultantsData] = useState([]);
  const [repData, setRepData] = useState({});
  const [consultants, setConsultants] = useState([{ id: 0 }]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(true); //SHOULD BE FALSE???????
  const navigateTo = useNavigate();
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showClients, setShowClient] = useState();
  const [showProjects, setShowProjects] = useState();
  const [submitButton, setSubmitButton] = useState("Add");
  const [clientInputs, setClientInputs] = useState({}); //INPUTS FOR NEW INFO
  const [projectInputs, setProjectInputs] = useState({}); //INPUTS FOR NEW INFO
  const [currentProject, setCurrentProject] = useState({});
  const [currentClient, setCurrentClient] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const multiselectRef = useRef();
  const [seletedConsultants, setSelectedConsultants] = useState([]);

  /* ************************************************************************************************************
   *
   *                                                 INPUT FIELD SET UP
   *
   *************************************************************************************************************/

  //STORE INPUTS FROM FORMS INPUTS
  const handleChangeClients = (e) =>
    setClientInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

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

    /*let consultantSelects = document.querySelectorAll("#consultants"); //FIND ALL COMPONENTS WITH ID OF CONSULTANTS
    let consultantsArr = [];
    consultantSelects.forEach((consultantSelect) => {
      consultantsArr.push(consultantSelect.value); //STORE IN TEMP ARR
    });
*/
    //UPDATE INPUTS TO INCLUDE CONSULTANTS ARR
    setProjectInputs((inputSelect) => ({
      ...inputSelect,
      consultants: consultantsArr,
    }));
  };

  //ADD EMPLOYEE DROPDOWN OPTIONS - CONSULTANTS
  const handleAddCon = (e) => {
    setConsultants([...consultants, { id: consultants.length - 1 }]);
  };

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
    multiselectRef.current.resetSelectedValues();
    //setConsultants([{ id: 0 }]); //reset number of selects to 1 with non matching employee id Z
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    setFeedbackModalOpen(false);
    setSuccess(false);
    setError(false);
    setClientInputs({});
    setProjectInputs({});
    clearInputs();
  };

  //RESET MODAL TO ADD OPTIONS FOR CLIENTS
  const resetModalClients = () => {
    setSubmitButton("Add");
    setData({
      ...data,
      title: "Add New Clients",
    });
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
    setLoading(true);
    //GET ALL PROJECTS FOR SPECIF CLIENT
    let getProjects = await request.get(
      `${config.path.projects.getProjects}/${key}`
    );
    setProjectData(getProjects);
    setLoading(false);
  };

  //FUNCTION TO REFRESH CLIENTS COMPONENTS
  const refreshClient = async () => {
    let getClients = await request.get(config.path.clients.getAll);
    setClientData(getClients);
  };

  /* ************************************************************************************************************
   *
   *                         USE EFFECT: GETTING PROJECTS AND CLIENTS
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);

    ///////////////////////////////////  All CLIENTS PAGE ///////////////////////////////////
    if (key === "all") {
      setShowClient(true);
      setShowProjects(false);
      setSubmitButton("Add");

      //GET ALL CLIENTS IN THE DB
      let getClients = await request.get(config.path.clients.getAll);
      setClientData(getClients);

      setData({
        add: "Add New Client",
        title: "Add New Client",
        company: "Convergenc3 Clients",
        addUrl: config.path.clients.createClient,
      });

      setLoading(false);
    }

    ///////////////////////////////////  INDIVIDUAL CLIENTS PAGE ///////////////////////////////////
    else {
      setShowClient(false);
      setShowProjects(true);
      setSubmitButton("Add");
      //GET ALL PROJECTS FOR SPECIF CLIENT
      let getProjects = await request.get(
        `${config.path.projects.getProjects}/${key}`
      );
      let getClients = await request.get(config.path.clients.getAll);
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

      setClientData(getClients);
      setProjectData(getProjects);
      setRepData(getEmployees);
      setConsultantsData([employeeArr]);

      //DATA FOR "ADD" BUTTON, TITLE AND URL
      setData({
        add: "Add New Project",
        title: "Add New Project",
        company: getCurretClient.clientName,
        addUrl: `${config.path.projects.createProject}/${key}`,
      });

      setLoading(false);
      //ADD CLIENTS ID TO INPUTS
      /*setProjectInputs({
        ...projectInputs,
        client: key,
      });*/
    }
  }, [key]);

  /* ************************************************************************************************************
   *
   *                                          SUBMIT FORM FUNCTION
   *
   *************************************************************************************************************/

  const submitForm = async (e) => {
    e.preventDefault();

    ///////////////////////////////////  ADDING A NEW CLIENT/PROJECT  ///////////////////////////////////
    if (submitButton == "Add") {
      ///////////////////////////////////  VALIDATING CLIENT FORM  ///////////////////////////////////

      if (showClients) {
        //VALIDATE CLIENT INPUTS
        let validate = validateClientInputs(clientInputs); //await validateClientInputs(clientInputs);
        if (!validate.valid) {
          setError(true);
          setErrorMessage(validate.msg);
          return;
        }
        setError(false);

        /////////////////////////////////// POST REQUEST TO CREATE NEW CLIENT  ///////////////////////////////////

        let req = await request.post(data.addUrl, clientInputs, true);
        if (req.err) {
          setError(true);
          setErrorMessage(req.error.message);
          return;
        }

        setSuccess(true);
        setSuccessMessage("Successfully Added New Client.");

        refreshClient();

        setTimeout(() => {
          resetState();
        }, 2000);
      }

      ///////////////////////////////////  VALIDATING PROJECT FORM  ///////////////////////////////////
      else if (showProjects) {
        //VALIDATE Project INPUTS
        let validate = validateProjectInputs(projectInputs); // await validateProjectInputs(projectInputs);
        if (!validate.valid) {
          setError(true);
          setErrorMessage(validate.msg);
          return;
        }
        setError(false);

        /////////////////////////////////// POST REQUEST TO CREATE NEW ROJECT  ///////////////////////////////////

        let req = await request.post(data.addUrl, projectInputs,true);
        if (req.err) {
          setError(true);
          setErrorMessage(req.error.message);
          return;
        }
        setSuccess(true);
        setSuccessMessage("Successfully Created Project.");

        refreshProjects();

        setTimeout(() => {
          resetState();
        }, 2000);
      }
    }

    ///////////////////////////////////  UPDATING A NEW CLIENT/PROJECT  ///////////////////////////////////
    else {
      e.stopPropagation();
      //open modal
      setSuccessModalOpen(true);
    }

    /*const addProp = async () => {};

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const addConsultant = (e) => {
      console.log("addConsultant", e.target.value);
    };*/
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
    let project = await request.get(
      `${config.path.projects.getProject}/${id}`
    );

    setCurrentProject(project);

    //add current project details text input
    document.getElementById("projectName").value = project.projectName;
    document.getElementById("ownerFirstName").value =
      project.contactInfo.firstName;
    document.getElementById("ownerLastName").value =
      project.contactInfo.lastName;
    document.getElementById("email").value = project.contactInfo.email;
    document.getElementById("phoneNumber").value =
      project.contactInfo.phoneNumber;
    document.getElementById("businessRep").value = project.businessRep;

    let consArr = [];
    let tempObj = {};

    project.consultants.forEach((id) => {
      consArr.push(
        consultantsData[0].find((consultObj) => {
          if (consultObj.value === id) {
            return true;
          }
          return false;
        })
      );
    });

    setSelectedConsultants(consArr);

    //TEMP ARR TO STORE ID OF CONSULTANTS
    let tempConsultantsArr = [];
    project.consultants.forEach((consultant) => {
      tempConsultantsArr.push({ value: consultant });
    });
    // multiselectRef.getSelectedItems = [{label: "Maarten Brits", value:"6233ca6879e591ff5cfc2f7a"}];

    /*//APPEND TEMP ARR TO
    setConsultants(tempConsultantsArr);*/
    document.getElementById("dueDate").value = project.completionDate;

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
    setProjectInputs({});

    refreshProjects();

    setTimeout(() => {
      setSuccessModalOpen(false);
      resetState();
      resetModalProjects();
    }, 1000);
  };

  /* ************************************************************************************************************
   *
   *                                          EDIT CLIENT FUNCTION
   *
   *************************************************************************************************************/
  const editClient = async (e, id) => {
    //set submit button
    setSubmitButton("Update");

    setData({
      ...data,
      title: "Edit Client",
    });

    e.stopPropagation();
    //e.preventDefault();

    //open modal
    setFeedbackModalOpen(true);

    //get current client
    let thisClient = await request.get(
      `${config.path.clients.getClient}/${id}`
    );

    setCurrentClient(thisClient);

    //add current project details text input
    document.getElementById("clientName").value = thisClient.clientName;
    document.getElementById("clientDesc").value = thisClient.clientDesc;
  };

  /////////////////////////////////// UPDATE REQUEST TO UPDATE EXISTING CLIENT  ///////////////////////////////////

  const updateClient = async (e) => {
    let req = await request.patch(
      `${config.path.clients.editClient}/${currentClient._id}`,
      clientInputs
    );
    if (req.err) {
      setError(true);
      setErrorMessage(req.error.message);
      return;
    }
    setSuccess(true);
    setSuccessMessage("Successfully Editted Client.");

    refreshClient();

    setTimeout(() => {
      setSuccessModalOpen(false);
      resetState();
      resetModalClients();
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

    let req = await request.delete(
      `${config.path.projects.deleteProject}/${currentProject._id}`
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
   *                                                 DELETE CLIENT
   *
   *************************************************************************************************************/
  const openModalClient = async (e, id) => {
    // e.preventDefault();
    e.stopPropagation();

    //get current client
    let thisClient = await request.get(
      `${config.path.clients.getClient}/${id}`
    );

    setCurrentClient(thisClient);

    ///open confirmation modal
    setDangerModalOpen(true);
  };

  /////////////////////////////////// DELETE REQUEST TO DELETE EXISTING CLIENT  ///////////////////////////////////

  const deleteClient = async (e) => {
    e.preventDefault();

    let req = await request.delete(
      `${config.path.clients.deleteClient}/${currentClient._id}`
    );
    if (req.err) {
      return;
    }

    refreshClient();

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
              {/* Search form */}
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
                <span className="hidden xs:block ml-2"> {data.add}</span>
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
                {/*
                 ********************************************** CLIENTS PART OF MODAL   **********************************************
                 */}
                {showClients && (
                  <div className="px-5 py-4">
                    {/*} <div className="text-lg">
                      <div className="font-large text-zinc-800 mb-3">
                        Please Enter Client's Details:
                      </div>
                 </div>*/}
                    <div className="space-y-3">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          Client Name
                        </label>
                        <input
                          id="clientName"
                          className="form-input w-full px-2 py-1"
                          type="text"
                          required
                          onChange={handleChangeClients}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="description"
                        >
                          Client Description
                        </label>
                        <textarea
                          id="clientDesc"
                          className="form-textarea w-full px-2 py-1"
                          rows="2"
                          required
                          onChange={handleChangeClients}
                        ></textarea>
                      </div>
                      {/* Error message */}
                      <Banner2 type="error" open={errors} setOpen={setError}>
                        {errorMessage}
                      </Banner2>
                      {/* On successful registration */}
                      <Banner2
                        type="success"
                        open={success}
                        setOpen={setSuccess}
                      >
                        {successMessage}
                      </Banner2>
                    </div>
                    {/* Modal footer */}
                    <div className="px-5 py-4 border-t border-zinc-200">
                      <div className="flex flex-wrap justify-end space-x-2">
                        <button
                          className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetState();
                            resetModalClients();
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
                  </div>
                )}
                {/*
                 ********************************************** PROJECTS PART OF MODAL   **********************************************
                 */}
                {showProjects && (
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
                            id="ownerFirstName"
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
                            id="ownerLastName"
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

                        <Multiselect
                          className="w-full mt-2"
                          id="consultants"
                          showArrow
                          options={consultantsData[0]}
                          displayValue="label"
                          closeOnSelect={false}
                          placeholder="Search for consultants"
                          onSelect={handleChangeConsultantsSelect}
                          onRemove={handleChangeConsultantsSelect}
                          selectedValues={seletedConsultants}
                          style={{
                            chips: { background: "rgb(225 29 72);" },
                            option: { color: "rgb(39 39 42)" },
                          }}
                          ref={multiselectRef}
                        />
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
                          End Date{" "}
                          {/*<span className="text-rose-500">*</span>*/}
                        </label>
                        <input
                          id="dueDate"
                          className="form-input w-full"
                          type="date"
                          onChange={handleChangeProjects}
                        />
                      </div>

                      {/* Error message */}
                      <Banner2 type="error" open={errors} setOpen={setError}>
                        {errorMessage}
                      </Banner2>
                      {/* On successful registration */}
                      <Banner2 type="success" open={success} setOpen={setError}>
                        {successMessage}
                      </Banner2>
                    </div>
                    {/* Modal footer */}
                    <div className="px-5 py-4 border-t border-zinc-200">
                      <div className="flex flex-wrap justify-end space-x-2">
                        <button
                          className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetState();
                            setSubmitButton("Add");
                            resetModalProjects();
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
                  </div>
                )}
              </ModalBasic>
              {/*
               ********************************************** Danger Modal **********************************************
               */}
              <ModalBlank
                id="danger-modal"
                modalOpen={dangerModalOpen}
                setModalOpen={setDangerModalOpen}
              >
                {/*
                 ********************************************** CLIENT DANGER MODAL PART **********************************************
                 */}
                {showClients && (
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
                          {currentClient.clientName}?
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
                          onClick={deleteClient}
                        >
                          Yes, Delete it
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/*
                 ********************************************** PROJECT DANGER MODAL PART **********************************************
                 */}
                {showProjects && (
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
                )}
              </ModalBlank>
              {/*
               ********************************************** Success Modal **********************************************
               */}
              <ModalBlank
                id="success-modal"
                modalOpen={successModalOpen}
                setModalOpen={setSuccessModalOpen}
              >
                {/*
                 ********************************************** PROJECT DANGER MODAL PART **********************************************
                 */}
                {showProjects && (
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
                )}

                {/*
                 ********************************************** CLIENT DANGER MODAL PART **********************************************
                 */}
                {showClients && (
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
                          {currentClient.clientName}?
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
                          onClick={updateClient}
                        >
                          Yes, Update it
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBlank>
            </div>
          </div>
          {/*
           ********************************************** CLIENT CARDS  **********************************************
           */}
          {/* Client Cards */}
          {showClients && (
            <div className="grid grid-cols-12 gap-6">
              {clientData &&
                clientData.map((client) => (
                  <UsersTabsCard
                    openModalClient={openModalClient}
                    editClient={editClient} //pass function to component
                    key={client._id}
                    id={client._id}
                    name={client.clientName}
                    image={Image01}
                    link={`/clients/${client._id}`} //link to client's page
                    content={client.clientDesc}
                  />
                ))}
            </div>
          )}

          {/*
           ********************************************** PROJECT CARDS  **********************************************
           */}
          {showProjects && (
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
                    consultants={project.consultants.length}

                    /*
                 consultants={project.consultants.map(
                    (consultant) => consultant.personalInfo.firstName
                  )}*/
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default UsersTabs;

{
  /*
   ********************************************** INPUT VALIDATIONS  **********************************************
   */
}

const validateClientInputs = (obj) => {
  let names = {
    clientName: "Client Name",
    clientDesc: "Client Description",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
  }
  return { valid: true };
};

const validateProjectInputs = (obj) => {
  let names = {
    projectName: "Project Name",
    ownerFirstName: "Project Owner's First Name ",
    ownerLastName: "Project Owner's Last Name ",
    email: "Email",
    phoneNumber: "Contact Number",
    dueDate: "Due Date",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
  }
  return { valid: true };
};
