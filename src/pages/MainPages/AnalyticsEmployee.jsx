import React, { useState, useEffect } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Datepicker from "../../components/Datepicker";
import AnalyticsCard01 from "../../partials/analytics/AnalyticsCard01";
import AnalyticsCard02 from "../../partials/analytics/AnalyticsCard02";
import AnalyticsCard03 from "../../partials/analytics/AnalyticsCard03";
import AnalyticsCard04 from "../../partials/analytics/AnalyticsCard04";
import AnalyticsCard05 from "../../partials/analytics/AnalyticsCard05";
import AnalyticsCard06 from "../../partials/analytics/AnalyticsCard06";
import AnalyticsCard07 from "../../partials/analytics/AnalyticsCard07";
import AnalyticsCard08 from "../../partials/analytics/AnalyticsCard08";
import AnalyticsCard09 from "../../partials/analytics/AnalyticsCard09";
import AnalyticsCard10 from "../../partials/analytics/AnalyticsCard10";
import AnalyticsCard11 from "../../partials/analytics/AnalyticsCard11";
import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import SearchForm from "../../partials/actions/SearchForm";
import DashboardCard04 from "../../partials/dashboard/DashboardCard04";

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeesData, setEmployeesData] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
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

  async function handleMonth(e) {
    console.log("change started");
    setLoading(true);
    setSelectedMonth(e.target.value);
    await refreshEmployees(e.target.value);
    setLoading(false);
  }

  const refreshEmployees = async (selectedMonth) => {
    //console.log("selectedMonth: ", selectedMonth);
    setLoading(true);
    checkToken();
    let employees = await request.get(
      `${config.path.users.getAllEmployees}/${selectedMonth}`
    );

    if (!employees.err) {
      setEmployeesData(employees);
    }
    setSelectedMonth(selectedMonth);
    console.log(selectedMonth);
    setLoading(false);
  };

  useEffect(async () => {
    setLoading(true);
    let getMonths = await request.get(`${config.path.timesheet.month}`, true);
    getMonths = getMonths.data;
    setMonths(getMonths);

    await refreshEmployees(getMonths[0]._id);

    document.getElementById("monthPicker").value = getMonths[0]._id; //ASSIGN THE LATEST MONTH AS OPTION
  }, []);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  return (
    <main>
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0 flex items-center">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Analytics
              </h1>
            </div>

            {/* Right: Actions  */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Datepicker built with flatpickr
            <Datepicker align="right" />*/}
              {/* Month Picker*/}
              <select
                id="monthPicker"
                className="form-select" // w-full mt-2 mb-5"
                value={selectedMonth}
                onChange={handleMonth}
              >
                {months.map((month, i) => (
                  <option key={i} value={month._id}>
                    {month.desc}{" "}
                  </option>
                ))}
              </select>
              {/* Search Form*/}
              <SearchForm placeholder="Search…" setSearchTerm={setSearchTerm} />
            </div>
          </div>

          <div className="pb-5 flex justify-between w-full">
            <DashboardCard04 data={employeesData && employeesData[1]} />
            <div
              className="flex justify-starts align-end flex-col"
              style={{ marginLeft: "100px" }}
            >
              <div class="px-5 py-10 mb-3">
                <div class="relative rounded-md border border-gray-600">
                  <div className="p-3 flex flex-col items-center justify-around">
                    <div className="mt-3 rounded-full bg-green-100 text-green-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      &gt;3 Months
                    </div>
                    <div className="ml-3 mt-3 rounded-full  bg-yellow-100 text-yellow-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      &gt;2 and &lt;3 Months
                    </div>
                    <div
                      className="ml-3 mt-3 rounded-full px-2.5 py-0.5 font-medium text-sm w-full text-center"
                      style={{
                        backgroundColor: "rgb(255 237 213)",
                        color: "rgb(234 88 12)",
                      }}
                    >
                      &gt;1 and &lt;2 Months
                    </div>
                    <div className="ml-3 mt-3 rounded-full  bg-rose-100 text-rose-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      &lt;1 Month
                    </div>
                  </div>
                  <h2 class="absolute flex top-0 left-0 transform -translate-y-1/2">
                    <span
                      class="bg-gray-700 px-1 ml-2 text-sm font-medium"
                      style={{ backgroundColor: "#F1F5F9" }}
                    >
                      Project Status (Employee)
                    </span>
                  </h2>
                </div>
              </div>
              <div class="px-5 py-10 mt-3">
                <div class="relative rounded-md border border-gray-600">
                  <div className="p-3 flex flex-col items-center justify-around">
                    <div className="mt-3 rounded-full bg-green-100 text-green-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      Above 80%
                    </div>
                    <div className="ml-3 mt-3 rounded-full  bg-yellow-100 text-yellow-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      Between 60% &amp; 80%
                    </div>
                    <div className="ml-3 mt-3 rounded-full bg-rose-100 text-rose-600 px-2.5 py-0.5 font-medium text-sm w-full text-center">
                      Below 60%
                    </div>
                  </div>
                  <h2 class="absolute flex top-0 left-0 transform -translate-y-1/2">
                    <span
                      class="bg-gray-700 px-1 ml-2 text-sm font-medium"
                      style={{ backgroundColor: "#F1F5F9" }}
                    >
                      Billable Utilization
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">
            {/* Line chart (Analytics)
          <AnalyticsCard01 />
          {/*  Line chart (Active Users Right Now)
          <AnalyticsCard02 />
          {/* Stacked bar chart (Acquisition Channels)
          <AnalyticsCard03 />
          {/* Horizontal bar chart (Audience Overview)
          <AnalyticsCard04 />
          {/* Report card (Top Channels)
          <AnalyticsCard05 />
          {/* Report card (Top Pages)
          <AnalyticsCard06 />
          {/* Report card (Top Countries)
          <AnalyticsCard07 />
          {/* Doughnut chart (Sessions By Device)
          <AnalyticsCard08 />
          {/* Doughnut chart (Visit By Age Category)
          <AnalyticsCard09 />
          {/* Polar chart (Sessions By Gender)
          <AnalyticsCard10 />
          {/* Table (Top Products) */}
            <AnalyticsCard11
              employeesData={employeesData && employeesData[0]}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Analytics;
