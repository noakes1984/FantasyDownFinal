// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {TextInput} from "react-native";

import {TextField, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";

type NameState = {
    firstName: string,
    lastName: string
};

export default class Name extends React.Component<NavigationProps<*>, NameState> {

    lastName: TextInput;

    componentWillMount() {
        this.setState({ firstName: "", lastName: "" });
    }

    @autobind
    setFirstName(firstName: string) {
        this.setState({ firstName });
    }

    @autobind
    setLastName(lastName: string) {
        this.setState({ lastName });
    }

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
        const {firstName, lastName} = this.state;
        if (firstName === "") {
            alert("Please provide a first name.");
        } else if (lastName === "") {
            alert("Please provide a last name.");
        } else {
            Firebase.registrationInfo.displayName = firstName + " " + lastName;
            this.props.navigation.navigate("SignUpEmail");
        }

    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
                <SignUpContainer title="Your Name" subtitle="Who are you" next={this.next} {...{navigation}}>
                    <TextField
                        placeholder="First Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={this.goToLastName}
                        onChangeText={this.setFirstName}
                    />
                    <TextField
                        placeholder="Last Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        textInputRef={this.setLastNameRef}
                        onSubmitEditing={this.next}
                        onChangeText={this.setLastName}
                    />
                </SignUpContainer>
        );
    }
}
