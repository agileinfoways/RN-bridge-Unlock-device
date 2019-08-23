import React, { Component } from "react";
import {
    View,
    Text,
    AsyncStorage
} from "react-native";
import styles from "../styles/index";
import firebase from 'react-native-firebase';

class SplashScreen extends Component {

    async componentDidMount() {
        this.checkPermission()
        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            console.log(" NOTIFICATION RECEIVED 111", notification)

            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        //App open
        this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
            console.log(" NOTIFICATION RECEIVED 222", notification)
            console.log(" NOTIFICATION RECEIVED 333", notification.title)
            console.log(" NOTIFICATION RECEIVED 444", notification.body)
            // Process your notification as required
            showMessage({
                message: notification.body,
                type: "info",
                color: COLORS.PRIMARY,
                backgroundColor: COLORS.WHITE
            });
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
        });
        this.removeNotificationDisplayedListener = firebase.messaging().onMessage((notification) => {
            alert("Hello in foreground")

            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
    }

    componentWillUnmount() {
        this.removeNotificationDisplayedListener();
        this.removeNotificationListener();
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log(' =============== FCM TOKEN =============== ', fcmToken);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                console.log(' =============== FCM TOKEN =============== ', fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected', error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text onPress={() => {
                    this.props.navigation.navigate({ routeName: "Transition", key: "Splash-01" })
                }} style={styles.textStyle}>Go to next screen</Text>
            </View>
        );
    }
}
export default SplashScreen;