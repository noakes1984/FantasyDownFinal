// @flow
import autobind from "autobind-decorator";
import * as React from "react";

import {TextField, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpStore from "./SignUpStore";
import SignUpContainer from "./SignUpContainer";

type PasswordState = {
    password: string,
    loading: boolean
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
        const {email, displayName} = SignUpStore;
        try {
            if (password === "") {
                throw new Error("Please provide a password.");
            }
            this.setState({ loading: true });
            const user = await Firebase.auth.createUserWithEmailAndPassword(email, password);
            await user.updateProfile({ displayName });
        } catch(e) {
            alert(e);
            this.setState({ loading: false });
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {loading} = this.state;
        return (
            <SignUpContainer title="Your Password" subtitle="Stay Safe" next={this.next} {...{ navigation, loading }}>
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
