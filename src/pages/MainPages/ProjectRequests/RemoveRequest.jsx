import React from "react";
import { useEffect } from "react";

export default function RemoveRequest({
  projectsData,
  setSelectedClient,
  selectedClient,
  setSelectedProject,
  disable,
  submitRequest,
  resetModal,
}) {
  const _id = localStorage.getItem("_id");
  return (
    <div className="p-3">
      <div id="title" className="">
        <h2 className="text-xl text-slate-800 font-bold mb-5">
          Request To Remove Project
        </h2>
      </div>
      {projectsData &&
      projectsData.filter((project) => project.client.clientName !== "Internal")
        .length > 0 ? (
        <div id="body">
          Select a Client:
          <div className="flex justify-center mb-5">
            <select
              id="client-selector"
              className="form-select w-full"
              onChange={(e) => setSelectedClient(e.currentTarget.value)}
            >
              <option disabled selected value>
                Select Client
              </option>
              {projectsData &&
                projectsData
                  .filter((project) => project.client.clientName !== "Internal")
                  .map((project) => (
                    <>
                      <option value={project.client.clientName}>
                        {project.client.clientName}
                      </option>
                    </>
                  ))}
            </select>
          </div>
          {selectedClient && (
            <div>
              Select a Project:
              <div className="flex justify-center mb-5">
                <select
                  id="project-selector"
                  className="form-select w-full"
                  onChange={(e) => setSelectedProject(e.currentTarget.value)}
                >
                  <option disabled selected value>
                    Select Project
                  </option>
                  {projectsData &&
                    projectsData
                      .filter(
                        (project) =>
                          project.client.clientName === selectedClient &&
                          project.businessRep._id !== _id
                      )
                      .map((project) => (
                        <>
                          <option value={project.projectName}>
                            {project.projectName}
                          </option>
                        </>
                      ))}
                </select>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center text-slate-400 text-2xl font-bold">
          <h1>No projects available for you at the moment..</h1>
        </div>
      )}
      <div id="footer" className="flex flex-wrap justify-end space-x-2">
        <button
          onClick={resetModal}
          className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
        >
          Cancel
        </button>
        <button
          className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
          disabled={disable ? true : false}
          onClick={submitRequest}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
