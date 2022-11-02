import React, { useState } from "react";

export default function NewRequest({ clients, selectedClient, setSelectedClient, resetModal, disable, submitRequest, updateInputs }) {
  return (
    <div className="p-3">
      <div id="title" className="">
        <h2 className="text-xl text-slate-800 font-bold mb-5">
          Request New Project
        </h2>
      </div>
      <div id="body">
        Select a Client:
        <div className="flex justify-center mb-5">
          <select
            id="client-selector"
            className="form-select w-full"
            onChange={(e) => setSelectedClient(e.currentTarget.value)}
          >
            <option disabled selected value>
              Select Client
            </option>
            {clients &&
              clients
                .map((client) => (
                  <>
                    <option value={client.clientName}>
                      {client.clientName}
                    </option>
                  </>
                ))}
          </select>
        </div>
        {selectedClient && (
          <>
            <div>
              Project Name:
              <input
                className="form-input w-full"
                id="projectName"
                type="text"
                onChange={updateInputs}
              />
            </div>
            <div>
              Project Desc:
              <textarea
                className="form-input w-full"
                id="desc"
                type="text"
                onChange={updateInputs}
              />
            </div>
          </>
        )}
      </div>
      <div id="footer" className="mt-5 flex flex-wrap justify-end space-x-2">
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
