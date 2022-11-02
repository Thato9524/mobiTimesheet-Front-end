import React, { useState, useEffect } from "react";

function TimesheetProjectTabs(props) {
  const handleProjectChange = (project) => {
    props.setSelectedProject(project._id);
    props.getTimesheetData(project._id);
    props.setSelectedProjectName(project.projectName);
  };

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <div className="flex">
        {props.allProjectsData.map((project) =>
          project.client.clientName == "Internal" ? (
            <div
              className={
                project._id == props.selectedProject
                  ? "font-semibold text-white px-5 py-2 bg-rose-500 hover:cursor-pointer hover:shadow-xl"
                  : "font-semibold text-rose-800 px-5 py-2 bg-rose-100 hover:cursor-pointer hover:shadow-xl"
              }
              onClick={() => {
                handleProjectChange(project);
              }}
            >
              {project.projectName}
            </div>
          ) : (
            <div
              className={
                project._id == props.selectedProject
                  ? "font-semibold text-white px-5 py-2 bg-indigo-500 hover:cursor-pointer hover:shadow-xl"
                  : "font-semibold text-indigo-800 px-5 py-2 bg-indigo-100 hover:cursor-pointer hover:shadow-xl"
              }
              onClick={() => {
                handleProjectChange(project);
              }}
            >
              {project.projectName}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TimesheetProjectTabs;
