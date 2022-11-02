import config from "../config";
import axios from "axios";

export default {
  post: async (path, body, verify) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
      },
    };

    if (verify) {
      reqConfig.headers["auth-token"] = localStorage.getItem("auth-token");
    }

    return new Promise(async (resolve, reject) => {
      await axios
        .post(`${config.url}${path}`, body, reqConfig)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  get: async (path) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    };

    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${config.url}${path}`, reqConfig)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  delete: async (path) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    };

    // console.log("reqConfig: ", reqConfig);

    return new Promise(async (resolve, reject) => {
      await axios
        .delete(`${config.url}${path}`, reqConfig)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  patch: async (path, body) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
    };
    // console.log("reqConfig: ", reqConfig);

    return new Promise(async (resolve, reject) => {
      await axios
        .patch(`${config.url}${path}`, body, reqConfig)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
