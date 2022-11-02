import React, { useEffect, useState, useReducer } from "react";
import IdleTimer from "./inactivityTimeOut";
import Signin from "../pages/MainPages/Signin";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function timeout() {
  const [isTimeout, setIsTimeout] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigateTo = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("microsoftToken") || null;
    let authToken = localStorage.getItem("auth-token");
    console.log("token: ", token);
    console.log("authtoken: ", authToken);
    if (authToken === null) {
      dispatch({
        type: "LOGOUT",
      });
      navigateTo("/signin");
    }

    const timer = new IdleTimer({
      timeout: 82800, //expire after 23 hours
      onTimeout: () => {
        setIsTimeout(true);
        dispatch({
          type: "LOGOUT",
        });

        navigateTo("/signin");
      },
      onExpired: () => {
        // do something if expired on load
        setIsTimeout(true);
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, []);

  return;
}
