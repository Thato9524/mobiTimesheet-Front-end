import React from "react";
import { Link } from "react-router-dom";
import EditMenu from "../../components/DropdownEditMenu";

function UsersTabsCard(props) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full">
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
                  onClick={(e) => props.editClient(e, props.id)}
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
                  onClick={(e) => props.openModalClient(e, props.id)}
                >
                  Delete
                </button>
              </li>
            </EditMenu>
          </div>
          <Link to={props.link}>
            {/* Image + name */}

            <header>
              <div className="flex justify-center mb-2">
                {/* <div
                  className="absolute top-0 right-0 -mr-2 bg-white rounded-full shadow"
                  aria-hidden="true"
                >
                  <svg
                    className="w-8 h-8 fill-current text-yellow-500"
                    viewBox="0 0 32 32"
                  >
                    <path d="M21 14.077a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5 1.5 1.5 0 00-1.5 1.5.75.75 0 01-.75.75zM14 24.077a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z" />
                  </svg>
                </div> */}
                {/* <img
                  className="rounded-full"
                  src={props.image}
                  width="64"
                  height="64"
                  alt={props.name}
                /> */}
              </div>
              {/* */}
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
              {/* 
            <div className="flex justify-center items-center"><span className="text-sm font-medium text-slate-400 -mt-0.5 mr-1">-&gt;</span> <span>{props.location}</span></div>
         */}
            </header>
            {/* Bio */}
            <div className="text-center mt-2">
              <div className="text-sm">{props.content}</div>
            </div>
          </Link>
        </div>
        {/* Card footer */}
        {/* <div className="border-t border-slate-200">
          <Link
            className="block text-center text-sm text-rose-500 hover:text-rose-600 font-medium px-3 py-4"
            to={props.link}
          >
            <div className="flex items-center justify-center">

              <span>Projects</span>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default UsersTabsCard;
