// @flow
import autobind from "autobind-decorator";
import * as React from "react";

import {TextField, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";

type PasswordState = {
    password: string
};

export default class Password extends React.Component<NavigationProps<*>, PasswordState> {

    componentWillMount() {
        this.setState({ password: "" });
    }

    @autobind
    setPassword(password: string) {
        this.setState({ password });
    }

    @autobind
    async next(): Promise<void> {
        const {password} = this.state;
        const {email} = Firebase.registrationInfo;
        try {
            await Firebase.auth.createUserWithEmailAndPassword(email, password);
        } catch(e) {
            alert(e);
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer title="Your Password" subtitle="Stay Safe" next={this.next} {...{ navigation }}>
                <TextField
                    secureTextEntry={true}
                    placeholder="Password"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={this.next}
                    onChangeText={this.setPassword}
                />
            </SignUpContainer>
        );
    }
}
