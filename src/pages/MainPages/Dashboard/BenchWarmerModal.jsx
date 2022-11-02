import React, { useEffect, useState } from "react";
import config from "../../../config";
import request from "../../../handlers/request";
import PreLoader from "../../../components/PreLoader";
import UserAvatar from "../../../images/avatar-001.png";

export default function BenchWarmerModal({ id, changeState }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [imageURL, setImageURL] = useState("");

  useEffect(async () => {
    setLoading(true);
    setImageURL("");
    let getUser = await request.get(`${config.path.users.getBenchUser}/${id}`);

    if (!getUser.err) {
      console.log(getUser);
      setUser(getUser.user);
      setProjects(getUser.projects);
      if (getUser.user.profilePictureKey != "none" ) {
        setImageURL(
          `${config.url}${config.path.s3.getFile}/${getUser.user.profilePictureKey}`
        );
      }
    }

    setLoading(false);
  }, [id]);
  return (
    <div
      className="fixed right-0 bg-white shadow-lg px-6 h-screen overflow-auto z-10"
      style={{ width: "50vw", paddingBottom: "80px" }}
    >
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <>
          <div className="sm:flex sm:justify-between sm:items-center mb-8 py-3 border-b border-slate-200 z-10">
            <div className="grid grid-flow-col sm:auto-row-max justify-start sm:justify-end gap-2">
              <button
                className="text-slate-400 cursor-pointer hover:text-slate-500"
                onClick={changeState}
              >
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current Icon CloseIcon">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center pl-3 pb-3">
            <div className="flex justify-center">
              <div className="flex items-center">
                <img
                  className="w-20 h-20 rounded-full mb-1"
                  src={imageURL !== "" ? imageURL : UserAvatar}
                  width="80"
                  height="80"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl text-slate-500 font-bold">
                {user
                  ? user.personalInfo.firstName +
                    " " +
                    user.personalInfo.lastName
                  : ""}
              </h1>
              <h3 className="text-xl text-slate-500 font-bold">
                {user ? user.type : ""}
              </h3>
              <h3 className="text-sm text-rose-500 font-bold">
                {user ? user.personalInfo.title : ""}
              </h3>
            </div>
          </div>
          {projects && projects.length > 0 ? (
            <>
              <div>
                <h3 className="text-xl text-slate-500 font-bold mb-2">
                  Projects
                </h3>
              </div>
              <table className="table-fixed w-full mb-2">
                <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Project Name
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Client</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Completed</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {/* Row */}
                  {projects.map((project, index) => (
                    <>
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap w-1/2">
                          <div className="flex items-center">
                            <div className="font-medium text-slate-800 truncate">
                              {project.projectName}
                            </div>
                          </div>
                        </td>
                        <td key={index} className="p-2 whitespace-nowrap w-1/2">
                          <div className="flex items-center">
                            <div className="font-medium text-slate-800 truncate">
                              {project.client.clientName}
                            </div>
                          </div>
                        </td>
                        <td key={index} className="p-2 whitespace-nowrap w-1/2">
                          <div className="flex items-center">
                            <div className="font-medium text-slate-800 truncate">
                              {new Date(project.completionDate).toDateString()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            ""
          )}
          {user
            ? user.strengthInfo.length > 0 && (
                <>
                  <div>
                    <h3 className="text-xl text-slate-500 font-bold mb-2 mt-2">
                      Strengths
                    </h3>
                  </div>
                  <table className="table-fixed w-full">
                    <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">
                            Strengths
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {/* Row */}
                      {user.strengthInfo.map((strength, index) => (
                            <>
                              <tr key={index}>
                                <td className="p-2 whitespace-nowrap w-1/2">
                                  <div className="flex items-center">
                                    <div className="font-medium text-slate-800 truncate">
                                      {strength}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </>
                          ))}
                    </tbody>
                  </table>
                </>
              )
            : ""}
        </>
      )}
    </div>
  );
}
