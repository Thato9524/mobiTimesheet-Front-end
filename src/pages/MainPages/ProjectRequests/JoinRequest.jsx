import React from "react";

export default function JoinRequest({
  requestedProjects,
  setSelectedProject,
  selectedProject,
  updateModal,
  selectedClient,
  disable,
  resetModal,
  submitRequest
}) {
  return (
    <div className="p-3">
      <div id="title" className="">
        <h2 className="text-xl text-slate-800 font-bold mb-5">
          Request To Join Project
        </h2>
      </div>
      {requestedProjects ? (
        <div id="body">
          Select a Client:
          <div className="flex justify-center mb-5">
            <select
              id="client-selector"
              className="form-select w-full"
              onChange={updateModal}
            >
              <option disabled selected value>
                Select Client
              </option>
              {requestedProjects &&
                requestedProjects.map((client) => (
                  <>
                    <option value={client.clientName}>
                      {client.clientName}
                    </option>
                  </>
                ))}
            </select>
          </div>
          {selectedClient ? (
            <>
              Select a Project:
              <div className="flex justify-center mb-5">
                <select
                  id="project-selector"
                  className="form-select w-full"
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option disabled selected value>
                    Select Project
                  </option>
                  {requestedProjects &&
                    requestedProjects
                      .find((client) => client.clientName === selectedClient)
                      .projects.map((project) => (
                        <>
                          <option value={project._id}>
                            {project.projectName}
                          </option>
                        </>
                      ))}
                </select>
              </div>
              {requestedProjects
                .find((project) => project.clientName === selectedClient)
                .projects.find((project) => project._id === selectedProject) ? (
                <>
                  Project Manager:
                  <div className="mb-5">
                    {requestedProjects
                      .find((client) => client.clientName === selectedClient)
                      .projects.find(
                        (project) => project._id === selectedProject
                      ).businessRep.personalInfo.firstName +
                      " " +
                      requestedProjects
                        .find((client) => client.clientName === selectedClient)
                        .projects.find(
                          (project) => project._id === selectedProject
                        ).businessRep.personalInfo.lastName}
                  </div>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-center text-slate-400 text-2xl font-bold">
            <h1>No projects available for you at the moment..</h1>
          </div>
        </>
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
