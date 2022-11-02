import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../azure/authConfig";
import { AuthContext } from "../../App";
import idleTimeout from "../../utils/idleTimeOut"
import AuthImage from "../../images/auth-image.jpg";
import request from "../../handlers/request";
import config from "../../config";

function Signin() {
  const navigateTo = useNavigate();
  const { instance, accounts } = useMsal();
  const { dispatch } = React.useContext(AuthContext);
  const [view, setView] = useState();

  /*
   *
   *************************************** Microsoft Login ****************************************
   *
   */
   
  async function handleLogin(e){
    e.preventDefault();
    try {
      let email = "";
      let thisToken = "";
      let name = "";
      let microsoftId = "";
      await instance //Instance
        .loginPopup(loginRequest)
        .catch((error) => console.log(error))
        .then((response) => {
          thisToken = response.accessToken; //GET TOKEN
          email = response.account.username; //GET EMAIL
          name = response.idTokenClaims.name; //GET NAME
          microsoftId = response.account.localAccountId; //GET ID
        });

      const loginDetails = {
        token: thisToken,
        user: email,
        name: name,
      };

      let login = await request.post(
        config.path.loginMicrosft,
        loginDetails,
        false
      );
  
      //IF USER NOT REGISTERED
      if (login.err) {
        //STORE DETAILS IN LOCAL STORAGE
        await localStorage.setItem(
          "onboarding",
          JSON.stringify({ loginDetails: loginDetails })
        );
        navigateTo("/onboarding-01");

        return;
      } else {
        
        localStorage.setItem("auth-token", login.token);
        localStorage.setItem("_id", login._id);
        localStorage.setItem("adminTag", login.adminTag);
        localStorage.setItem("repTag", login.repTag);
        localStorage.setItem("microsoftId", microsoftId);
        localStorage.setItem("isTrainingDay", await request.get(config.path.events.isTrainingDay));
        localStorage.setItem("isDev", await request.get(`${config.path.profile.getDev}/${login._id}`));
        //localStorage.setItem("_expiredTime", Date.now() + 6 * 1000);
        dispatch({
          type: "LOGIN",
          payload: loginDetails,
        });
        navigateTo("/");
        
      }
    } catch (err) {
      setView("error");
      // console.log("Something went wrong");
    }
  };

  return (
    <main className="bg-black">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              
            </div>
            {(() => {
              switch (view) {
                case "error":
                  return (
                    <div className="max-w-sm mx-auto px-4 py-8">
                      <img
                        src="https://i.ibb.co/jMBgmsV/C3-light.png"
                        width="400"
                        height="120"
                        className=""
                        alt="Convergence Logo"
                      />
                      <h1 className="text-xl text-center text-white font-bold mb-1">
                        Error:
                      </h1>
                      <h1 className="text-m text-center text-white mb-6">
                        An error has occurred, please sign in again.
                      </h1>
                      <div className="flex items-center justify-center mt-6">
                        <button
                          className="btn bg-white hover:bg-rose-600 text-black"
                          onClick={handleLogin}
                          style={{
                            width: "216px",
                            padding: "0px",
                            top: "0px",
                            margin: "0px",
                            //width: "106px",
                            height: "45px",
                            background: `url(${"https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_signin_dark.svg"})`,
                            // background: `url(${"https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_signin_dark_short.svg"})`,
                          }}
                        ></button>
                        {/* <button
                          className="btn bg-rose-500 hover:bg-rose-600 text-white"
                          onClick={() => {
                            handleLogin
                            localStorage.clear();
                            instance.logoutPopup({
                              postLogoutRedirectUri: '/',
                              mainWindowRedirectUri: '/',
                            });
                          }}
                        >
                          Sign Out
                        </button>*/}
                      </div>
                    </div>
                  );
                case "register":
                  return (
                    <div className="max-w-sm mx-auto">
                      <img
                        src="https://i.ibb.co/jMBgmsV/C3-light.png"
                        width="400"
                        height="120"
                        className=""
                        alt="Convergence Logo"
                      />
                      <h1 className="text-xl text-center text-white font-bold mb-1">
                        Attention:
                      </h1>
                      <h1 className="text-m text-center text-white mb-6">
                        Before you start, please{" "}
                        <Link
                          className="font-medium text-rose-500 hover:text-rose-600"
                          to="/onboarding-01"
                        >
                          click here{" "}
                        </Link>
                        to follow the onboarding process.{" "}
                      </h1>
                    </div>
                  );
                default:
                  return (
                    <div className="max-w-sm mx-auto">
                      <img
                        src="https://i.ibb.co/jMBgmsV/C3-light.png"
                        width="400"
                        height="120"
                        className=""
                        alt="Convergence Logo"
                      />
                      
                      <div className="flex items-center justify-center mt-6">
                        <button
                          className="btn bg-rose-500 hover:bg-rose-600 text-black ml-3"
                          onClick={handleLogin}
                          style={{
                            width: "216px",
                            padding: "0px",
                            top: "0px",
                            margin: "0px",
                            //width: "106px",
                            height: "45px",
                            background: `url(${"https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_signin_dark.svg"})`,
                            // background: `url(${"https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_signin_dark_short.svg"})`,
                          }}
                        ></button>
                      </div>
                      
                    </div>
                  );
              }
            })()}
          </div>
        </div>

        {/* Image */}
        <div
          className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="760"
            height="1024"
            alt="Authentication"
          />
        </div>
      </div>
    </main>
  );
}

export default Signin;

const validateInputs = (obj) => {
  let names = {
    email: "Email",
    password: "Password",
  };
  for (let i in obj) {
    if (obj[i] === "") {
      return { valid: false, msg: `${names[i]} is required` };
    }
  }
  return { valid: true };
};
