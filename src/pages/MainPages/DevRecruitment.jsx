import React, { useState, useEffect } from "react";

import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import RecruitmentCard from "./RecruitmentPartials/RecruitmentCard";
import SideModal from "./RecruitmentPartials/SideModal";

import TasksGroups from "../../partials/tasks/TasksGroups";

function DevRecruitment() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [devRecruitData, setDevRecruitData] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();

  const [type, setType] = useState("dev");

  const [showModal, setShowModal] = useState(false);

  const [stage, setStage] = useState("");

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

    if (type === "dev") {
      let devRecruits = await request.get(
        config.path.recruitment.getAllDevRecruits
      );

      if (!devRecruits.err) {
        setDevRecruitData(devRecruits);
      }
    } else if (type === "consultant") {
      let consultantRecruits = await request.get(
        config.path.recruitment.getAllConsultantRecruits
      );

      if (!consultantRecruits.err) {
        setDevRecruitData(consultantRecruits);
      }
    }

    setLoading(false);

    if (stage !== "") {
      setStage("");
    }
  }, [stage]);

  useEffect(async () => {
    checkToken();
  }, [request]);

  const handleClick = (id) => {
    setShowModal(true);
    setId(id);
  };

  const loadDevs = async () => {
    setType("dev");
    setLoading(true);

    let devRecruits = await request.get(
      config.path.recruitment.getAllDevRecruits
    );

    if (!devRecruits.err) {
      setDevRecruitData(devRecruits);
    }

    setLoading(false);
  };

  const loadConsultants = async () => {
    setType("consultants");
    setLoading(true);

    let devRecruits = await request.get(
      config.path.recruitment.getAllConsultantRecruits
    );

    if (!devRecruits.err) {
      setDevRecruitData(devRecruits);
    }

    setLoading(false);
  };

  return (
    <main>
      {showModal && (
        <SideModal
          id={id}
          type={type}
          changeState={setShowModal}
          changeStage={setStage}
        />
      )}
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
                {type === "dev"
                  ? "Developer Recruitment"
                  : "Consultant Recruitment"}
              </h1>
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add board button */}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 border-b border-slate-200">
            <ul className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <div
                  onClick={loadDevs}
                  className={`${
                    type === "dev" ? "text-indigo-500" : "text-slate-500"
                  } whitespace-nowrap cursor-pointer`}
                >
                  Developers
                </div>
              </li>
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <div
                  onClick={loadConsultants}
                  className={`${
                    type === "consultants"
                      ? "text-indigo-500"
                      : "text-slate-500"
                  } whitespace-nowrap cursor-pointer`}
                >
                  Consultants
                </div>
              </li>
            </ul>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-x-4 gap-y-8">
            {/* Tasks column */}
            <TasksGroups title="Review">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Review") {
                  return (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleClick(devRecruit._id)}
                      key={index}
                    >
                      <RecruitmentCard recruit={devRecruit} />
                    </div>
                  );
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="1st Interview">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "1st Interview") {
                  return (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleClick(devRecruit._id)}
                      key={index}
                    >
                      <RecruitmentCard key={index} recruit={devRecruit} />
                    </div>
                  );
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            {type === "consultants" && (
              <TasksGroups title="2nd Interview">
                {devRecruitData.map((devRecruit, index) => {
                  if (devRecruit.stage === "2nd Interview") {
                    return (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleClick(devRecruit._id)}
                        key={index}
                      >
                        <RecruitmentCard key={index} recruit={devRecruit} />
                      </div>
                    );
                  }
                })}
              </TasksGroups>
            )}
            {/* Tasks column */}
            {type === "consultants" && (
              <TasksGroups title="Technical Test">
                {devRecruitData.map((devRecruit, index) => {
                  if (devRecruit.stage === "Technical Test") {
                    return (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleClick(devRecruit._id)}
                        key={index}
                      >
                        <RecruitmentCard key={index} recruit={devRecruit} />
                      </div>
                    );
                  }
                })}
              </TasksGroups>
            )}
            {type === "dev" && (
              <TasksGroups title="Stefan Interview">
                {devRecruitData.map((devRecruit, index) => {
                  if (devRecruit.stage === "Stefan Interview") {
                    return (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleClick(devRecruit._id)}
                        key={index}
                      >
                        <RecruitmentCard key={index} recruit={devRecruit} />
                      </div>
                    );
                  }
                })}
              </TasksGroups>
            )}
            <TasksGroups title="Accepted">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Accepted") {
                  return (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleClick(devRecruit._id)}
                      key={index}
                    >
                      <RecruitmentCard key={index} recruit={devRecruit} />
                    </div>
                  );
                }
              })}
            </TasksGroups>
            {/* Tasks column */}
            <TasksGroups title="Dear John">
              {devRecruitData.map((devRecruit, index) => {
                if (devRecruit.stage === "Dear John") {
                  return (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleClick(devRecruit._id)}
                      key={index}
                    >
                      <RecruitmentCard key={index} recruit={devRecruit} />
                    </div>
                  );
                }
              })}
            </TasksGroups>
          </div>
        </div>
      )}
    </main>
  );
}

export default DevRecruitment;
