// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions} from "react-native";

import {Text, SmartImage, APIStore, Avatar, NavigationHelpers, Theme} from "../../components";
import type {ScreenProps} from "../../components/Types";

export default class Profile extends React.Component<ScreenProps<>> {

    @autobind
    logOut() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Welcome");
    }

    render(): React.Node {
        const profile = APIStore.profile();
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <SmartImage style={styles.cover} {...profile.cover} />
                    <View style={styles.title}>
                        <Text type="large" style={styles.outline}>{profile.outline}</Text>
                        <Text type="header2" style={styles.name}>{profile.name}</Text>
                    </View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </View>
            </View>
        );
    }
}

const avatarSize = 100;
const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {

    },
    cover: {
        height: width
    },
    avatar: {
        position: "absolute",
        top: width - avatarSize * 0.62,
        right: Theme.spacing.base
    },
    title: {
        position: "absolute",
        bottom: Theme.spacing.base,
        left: Theme.spacing.base
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)"
    },
    name: {
        color: "white"
    }
});
