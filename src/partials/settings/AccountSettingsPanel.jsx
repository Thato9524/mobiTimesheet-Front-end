import React from "react";
import { NavLink } from "react-router-dom";
import ModalBasic from "../../components/ModalBasic";
import PreLoader from "../../components/PreLoader";

function BillingPanel({ loading, versions, isDev }) {
  return (
    <div className="grow">
      {/* Panel body */}
      {loading ? (
        <PreLoader />
      ) : (
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl text-slate-800 font-bold mb-4">
              About Versions
            </h2>
            <div className="text-sm">
              This gives detailed information about the current and previous
              version of C3 portal.
            </div>
          </div>

          {/* Billing Information */}
          <section>
            <h3 className="text-xl leading-snug text-slate-800 font-bold mb-1">
              Version Information
            </h3>
            <ul>
              {versions.map((version) => (
                <div>
                  <li className={`md:flex md:justify-between md:items-center py-3 ${versions.length > 1 ? "border-b border-slate-200": ""}`}>
                    {/* Left */}
                    <div className="text-sm text-slate-800 font-medium">
                      v{version.version}
                    </div>
                    {/* Right */}
                    <div className="text-sm text-slate-800 mr-4">
                      <span className="mr-3">
                        {new Date(version.releasedate).toLocaleDateString()}
                      </span>
                      <NavLink
                        className="font-medium text-rose-500 hover:text-rose-600 mr-4"
                        to={`/patchNotes/${version.version}`}
                      >
                        Open
                      </NavLink>
                      {/* <NavLink
                        className="font-medium text-rose-500 hover:text-rose-600"
                        to={`/addPatch/${version.version}`}
                      >
                        Update
                      </NavLink> */}
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </section>

          {/* Panel footer */}
          {isDev && (
            <footer>
              <div className="flex flex-col px-6 py-5 border-t border-slate-200">
                <div className="flex self-end">
                  <NavLink to={"/addPatch"}>
                    <button className="btn bg-rose-500 hover:bg-rose-600 text-white ml-3">
                      Add Patch Note
                    </button>
                  </NavLink>
                </div>
              </div>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default BillingPanel;
