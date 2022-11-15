/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel, AuthenticationScheme } from "@azure/msal-browser";
//update
export const msalConfig = {
  auth: {
    //clientId: "d76cc0c9-ee25-4685-9cde-ae6d8902b825", // This is the ONLY mandatory field that you need to supply. // Testing
    clientId: "00ec1a50-07a6-4d7a-ac32-807477a41666", // This is the ONLY mandatory field that you need to supply.
    authority:
      "https://login.microsoftonline.com/7748092c-54f8-4695-ac9f-d6114216c194", // Defaults to "https://login.microsoftonline.com/common"
    redirectUri: "/blank", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin. REDIRECT TO BLANK
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["User.Read"],
  prompt: "select_account",
};
