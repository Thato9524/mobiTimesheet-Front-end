import React, { useState, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Datepicker from "../../components/Datepicker";
import AnalyticsCard01 from "../../partials/analytics/AnalyticsCard01";
import AnalyticsCard12 from "../../partials/analytics/AnalyticsCard12";
import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { useParams, useNavigate } from "react-router-dom";
import SearchForm from "../../partials/actions/SearchForm";
import { set } from "date-fns";
import DashboardCard01 from "../../partials/dashboard/DashboardCard01";

function ProjectAnalytics(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientsData, setClientsData] = useState([]);
  const [clientHours, setClientHours] = useState([]);
  const { dispatch } = React.useContext(AuthContext);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigateTo = useNavigate();

  const { key } = useParams();
  const { id } = useParams();
  const { clientID } = useParams();

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

  //FUNCTION TO REFRESH CLIENTS COMPONENTS
  const refreshClient = async (selectedMonth) => {
    //console.log("selectedMonth: ", selectedMonth);
    setLoading(true);
    checkToken();
    let clients = await request.get(config.path.clients.getAllClients);

    let clientHrs = await getClientHours(selectedMonth);

    setClientHours(clientHrs);
    // console.log("clientHours");

    // console.log("clients:", clients);
    setClientsData(clients, `${clients.length}`);
    setSelectedMonth(selectedMonth);
    setLoading(false);
  };

  //STORE MONTH ID
  async function handleMonth(e){
    console.log("change started")
    setLoading(true);
    setSelectedMonth(e.target.value);
    let hours = await getClientHours(e.target.value);
    setClientHours(hours);
    setLoading(false);
  };

  //GET CLIENT HOURS FUNCTION
  async function getClientHours(monthId){
    let hours = await request.get(config.path.clients.getClientHours.concat(`/${monthId}`), true);
    console.log(hours);
    return hours;
  }

  useEffect(async () => {
    let getMonth = await request.get(`${config.path.timesheet.month}`, true);
    getMonth = getMonth.data;
    setMonths(getMonth);

    await refreshClient(getMonth[0]._id);

    // console.log("////////////////////months: ", getMonth);
    document.getElementById("monthPicker").value = getMonth[0]._id; //ASSIGN THE LATEST MONTH AS OPTION
    setSelectedMonth(getMonth[0]._id);
  }, []);

  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    checkToken();
  }, [request]);

  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
              Projects Analytics
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
              onChange={handleMonth}
            >
              {months.map((month, i) => (
                <option key={i} value={month._id}>
                  {month.desc}{" "}
                </option>
              ))}
            </select>
            {/* Search Form*/}
            <SearchForm
              placeholder="Search Client…"
              setSearchTerm={setClientSearchTerm}
            />{" "}
            <SearchForm
              placeholder="Search Project…"
              setSearchTerm={setProjectSearchTerm}
            />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div>
            <PreLoader />
          </div>
        ) : (
          <React.Fragment>
            <div className="grid grid-cols-12 gap-6 pb-6">
              {clientHours.map((client) => (
                <DashboardCard01 key={client._id} client={client} />
              ))}
            </div>
            <div className="grid grid-cols-12 gap-6">
              <AnalyticsCard12
                clientsData={clientsData}
                refreshClient={refreshClient}
                clientSearchTerm={clientSearchTerm}
                projectSearchTerm={projectSearchTerm}
                selectedMonth={selectedMonth}
              />
            </div>
          </React.Fragment>
        )}
      </div>
      {/*)}*/}
    </main>
  );
}

export default ProjectAnalytics;
