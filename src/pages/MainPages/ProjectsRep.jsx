import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditMenu from "../../components/DropdownEditMenu";

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
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
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

function UsersTabsRep() {
  let da = new Date();
  // console.log("start", da);
  const { key } = useParams();
  const [data, setData] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [completedsheetData, setCompletedsheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataChange, setDataChange] = useState(false);
  const navigateTo = useNavigate();
  const { dispatch } = React.useContext(AuthContext);

  //FUNCTION TO CHECK TOKENS
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

  /* ************************************************************************************************************
   *
   *                         USE EFFECT: GETTING PROJECTS
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);
    let userId = localStorage.getItem("_id");

    //GET ALL PROJECTS FOR SPECIF C3 REP
    let getProjectsFor = await request.get(
      `${config.path.projects.getProjectsForRep}/${userId}`
    );

    let getCompletedsheet = await request.get(
      `${config.path.completedsheet.getCompletedsheets}`
    );

    setProjectData(getProjectsFor.projects);
    setCompletedsheetData(getCompletedsheet.completedsheets);
    setLoading(false);
  }, []);
  function userExists(name) {
    return completedsheetData.some(function (el) {
      return el.project === name;
    });
  }
  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

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
                My Projects
              </h1>
              <br />
              <div>
                <FontAwesomeIcon icon={faCircle} /> Timesheet Submitted
                <br />
                <FontAwesomeIcon icon={faCircleNotch} /> No Timesheet Submitted
              </div>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Search form */}
              {/* <SearchForm /> */}
              {/* Add member button */}
              {/* Send Feedback */}
              {/* Start */}

              {/*} <button
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
              aria-controls="feedback-modal"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xs:block ml-2"> BUTTON </span>
            </button> */}
            </div>
          </div>

          {/*
           ********************************************** PROJECT CARDS  **********************************************
           */}
          <div className="grid grid-cols-12 gap-6">
            {projectData.map((project) => (
              <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
                <div className="flex flex-col h-full ">
                  {/* Card top */}
                  <div className="grow p-5">
                    {/* Project name and contact details */}
                    <header>
                      <div className="text-center mb-5">
                        <Link
                          className="inline-flex text-slate-800 hover:text-slate-900"
                          to={`/approve/${project._id}`} //------> UsersTilesRep File
                        >
                          <h2 className="text-xl leading-snug justify-center font-semibold">
                            {project.projectName}
                          </h2>
                        </Link>
                      </div>
                    </header>
                    {/* Contact Info */}
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        Client Rep:
                      </div>
                      <div className="text-sm col-span-5">
                        <a href={`mailto:${project.contactInfo.email}`}>
                          {" "}
                          {project.contactInfo.firstName +
                            " " +
                            project.contactInfo.lastName}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">
                        C3 Rep:
                      </div>
                      <div className="text-sm col-span-5">
                        <a href={`mailto:${project.businessRep.email}`}>
                          {project.businessRep.personalInfo.firstName +
                            " " +
                            project.businessRep.personalInfo.lastName}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
                      <div className="text-sm col-span-5 font-bold">Team:</div>
                      <div className="text-sm col-span-5">
                        {project.consultants.slice(0, 2).map((item) => (
                          <div>
                            {item.personalInfo.firstName +
                              " " +
                              item.personalInfo.lastName}
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="border-t border-slate-200">
                    <Link
                      className="block text-center text-sm text-rose-500 hover:text-rose-600 font-medium px-3 py-4"
                      to={`/approve/${project._id}`} //------> UsersTilesRep File
                    >
                      <div className="flex items-center justify-center">
                        <div className="h-5% w-5% bg-red-500"></div>
                        {userExists(project._id) ? (
                          <FontAwesomeIcon
                            icon={faCircle}
                            className="p-2"
                            color="#3E3E3F"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCircleNotch}
                            className="p-2"
                            color="#3E3E3F"
                          />
                        )}

                        <span>See Timesheets</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default UsersTabsRep;

/*
 <UsersTabsCardProjects
                  openModalProject=""
                  editProject="" //pass function to component
                  key={project._id}
                  id={project._id}
                  name={project.projectName} // let projName = projectData.projects[0].projectName; project.projects[project].projectName
                  contactInfo={{
                    name: `${project.contactInfo.firstName} ${project.contactInfo.lastName}`,
                    email: project.contactInfo.email,
                  }}
                  link={`/projects/${project._id}`} //LINK TO TIMESHEET OF PROJECT /projects/:key/
                  businessRep={{
                    name: `${project.businessRep.personalInfo.firstName} ${project.businessRep.personalInfo.lastName}`,
                    email: project.businessRep.email,
                  }}
                  consultants={project.consultants.length}
                />
                */
