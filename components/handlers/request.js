import config from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default {
  post: async (path, body, verify) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
      },
    };

    return new Promise(async (resolve, reject) => {
      console.log(`${config.url}${path}`);
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
  uploadImage: async (path, body) => {
    let data = new FormData();

    data.append("image", {
      name: body.image.fileName,
      type: body.image.type,
      uri:
        Platform.OS === "ios"
          ? body.image.uri.replace("file://", "")
          : body.image.uri,
    });

    console.log("Calling uplaod");
    return new Promise(async (resolve, reject) => {
      axios
        .post(`${config.url}${path}`, data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "multipart/form-data", //; boundary=${data._boundary}",
          },
        })
        .then((response) => {
          console.log("response", response);
          resolve(response.data);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  get: async (path, body) => {
    const reqConfig = {
      headers: {
        "Content-type": "application/json",
        "auth-token": await AsyncStorage.getItem("auth-token"),
      },
    };

    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${config.url}${path}`, body, reqConfig)
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

    console.log("reqConfig: ", reqConfig);

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
    console.log("reqConfig: ", reqConfig);

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
