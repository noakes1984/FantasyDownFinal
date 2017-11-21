// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {TextInput} from "react-native";

import {TextField} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";

export default class Name extends React.Component<NavigationProps<*>> {

    lastName: TextInput;

    @autobind
    setLastNameRef(input: TextInput) {
        this.lastName = input;
    }

    @autobind
    goToLastName() {
        this.lastName.focus();
    }

    @autobind
    next() {
        this.props.navigation.navigate("SignUpEmail");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
                <SignUpContainer title="Your Name" subtitle="Who are you" next={this.next} {...{navigation}}>
                    <TextField
                        placeholder="First Name"
                        autoFocus={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={this.goToLastName}
                    />
                    <TextField
                        placeholder="Last Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        textInputRef={this.setLastNameRef}
                        onSubmitEditing={this.next}
                    />
                </SignUpContainer>
        );
    }
}
