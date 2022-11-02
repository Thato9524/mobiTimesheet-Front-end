import React, { useState, useEffect } from "react";
import PreLoader from "../../components/PreLoader";
import request from "../../handlers/request";
import config from "../../config";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthContext } from "../../App";
import { PropTypes } from "prop-types";
import TaTable from "../../components/FormTables/TaTable";
import { Box, createTheme, Tab, Tabs, ThemeProvider } from "@mui/material";
import styled from "@emotion/styled";
import ErTable from "../../components/FormTables/ErTable";
import ScfTable from "../../components/FormTables/ScfTable";
import ModalBlank from "../../components/ModalBlank";
import SearchForm from "../../partials/actions/SearchForm";
import { CSVLink } from "react-csv";
import SFTable from "../../components/FormTables/SFTable";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#f33f5f",
      dark: "#ad2d44",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

//CUSTOM TABS COMPONENT CONTAINER
const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#f33f5f",
  },
});

//CUSTOM TAB COMPONENT
const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: "text-zinc-500",
    "&:hover": {
      color: "#f26680",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#f33f5f",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

//TAB CONTENT CONTAINER
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
//TAB CONTENT PROP TYPES
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

//FUNCTION FOR THE TABS INDEXING
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function FormSubmissions() {
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [option, setOption] = useState("all");
  const [status, setStatus] = useState({
    Ta: {
      pending: [],
      approved: [],
      declined: [],
      all: [],
    },
    Scf: {
      pending: [],
      approved: [],
      declined: [],
      all: [],
    },
    Er: {
      pending: [],
      approved: [],
      declined: [],
      all: [],
    },
  });
  const [TaForms, setTaForms] = useState([]);
  const [ScfForms, setScfForms] = useState([]);
  const [ErForms, setErForms] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [value, setValue] = useState(0);
  const [trainingDays, setTrainingDays] = useState([]);
  const { dispatch } = React.useContext(AuthContext);

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
  //USE EFFECT TO LOGOUT IF TOKEN EXPIRED
  useEffect(async () => {
    await refreshPage();
  }, [request]);

  function handleChange(event, newValue) {
    if (option === "pending") {
      setTaForms(status.Ta.pending);
      setScfForms(status.Scf.pending);
      setErForms(status.Er.pending);
    } else if (option === "approved") {
      setTaForms(status.Ta.approved);
      setScfForms(status.Scf.approved);
      setErForms(status.Er.approved);
    } else if (option === "declined") {
      setTaForms(status.Ta.declined);
      setScfForms(status.Scf.declined);
      setErForms(status.Er.declined);
    } else {
      setTaForms(status.Ta.all);
      setScfForms(status.Scf.all);
      setErForms(status.Er.all);
    }
    setValue(newValue);
  }
  async function refreshPage() {
    try{
    setLoading(true);
    checkToken();
    const getSfForms = await request.get(config.path.formSubmissions.getSfForms);
    setTrainingDays(getSfForms);
    const tAforms = await request.get(config.path.formSubmissions.getTaForms);
    console.log(tAforms.all.sort(compareDates));
    setTaForms(tAforms.all.sort(compareDates));
    const eRforms = await request.get(config.path.formSubmissions.getErForms);
    setErForms(eRforms.all.sort(compareDates));
    console.log(eRforms.all);
    const sCFforms = await request.get(config.path.formSubmissions.getScfForms);
    setScfForms(sCFforms.all.sort(compareDates));

    setStatus({
      Ta: {
        pending: tAforms.pending,
        approved: tAforms.approved,
        declined: tAforms.declined,
        all: tAforms.all,
      },
      Scf: {
        pending: sCFforms.pending,
        approved: sCFforms.approved,
        declined: sCFforms.declined,
        all: sCFforms.all,
      },
      Er: {
        pending: eRforms.pending,
        approved: eRforms.approved,
        declined: eRforms.declined,
        all: eRforms.all,
      },
    });
    setLoading(false);
  }catch(err){
    setLoading(false);
    setMessage(err.message);
    setError(true);
  }
  }
  //HANDLES THE ACTION OF APPROVING/DECLINING A SUBMISSION
  async function handleApproval(e, table, type) {
    let response, req;
    //IF THE REQUEST IS COMING FROM THE TRAVEL ALLOWANCE TABLE
    if (table === "Ta") {
      req = {
        approval: type,
      };
      response = await request.patch(
        `${config.path.formSubmissions.updateTaForm}/${e.target.id}`,
        req,
        true
      );
      if (response.err) {
        setError(true);
        setMessage(response.message);
      } else {
        await refreshPage();
      }
    }
    //IF THE REQUEST IF COMING FROM THE STUDY COST FUNDING REQUEST
    else if (table === "Scf") {
      req = {
        approval: type,
      };
      response = await request.patch(
        `${config.path.formSubmissions.updateScfForm}/${e.target.id}`,
        req,
        true
      );
      if (response.err) {
        setError(true);
        setMessage(response.message);
      } else {
        await refreshPage();
      }
    }
    //IF THE REQUEST IS COMING FROM THE EXPENSE REIMBURSEMENT TABLE
    else {
      req = {
        approval: type,
      };
      response = await request.patch(
        `${config.path.formSubmissions.updateErForm}/${e.target.id}`,
        req,
        true
      );
      if (response.err) {
        setError(true);
        setMessage(response.message);
      } else {
        await refreshPage();
      }
    }
  }
  //HANDLES THE STATE OF TABLE INFORMATION DISPLAYED
  function handleOption(e) {
    //IF THE CURRENT DISPLAYED TABLE IS EXPENSE REIMBURSEMENT
    if (value === 0) {
      if (e.target.value === "pending") {
        setOption(e.target.value);
        setErForms(status.Er.pending);
      } else if (e.target.value === "approved") {
        setOption(e.target.value);
        setErForms(status.Er.approved);
      } else if (e.target.value === "declined") {
        setOption(e.target.value);
        setErForms(status.Er.declined);
      } else {
        setOption(e.target.value);
        setErForms(status.Er.all);
      }
    }
    //IF THE CURRENT DISPLAYED TABLE IS STUDY COST FUNDING
    else if (value === 1) {
      if (e.target.value === "pending") {
        setOption(e.target.value);
        setScfForms(status.Scf.pending);
      } else if (e.target.value === "approved") {
        setOption(e.target.value);
        setScfForms(status.Scf.approved);
      } else if (e.target.value === "declined") {
        setOption(e.target.value);
        setErForms(status.Scf.declined);
      } else {
        setOption(e.target.value);
        setErForms(status.Scf.all);
      }
    }
    //IF THE CURRENT DISPLAYED TABLE IS TRAVEL ALLOWANCE
    else {
      if (e.target.value === "pending") {
        setOption(e.target.value);
        setTaForms(status.Ta.pending);
      } else if (e.target.value === "approved") {
        setOption(e.target.value);
        setTaForms(status.Ta.approved);
      } else if (e.target.value === "declined") {
        setOption(e.target.value);
        setTaForms(status.Ta.declined);
      } else {
        setOption(e.target.value);
        setTaForms(status.Ta.all);
      }
    }
  }

  function compareDates(a, b) {
    const dateA = new Date(a.created).setHours(0, 0, 0, 0, 0); // ignore time
    const dateB = new Date(b.created).setHours(0, 0, 0, 0, 0); // ignore time
    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0; //date is the same
  }
  return (
    <div className="relative mb-6">
      {loading ? (
        <PreLoader />
      ) : (
        <div>
          <ModalBlank
            id="error-modal"
            modalOpen={error}
            setModalOpen={setError}
          >
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                </svg>
              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-5">
                  <div className="text-lg font-semibold text-zinc-800">
                    Error: {message}
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={() => setError(false)}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
          <Box className="sm:flex sm:justify-between sm:items-center mb-1">
            <div className="px-4 sm:px-6 lg:px-8 py-8 mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                Form Submissions
              </h1>
            </div>
            <div className="flex justify-end mr-3">
              {value === 0 ? (
                <>
                  {ErForms.length > 0 && (
                    <CSVLink
                      className="mr-3 btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                      data={ErForms}
                      filename={`Expense_Reimbursement_${option}_${today.getDate()}_${
                        today.getMonth() + 1
                      }_${today.getFullYear()}.csv`}
                    >
                      Export to CSV
                    </CSVLink>
                  )}
                </>
              ) : value === 1 ? (
                <>
                  {ScfForms.length > 0 && (
                    <CSVLink
                      className="mr-3 btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                      data={ScfForms}
                      filename={`Study_Cost_Funding_${option}_${today.getDate()}_${
                        today.getMonth() + 1
                      }_${today.getFullYear()}.csv`}
                    >
                      Export to CSV
                    </CSVLink>
                  )}
                </>
              ) : value === 2 ? (
                <>
                  {TaForms.length > 0 && (
                    <CSVLink
                      className="mr-3 btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                      data={TaForms}
                      filename={`Travel_Allowance_${option}_${today.getDate()}_${
                        today.getMonth() + 1
                      }_${today.getFullYear()}.csv`}
                    >
                      Export to CSV
                    </CSVLink>
                  )}
                </>
              ) : (
                ""
              )}
              {/* Filter button */}
              {value <= 2 ? (
                <select
                  className="form-select mr-3"
                  value={option}
                  onChange={handleOption}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              ) : (
                ""
              )}
              <SearchForm placeholder="Search…" setSearchTerm={setSearchItem} />
            </div>
          </Box>
          <div className="relative">
            <Box
              className="flex flex-wrap"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <ThemeProvider theme={theme}>
                <CustomTabs
                  value={value}
                  onChange={handleChange}
                  textColor="primary"
                  indicatorColor="primary"
                  variant="fullWidth"
                >
                  <CustomTab
                    className="pl-2"
                    label="Expense Reimbursement"
                    {...a11yProps(0)}
                  />
                  <CustomTab label="Study Cost Funding" {...a11yProps(1)} />
                  <CustomTab label="Travel Allowance" {...a11yProps(2)} />
                  <CustomTab label="Skills Friday" {...a11yProps(3)} />
                </CustomTabs>
              </ThemeProvider>
            </Box>
            <TabPanel value={value} index={0}>
              {ErForms.length > 0 ? (
                <ErTable
                  forms={ErForms}
                  searchTerm={searchItem}
                  handleApproval={handleApproval}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <div className="mt-5 flex justify-center text-zinc-400 text-xl">
                  <h1>No Forms Found</h1>
                </div>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {ScfForms.length > 0 ? (
                <ScfTable
                  forms={ScfForms}
                  searchTerm={searchItem}
                  open={open}
                  setOpen={setOpen}
                  handleApproval={handleApproval}
                />
              ) : (
                <div className="mt-5 flex justify-center text-zinc-400 text-xl">
                  <h1>No Forms Found</h1>
                </div>
              )}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {TaForms.length > 0 ? (
                <TaTable
                  forms={TaForms}
                  searchTerm={searchItem}
                  handleApproval={handleApproval}
                />
              ) : (
                <div className="mt-5 flex justify-center text-zinc-400 text-xl">
                  <h1>No Forms Found</h1>
                </div>
              )}
            </TabPanel>
            <TabPanel value={value} index={3}>
              {trainingDays.length > 0 ? (
                <SFTable attendances={trainingDays} />
              ) : (
                <div className="mt-5 flex justify-center text-zinc-400 text-xl">
                  <h1>No Training</h1>
                </div>
              )}
            </TabPanel>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormSubmissions;
