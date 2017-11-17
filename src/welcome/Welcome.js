// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

import {Text, Button, Container, Logo} from "../components";
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
            <Container withGutter={true} style={styles.container}>
                <Logo size={100} />
                <Text type="header1" gutterBottom={true}>Fiber</Text>
                <Button label="Login" full={true} primary={true} onPress={this.login} />
                <Button label="Sign Up" full={true} onPress={this.signUp} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});
