import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ReaModal from "../ReaModal";
import dropdown from "./Dropdown";

export default function UsersTable({
  users,
  searchItem,
  handleAction,
  setSearchItem,
}) {
  const [ensureModalOpen, setEnsureModalOpen] = useState(false);
  const [ensure, setEnsure] = useState(false);
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [activate, setActivate] = useState(false);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(null);
  const today = new Date();
  const [end, setEnd] = useState("2022-09-08");
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [tempTitle, setTempTitle] = useState("");

  function resetState() {
    setSearchItem("");
    setEnsureModalOpen(false);
    setEnsure(false);
    setEdit(false);
    setActivate(false);
  }

  function displayRemoval(id) {
    const index = users.findIndex((user) => user._id === id);
    const selectedUser = users[index].personalInfo;
    setId(id);
    setFirstName(selectedUser.firstName);
    setLastName(selectedUser.lastName);
    setTitle(selectedUser.title);
    setEnsureModalOpen(true);
  }

  function displayActivate(id) {
    const index = users.findIndex((user) => user._id === id);
    const selectedUser = users[index].personalInfo;
    setId(id);
    setFirstName(selectedUser.firstName);
    setLastName(selectedUser.lastName);
    setTitle(selectedUser.title);
    setActivate(true);
  }

  function displayEdit(id) {
    setDisable(true);

    //FIND THE SELECTED USER
    const index = users.findIndex((user) => user._id === id);
    const selectedUser = users[index].personalInfo;
    setId(id);

    //SET THE START DATE
    setStart(
      users[index].start
        ? users[index].start
        : today.toISOString().substring(0, 10)
    );
    setTempStart(
      users[index].start
        ? users[index].start
        : today.toISOString().substring(0, 10)
    );

    //SET THE END DATE
    setEnd(
      users[index].end ? users[index].end : today.toISOString().substring(0, 10)
    );
    setTempEnd(
      users[index].end ? users[index].end : today.toISOString().substring(0, 10)
    );

    //SET USER INFO
    setFirstName(selectedUser.firstName);
    setLastName(selectedUser.lastName);
    setTitle(selectedUser.title);
    setTempTitle(selectedUser.title);

    //SORT DROPDOWN LIST
    dropdown.sort(compare);

    setEdit(true);
  }
  function compare(a, b) {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    return 0;
  }

  function handleChange(e) {
    setTempTitle(e.target.value);
    if (e.target.value === title) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }

  function handleDateChange(e, type) {
    if (type === "end") {
      setTempEnd(e.target.value);
    } else {
      if (e.target.value > tempEnd) {
        setTempStart(e.target.value);
        setTempEnd(e.target.value);
      } else {
        setTempStart(e.target.value);
      }
    }
    if (type === "end" && e.target.value === end) {
      setDisable(true);
    } else if (type === "start" && e.target.value === start) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }
  function validate() {
    if (!tempStart) {
      setError(true);
      setMessage("Contract Start Date is required.");
    } else if (!tempEnd) {
      setError(true);
      setMessage("Contract End Date is required.");
    } else {
      setEnsure(true);
    }
  }

  function submitEdit() {
    resetState();
    const req = {
      _id: id,
      firstName: firstName,
      lastName: lastName,
      newTitle: tempTitle,
      oldTitle: title,
      start: tempStart,
      end: tempEnd,
    };
    handleAction("edit", req);
  }

  function submitRemove() {
    resetState();
    const req = {
      id: id,
    };
    handleAction("remove", req);
  }
  function submitActivate() {
    resetState();
    const req = {
      _id: id,
      firstName: firstName,
      lastName: lastName,
      title: tempTitle,
      start: tempStart,
      end: tempEnd,
    };
    handleAction("activate", req);
  }

  function search(list) {
    if (searchItem === "") {
      return list;
    } else {
      return list.filter((list) => {
        if (
          list.personalInfo.firstName
            .toLowerCase()
            .includes(searchItem.toLowerCase())
        ) {
          return list;
        }
        if (
          list.personalInfo.lastName
            .toLowerCase()
            .includes(searchItem.toLowerCase())
        ) {
          return list;
        }
      });
    }
  }

  return (
    <>
      <Container>
        {search(users).length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Contract Length</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {search(users).map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.personalInfo.firstName}</TableCell>
                    <TableCell>{user.personalInfo.lastName}</TableCell>
                    {/* Check whether or not the user is a director */}
                    {user.personalInfo.title !== "Director" ? (
                      <>
                        <TableCell>{user.personalInfo.title}</TableCell>
                        <TableCell>
                          {user.active ? (
                            <>
                              {user.start !== undefined ? (
                                today < new Date(user.end) ? (
                                  <>
                                    <span className="mr-3 p-2 rounded-full bg-emerald-100 text-emerald-500 font-bold">
                                      {today.getFullYear() !==
                                      new Date(user.end).getFullYear()
                                        ? parseInt(
                                            new Date(user.end).getFullYear() -
                                              today.getFullYear()
                                          ) +
                                          `${
                                            parseInt(
                                              new Date(user.end).getFullYear() -
                                                today.getFullYear()
                                            ) > 1
                                              ? " Years Left"
                                              : " Year Left"
                                          }`
                                        : ""}{" "}
                                      {today.getFullYear() ===
                                      new Date(user.end).getFullYear()
                                        ? new Date(user.end).getMonth() -
                                          today.getMonth() +
                                          " Months Left"
                                        : ""}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-3 p-2 rounded-full bg-rose-100 text-rose-500 font-bold">
                                      Contract Expired
                                    </span>
                                  </>
                                )
                              ) : (
                                <>
                                  <span className="mr-3 p-2 rounded-full bg-amber-100 text-amber-500 font-bold">
                                    Contract Info Needed
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="mr-3 p-2 rounded-full bg-amber-100 text-rose-500 font-bold">
                                Terminated
                              </span>
                            </>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {user.active ? (
                            <>
                              <button
                                className="mr-3 text-sky-500 hover:text-sky-700"
                                id={user._id}
                                onClick={(e) => displayEdit(e.target.id)}
                              >
                                Edit
                              </button>
                              /
                              <button
                                className="ml-3 text-rose-500 hover:text-rose-700"
                                id={user._id}
                                onClick={(e) => displayRemoval(e.target.id)}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="mr-3 text-emerald-500 hover:text-emerald-700"
                                id={user._id}
                                onClick={(e) => displayActivate(e.target.id)}
                              >
                                Activate
                              </button>
                            </>
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{user.personalInfo.title}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="flex text-zinc-300 justify-center">
            <Typography variant="h5" component="h2">
              No Results Found
            </Typography>
          </div>
        )}
        <ReaModal
          id={"ensure-modal"}
          modalOpen={ensureModalOpen}
          setModalOpen={setEnsureModalOpen}
        >
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-amber-100">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-amber-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-5">
                <div>
                  <div className="text-lg font-semibold text-zinc-800">
                    Are you sure you want to remove ?{" "}
                  </div>
                  <div className="mt-3">
                    <div>
                      1. First Name:
                      <div className="ml-5 font-semibold text-amber-500">
                        {firstName}
                      </div>
                    </div>
                    <div>
                      2. Last Name:
                      <div className="ml-5 font-semibold text-amber-500">
                        {lastName}
                      </div>
                    </div>
                    <div>
                      3. Job Title:
                      <div className="ml-5 font-semibold text-amber-500">
                        {title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnsureModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={submitRemove}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
        <ReaModal id={"edit-modal"} modalOpen={edit} setModalOpen={setEdit}>
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-100">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-sky-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-5">
                <div>
                  <div className="text-lg font-semibold text-zinc-800">
                    Edit User:{" "}
                    <span className="text-sky-500">
                      {firstName + " " + lastName}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div>
                      Job Title:
                      <div className="font-semibold text-rose-600">
                        <select
                          id="title"
                          value={tempTitle}
                          className="form-select w-full"
                          onChange={handleChange}
                        >
                          {dropdown.map((drop) => (
                            <>
                              <option value={drop}>{drop}</option>
                            </>
                          ))}
                        </select>
                      </div>
                      <div className="block mt-1">
                        Start Date:
                        <div className="mb-2 font-semibold text-rose-600">
                          <input
                            id="title"
                            type={"date"}
                            value={tempStart}
                            className="form-select w-full"
                            onChange={(e) => handleDateChange(e, "start")}
                          />
                        </div>
                        End Date:
                        <div className="font-semibold text-rose-600">
                          <input
                            id="title"
                            type={"date"}
                            value={tempEnd}
                            min={tempStart}
                            className="form-select w-full"
                            onChange={(e) => handleDateChange(e, "end")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn-sm text-white ${
                    disable
                      ? "bg-zinc-400 hover:bg-zinc-500"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                  onClick={validate}
                  disabled={disable}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
        <ReaModal id="ensure" modalOpen={ensure} setModalOpen={setEnsure}>
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-amber-100">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-amber-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-5">
                <div className="mb-2 text-lg font-semibold text-zinc-800">
                  Are you sure about these changes for{" "}
                  <span className="font-semibold text-sky-500">
                    {firstName}
                  </span>{" "}
                  ?
                </div>
                <div>
                  <div>
                    Title:
                    <div className="mb-2 font-semibold text-sky-500">
                      {tempTitle}
                    </div>
                  </div>
                  <div>
                    Contract Start Date:
                    <div className="mb-2 font-semibold text-sky-500">
                      {tempStart}
                    </div>
                  </div>
                  <div>
                    Contract End Date:
                    <div className="mb-2 font-semibold text-sky-500">
                      {tempEnd}
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnsure(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm text-white bg-rose-500 hover:bg-rose-600"
                  onClick={submitEdit}
                  disabled={disable}
                >
                  Yes, Save Changes
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
        <ReaModal
          id={"activate-modal"}
          modalOpen={activate}
          setModalOpen={setActivate}
        >
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-amber-100">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-amber-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-5">
                <div>
                  <div className="text-lg font-semibold text-zinc-800">
                    Are you sure you want to reactivate this account ?{" "}
                  </div>
                  <div className="mt-3">
                    <div>
                      1. First Name:
                      <div className="ml-5 font-semibold text-amber-500">
                        {firstName}
                      </div>
                    </div>
                    <div>
                      2. Last Name:
                      <div className="ml-5 font-semibold text-amber-500">
                        {lastName}
                      </div>
                    </div>
                    <div>
                      3. Job Title:
                      <div className="ml-5 font-semibold text-amber-500">
                        {title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnsureModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={submitActivate}
                >
                  Yes, Reactivate
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
        <ReaModal id="error-modal" modalOpen={error} setModalOpen={setError}>
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-red-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
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
                  onClick={() => setError(false)}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </ReaModal>
      </Container>
    </>
  );
}
