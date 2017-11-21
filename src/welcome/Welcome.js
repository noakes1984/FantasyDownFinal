// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

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
                <AnimatedView style={styles.container} delay={150} duration={150}>
                    <Button label="Login" full={true} primary={true} onPress={this.login} />
                    <Button label="Sign Up" full={true} onPress={this.signUp} />
                </AnimatedView>
            </Container>
        );
    }
}

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
    }
});
