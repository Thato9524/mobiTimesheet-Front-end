import { Box } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import ModalBlank from "../../components/ModalBlank";
import UsersTable from "../../components/UsersTable/UsersTable";
import config from "../../config";
import request from "../../handlers/request";
import SearchForm from "../../partials/actions/SearchForm";
import PreLoader from "../../components/PreLoader";

export default function UserManagement() {
  //FUNCTIONAL STATES
  const [loading, setLoading] = useState(false);
  const [gotData, setGotData] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  //VARIABLE STATES
  const [option, setOption] = useState("all");
  const [searchItem, setSearchItem] = useState("");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({
    all: [],
    dtUsers: [],
    mcUsers: [],
    deUsers: [],
    naUsers: [],
  });

  //HANDLE THE CHANGE IN SELECTION FROM THE DROPDOWN
  function handleOption(e) {
    const value = e.target.value;
    if (value === "all") {
      setUsers(status.all);
      setOption(value);
    } else if (value === "dt") {
      setUsers(status.dtUsers);
      setOption(value);
    } else if (value === "mc") {
      setUsers(status.mcUsers);
      setOption(value);
    } else if(value==="de"){
      setUsers(status.deUsers);
      setOption(value);
    }else{
      setUsers(status.naUsers);
      setOption(value);
    }
  }
  //RESET FUNCTION TO HELP RESET ALL VALUES AFTER A CHANGE IN PAGE INFORMATION
function resetState(){
  setOption("all");
    setMessage("");
    setSuccess(false);
    setError(false);
}
  //REFRESH THE PAGE
  async function refreshPage() {
    setLoading(true);
    const getAllUsers = await request.get(config.path.users.getAllUserTypes);
    if (getAllUsers.err) {
      setError(true);
      setMessage(getAllUsers.message);
    }
    console.log(getAllUsers)
    setUsers(getAllUsers.all);
    resetState();
    setStatus({
      all: getAllUsers.all,
      dtUsers: getAllUsers.dt,
      mcUsers: getAllUsers.mc,
      deUsers: getAllUsers.de,
      naUsers: getAllUsers.na
    });
    setGotData(true);
    setLoading(false);
  }

  //HANDLE THE EDIT OR REMOVAL OF A USER
  async function handleAction(type, req) {
    //IF THERE WAS NO TITLE SUBMITTED, REMOVE USER
    if (type === "remove") {
      try {
        const response = await request.post(
          `${config.path.userManagement.softDeleteUser}/${req.id}`, {},true
        );

        if (response.err) {
          setError(true);
          setMessage(response.message);
          return;
        }

        setSuccess(true);
        setMessage(response);
      } catch (ex) {
        setError(true);
        setMessage(ex.message);
      }
    }
    //ELSE EDIT THE USER INFORMATION
    else if(type === "edit"){
      try{
        const response = await request.post(config.path.userManagement.updateUser, req, true);

        if(response.err){
          setError(true);
          setMessage(response.message);
          return;
        }

        setSuccess(true);
        setMessage(response);

      }catch(ex){
        setError(true);
        setMessage(ex.message);
      }
    }else{
      try{
        const response = await request.post(config.path.userManagement.reactivateUser, req, true);

        if(response.err){
          setError(true);
          setMessage(response.message);
          return;
        }

        setSuccess(true);
        setMessage(response);

      }catch(ex){
        setError(true);
        setMessage(ex.message);
      }
    }
  }

  useEffect(async () => {
    try {
      refreshPage();
    } catch (ex) {
      setGotData(false);
      setError(true);
      setMessage(ex.message);
    }
  }, [request]);

  return (
    <div>
      {loading ? (
        <PreLoader />
      ) : (
        <div>
          <Box className="sm:flex sm:justify-between sm:items-center mb-1">
            <div className="px-4 sm:px-6 lg:px-8 py-8 mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                User Management
              </h1>
            </div>
            <div className="flex justify-end mr-3">
              {/* Filter button */}
              <select
                className="form-select mr-3"
                value={option}
                onChange={handleOption}
              >
                <option value="all">All</option>
                <option value="dt">Disruptive Technology</option>
                <option value="mc">Management Consulting</option>
                <option value="de">Data Engineering</option>
                <option value="na">Deactivated</option>
              </select>
              <SearchForm placeholder="Search…" setSearchTerm={setSearchItem} />
            </div>
          </Box>
          <div>
            {users ? (
              <UsersTable
                users={users}
                searchItem={searchItem}
                handleAction={handleAction}
                setSearchItem={setSearchItem}
              />
            ) : (
              "We need to hire more people..."
            )}
          </div>
          <ModalBlank
            id="error-modal"
            modalOpen={error}
            setModalOpen={setError}
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
                    Error: {message}
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={() => setError(false)}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
          <ModalBlank
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
                    onClick={refreshPage}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
        </div>
      )}
    </div>
  );
}
