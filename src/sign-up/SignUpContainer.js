// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, ScrollView, KeyboardAvoidingView} from "react-native";

import {Container, IconButton, Theme} from "../components";
import type {NavigationProps} from "../components/Types";

type SignUpContainerProps =  NavigationProps<*> & {
    back?: boolean,
    children?: React.ChildrenArray<React.Element<*>>
};

export default class SignUpContainer extends React.Component<SignUpContainerProps> {

    @autobind
    goBack() {
        this.props.navigation.goBack();
    }

    render(): React.Node {
        const {back} = this.props;
        return (
            <Container withGutter={true} style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    {
                        back && (
                            <View style={styles.back}>
                                <IconButton
                                    name="ios-arrow-back-outline"
                                    contrast={true}
                                    onPress={this.goBack}
                                />
                            </View>
                        )
                    }
                    <KeyboardAvoidingView behavior="padding">
                        {this.props.children}
                    </KeyboardAvoidingView>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    back: {
        position: "absolute",
        top: 0
    },
    content: {
        justifyContent: "center",
        flex: 1
    }
});
