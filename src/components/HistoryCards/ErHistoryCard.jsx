import React, { useEffect } from "react";
import config from "../../config";

export default function ErHistoryCard(props) {
  useEffect(()=>{
    console.log(props.form)
  })
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="flex flex-col h-full ">
        {/* Card top */}
        <div className="grow p-5">
          {/* Project name and contact details*/}
          <header>
            <div title={props.form.created} className="text-center mb-5">
              <div className="inline-flex text-slate-800 hover:text-slate-900">
                <h2 className="text-xl leading-snug justify-center font-semibold">
                  {new Date(props.form.created).toDateString()}
                </h2>
              </div>
            </div>
          </header>
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm font-bold">
              Date of transaction
            </div>
            <div className="text-sm">
              {new Date(props.form.transactionDate).toLocaleDateString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm font-bold">Amount requested</div>
            <div className="text-sm">{props.form.amount}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm font-bold">Reason</div>
            <div className="text-sm">
              {props.form.reason.length > 8
                ? props.form.reason.substring(0, 8)
                : props.form.reason}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="text-sm font-bold">Attachments</div>
            <div>
            {props.form.fileKeys && props.form.fileKeys.map((key) => (
              <>
                <div
                  class="border border-slate-200 hover:border-slate-300 mx-0 p-3 ml-2 mb-2 rounded-md"
                  style={{
                    width: "80px",
                  }}
                >
                  <a
                    href={`${config.url}/${config.path.s3.getFile}/${key}`}
                    target="_blank"
                    className="flex items-center h-3"
                  >
                    <div>
                      <svg
                        className="shrink-0 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      >
                        <path d="M22 24h-20v-24h14l6 6v18zm-7-23h-12v22h18v-16h-6v-6zm3 15v1h-12v-1h12zm0-3v1h-12v-1h12zm0-3v1h-12v-1h12zm-2-4h4.586l-4.586-4.586v4.586z" />
                      </svg>
                    </div>
                    <div className="my-2 ml-3 py-2 text-sm font-bold">File</div>
                  </a>
                </div>
              </>
            ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-md-left mt-2">
            <div className="text-sm font-bold">Approval</div>
            <div className="text-sm">{props.form.approval}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
