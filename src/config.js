export default {
  //url: "https://api.portal.c3-dev-house.com/v1",
  url: "https://server.c3uatportal.click/v1",
  //url: "http://localhost:3003/v1",
  //

  path: {
    patchNotes: {
      addPatch: "/patchNotes/addPatch",
      getSpecificPatch: "/profile/patchNotes",
    },
    settings: {
      updateNotifications: "/profile/updateNotifications",
    },
    formSubmissions: {
      getTaForms: "/formSubmissions/Ta/getAllSubmitted",
      getErForms: "/formSubmissions/Er/getAllSubmitted",
      getSfForms: "/formSubmissions/Sf/getAllSubmitted",
      getScfForms: "/formSubmissions/Scf/getAllSubmitted",
      updateTaForm: "/formSubmissions/Ta/update",
      updateScfForm: "/formSubmissions/Scf/update",
      updateErForm: "/formSubmissions/Er/update",
    },
    s3: {
      uploadFile: "/file",
      getFile: "/file",
    },
    login: "/authorization/login",
    loginMicrosft: "/authorization/loginMicrosft",
    register: "/authentication/register",
    checkToken: "/authorization/checkToken",
    getStrengths: "/authentication/getStrengths",
    profile: {
      getDev: "/profile/getDev",
      history: {
        getTaForms: "/profile/Ta/getAllSubmitted",
        getScfForms: "/profile/Scf/getAllSubmitted",
        getErForms: "/profile/Er/getAllSubmitted",
        getSfForms: "/profile/Sf/getAllSubmitted",
      },
      getProfile: "/profile/getProfile",
      updateProfile: "/profile/updateProfile",
      requestFunding: "/profile/requestFunding",
      requestReimbursement: "/profile/requestReimbursement",
      requestAllowance: "/profile/requestAllowance",
      addReview: "/profile/review/add",
      getPatch: "/profile/patchNotes",
      addAttendance: "/profile/addAttendance",
    },
    recruitment: {
      getAllDevRecruits: "/recruitment/getAllDevRecruits",
      getAllConsultantRecruits: "/recruitment/getAllConsultantRecruits",
      getDevDetails: "/recruitment/getDevDetails",
      getConsultantDetails: "/recruitment/getConsultantDetails",
      changeStage: "/recruitment/changeStage",
      sendConsultantEmail: "/recruitment/sendConsultantEmail",
      sendDevEmail: "/recruitment/sendDevEmail",
    },
    timesheet: {
      getTimesheets: "/timesheet/getTimesheets",
      approveTimesheet: "/timesheet/approveTimesheet",
      getTimesheetForUser: "/timesheet/getTimesheetForUser",
      getTimesheetForUserDay: "/timesheet/getTimesheetForUserDay",
      createTimesheet: "/timesheet/createTimesheet",
      deleteTimesheet: "/timesheet/deleteTimesheet",
      editTimesheet: "/timesheet/editTimesheet",
      getTimesheet: "/timesheet/getTimesheet",
      getTimesheetForProject: "/timesheet/getTimesheetForProject",
      addRates: "/timesheet/addRates",
      month: "/timesheet/month",
      getMonth: "/timesheet/getMonth",
    },
    completedsheet: {
      getCompletedsheets: "/completedSheets/getCompletedsheets",
      createCompletedsheet: "/completedSheets/createCompletedsheet",
      editCompletedsheet: "/completedSheets/editCompletedsheet",
      getCompletedsheet: "/completedSheets/getCompletedsheet",
      getCompletedsheetForMonth: "/completedSheets/getCompletedsheetForMonth",
    },
    clients: {
      getAll: "/clients/getAll",
      getClient: "/clients/getClient",
      createClient: "/clients/createClient",
      deleteClient: "/clients/deleteClient",
      editClient: "/clients/editClient",
      getAllClients: "/clients/getAllClients",
      getClientHours: "/clients/getClientHours",
      getClientHoursFor: "/clients/getClientHoursFor",
      getClientProjectHours: "/clients/getClientProjectHours",
    },
    projects: {
      getAll: "/projects/getAll",
      getProjects: "/projects/getProjects",
      createProject: "/projects/createProject",
      deleteProject: "/projects/deleteProject",
      editProject: "/projects/editProject",
      softDeleteProject: "/projects/softDeleteProject",
      getProject: "/projects/getProject",
      getProjectsFor: "/projects/getProjectsFor",
      getProjectsForClient: "/projects//getProjectsForClient",
      getProjectsForRep: "/projects/getProjectsForRep",
      getProjectDetails: "/projects/getProjectDetails",
      getPdfStatus: "/projects/getPdfStatus",
      setPdfStatus: "/projects/setPdfStatus",
      setPdfApproval: "/projects/setPdfApproval",
      getProjectsNotIn: "/projects/getProjectsNotIn",
      requestToJoin: "/projects/requestToJoin",
      requestToCreate: "/projects/requestToCreate",
      requestRemoval: "/projects/requestRemoval",
    },
    users: {
      getAll: "/users/getAll",
      getAllEmployees: "/users/getAllEmployees",
      getAllEmployeesFor: "/users/getAllEmployeesFor",
      getAllManagers: "/users/getAllManagers",
      updateProfilePicture: "/users/updateUserProfilePicture",
      getAllUserTypes: "/users/getAllUserTypes",
      getBenchWarmers: "/users/getBenchWarmers",
      getBenchUser: "/users/getBenchUser",
    },
    userManagement: {
      updateUser: "/users/updateUser",
      softDeleteUser: "/users/softDeleteEmployee",
      reactivateUser: "/users/reactivateUser",
    },
    events: {
      addEvent: "/events/addEvent",
      getAllEvents: "/events/getAllEvents",
      getAllTrainingDays: "/events/getAllTrainingDays",
      isTrainingDay: "/events/isTrainingDay",
      editEvent: "/events/editEvent",
      getEvent: "/events/getEvent",
      deleteEvent: "/events/deleteEvent",
    },
    leave: {
      addLeave: "/leave/addLeave",
      getAllLeave: "/leave/getAllLeave",
      editLeave: "/leave/editLeave",
      getLeave: "/leave/getLeave",
      getAllLeaveForAdmin: "/leave/getAllLeaveForAdmin",
      getAllLeaveForManagers: "/leave/getAllLeaveForManagers",
      deleteLeave: "/leave/deleteLeave",
      approveLeave: "/leave/approveLeave",
    },
  },
};
