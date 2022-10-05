import React from "react";

export const AuthContext = React.createContext();

/*import React, { createContext } from "react";
import request from "../handlers/request";
const AccountContext = createContext();
const AuthContext = (props) => {
  const getSession = async () => {
    let authToken = localStorage.getItem('auth-token')
    console.log(authToken)
  };
  const authenticate = async (Username, Password) => {
    
  };
  const logout = () => {
  };
  return (
    <AccountContext.Provider value={{ authenticate, getSession, logout }}>
      {props.children}
    </AccountContext.Provider>
  );
};
export { AuthContext, AccountContext };*/
