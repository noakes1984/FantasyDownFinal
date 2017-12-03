// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, Platform} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Post from "../explore/Post";
import FirstPost from "./FirstPost";

import {Text, SmartImage, APIStore, Avatar, NavigationHelpers, Theme} from "../../components";
import type {ScreenProps} from "../../components/Types";

export default class Profile extends React.Component<ScreenProps<>> {

    @autobind
    logout() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Welcome");
    }

    render(): React.Node {
        const {navigation} = this.props;
        const profile = APIStore.profile();
        const posts = APIStore.posts().filter(post => post.name === profile.name);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <SmartImage style={styles.cover} {...profile.cover} />
                    <SafeAreaView style={styles.logout}>
                        <TouchableOpacity onPress={this.logout}>
                            <View>
                                <Icon name="log-out" size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={styles.title}>
                        <Text type="large" style={styles.outline}>{profile.outline}</Text>
                        <Text type="header2" style={styles.name}>{profile.name}</Text>
                    </View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    keyExtractor={post => post.id}
                    renderItem={({ item }) => <Post post={item} {...{navigation}} />}
                    ListEmptyComponent={<FirstPost {...{navigation}} />}
                />
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
        zIndex: 10000
    },
    cover: {
        height: width
    },
    avatar: {
        position: "absolute",
        top: Platform.OS === "ios" ? (width - avatarSize * 0.62) : undefined,
        bottom: Platform.OS === "ios" ? undefined : Theme.spacing.small,
        right: Theme.spacing.base
    },
    title: {
        position: "absolute",
        bottom: Theme.spacing.base,
        left: Theme.spacing.base
    },
    logout: {
        position: "absolute",
        top: Theme.spacing.small,
        right: Theme.spacing.base,
        backgroundColor: "transparent"
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)"
    },
    name: {
        color: "white"
    },
    list: {
        paddingHorizontal: Theme.spacing.small,
        paddingBottom: 57 + Theme.spacing.small
    }
});
