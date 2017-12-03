// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {TextInput} from "react-native";

import SignUpContainer from "./SignUpContainer";

import {TextField} from "../components";
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
        this.props.navigation.navigate("Walkthrough");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer
                title="Login"
                subtitle="Get Started"
                nextLabel="Login"
                next={this.login}
                {...{ navigation }}
            >
                <TextField
                    placeholder="Email"
                    keyboardType="email-address"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={this.goToPassword}
                />
                <TextField
                    toggleSecureEntry={true}
                    placeholder="Password"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    textInputRef={this.setPasswordRef}
                    onSubmitEditing={this.login}
                />
            </SignUpContainer>
        );
    }
}
