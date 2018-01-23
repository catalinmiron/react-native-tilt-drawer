// Inspiration: https://dribbble.com/shots/4129974-Menu-interaction

import React from "react";
import {
  Image,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { Accelerometer } from "expo";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const EXPO_LOGO = require("./assets/expo_white.png");

class Drawer extends React.Component {
  state = {
    direction: "NONE",
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillMount() {
    if (!this.props.children) {
      throw new Error("Please provide a children!");
    }

    this.transition = new Animated.Value(0);
    // fancy number
    Accelerometer.setUpdateInterval(300);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  animate = () => {
    const { direction } = this.state;

    Animated.timing(this.transition, {
      toValue: direction === "RIGHT" ? 1 : 0,
      duration: 1000,
      easing: Easing.bounce,
    }).start(this.done);
  };

  _subscribe = () => {
    const { threshold } = this.props;

    this._subscription = Accelerometer.addListener(accelerometerData => {
      const direction =
        accelerometerData.x > threshold
          ? "RIGHT"
          : accelerometerData.x < -threshold ? "LEFT" : "NONE";

      // Don't animate if the prev direction is the same
      if (this.state.direction === direction || direction === "NONE") {
        return;
      }

      this.setState({ direction }, () => {
        this.animate();
      });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.reRIGHT();
    this._subscription = null;
  };

  render() {
    const { width, height, drawerContent, children } = this.props;

    const translateX = this.transition.interpolate({
      inputRange: [0, 1],
      outputRange: [-WIDTH, 0],
    });

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Animated.View
          style={[
            {
              transform: [{ translateX }],
              width: width,
              height: height,
              position: "absolute",
              zIndex: 1,
            },
          ]}
        >
          {drawerContent}
        </Animated.View>
        {children}
      </View>
    );
  }
}

Drawer.defaultProps = {
  threshold: 0.35,
  drawerContent: null,
  width: WIDTH,
  height: HEIGHT,
  done: () => {},
};

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Drawer drawerContent={<DrawerContent />}>
          <Content />
        </Drawer>
      </View>
    );
  }
}
const DrawerContent = () => (
  <View style={[styles.container, { backgroundColor: "turquoise" }]}>
    <Image source={EXPO_LOGO} style={styles.image} />
    {[...Array(5).keys()].map(i => <View key={i} style={styles.block} />)}
  </View>
);

const Content = () => (
  <View style={styles.container}>
    <Image source={EXPO_LOGO} style={styles.image} />
    <Text style={styles.paragraph}>Tilt right or left to</Text>
    <Text style={styles.paragraph}>show or hide the drawer</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "tomato",
  },
  drawer: {
    backgroundColor: "turquoise",
    width: WIDTH,
    height: HEIGHT,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  block: {
    height: 14,
    width: WIDTH * 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 22,
    color: "#ddd",
    textAlign: "center",
  },
  image: {
    width: WIDTH * 0.3,
    height: WIDTH * 0.3,
    marginBottom: 20,
    resizeMode: "contain",
  },
});
