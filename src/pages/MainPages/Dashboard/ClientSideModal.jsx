import React, { useState, useEffect } from "react";
import config from "../../../config";
import request from "../../../handlers/request";
import PreLoader from "../../../components/PreLoader";

const ClientSideModal = ({ id, changeState }) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(async () => {
    setLoading(true);
    let clientProjectHours = await request.post(
      config.path.clients.getClientProjectHours,
      { id },
      true
    );

    if (!clientProjectHours.err) {
      console.log(clientProjectHours);
      setClients(clientProjectHours);
    }

    setLoading(false);
  }, [id]);

  return (
    <div
      className="fixed right-0 bg-white shadow-lg px-6 h-screen overflow-auto"
      style={{ width: "50vw", paddingBottom: "80px" }}
    >
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <>
          <div className="sm:flex sm:justify-between sm:items-center mb-8 py-3 border-b border-slate-200">
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
          <div className="flex justify-between pl-3 pb-3">
            <h1 className="text-3xl font-bold">
              {clients.length !== 0 && clients[0].clientName}
            </h1>
          </div>
          <table className="table-fixed w-full">
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Project</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-right">Hours</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {/* Row */}
              {clients.length !== 0 &&
                clients.map((client, index) => (
                  <tr key={index}>
                    <td className="p-2 whitespace-nowrap w-1/2">
                      <div className="flex items-center">
                        <div className="font-medium text-slate-800 truncate">
                          {client.project}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap w-1/2">
                      <div className="font-medium text-emerald-500 text-right">
                        {client.hours}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ClientSideModal;
