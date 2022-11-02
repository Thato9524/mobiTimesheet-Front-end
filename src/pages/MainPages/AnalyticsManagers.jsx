import React, { useState, useEffect } from "react";
import AnalyticsCard13 from "../../partials/analytics/AnalyticsCard13";
import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import SearchForm from "../../partials/actions/SearchForm";

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [managersData, setManagersData] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(async () => {
    setLoading(true);

    //GET DATA

    let managers = await request.get(config.path.users.getAllManagers);
    console.log(managers.error);

    if (!managers.err) {
      setManagersData(managers);
    }

    // console.log("empmanagersloyees", managers);

    setLoading(false);
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
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Managers
              </h1>
            </div>

            {/* Right: Actions  */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Datepicker built with flatpickr
            <Datepicker align="right" />*/}
              {/* Search Form*/}
              <SearchForm placeholder="Search…" setSearchTerm={setSearchTerm} />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">
            <AnalyticsCard13
              managersData={managersData}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Analytics;
