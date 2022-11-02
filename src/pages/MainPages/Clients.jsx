import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SearchForm from "../../partials/actions/SearchForm";
import UsersTabsCard from "../../partials/community/UsersTabsCard";
import ModalBasic from "../../components/ModalBasic";
import request from "../../handlers/request";
import Banner2 from "../../components/Banner2";
import ModalBlank from "../../components/ModalBlank";
import PreLoader from "../../components/PreLoader";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import ClientContext from "../../ClientContext";

import Image01 from "../../images/user-64-01.jpg";
import config from "../../config";

function UsersTabs() {
  const { key } = useParams();
  const [data, setData] = useState({});
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const navigateTo = useNavigate();
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitButton, setSubmitButton] = useState("Add");
  const [clientInputs, setClientInputs] = useState({}); //INPUTS FOR NEW INFO
  const [currentClient, setCurrentClient] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const { dispatch } = React.useContext(AuthContext);

  const { setClients } = useContext(ClientContext);

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

  //CLEAR ALL TEXT FIELDS
  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    Array.from(document.querySelectorAll("textarea")).forEach(
      (textarea) => (textarea.value = "")
    );
    //setConsultants([{ id: 0 }]); //reset number of selects to 1 with non matching employee id Z
  };

  //RESET SPECIFIC STATE VARIABLES
  const resetState = () => {
    // // console.log("reset")
    setFeedbackModalOpen(false);
    setSuccess(false);
    setError(false);
    setClientInputs({
      clientName: "",
      clientDesc: "",
    });
    clearInputs();
    resetModalClients();
  };

  //RESET MODAL TO ADD OPTIONS FOR CLIENTS
  const resetModalClients = () => {
    setSubmitButton("Add");
    setData({
      ...data,
      title: "Add New Client",
    });
  };

  //FUNCTION TO REFRESH CLIENTS COMPONENTS
  const refreshClient = async () => {
    checkToken();
    setLoading(true);
    let getClients = await request.get(config.path.clients.getAll);
    setClients(getClients);
    setClientData(getClients);
    setLoading(false);
  };

  //FUNCTION TO CHECK TOKENS
  const checkToken = async () => {
    // // console.log("checkToken()");
    let authToken = localStorage.getItem("auth-token");
    //let checkToken = await request.get(config.path.checkToken);
    //if (!(checkToken.ok)) {
    if (isJwtExpired(authToken)) {
      // // console.log("experied");
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      // console.log("login out...");
      navigateTo("/signin");
    }
  };
  /* ************************************************************************************************************
   *
   *                         USE EFFECT: GETTING CLIENTS
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);
    setSubmitButton("Add");

    //GET ALL CLIENTS IN THE DB
    let getClients = await request.get(config.path.clients.getAll);
    setClientData(getClients);

    setData({
      ...data,
      title: "Add New Client",
    });

    setClientInputs({
      clientName: "",
      clientDesc: "",
    });

    setLoading(false);
  }, [key]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  /* ************************************************************************************************************
   *
   *                                          SUBMIT FORM FUNCTION
   *
   *************************************************************************************************************/

  const submitForm = async (e) => {
    e.preventDefault();

    ///////////////////////////////////  ADDING A NEW CLIENT  ///////////////////////////////////
    if (submitButton == "Add") {
      ///////////////////////////////////  VALIDATING CLIENT FORM  ///////////////////////////////////

      //VALIDATE CLIENT INPUTS
      let validate = await validateClientInputs(clientInputs);
      if (!validate.valid) {
        setError(true);
        setErrorMessage(validate.msg);
        return;
      }
      setError(false);

      /////////////////////////////////// POST REQUEST TO CREATE NEW CLIENT  ///////////////////////////////////

      let req = await request.post(
        config.path.clients.createClient,
        clientInputs,
        true
      );
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

    ///////////////////////////////////  UPDATING A NEW CLIENT  ///////////////////////////////////
    else {
      e.stopPropagation();
      //VALIDATE CLIENT INPUTS
      let validate = await validateClientInputs(clientInputs);
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

    /*const addProp = async () => {};

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const addConsultant = (e) => {
      // console.log("addConsultant", e.target.value);
    };*/
  };

  /* ************************************************************************************************************
   *
   *                                          EDIT CLIENT FUNCTION
   *
   *************************************************************************************************************/
  const editClient = async (e, id) => {
    e.stopPropagation();
    //e.preventDefault();

    //set submit button
    setSubmitButton("Update");

    setData({
      ...data,
      title: "Edit Client",
    });

    //open modal
    setFeedbackModalOpen(true);

    //get current client
    let thisClient = await request.get(
      `${config.path.clients.getClient}/${id}`
    );

    setCurrentClient(thisClient);

    setClientInputs({
      clientName: thisClient.clientName,
      clientDesc: thisClient.clientDesc,
    });

    //add current client details to text input
    document.getElementById("clientName").value = thisClient.clientName;
    document.getElementById("clientDesc").value = thisClient.clientDesc;
  };

  /////////////////////////////////// UPDATE REQUEST TO UPDATE EXISTING CLIENT  ///////////////////////////////////

  const updateClient = async (e) => {
    setLoading(true);
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
      resetState();
      //resetModalClients();
      //setSuccessModalOpen(false);
    }, 1000);
    setLoading(false);
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
    setLoading(true);

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
    setLoading(false);
  };

  const openFM = async (e) => {
    e.stopPropagation();
    // e.preventDefault();
    // console.log("clicked");
    //setSuccessModalOpen(true);
    setFeedbackModalOpen(true);
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
                Convergenc3 Clients
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
                onClick={openFM}
              >
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="hidden xs:block ml-2"> Add New Client</span>
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
                        rows="4"
                        //uncomment to add max characters
                        // maxLength={200}
                        required
                        onChange={handleChangeClients}
                      ></textarea>
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
                  {/* Modal footer */}
                  <div className="px-5 py-4 border-t border-zinc-200">
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetState();
                          //resetModalClients();
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
                        Are you sure you want update {currentClient.clientName}?
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
              </ModalBlank>
            </div>
          </div>
          {/*
           ********************************************** CLIENT CARDS  **********************************************
           */}
          {/* Client Cards */}
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
                  link={`/clients/${client._id}/projects`} //link to client's page --> UsersTabsAdmin
                  content={client.clientDesc}
                />
              ))}
          </div>
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
    if (obj[i] == "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
  }
  return { valid: true };
};
