// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {TextField, Switch, Theme, Text} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";
import SubmitButton from "./SubmitButton";

export default class Email extends React.Component<NavigationProps<*>> {

    @autobind
    next() {
        this.props.navigation.navigate("SignUpBirthday");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer back={true} {...{ navigation }}>
                <Text type="header2" gutterBottom={true} style={styles.header}>And, your email?</Text>
                <TextField
                    label="email"
                    keyboardType="email-address"
                    contrast={true}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={this.next}
                />
                <View style={styles.row}>
                    <Text style={styles.text}>
                    I’d like to receive marketing and policy communications from Ting and its partners.
                    </Text>
                    <Switch />
                </View>
                <SubmitButton onPress={this.next} />
            </SignUpContainer>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        flexWrap: "wrap",
        flex: 1,
        color: "white"
    },
    row: {
        flexDirection: "row",
        marginBottom: Theme.spacing.small
    },
    header: {
        color: "white"
    }
});
