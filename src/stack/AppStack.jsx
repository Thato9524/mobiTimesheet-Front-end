import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SideBarAdmin from "../partials/SideBarAdmin";

// Import pages
import Analytics from "../pages/MainPages/AnalyticsEmployee";
import ManagersAnalytics from "../pages/MainPages/AnalyticsManagers";
import ProjectAnalytics from "../pages/MainPages/AnalyticsProjects";
import Timesheets from "../pages/MainPages/Timesheets";
import TimesheetsAdmin from "../pages/MainPages/TimesheetsAdmin";
import TimesheetsRep from "../pages/MainPages/TimesheetsRep";
import Clients from "../pages/MainPages/Clients";
import ProjectsAdmin from "../pages/MainPages/ProjectsAdmin";
import ProjectsRep from "../pages/MainPages/ProjectsRep";
import Months from "../pages/MainPages/Months";
import MonthsAdmin from "../pages/MainPages/MonthsAdmin";
import MonthsRep from "../pages/MainPages/MonthsRep";
import Profile from "../pages/MainPages/Profile";
import Calendar from "../pages/MainPages/Calendar";
import Events from "../pages/MainPages/Events";
import Leave from "../pages/MainPages/Leave";
import LeaveRequestsManagers from "../pages/MainPages/LeaveRequestsManagers";
import LeaveRequestsAdmin from "../pages/MainPages/LeaveRequestsAdmin";
import Account from "../pages/settings/Account";
import Notifications from "../pages/settings/Notifications";
import Apps from "../pages/settings/Apps";
import Plans from "../pages/settings/Plans";
import AccountSettings from "../pages/settings/AccountSettings";

import PageNotFound from "../pages/utility/PageNotFound";
import PatchPage from "../pages/MainPages/PatchPage/PatchPage";
import Fintech from "../pages/Fintech"
// import Recruitment from "../pages/MainPages/Recruitment";
import DevRecruitment from "../pages/MainPages/DevRecruitment";
import FormSubmissions from "../pages/MainPages/FormSubmissions";
import AddPatch from "../pages/MainPages/PatchPage/AddPatch"
import UserManagement from "../pages/MainPages/UserManagement";
import IdleTimer from "../utils/idleTimeOut";
import TokenChecker from "../utils/TokenChecker";
// import ConsultantRecruitment from "../pages/MainPages/ConsultantRecruitment";

function AppStack() {
  IdleTimer()
  TokenChecker()
  const location = useLocation();
  const [adminView, setAdminView] = useState(false);

  useEffect(() => {
    let adminTag = localStorage.getItem("adminTag"); //GET TAG/////////////////////////////
    if (adminTag == "valid") {
      setAdminView(true);
    }

    /*document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });*/
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

// calls both side bars
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}

      {adminView ? (
        <SideBarAdmin
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          backbutton={
            location.pathname.split("/").length - 1 > 1 ? true : false
          }
        />

        {/* Routes */}
        {adminView ? (
          <Routes>
            
            {/* <Route path="/recruitment" element={<DevRecruitment />} /> */}
           
            <Route path="/addPatch" element={<AddPatch />} />
          
            <Route path="/patchNotes/:version" element={<PatchPage />} />
            <Route exact path="/analytics" element={<Analytics />} />
            <Route exact path="/projects" element={<ProjectAnalytics />} />
            <Route exact path="/managers" element={<ManagersAnalytics />} />
            <Route path="/dashboard" element={<Fintech />} />
            
            <Route path="/timesheet/:key" element={<Timesheets />} />
            <Route
              path="/clients/:clientID/projects/:key/:id"
              element={<TimesheetsAdmin />}
            />
            <Route path="/approve/:key/:id" element={<TimesheetsRep />} />
            <Route path="/clients/:key" element={<Clients />} />
            <Route path="/clients/:key/projects" element={<ProjectsAdmin />} />
            <Route path="/approve" element={<ProjectsRep />} />
            <Route path="/timesheet" element={<Months />} />
            <Route path="/userManagement" element={<UserManagement/>}/>
            <Route
              path="/clients/:clientID/projects/:key"
              element={<MonthsAdmin />}
            />
            <Route path="/approve/:key" element={<MonthsRep />} />
            <Route path="/" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/formSubmissions" element={<FormSubmissions />} />
            <Route path="/leave/admin" element={<LeaveRequestsAdmin />} />
            <Route path="/leave/managers" element={<LeaveRequestsManagers />} />
            <Route path="/settings/account" element={<Account />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/apps" element={<Apps />} />
            <Route path="/settings/plans" element={<Plans />} />
            <Route path="/settings/patchNotes" element={<AccountSettings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        ) : (
          <Routes>
            {/* PATCH NOTES HERE */}
            <Route path="/patchNotes/:version" element={<PatchPage />} />
            <Route exact path="/dashboard" element={<Fintech />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projectanalytics" element={<ProjectAnalytics />} />
            <Route path="/timesheet/:key" element={<Timesheets />} />
            <Route
              path="/clients/:clientID/projects/:key/:id"
              element={<TimesheetsAdmin />}
            />
            {/* <Route
              path="/recruitment/consultants"
              element={<ConsultantRecruitment />}
            /> */}
            <Route path="/recruitment" element={<DevRecruitment />} />
            <Route path="/approve/:key/:id" element={<TimesheetsRep />} />
            <Route path="/clients/:key" element={<Clients />} />
            <Route path="/approve" element={<ProjectsRep />} />
            <Route path="/leave/managers" element={<LeaveRequestsManagers />} />
            <Route path="timesheet" element={<Months />} />
            <Route
              path="/clients/:clientID/projects/:key"
              element={<MonthsAdmin />}
            />
            <Route path="/approve/:key" element={<MonthsRep />} />
            <Route exact path="/" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings/account" element={<Account />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/apps" element={<Apps />} />
            <Route path="/settings/plans" element={<Plans />} />
            <Route path="/settings/patchNotes" element={<AccountSettings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default AppStack;
