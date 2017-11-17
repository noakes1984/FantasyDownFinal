// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

import {Field, DatePicker, Text} from "../components";
import type {NavigationProps} from "../components/Types";

import SignUpContainer from "./SignUpContainer";
import SubmitButton from "./SubmitButton";

export default class Birthday extends React.Component<NavigationProps<*>> {

    @autobind
    next() {
        this.props.navigation.navigate("SignUpPassword");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <SignUpContainer back={true} {...{ navigation }}>
                <Text type="header2" style={styles.text} gutterBottom={true}>When is your birthday?</Text>
                <Text gutterBottom={true} style={styles.text}>
                You must be at least 18 years old to use Ting.
                Other people won’t see your Birthday.
                </Text>
                <Field contrast={true} label="Birthday">
                    <DatePicker />
                </Field>
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
