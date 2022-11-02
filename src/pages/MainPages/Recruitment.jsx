import React, { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);
  const [employeesData, setEmployeesData] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigateTo = useNavigate();

  const checkToken = async () => {
    let authToken = localStorage.getItem("auth-token");
    if (isJwtExpired(authToken)) {
      localStorage.setItem("auth-token", null);
      dispatch({
        type: "LOGOUT",
      });
      navigateTo("/signin");
    }
  };

  useEffect(async () => {
    setLoading(true);

    let employees = await request.get(config.path.users.getAllEmployees);

    if (!employees.err) {
      setEmployeesData(employees);
    }

    setLoading(false);
  }, []);

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
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Analytics
              </h1>
            </div>

            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <SearchForm placeholder="Search…" setSearchTerm={setSearchTerm} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-5">
            <DashboardCard04 data={employeesData && employeesData[1]} />
          </div>

          <div className="grid grid-cols-12 gap-6">
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
