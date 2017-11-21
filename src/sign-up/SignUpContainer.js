// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, ScrollView, KeyboardAvoidingView} from "react-native";

import {Text, Container, Button} from "../components";
import type {NavigationProps} from "../components/Types";

type SignUpContainerProps = NavigationProps<*> & {
    title: string,
    subtitle: string,
    next: () => void,
    children?: React.ChildrenArray<React.Element<*>>,
    nextLabel: string
};

export default class SignUpContainer extends React.Component<SignUpContainerProps> {

    static defaultProps = {
        nextLabel: "Next"
    };

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    render(): React.Node {
        const {title, subtitle, next, children, nextLabel} = this.props;
        return (
            <Container gutter={2}>
                <ScrollView contentContainerStyle={styles.container}>
                    <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
                        <View>
                            <Text type="large">{subtitle}</Text>
                            <Text type="header2" gutterBottom={true}>{title}</Text>
                        </View>
                        <View>{children}</View>
                        <View>
                            <Button label={nextLabel} full={true} primary={true} onPress={next} />
                            <Button label="Back" full={true} onPress={this.back} />
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    innerContainer: {
        flexGrow: 1,
        justifyContent: "space-between"
    }
});
