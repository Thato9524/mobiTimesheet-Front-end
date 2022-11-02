import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SearchForm from "../../partials/actions/SearchForm";
import UsersTilesCard from "../../partials/community/UsersTilesCard";
import PaginationNumeric from "../../components/PaginationNumeric";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";

import Image01 from "../../images/user-64-01.jpg";
import Image02 from "../../images/user-64-02.jpg";
import Image03 from "../../images/user-64-03.jpg";
import Image04 from "../../images/user-64-04.jpg";
import Image05 from "../../images/user-64-05.jpg";
import Image06 from "../../images/user-64-06.jpg";
import Image07 from "../../images/user-64-07.jpg";
import Image08 from "../../images/user-64-08.jpg";
import Image09 from "../../images/user-64-09.jpg";
import Image10 from "../../images/user-64-10.jpg";
import Image11 from "../../images/user-64-11.jpg";
import Image12 from "../../images/user-64-12.jpg";
import request from "../../handlers/request";
import config from "../../config";
import PreLoader from "../../components/PreLoader";

function UsersTilesRep() {
  const [gotData, setGotData] = useState(false);
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();
  const [completedsheetData, setCompletedsheetData] = useState([]);

  const { key } = useParams();

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
   *                                USE EFFECT: GETTING MONTHS
   *
   *************************************************************************************************************/

  useEffect(async () => {
    setLoading(true);

    //// console.log("id ",localStorage.getItem("_id"));
    let _id = localStorage.getItem("_id");

    let getCompletedsheet = await request.get(
      `${config.path.completedsheet.getCompletedsheet}/${key}`,
      true
    );

    await setCompletedsheetData(getCompletedsheet);
    //GET MONTHS
    let getData = await request.get(config.path.timesheet.month, true);
    // // console.log(gotData);
    if (getData.err) {
      return;
    }
    setData(getData.data);

    //GET CLIENT NAME, PROJECT NAME, MONTH NAME
    let getProject = await request.get(
      `${config.path.projects.getProject}/${key}`
    );
    let client = await request.get(
      `${config.path.clients.getClient}/${getProject.client}`
    );

    setInfo({
      project: getProject.projectName,
      client: client.clientName,
    });

    setGotData(true);
    // console.log("data", getData.data);

    setLoading(false);
  }, [gotData]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);
  function userExist(name) {
    return completedsheetData.some(function (el) {
      return el.month === name;
    });
  }
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
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Months 📆
              </h1>
              <h2 className="text-xl md:text-xl text-slate-800">
                {info.client}
              </h2>
              {info.project}
            </div>

            {/* Right: Actions */}
            {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Search form 
            <SearchForm />
            {/* Add member button 
            <button
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
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
              <span className="hidden xs:block ml-2">Add New Month</span>
            </button>
          </div>*/}
          </div>
          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">
            {gotData &&
              data.map((item) => {
                //// console.log(item);
                return (
                  <UsersTilesCard
                    userExists={userExist}
                    completedSheets={completedsheetData}
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    link={`/approve/${key}/${item._id}`} //approve/projectID/monthID ---------> OrdersRep
                    data={item}
                    desc={item.desc}
                    linkTitle="Approve Timesheets"
                    // location={item.location}
                    // content={item.content}
                  />
                );
              })}
          </div>

          {/* Pagination 
        <div className="mt-8">
          <PaginationNumeric />
        </div>*/}
        </div>
      )}
    </main>
  );
}

export default UsersTilesRep;
