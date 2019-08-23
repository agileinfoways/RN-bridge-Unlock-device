import { Animated, Easing, Button } from "react-native";
import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
  BottomTabBar,
  createMaterialTopTabNavigator
} from "react-navigation";
import SplashScreen from "./src/screens/SplashScreen";
import TransitionScreen from "./src/screens/TransitionScreen";
import Transition1Screen from "./src/screens/Transition1Screen";

const AuthStack = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: () => ({
        title: "Splash Screen",
        headerBackTitle: null,
        headerTruncatedBackTitle: "Back"
      })
    },
    Transition: {
      screen: TransitionScreen,
      navigationOptions: () => ({
        title: "Transition Screen",
      })
    },
    Transition1: {
      screen: Transition1Screen,
      navigationOptions: () => ({
        title: "Transition1 Screen",
      })
    }
  },
  {
    initialRouteName: 'Splash',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    })
  }
)

const App = createSwitchNavigator(
  {
    Auth: AuthStack,
  },
  {
    initialRouteName: "Auth"
  }
)

export default createAppContainer(App);
