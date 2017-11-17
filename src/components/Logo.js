// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";

type LogoProps = {
    size: number
};

export default class Logo extends React.Component<LogoProps> {

    render(): React$Element<*> {
        const {size} = this.props;
        const container = { height: size, width: size };
        const root = { height: size * Math.sqrt(2), width: size * Math.sqrt(2), alignItems: "center" };
        const margin = Math.ceil(size * 0.02);
        const square = { height: size/2 - margin, width: size/2 - margin };
        return (
            <View style={root}>
                <View style={[container, styles.container]}>
                    <View style={[square, styles.square1, styles.square]} />
                    <View style={[square, styles.square2, styles.square]} />
                    <View style={[square, styles.square3, styles.square]} />
                    <View style={[square, styles.square4, styles.square]} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        transform: [{ rotate: "45deg" }]
    },
    square: {
        position: "absolute"
    },
    square1: {
        backgroundColor: "#b1ecfd",
        top: 0,
        left: 0
    },
    square2: {
        backgroundColor: "#49abf8",
        top: 0,
        right: 0
    },
    square3: {
        bottom: 0,
        left: 0
    },
    square4: {
        backgroundColor: "#1058f5",
        bottom: 0,
        right: 0
    }
});
