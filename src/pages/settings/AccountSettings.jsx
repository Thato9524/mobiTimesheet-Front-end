import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import AccountSettingsPanel from '../../partials/settings/AccountSettingsPanel';
import request from '../../handlers/request';
import config from '../../config';

function Billing() {
  const [versions, setVersions] = useState([]);
  const [isDev, setIsDev] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(async()=>{
    try{
    setLoading(true);
    let dev = localStorage.getItem("isDev");
    let getPatch = await request.get(`${config.path.profile.getPatch}/1.2.0`);

    //IF YOU ARE A DEVELOPER
    dev === 'true' ? setIsDev(true): setIsDev(false);

    setVersions(getPatch.message.versions);
    setLoading(false);
    }catch(err){
      console.log(err);
    }
  }, [request])

  return (
    <div className="flex h-screen overflow-hidden">

      

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Account Settings </h1>
            </div>

            {/* Content */}
            <div className="bg-white shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <SettingsSidebar />
                <AccountSettingsPanel versions={versions} loading={loading} isDev={isDev}/>
              </div>
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Billing;