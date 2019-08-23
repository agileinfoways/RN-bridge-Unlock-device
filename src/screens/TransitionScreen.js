import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler
} from "react-native";
import { NavigationEvents, NavigationActions } from "react-navigation";
import styles from "../styles/index";

class TransitionScreen extends Component {
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text onPress={() => {
                    navigate({
                        routeName: "Transition1",
                        key: "Transition"
                    })
                }} style={styles.textStyle}>
                    Go to next screen
                </Text>
            </View>
        );
    }
}
export default TransitionScreen;