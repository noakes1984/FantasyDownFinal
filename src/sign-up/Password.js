// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

import {Text, TextField, NavigationHelpers} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";
import SubmitButton from "./SubmitButton";

export default class Password extends React.Component<NavigationProps<*>> {

    @autobind
    next() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Home");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer back={true} {...{ navigation }}>
                <Text type="header2" gutterBottom={true} style={styles.text}>Create a password</Text>
                <Text gutterBottom={true} style={styles.text}>
                Your password must include at least one symbol and be 8 or more characters long.
                </Text>
                <TextField
                    toggleSecureEntry={true}
                    label="Password"
                    contrast={true}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={this.next}
                />
                <SubmitButton onPress={this.next} />
            </SignUpContainer>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: "white"
    }
});
