// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import {Text, Theme} from "../../components";
import type {NavigationProps} from "../../components/Types";

export default class First extends React.Component<NavigationProps<>> {

    @autobind
    share() {
        this.props.navigation.navigate("Share");
    }

    render(): React.Node {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.share}>
                    <Icon name="plus-circle" color={Theme.palette.primary} size={25} />
                </TouchableWithoutFeedback>
                <Text style={styles.text}>
                Looks like you have not shared anything yet.
                Now is the time to make your first post!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: Theme.spacing.base * 2
    },
    text: {
        marginTop: Theme.spacing.base
    }
});
