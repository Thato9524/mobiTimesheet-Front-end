import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import idleTimeout from "../src/utils/idleTimeOut"
//import { AuthContext } from "./context/AuthContext";

import { isJwtExpired } from "jwt-check-expiration";
export const AuthContext = React.createContext();

import { ClientProvider } from "./ClientContext";

import "./css/style.scss";

import "./charts/ChartjsConfig";

import AuthStack from "./stack/AuthStack";
import AppStack from "./stack/AppStack";
import { useIsAuthenticated } from "@azure/msal-react";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("microsoftToken", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

function App() {
  
  const navigateTo = useNavigate();

  const location = useLocation();
  //const isAuthenticated = useIsAuthenticated();

  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("state: ", state);

  const [query, setQuery] = useState("react");
  useEffect(() => {
    const user = localStorage.getItem("user") || null;
    const token = localStorage.getItem("microsoftToken") || null;
    let authToken = localStorage.getItem("auth-token");
    console.log("token: " ,token)
    console.log("authtoken: " ,authToken)
    if (authToken === null){
      dispatch({
        type: "LOGOUT"
      })
      navigateTo("/signin")
    }
    if (user && token && !isJwtExpired(authToken)) {
      // console.log("Dispatch-Login");
      dispatch({
        type: "LOGIN",
        payload: {
          user,
          token,
        },
      });
      // console.log("state: ", state);
    } else {
      // console.log("Dispatch-Logout");
      dispatch({
        type: "LOGOUT",
      });
      navigateTo("/signin");
    }
    // console.log("state: ", state);
  }, [localStorage.getItem("user")]);
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change


  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ClientProvider>
        <div className="App">
          {!state.isAuthenticated ? <AuthStack /> : <AppStack />}
          {/*
      { (!state.isAuthenticated || isAuthenticated)? <AuthStack /> : <AppStack />}
       */}
        </div>
      </ClientProvider>
    </AuthContext.Provider>
  );

  // return <>{status ? <AppStack /> : <AuthStack />}</>; //isAuthenticated
}



export default App;
