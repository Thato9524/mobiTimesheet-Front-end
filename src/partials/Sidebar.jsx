import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import profile from "../images/id-card-svgrepo-com.png";
import timesheets from "../images/time-management-svgrepo-com.png";
import management from "../images/conference-svgrepo-com.png";
import request from "../handlers/request";
import config from "../config";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const [approvalMenu, setApprovalMenu] = useState(false);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.parentElement.id === target.id ||
        trigger.current.parentElement.id === target.id
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const [gotData, setGotData] = useState(false);
  const [months, setMonths] = useState([]);
  const [version, setVersion] = useState("");

  useEffect(async () => {
    let v = localStorage.getItem("patch");
    let repTag = localStorage.getItem("repTag");
    if (repTag == "valid") {
      setApprovalMenu(true);
    }
    setVersion(v);
    let data = await request.get(config.path.timesheet.month);

    setMonths(data.data);
    setGotData(true);
  }, [gotData]);

  return (
    <>
      {gotData && (
        <div>
          {/* Sidebar backdrop (mobile only) */}
          <div
            className={`fixed inset-0 bg-zinc-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
          ></div>
          {/* Sidebar */}
          <div
            id="sidebar"
            ref={sidebar}
            className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-zinc-800 p-4 transition-all duration-200 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-64"
            }`}
          >
            {/* Sidebar header */}
            <div className="flex justify-between mb-10 pr-3 sm:px-2">
              {/* Close button */}
              <button
                ref={trigger}
                className="lg:hidden text-zinc-500 hover:text-zinc-400"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                </svg>
              </button>
              {/* Logo */}
              <NavLink end to="/" className="block">
                <img src="https://i.ibb.co/jMBgmsV/C3-light.png" alt="" />
              </NavLink>
            </div>

            {/* Links */}
            <div className="space-y-8">
              {/* Pages group */}
              <div>
                <h3 className="text-xs uppercase text-zinc-500 font-semibold pl-3">
                  <span
                    className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                    aria-hidden="true"
                  >
                    •••
                  </span>
                  <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                    Pages
                  </span>
                </h3>
                <ul className="mt-3">
                  {/* Profile */}
                  <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname === "/" && "bg-zinc-900"
                    }`}
                  >
                    <NavLink
                      end
                      to="/"
                      className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                        pathname === "/" && "hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current text-zinc-500 
                            ${pathname === "/" && "text-zinc-400"}`}
                            d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                          />
                          <path
                            className={`fill-current text-zinc-300 
                            ${pathname === "/" && "text-zinc-200"}`}
                            d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Profile
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/* Timesheet */}
                  <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname.includes("timesheet") && "bg-zinc-900"
                    }`}
                  >
                    <NavLink
                      end
                      to={`/timesheet/${months[0]._id}`}
                      className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                        pathname.includes("timesheet") && "hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current text-zinc-600 ${
                              pathname.includes("timesheet") && "text-zinc-500"
                            }`}
                            d="M1 3h22v20H1z"
                          />
                          <path
                            className={`fill-current text-zinc-400 ${
                              pathname.includes("timesheet") && "text-zinc-300"
                            }`}
                            d="M21 3h2v4H1V3h2V1h4v2h10V1h4v2Z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Timesheets
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/*Management */}
                  {approvalMenu && (
                    <SidebarLinkGroup
                      activecondition={pathname.includes("approve")}
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <a
                              href="#0"
                              className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                                pathname.includes("approve") &&
                                "hover:text-zinc-200"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              {" "}
                              <NavLink
                                end
                                to="/approve"
                                className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                                  (pathname.includes("approve") ||
                                    pathname === "") &&
                                  "hover:text-zinc-200"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <svg
                                        className="shrink-0 h-6 w-6"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          className={`fill-current text-zinc-300 ${
                                            pathname.includes("approve") &&
                                            "text-zinc-200"
                                          }`}
                                          d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z"
                                        />
                                        <path
                                          className={`fill-current text-zinc-500 ${
                                            pathname.includes("approve") &&
                                            "text-zinc-400"
                                          }`}
                                          d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z"
                                        />
                                        <path
                                          className={`fill-current text-zinc-600 ${
                                            pathname.includes("approve") &&
                                            "text-zinc-500"
                                          }`}
                                          d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z"
                                        />
                                      </svg>

                                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                        Management
                                      </span>
                                    </div>
                                    {/* Icon */}{" "}
                                    <div className="flex shrink-0 ml-2">
                                      <svg
                                        className={`w-3 h-3 shrink-0 ml-1 fill-current text-zinc-400 ${
                                          open && "transform rotate-180"
                                        }`}
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </NavLink>
                            </a>
                            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                              <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                                <li className="mb-1 last:mb-0">
                                  <NavLink
                                    end
                                    to="/approve"
                                    className={({ isActive }) =>
                                      "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                      (isActive ? "!text-rose-500" : "")
                                    }
                                  >
                                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      My Projects
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    end
                                    to="/leave/managers"
                                    className={({ isActive }) =>
                                      "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                      (isActive ? "!text-rose-500" : "")
                                    }
                                  >
                                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      Leave Request
                                    </span>
                                  </NavLink>
                                </li>
                              </ul>
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-auto">
              <div className="justify-end mt-auto text-center mb-0">
                <NavLink end to="/settings/patchNotes">
                  <span className="text-sm text-rose-500">1.2.2</span>
                </NavLink>
              </div>
              {/* Expand / collapse button */}
              <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
                <div className="px-3 py-2">
                  <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                    <span className="sr-only">Expand / collapse sidebar</span>
                    <svg
                      className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                      viewBox="0 0 24 24"
                    >
                      <path
                        className="text-zinc-400"
                        d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                      />
                      <path className="text-zinc-600" d="M3 23H1V1h2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
