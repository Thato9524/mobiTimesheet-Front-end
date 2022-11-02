import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditMenu from "../../components/DropdownEditMenu";

function UsersTabsCardProjects(props) {
  return props.active ? (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full ">
        {/* Card top */}
        <div className="grow p-5">
          {/* Menu button  */}

          <div className="relative">
            <EditMenu
              align="right"
              className="absolute top-0 right-0 inline-flex"
            >
              <li>
                <button
                  className="font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3"
                  onClick={(e) => {
                    props.editProject(e, props.id);
                  }}
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
                  onClick={(e) => props.openModalProject(e, props.id)}
                >
                  Delete
                </button>
              </li>
            </EditMenu>
          </div>
          {/* Project name and contact details*/}
          <header>
            <div title={props.name} className="text-center mb-5">
              <Link
                className="inline-flex text-slate-800 hover:text-slate-900"
                to={props.link}
              >
                <h2 className="text-xl leading-snug justify-center font-semibold">
                  {props.name.length > 15
                    ? props.name.substring(0, 15) + "..."
                    : props.name}
                </h2>
              </Link>
            </div>
          </header>
          {/* Contact Info */}
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">Client Rep:</div>
            <div className="text-sm col-span-5">
              <a href={`mailto:${props.contactInfo.email}`}>
                {" "}
                {props.contactInfo.name}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">C3 Rep:</div>
            <div className="text-sm col-span-5">
              <a href={`mailto:${props.businessRep.email}`}>
                {props.businessRep.name}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold">Team:</div>
            <div className="text-sm col-span-5">
              {/* {console.log("props.consultants", props.consultants)} */}
              {props.consultants.slice(0, 2).map((item) => (
                <div>
                  {item.personalInfo.firstName +
                    " " +
                    item.personalInfo.lastName}
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Card footer */}
        <div className="border-t border-slate-200">
          <Link
            className="block text-center text-sm text-rose-500 hover:text-rose-600 font-medium px-3 py-4"
            to={props.link} //"/clients/:key/:id"
          >
            <div className="flex items-center justify-center">
              <span>See Timesheets</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-slate-300 shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full ">
        {/* Card top */}
        <div className="grow p-5">
          {/* Menu button  */}

          {/* <div className="relative">
            <EditMenu
              align="right"
              className="absolute top-0 right-0 inline-flex bg-zinc"
            >
              <li>
                <button
                  className="font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3"
                  onClick={(e) => {
                    props.editProject(e, props.id);
                  }}
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
                  onClick={(e) => props.openModalProject(e, props.id)}
                >
                  Delete
                </button>
              </li>
            </EditMenu>
          </div>
          {/* Project name and contact details*/}
          <header>
            <div className="text-center mb-5">
              <Link
                className="inline-flex text-slate-400 hover:text-slate-500"
                to={props.link}
              >
                <h2 className="text-xl leading-snug justify-center font-semibold">
                  {props.name}
                </h2>
              </Link>
            </div>
          </header>
          {/* Contact Info */}
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold text-slate-400">
              Client Rep:
            </div>
            <div className="text-sm col-span-5 text-slate-400">
              <a href={`mailto:${props.contactInfo.email}`}>
                {" "}
                {props.contactInfo.name}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold text-slate-400">
              C3 Rep:
            </div>
            <div className="text-sm col-span-5 text-slate-400">
              <a href={`mailto:${props.businessRep.email}`}>
                {props.businessRep.name}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2 text-md-left mt-2">
            <div className="text-sm col-span-5 font-bold text-slate-400">
              Team:
            </div>
            <div className="text-sm col-span-5 text-slate-400">
              {props.consultants.slice(0, 2).map((item) => (
                <div>
                  {item.personalInfo.firstName +
                    " " +
                    item.personalInfo.lastName}
                  <br />
                </div>
              ))}{" "}
            </div>
          </div>
        </div>
        {/* Card footer */}
        <div className="border-t border-slate-200">
          <Link
            className="block text-center text-sm text-rose-200 hover:text-rose-400 font-medium px-3 py-4"
            to={props.link} //"/clients/:key/:id"
          >
            <div className="flex items-center justify-center">
              <span>See Timesheets</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UsersTabsCardProjects;
