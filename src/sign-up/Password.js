// @flow
import autobind from "autobind-decorator";
import * as React from "react";

import {TextField, NavigationHelpers} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";

export default class Password extends React.Component<NavigationProps<*>> {

    @autobind
    next() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Home");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer title="Your Password" subtitle="Stay Safe" next={this.next} {...{ navigation }}>
                <TextField
                    toggleSecureEntry={true}
                    placeholder="Password"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={this.next}
                />
            </SignUpContainer>
        );
    }
}
