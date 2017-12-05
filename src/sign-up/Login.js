// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {TextInput} from "react-native";

import SignUpContainer from "./SignUpContainer";

import {TextField, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";

type LoginState = {
    email: string,
    password: string
};

export default class Login extends React.Component<NavigationProps<*>, LoginState> {

    password: TextInput;

    componentWillMount() {
        this.setState({ email: "", password: "" });
    }

    @autobind
    setEmail(email: string) {
        this.setState({ email });
    }

    @autobind
    setPassword(password: string) {
        this.setState({ password });
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    async login(): Promise<void> {
        const {email, password} = this.state;
        try {
            if (email === "") {
                throw new Error("Please provide an email address.");
            }
            if (password === "") {
                throw new Error("Please provide a password.");
            }
            await Firebase.auth.signInWithEmailAndPassword(email, password);
        } catch(e) {
            alert(e);
        }
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
                    onChangeText={this.setEmail}
                />
                <TextField
                    secureTextEntry={true}
                    placeholder="Password"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    textInputRef={this.setPasswordRef}
                    onSubmitEditing={this.login}
                    onChangeText={this.setPassword}
                />
            </SignUpContainer>
        );
    }
}
