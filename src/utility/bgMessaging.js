// @flow
import firebase from "react-native-firebase";
// Optional flow type
import type, { RemoteMessage } from "react-native-firebase";
import RNUnlockDevice from "./RNUnlockDevice";

export default async (message: RemoteMessage) => {
  // handle your message
  console.log("SKK", message);
  // alert("Hello")

  RNUnlockDevice.unlock();

  // Create Channel first.
  const channel = new firebase.notifications.Android.Channel(
    "general-channel",
    "General Notifications",
    firebase.notifications.Android.Importance.Default
  ).setDescription("General Notifications");
  firebase.notifications().android.createChannel(channel);

  // Build your notification
  const notification = new firebase.notifications.Notification()
    .setTitle(message.data.custom_notification.title)
    .setBody(message)
    .setNotificationId("notification-action")
    .setSound("default")
    .setData(message.data)
    .android.setChannelId("general-channel")
    .android.setPriority(firebase.notifications.Android.Priority.Max);

  // Display the notification (with debug)
  firebase
    .notifications()
    .displayNotification(notification)
    .catch(err => console.error(err));

  return Promise.resolve();
};
