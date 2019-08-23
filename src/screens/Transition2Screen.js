import React, { Component } from "react";
import {
    View,
    Text,
    InteractionManager,
    StatusBar
} from "react-native";
import { withNavigationFocus, NavigationActions, StackActions, SwitchActions } from "react-navigation";
import styles from "../styles/index";

class Transition2Screen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text onPress={() => {
                    //this.props.navigation.navigate("SwitchScreen")
                }} style={styles.textStyle}> Go to next stack</Text>
            </View>
        );
    }
}
export default withNavigationFocus(Transition2Screen);