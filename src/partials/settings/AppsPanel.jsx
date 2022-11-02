import React from 'react';

function AppsPanel() {
  return (
    <div className="grow">

      {/* Panel body */}
      <div className="p-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Connected Apps</h2>

        {/* General */}
        <div className="mb-6">
          {/* Filters */}
          <div className="mb-4 border-b border-slate-200">
            <ul className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-indigo-500 whitespace-nowrap" href="#0">Utility</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Connected Apps cards */}
        <section className="pb-6 border-b border-slate-200">
          <div className="grid grid-cols-12 gap-6">
            {/* Card 1 */}
            <div className="col-span-full xl:col-span-6 2xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
              {/* Card content */}
              <div className="flex flex-col h-full p-5">
                <div className="grow">
                  <header className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-tr from-indigo-500 to-indigo-300 mr-3">
                      <svg className="w-10 h-10 fill-current text-white" viewBox="0 0 40 40">
                        <path d="M26.946 18.005a.583.583 0 00-.53-.34h-6.252l.985-3.942a.583.583 0 00-1.008-.52l-7 8.167a.583.583 0 00.442.962h6.252l-.984 3.943a.583.583 0 001.008.52l7-8.167a.583.583 0 00.087-.623z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">Microsoft Teams</h3>
                  </header>
                  <div className="text-sm">Connect your teams calander to your c3 portal calendar allowing you to make use of creating,viewing,removing and connecting to your meetings .</div>
                </div>
                {/* Card footer */}
                <footer className="mt-4">
                  <div className="flex flex-wrap justify-between items-center">
                    {/* Left side */}
                    
                    {/* Right side */}
                    <button className="btn-sm border-slate-200 hover:border-slate-300 shadow-sm flex items-center">
                      <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <span>Connected</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-span-full xl:col-span-6 2xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
              {/* Card content */}
              <div className="flex flex-col h-full p-5">
                <div className="grow">
                  <header className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-tr from-emerald-500 to-emerald-300 mr-3">
                      <svg className="w-10 h-10 fill-current text-white" viewBox="0 0 40 40">
                        <path d="M26.946 18.005a.583.583 0 00-.53-.34h-6.252l.985-3.942a.583.583 0 00-1.008-.52l-7 8.167a.583.583 0 00.442.962h6.252l-.984 3.943a.583.583 0 001.008.52l7-8.167a.583.583 0 00.087-.623z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">Asana</h3>
                  </header>
                  <div className="text-sm">Connect your c3 portal to your teams Asana page and get notified via email if there have been updates to your task.</div>
                </div>
                {/* Card footer */}
                <footer className="mt-4">
                  <div className="flex flex-wrap justify-between items-center">
                    
                    {/* Right side */}
                    <button className="btn-sm border-slate-200 hover:border-slate-300 shadow-sm flex items-center">
                      <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <span>Connected</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col-span-full xl:col-span-6 2xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
              {/* Card content */}
              <div className="flex flex-col h-full p-5">
                <div className="grow">
                  <header className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-tr from-sky-500 to-sky-300 mr-3">
                      <svg className="w-10 h-10 fill-current text-white" viewBox="0 0 40 40">
                        <path d="M26.946 18.005a.583.583 0 00-.53-.34h-6.252l.985-3.942a.583.583 0 00-1.008-.52l-7 8.167a.583.583 0 00.442.962h6.252l-.984 3.943a.583.583 0 001.008.52l7-8.167a.583.583 0 00.087-.623z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">Click Up</h3>
                  </header>
                  <div className="text-sm">ClickUp's API allows you to instantly access your Workspace's data</div>
                </div>
                {/* Card footer */}
                <footer className="mt-4">
                  <div className="flex flex-wrap justify-between items-center">
                   
                    {/* Right side */}
                    <button className="btn-sm border-slate-200 hover:border-slate-300 shadow-sm flex items-center">
                      <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <span>Connected</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
              
               
            

          </div>
        </section>

       
      </div>

    </div>
  );
}

export default AppsPanel;