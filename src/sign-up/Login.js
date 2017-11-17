// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, TextInput} from "react-native";

import SignUpContainer from "./SignUpContainer";
import SubmitButton from "./SubmitButton";

import {TextField, Text, NavigationHelpers} from "../components";
import type {NavigationProps} from "../components/Types";

export default class Login extends React.Component<NavigationProps<*>> {

    password: TextInput;

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    login() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Home");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer back={true} {...{ navigation }}>
                <Text type="header2" gutterBottom={true} style={styles.header}>Login</Text>
                <TextField
                    label="email"
                    keyboardType="email-address"
                    contrast={true}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={this.goToPassword}
                />
                <TextField
                    toggleSecureEntry={true}
                    label="Password"
                    contrast={true}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    textInputRef={this.setPasswordRef}
                    onSubmitEditing={this.login}
                />
                <SubmitButton onPress={this.login} />
            </SignUpContainer>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        color: "white"
    }
});
