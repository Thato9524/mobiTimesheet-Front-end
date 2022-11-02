import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import config from "../config";
import request from "../handlers/request";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import admin from "../images/deal-svgrepo-com.png";
import management from "../images/conference-svgrepo-com.png";
import dashboard from "../images/human-resources-search-svgrepo-com.png";
import profile from "../images/id-card-svgrepo-com.png";
import clients from "../images/employees-group-svgrepo-com.png";
import timesheets from "../images/time-management-svgrepo-com.png";
import ClientContext from "../ClientContext";

function SideBarAdmin({ sidebarOpen, setSidebarOpen }) {
  const { globalClients, setClients} = useContext(ClientContext);

  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const [approvalMenu, setApprovalMenu] = useState(false);
  const { dispatch } = React.useContext(AuthContext);
  const navigateTo = useNavigate();

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

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
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
  const [data, setData] = useState({});
  const [months, setMonths] = useState([]);
  const [version, setVersion] = useState("");

  useEffect(async () => {
    let repTag = localStorage.getItem("repTag");
    let v = localStorage.getItem("patch");
    if (repTag == "valid") {
      setApprovalMenu(true);
    }

    setVersion(v);
    let clients = await request.get(config.path.clients.getAll);
    setClients(clients);

    let data = await request.get(config.path.timesheet.month);
    
    setMonths( data.data );
    setData({
      clients,
    });
    setGotData(true);

    //// console.log('All Clients', clients);
  }, [gotData]);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

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
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                <img
                  className="w-10 rounded-full pt-1" //w-8 h-8
                  src="https://i.ibb.co/fvGBWTW/c3-small-dark.png"
                  width="64"
                  height="32"
                  alt="User"
                />
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <NavLink end to="/" className="block">
                  <img
                    //className="rounded-full"
                    src="https://i.ibb.co/jMBgmsV/C3-light.png"
                    // width="64"
                    // height="64"
                    alt=""
                  />
                </NavLink>
              </span>
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
                            className={`fill-current text-zinc-300 ${
                              pathname === "/" && "text-zinc-200"
                            }`}
                            d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Profile
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/*Dashboard */}
                  <SidebarLinkGroup
                    activecondition={pathname.endsWith("/dashboard")}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                              pathname === "/dashboard" && "hover:text-zinc-200"
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
                              to="/dashboard"
                              className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                                pathname === "/dashboard" &&
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
                                        className={`fill-current text-zinc-400 ${
                                          (pathname === "/dashboard" ||
                                            pathname.includes("dashboard")) &&
                                          "!text-zinc-500"
                                        }`}
                                        d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                                      />
                                      <path
                                        className={`fill-current text-zinc-600 ${
                                          (pathname === "/dashboard" ||
                                            pathname.includes("dashboard")) &&
                                          "text-zinc-600"
                                        }`}
                                        d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                                      />
                                      <path
                                        className={`fill-current text-zinc-400 ${
                                          (pathname === "/dashboard" ||
                                            pathname.includes("dashboard")) &&
                                          "text-zinc-200"
                                        }`}
                                        d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                                      />
                                    </svg>
                                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      Dashboard
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
                                  to="/dashboard"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Overview
                                  </span>
                                </NavLink>
                                <NavLink
                                  end
                                  to="/analytics"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Employees
                                  </span>
                                </NavLink>
                                <NavLink
                                  end
                                  to="/managers"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Managers
                                  </span>
                                </NavLink>
                                <NavLink
                                  end
                                  to="/projects"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Projects
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/* Recruitment */}
                  {/* <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname === "/recruitment" && "bg-zinc-900"
                    }`}
                  >
                    <NavLink
                      end
                      to="/recruitment"
                      className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                        pathname === "/recruitment" && "hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current text-zinc-500 
                            ${pathname === "/recruitment" && "text-zinc-400"}`}
                            d="M4.418 19.612A9.092 9.092 0 0 1 2.59 17.03L.475 19.14c-.848.85-.536 2.395.743 3.673a4.413 4.413 0 0 0 1.677 1.082c.253.086.519.131.787.135.45.011.886-.16 1.208-.474L7 21.44a8.962 8.962 0 0 1-2.582-1.828Z"
                          />
                          <path
                            className={`fill-current text-zinc-400 ${
                              pathname === "/recruitment" && "text-zinc-300"
                            }`}
                            d="M10.034 13.997a11.011 11.011 0 0 1-2.551-3.862L4.595 13.02a2.513 2.513 0 0 0-.4 2.645 6.668 6.668 0 0 0 1.64 2.532 5.525 5.525 0 0 0 3.643 1.824 2.1 2.1 0 0 0 1.534-.587l2.883-2.882a11.156 11.156 0 0 1-3.861-2.556Z"
                          />
                          <path
                            className={`fill-current text-zinc-300 ${
                              pathname === "/recruitment" && "text-zinc-200"
                            }`}
                            d="M21.554 2.471A8.958 8.958 0 0 0 18.167.276a3.105 3.105 0 0 0-3.295.467L9.715 5.888c-1.41 1.408-.665 4.275 1.733 6.668a8.958 8.958 0 0 0 3.387 2.196c.459.157.94.24 1.425.246a2.559 2.559 0 0 0 1.87-.715l5.156-5.146c1.415-1.406.666-4.273-1.732-6.666Zm.318 5.257c-.148.147-.594.2-1.256-.018A7.037 7.037 0 0 1 18.016 6c-1.73-1.728-2.104-3.475-1.73-3.845a.671.671 0 0 1 .465-.129c.27.008.536.057.79.146a7.07 7.07 0 0 1 2.6 1.711c1.73 1.73 2.105 3.472 1.73 3.846Z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Recruitment
                        </span>
                      </div>
                    </NavLink>
                  </li> */}
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
                        pathname.includes("timesheet") &&
                        "text-rose-500 hover:text-zinc-200"
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

                  {/* Clients */}
                  <SidebarLinkGroup
                    activecondition={pathname.includes("clients")}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                              (pathname === "/" ||
                                pathname.includes("clients")) &&
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
                              to="/clients/all"
                              className={
                                "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate "
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <svg
                                    className="shrink-0 h-6 w-6"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      className={`fill-current text-zinc-600 
                                      ${
                                        pathname.includes("clients") ||
                                        (pathname.includes("projects") &&
                                          "text-zinc-500")
                                      }`}
                                      d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                                    />
                                    <path
                                      className={`fill-current text-zinc-400 
                                      ${
                                        pathname.includes("clients") ||
                                        (pathname.includes("projects") &&
                                          "text-zinc-300")
                                      }`}
                                      d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                                    />
                                  </svg>

                                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Clients
                                  </span>
                                </div>
                                {/* Icon */}
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
                            </NavLink>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                {/* <NavLink
                                  end
                                  to="/clients/all"
                                  className={({ isActive }) =>
                                    "block text-zinc-400 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    All
                                  </span>
                                </NavLink> */}
                              </li>

                              {globalClients.map((client) => (
                                <li className="mb-1 last:mb-0" key={client._id}>
                                  <NavLink
                                    end
                                    to={`/clients/${client._id}/projects`}
                                    className={({ isActive }) =>
                                      "block text-zinc-400 hover:text-zinc-200 transition duration-150 truncate " +
                                      (pathname.includes(client._id) || isActive
                                        ? "!text-rose-500"
                                        : "")
                                    }
                                  >
                                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      {client.clientName}
                                    </span>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  

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
                                      {/* <svg
                                      className="shrink-0 h-6 w-6"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        className={`fill-current text-zinc-400 ${
                                          (pathname === "/approve" ||
                                            pathname.includes("approve")) &&
                                          "text-zinc-200"
                                        }`}
                                        d="M17.896,12.706v-0.005v-0.003L15.855,2.507c-0.046-0.24-0.255-0.413-0.5-0.413H4.899c-0.24,0-0.447,0.166-0.498,0.4L2.106,12.696c-0.008,0.035-0.013,0.071-0.013,0.107v4.593c0,0.28,0.229,0.51,0.51,0.51h14.792c0.28,0,0.51-0.229,0.51-0.51v-4.593C17.906,12.77,17.904,12.737,17.896,12.706 M5.31,3.114h9.625l1.842,9.179h-4.481c-0.28,0-0.51,0.229-0.51,0.511c0,0.703-1.081,1.546-1.785,1.546c-0.704,0-1.785-0.843-1.785-1.546c0-0.281-0.229-0.511-0.51-0.511H3.239L5.31,3.114zM16.886,16.886H3.114v-3.572H7.25c0.235,1.021,1.658,2.032,2.75,2.032c1.092,0,2.515-1.012,2.749-2.032h4.137V16.886z"
                                      />
                                      </svg>*/}
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
                  {/*Admin */}
                  <SidebarLinkGroup
                    activecondition={pathname.includes("events")}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                              pathname.includes("events") &&
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
                              to="/events"
                              className={`block text-zinc-200 hover:text-white truncate transition duration-150 ${
                                (pathname.includes("events") ||
                                  pathname === "") &&
                                "hover:text-zinc-200"
                              }`}
                            >
                              <div>
                                <div
                                  className={`flex items-center justify-between ${
                                    !sidebarExpanded &&
                                    pathname.includes("/events")
                                      ? "bg-zinc-900 rounded"
                                      : ""
                                  }`}
                                >
                                  <div className={`flex items-center `}>
                                    <svg
                                      className="shrink-0 h-6 w-6"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        className={`fill-current text-zinc-400 ${
                                          (pathname === "/approve" ||
                                            pathname.includes("approve")) &&
                                          "text-zinc-200"
                                        }`}
                                        d="M17.896,12.706v-0.005v-0.003L15.855,2.507c-0.046-0.24-0.255-0.413-0.5-0.413H4.899c-0.24,0-0.447,0.166-0.498,0.4L2.106,12.696c-0.008,0.035-0.013,0.071-0.013,0.107v4.593c0,0.28,0.229,0.51,0.51,0.51h14.792c0.28,0,0.51-0.229,0.51-0.51v-4.593C17.906,12.77,17.904,12.737,17.896,12.706 M5.31,3.114h9.625l1.842,9.179h-4.481c-0.28,0-0.51,0.229-0.51,0.511c0,0.703-1.081,1.546-1.785,1.546c-0.704,0-1.785-0.843-1.785-1.546c0-0.281-0.229-0.511-0.51-0.511H3.239L5.31,3.114zM16.886,16.886H3.114v-3.572H7.25c0.235,1.021,1.658,2.032,2.75,2.032c1.092,0,2.515-1.012,2.749-2.032h4.137V16.886z"
                                      />
                                    </svg>

                                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      Admin
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
                                  to="/events"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Events
                                  </span>
                                </NavLink>
                                <NavLink
                                  end
                                  to="/leave/admin"
                                  className={({ isActive }) =>
                                    "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                    (isActive ? "!text-rose-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Leave Request
                                  </span>
                                </NavLink>
                                <NavLink
                                    end
                                    to="/formSubmissions"
                                    className={({ isActive }) =>
                                      "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                      (isActive ? "!text-rose-500" : "")
                                    }
                                  >
                                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      Form Submissions
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    end
                                    to="/userManagement"
                                    className={({ isActive }) =>
                                      "block text-zinc-200 hover:text-zinc-200 transition duration-150 truncate " +
                                      (isActive ? "!text-rose-500" : "")
                                    }
                                  >
                                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      User Management
                                    </span>
                                  </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                 
                </ul>
              </div>
            </div>
            <div className="justify-end mt-auto text-center mb-0">
              <NavLink end to={`settings/patchNotes`}>
                <span className="text-sm text-rose-500">1.2.2</span>
              </NavLink>
            </div>
            {/* Expand / collapse button */}
            <div className="hidden lg:inline-flex 2xl:hidden  mt-0">
              <div className="px-3 py-2 justify-end">
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
      )}
    </>
  );
}

export default SideBarAdmin;

