import React, { useState, useEffect } from "react";
import request from "../../handlers/request";
import config from "../../config";
import PreLoader from "../../components/PreLoader";
import { PropTypes } from "prop-types";
import "./profile.css";
import UserAvatar from "../../images/avatar-001.png";
import Icon03 from "../../images/icon-03.svg";
import ProfileBg from "../../images/MicrosoftTeams-imageee3c608c5bf344a84d21d87ade4be7129ab0046cfda60b73fe847a83739942f0.png";
import { Box, createTheme, Tab, Tabs, ThemeProvider } from "@mui/material";
import StudyCostFunding from "../community/profileForms/StudyCostFunding";
import TravelAllowance from "../community/profileForms/TravelAllowance";
import Leave from "../MainPages/Leave";
import ExpenseReimbursement from "../community/profileForms/ExpenseReimbursement";
import styled from "@emotion/styled";
import TimesheetReview from "../community/profileForms/TimesheetReview";
import ReaModal from "../../components/ReaModal";
import SkillsFriday from "../community/profileForms/SkillsFriday";
import { AuthContext } from "../../App";
import { isJwtExpired } from "jwt-check-expiration";
import JoinRequest from "./ProjectRequests/JoinRequest";
import NewRequest from "./ProjectRequests/NewRequest";
import RemoveRequest from "./ProjectRequests/RemoveRequest";
import ClientContext from "../../ClientContext";
import idleTimeout from "../../utils/idleTimeOut"

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

//CUSTOM TABS COMPONENT CONTAINER
const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#f33f5f",
  },
});

//CUSTOM TAB COMPONENT
const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: "text-zinc-500",
    "&:hover": {
      color: "#f26680",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#f33f5f",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

//TAB CONTENT CONTAINER
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
//TAB CONTENT PROP TYPES
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

//FUNCTION FOR THE TABS INDEXING
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Profile() {
  const { dispatch } = React.useContext(AuthContext);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [personalData, setPersonalData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [gotData, setGotData] = useState(false);
  const [loading, setLoading] = useState(true);

  // PROFILE BODY CONSTANTS
  const [disable, setDisable] = useState(false);
  const [trainingDays, setTrainingDays] = useState([]);
  const [trainingDay, setTrainingDay] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const { globalClients } = React.useContext(ClientContext);
  const [requestedProjects, setRequestedProjects] = useState([
    {
      _id: "",
      client: {},
      clientName: "",
      projects: [],
    },
  ]);
  const [value, setValue] = useState(0);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [inputs, setInputs] = useState({
    projectName: "",
    desc: ""
  });
  const [Imageurl, setImageurl] = useState("");
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [projectValue, setProjectValue] = useState(0);
  const [fieldInputs, setFieldInputs] = useState();

  //HANDLING A CHANGE IN TABS
  function handleChange(event, newValue) {
    
    setValue(newValue);
  }

  const checkToken = async () => {
    // console.log("checkToken()");
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

  
  useEffect(async () => {
    try {
     
      checkToken();
      setLoading(true);
      const _id = localStorage.getItem("_id");
      let isTrainingDay = localStorage.getItem("isTrainingDay"),
        getTrainingDays;

      setTrainingDay(isTrainingDay === "true" ? true : false);
      if (isTrainingDay) {
        getTrainingDays = await request.get(
          config.path.events.getAllTrainingDays
        );
        if (getTrainingDays.err) {
          setLoading(false);
          return;
        }
        setTrainingDays(getTrainingDays);
      }

      // GET USER INFORMATION FOR PROFILE
      let getData = await request.get(
        `${config.path.profile.getProfile}`,
        true
      );
      setPersonalData(getData);
      if (getData.profilePictureKey !== "none") {
        setImageurl(
          `${config.url}/${config.path.s3.getFile}/${getData.profilePictureKey}`
        );
      }

      //GET PROJECTS FOR USER
      let getProjects = await request.get(
        `${config.path.projects.getProjectsFor}/${_id}`
      );

      //GET REQUESTED PROJECTS
      let requested = await request.get(
        `${config.path.projects.getProjectsNotIn}/${_id}`
      );

      if (requested.err) {
        setMessage(requested.message);
        setError(true);
      } else {
        setRequestedProjects(requested);
      }

      setProjectsData(getProjects.projects);
      setGotData(true);
      setLoading(false);
      idleTimeout();
    } catch (err) {
      setLoading(false);
      setError(true);
      setMessage(err.message);
    }
  }, []);

  const validate = () => {
    if (selectedClient === "") {
      setMessage("Client is not selected.");
      setErrorModalOpen(true);
      return false;
    } else if (selectedProject === "") {
      setMessage("Project is not selected.");
      setErrorModalOpen(true);
      return false;
    } else {
      return true;
    }
  };

  const createValidation = () => {
    try {
      if (selectedClient === "") {
        setMessage("Client is not selected.");
        setErrorModalOpen(true);
        return false;
      } else if (!inputs.projectName) {
        setMessage("Project Name is required.");
        setErrorModalOpen(true);
        return false;
      } else if (!inputs.desc) {
        setMessage("Description is required.");
        setErrorModalOpen(true);
        return false;
      } else if (inputs.desc.length <= 5) {
        setMessage("Description needs to be more than 5 characters long.");
        setErrorModalOpen(true);
        return false;
      } else {
        return true;
      }
    } catch (err) {
      setMessage(err.message);
      setErrorModalOpen(true);
      return false;
    }
  };

  async function submitCreateRequest() {
    try {
      let valid = createValidation();
      if (!valid) {
        return;
      }
      setDisable(true);
      let req;

      req = {
        ...inputs,
        client: selectedClient,
      };
      let response = await request.post(
        `${config.path.projects.requestToCreate}`,
        req,
        true
      );

      if (response.err) {
        setMessage(response.error.message);
        setErrorModalOpen(true);
      } else {
        setRequestModalOpen(false);
        setMessage(response);
        setSuccess(true);
      }
    } catch (err) {
      setMessage(err.message);
      setErrorModalOpen(true);
    }
  }

  async function submitRemoveRequest() {
    try {
      let valid = validate();
      if (!valid) {
        return;
      }
      setDisable(true);
      let req;

      req = {
        project: selectedProject,
      };

      let response = await request.post(
        `${config.path.projects.requestRemoval}`,
        req,
        true
      );

      if (response.err) {
        setMessage(response.error.message);
        setErrorModalOpen(true);
      } else {
        setRequestModalOpen(false);
        setMessage(response);
        setSuccess(true);
      }
    } catch (err) {
      setMessage(err.message);
      setErrorModalOpen(true);
    }
  }

  async function submitJoinRequest() {
    let valid = validate();

    if (!valid) {
      return;
    }

    try {
      const _id = localStorage.getItem("_id");
      setDisable(true);
      let req;

      req = {
        project: selectedProject,
        user: _id,
      };

      let response = await request.post(
        `${config.path.projects.requestToJoin}`,
        req,
        true
      );

      if (response.err) {
        setMessage(response.message);
        setErrorModalOpen(true);
      } else {
        setRequestModalOpen(false);
        setMessage(response);
        setSuccess(true);
      }
    } catch (err) {
      setMessage(err.message);
      setErrorModalOpen(true);
    }
  }

  function resetModal() {
    try {
      setSuccess(false);
      setError(false);
      setDisable(false);
      setRequestModalOpen(false);
      setSelectedClient("");
      setSelectedProject("");
      document.getElementById("project-selector").value = "";
      document.getElementById("client-selector").value = "";
      setProjectValue(0);
    } catch (err) {
      setRequestModalOpen(false);
      setSelectedClient("");
      setSelectedProject("");
    }
  }

  function updateModal(e) {
    setSelectedClient(e.target.value);
    if (selectedProject !== "") {
      setSelectedProject(
        requestedProjects.find((client) => client.clientName === e.target.value)
          .projects[0]._id
      );
    }
  }

  const projectValueChange = (e, value) => {
    setProjectValue(value);
    setSelectedClient("");
    setSelectedProject("");
  };

  const updateInputs = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <main>
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <div className="relative flex">
          {/* Profile body */}
          {gotData && (
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
                  {/* <div className="sm:flex-row sm:justify-between sm:items-end"> */}
                  {/* Avatar */}
                  {/* <div className="inline-flex -ml-1 -mt-1 mb-4 sm:mb-0">
                      <Avatar
                        style={{ width: "100px", height: "100px" }}
                        avatarStyle="Circle"
                        {...generateRandomAvatarOptions()}
                        alt="Avatar"
                      />
                      </div> */}
                  {/* <div className="inline-flex -ml-1 -mt-1 sm:mb-0"> */}
                  <img
                    className="w-20 h-20 rounded-full mb-1"
                    src={Imageurl ? Imageurl : UserAvatar}
                    width="80"
                    height="80"
                    alt="Avatar"
                  />
                  {/* </div> */}

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
                  {/* </div> */}
                </div>

                {/* Header */}
                <header className="text-left sm:text-left mb-6">
                  {/* Name */}
                  <div className="flex justify-between mb-4">
                    <div className="inline-flex">
                      <h1 className="text-2xl text-zinc-800 font-bold">
                        {personalData.personalInfo.firstName}{" "}
                        {personalData.personalInfo.lastName}
                      </h1>
                    </div>
                  </div>
                  {/* Bio 
                <div className="text-sm mb-3">
                  Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP
                  Lover.
                </div>*/}
                  <div className="text-sm mb-3">{personalData.type}</div>
                  {/* Meta */}
                  <div className="flex flex-wrap justify-left sm:justify-start space-x-4">
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
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    className="relative text-sm font-small flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar"
                  >
                    <ThemeProvider theme={theme}>
                      <CustomTabs
                        value={value}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="fullWidth"
                      >
                        <CustomTab label="Profile" {...a11yProps(0)} />
                        <CustomTab
                          label="Expense Reimbursement"
                          {...a11yProps(1)}
                        />
                        <CustomTab
                          label="Study Cost Funding"
                          {...a11yProps(2)}
                        />
                        <CustomTab label="Travel Allowance" {...a11yProps(3)} />
                        <CustomTab
                          label="Portal Recommendations"
                          {...a11yProps(4)}
                        />
                        <CustomTab
                          label="Skills Friday Attendance"
                          {...a11yProps(5)}
                        />
                        <CustomTab label="Leave" {...a11yProps(6)} />
                      </CustomTabs>
                    </ThemeProvider>
                  </Box>
                  <ThemeProvider theme={theme}>
                    <TabPanel value={value} index={0}>
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
                                onClick={() => {
                                  setErrorModalOpen(false);
                                  setDisable(false);
                                }}
                              >
                                Okay
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
                                onClick={resetModal}
                              >
                                Okay
                              </button>
                            </div>
                          </div>
                        </div>
                      </ReaModal>
                      <ReaModal
                        id="project-requests"
                        modalOpen={requestModalOpen}
                        setModalOpen={setRequestModalOpen}
                      >
                        <Tabs
                          value={projectValue}
                          onChange={projectValueChange}
                          variant="fullWidth"
                          centered
                        >
                          <CustomTab label="Join" {...a11yProps(0)} />
                          <CustomTab label="Request New" {...a11yProps(1)} />
                          <CustomTab label="Remove" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={projectValue} index={0}>
                          <JoinRequest
                            updateModal={updateModal}
                            requestedProjects={requestedProjects}
                            setSelectedProject={setSelectedProject}
                            selectedProject={selectedProject}
                            selectedClient={selectedClient}
                            disable={disable}
                            resetModal={resetModal}
                            submitRequest={submitJoinRequest}
                          />
                        </TabPanel>
                        <TabPanel value={projectValue} index={1}>
                          <NewRequest
                            clients={globalClients}
                            setSelectedClient={setSelectedClient}
                            selectedClient={selectedClient}
                            submitRequest={submitCreateRequest}
                            disable={disable}
                            resetModal={resetModal}
                            updateInputs={updateInputs}
                          />
                        </TabPanel>
                        <TabPanel value={projectValue} index={2}>
                          <RemoveRequest
                            projectsData={projectsData}
                            setSelectedClient={setSelectedClient}
                            setSelectedProject={setSelectedProject}
                            selectedClient={selectedClient}
                            disable={disable}
                            resetModal={resetModal}
                            submitRequest={submitRemoveRequest}
                          />
                        </TabPanel>
                      </ReaModal>
                      {/* Profile content */}
                      <div className="flex flex-col xl:flex-row xl:space-x-16 mt-5">
                        {/* Main content */}
                        <div className="space-y-5 mb-8 xl:mb-0">
                          {/* About Me */}
                          <div>
                            <h2 className="text-zinc-800 font-semibold mb-2">
                              About Me
                            </h2>
                            <div className="text-sm space-y-2">
                              <p>{personalData.personalInfo.about}</p>
                            </div>
                          </div>

                          {/* Departments */}
                          <div>
                            <div className="flex justify-content items-center">
                              <h2 className="text-zinc-800 font-semibold mb-3">
                                Projects
                              </h2>
                              <button
                                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white mb-3 ml-3"
                                onClick={() => setRequestModalOpen(true)}
                              >
                                Project Requests
                              </button>
                            </div>

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
                                      {project.client
                                        ? project.client.clientName
                                        : ""}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                                    <div className="text-sm col-span-5 font-bold">
                                      Client Rep:
                                    </div>
                                    <div className="text-sm col-span-5">
                                      <a
                                        href={`mailto:${project.contactInfo.email}`}
                                      >
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
                                      {project.businessRep.personalInfo
                                        .firstName +
                                        " " +
                                        project.businessRep.personalInfo
                                          .lastName}{" "}
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
                                    <div className="text-sm col-span-5 font-bold">
                                      Team:
                                    </div>
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
                               
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                    
                        </div>

                        {/* Sidebar */}
                        <aside className="xl:min-w-56 xl:w-56 space-y-3">
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">Title</h3>
                            <div>{personalData.personalInfo.title}</div>
                          </div>
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">
                              Location
                            </h3>
                            <div>{personalData.personalInfo.city} - Remote</div>
                          </div>
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">Email</h3>
                            <div>{personalData.email}</div>
                          </div>
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">
                              Birthdate
                            </h3>
                            <div>{personalData.personalInfo.birthDate}</div>
                          </div>
                          {/* Strengths */}
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">
                              Strengths
                            </h3>
                            {personalData.strengthInfo.map((strength) => (
                              <div>{strength}</div>
                            ))}
                          </div>
                          <div className="text-sm">
                            <h3 className="font-medium text-zinc-800">
                              Joined C3
                            </h3>
                            <div>{personalData.personalInfo.joinedDate}</div>
                          </div>
                        </aside>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <ExpenseReimbursement />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <StudyCostFunding />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <TravelAllowance />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <TimesheetReview />
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      <SkillsFriday
                        trainingDays={trainingDays}
                        user={personalData}
                        isTrainingDay={trainingDay}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      <Leave />
                    </TabPanel>
                  </ThemeProvider>
                 
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Profile;
