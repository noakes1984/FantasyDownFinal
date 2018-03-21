// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, Dimensions, Linking, TouchableOpacity} from "react-native";

import {Text, Button, Container, Logo, Theme, AnimatedView} from "../components";
import type {ScreenProps} from "../components/Types";

export default class Welcome extends React.Component<ScreenProps<>> {

    @autobind
    signUp() {
        this.props.navigation.navigate("SignUp");
    }

    @autobind
    login() {
        this.props.navigation.navigate("Login");
    }

    render(): React.Node {
        return (
            <Container gutter={2} style={styles.root}>
                <Logo />
                <AnimatedView style={styles.container}>
                    <Text type="header1" style={styles.header}>Fiber</Text>
                </AnimatedView>
                <AnimatedView style={styles.container} delay={600} duration={300}>
                    <Button label="Login" onPress={this.login} full primary />
                    <Button label="Sign Up" onPress={this.signUp} full />
                </AnimatedView>
                <TouchableOpacity style={styles.framer} onPress={framer}>
                    <Text style={styles.framerText}>Designed by Framer</Text>
                </TouchableOpacity>
            </Container>
        );
    }
}

const framer = () => Linking.openURL("https://framer.com/fiber");
const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    root: {
        justifyContent: "flex-end",
        alignItems: "center"
    },
    container: {
        alignSelf: "stretch"
    },
    header: {
        textAlign: "center",
        marginTop: Theme.spacing.base * 2,
        marginBottom: Theme.spacing.base * 2
    },
    framer: {
        position: "absolute",
        bottom: Theme.spacing.tiny,
        width
    },
    framerText: {
        textAlign: "center",
        fontSize: 12
    }
});
