import React, { useState, useEffect } from "react";

import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import RecruitmentCard from "./RecruitmentPartials/RecruitmentCard";

import TasksGroups from "../../partials/tasks/TasksGroups";

function ConsultantRecruitment() {
  const [loading, setLoading] = useState(true);
  const [devRecruitData, setDevRecruitData] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();

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

  useEffect(async () => {
    setLoading(true);

    let devRecruits = await request.get(
      config.path.recruitment.getAllConsultantRecruits
    );

    if (!devRecruits.err) {
      setDevRecruitData(devRecruits);
    }

    setLoading(false);
  }, []);

  useEffect(async () => {
    checkToken();
  }, [request]);

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
                Consultant Recruitment
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add board button */}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-x-4 gap-y-8">
            {/* Tasks column */}
            <TasksGroups title="Review">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Review") {
                  return <RecruitmentCard recruit={devRecruit} />;
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="1st Interview">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "1st Interview") {
                  return <RecruitmentCard recruit={devRecruit} />;
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="2nd Interview">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "2nd Interview") {
                  return <RecruitmentCard recruit={devRecruit} />;
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="Technical Test">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Technical Test") {
                  return <RecruitmentCard recruit={devRecruit} />;
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="Dear John">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Dear John") {
                  return <RecruitmentCard recruit={devRecruit} />;
                }
              })}
            </TasksGroups>
          </div>
        </div>
      )}
    </main>
  );
}

export default ConsultantRecruitment;
