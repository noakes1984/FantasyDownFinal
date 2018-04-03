// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, TouchableOpacity, Image, Animated} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";
import {inject, observer} from "mobx-react/native";
import {Constants} from "expo";

import ProfileStore from "../ProfileStore";

import {Text, Avatar, Theme, Images, Feed, FeedStore} from "../../components";
import type {FeedEntry} from "../../components/Model";
import type {ScreenProps} from "../../components/Types";

type InjectedProps = {
    profileStore: ProfileStore,
    userFeedStore: FeedStore
};

@inject("profileStore", "userFeedStore") @observer
export default class ProfileComp extends React.Component<ScreenProps<> & InjectedProps> {

    componentDidMount() {
        this.props.userFeedStore.checkForNewEntriesInFeed();
    }

    @autobind
    settings() {
        const {profile} = this.props.profileStore;
        this.props.navigation.navigate("Settings", { profile });
    }

    @autobind
    loadMore() {
        this.props.userFeedStore.loadFeed();
    }

    @autobind
    // eslint-disable-next-line class-methods-use-this
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    render(): React.Node {
        const {navigation, userFeedStore, profileStore} = this.props;
        const {profile} = profileStore;
        return (
            <Feed
                bounce={false}
                ListHeaderComponent={(
                    <View style={styles.header}>
                        <AnimatedImage style={styles.cover} source={Images.cover} />
                        <TouchableOpacity onPress={this.settings} style={styles.settings}>
                            <View>
                                <Icon name="settings" size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.title}>
                            <Text type="large" style={styles.outline}>{profile.outline}</Text>
                            <Text type="header2" style={styles.name}>{profile.name}</Text>
                        </View>
                        <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                    </View>
                )}
                store={userFeedStore}
                {...{navigation}}
            />
        );
    }
}

const avatarSize = 100;
const {width} = Dimensions.get("window");
const {statusBarHeight} = Constants;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const styles = StyleSheet.create({
    header: {
        marginBottom: (avatarSize * 0.5) + Theme.spacing.small
    },
    cover: {
        width,
        height: width
    },
    avatar: {
        position: "absolute",
        right: Theme.spacing.small,
        bottom: -avatarSize * 0.5
    },
    settings: {
        position: "absolute",
        top: statusBarHeight + Theme.spacing.small,
        right: Theme.spacing.base,
        backgroundColor: "transparent",
        zIndex: 10000
    },
    title: {
        position: "absolute",
        left: Theme.spacing.small,
        bottom: 50 + Theme.spacing.small
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)"
    },
    name: {
        color: "white"
    }
});
