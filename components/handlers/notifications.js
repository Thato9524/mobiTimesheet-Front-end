import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import request from "../handlers/request";

//FOR THIS CODE TO WORK DEVELOPER MUST LOGIN TO THEIR EXPO ACCOUNT
//REGISTERING PUSH NOTIFICATION - GETTING PUSH NOTIFCATION TOKEN
export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("existingStatus: ", existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push notifications token: ", token);
    let user = await AsyncStorage.getItem("userId");
    let saveExpoPushToken = await request.post(
      config.path.notifications.saveExpoPushToken,
      {
        token: token,
        user: user,
      }
    );
    console.log("saveExpoPushToken: ", saveExpoPushToken);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
