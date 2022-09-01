export default {
  //url: "https://api.portal.c3-dev-house.com/v1",
  url: "http://localhost:3003/v1",
  //url: "https://uat.api.portal.c3-dev-house.com/v1",
  path: {
    settings: {
      updateNotifications: "/profile/updateNotifications",
    },

    login: "/authorization/login",
    loginMicrosft: "/authorization/loginMicrosft",
    register: "/authentication/register",
    checkToken: "/authorization/checkToken",
    getStrengths: "/authentication/getStrengths",
    profile: {
      getProfile: "/profile/getProfile",
      updateProfile: "/profile/updateProfile",
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

    projects: {
      getAll: "/projects/getAll",
      getProjects: "/projects/getProjects",
      createProject: "/projects/createProject",
      deleteProject: "/projects/deleteProject",
      editProject: "/projects/editProject",
      getProject: "/projects/getProject",
      getProjectsFor: "/projects/getProjectsFor",
      getProjectsForRep: "/projects/getProjectsForRep",
      getProjectDetails: "/projects/getProjectDetails",
      getPdfStatus: "/projects/getPdfStatus",
      setPdfStatus: "/projects/setPdfStatus",
      setPdfApproval: "/projects/setPdfApproval",
    },
  },
};
