// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";

import IconButton from "./IconButton";
import {Theme} from "./Theme";
import Text from "./Text";

import type {NavigationProps} from "./Types";

type NavHeaderProps = NavigationProps<*> & {
    title: string
};

export default class NavHeader extends React.Component<NavHeaderProps> {

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    render(): React.Node {
        const {title} = this.props;
        return (
            <View style={styles.header}>
                <IconButton name="ios-arrow-back-outline" onPress={this.back} style={styles.headerSide} />
                <Text type="large">{title}</Text>
                <View style={styles.headerSide} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 57,
        borderColor: Theme.palette.lightGray,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerSide: {
        marginLeft: Theme.spacing.base,
        marginRight: Theme.spacing.base,
        width: 50
    }
});
