// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {TextField, Switch, Theme, Text, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";

type EmailState = {
    email: string
};

export default class Email extends React.Component<NavigationProps<*>, EmailState> {

    componentWillMount() {
        this.setState({ email: "" });
    }

    @autobind
    setEmail(email: string) {
        this.setState({ email });
    }

    @autobind
    next() {
        const {email} = this.state;
        if (email === "") {
            alert("Please provide an email.");
        } else {
            Firebase.registrationInfo.email = email;
            this.props.navigation.navigate("SignUpPassword");
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer title="Your Email" subtitle="We won't span" next={this.next} {...{ navigation }}>
                <TextField
                    placeholder="Email"
                    keyboardType="email-address"
                    contrast={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={this.next}
                    onChangeText={this.setEmail}
                />
                <View style={styles.row}>
                    <Switch />
                    <Text style={styles.text}>
                    Sign up for the newsletter
                    </Text>
                </View>
            </SignUpContainer>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        flexWrap: "wrap",
        marginLeft: Theme.spacing.small,
        textAlign: "right",
        flexGrow: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    header: {
        color: "white"
    }
});
