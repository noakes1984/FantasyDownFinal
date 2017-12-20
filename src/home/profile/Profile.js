// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, TouchableOpacity, Image, Animated} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";
import {inject, observer} from "mobx-react/native";
import {Constants} from "expo";

import ProfileStore from "../ProfileStore";
import Feed from "../Feed";
import FeedStore from "../FeedStore";

import {Text, Avatar, Theme, Images} from "../../components";
import type {FeedEntry} from "../../components/Model";
import type {ScreenProps} from "../../components/Types";

type InjectedProps = {
    profileStore: ProfileStore,
    userFeedStore: FeedStore
};

type ProfileState = {
    scrollAnimation: Animated.Value
};

@inject("profileStore", "userFeedStore") @observer
export default class ProfileComp extends React.Component<ScreenProps<> & InjectedProps, ProfileState> {

    componentWillMount() {
        this.props.userFeedStore.checkForNewEntriesInFeed();
        this.setState({
            scrollAnimation: new Animated.Value(0)
        });
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
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    render(): React.Node {
        const {navigation, userFeedStore, profileStore} = this.props;
        const {profile} = profileStore;
        const {scrollAnimation} = this.state;
        const height = scrollAnimation.interpolate({
            inputRange: [0, 0, 100, 100],
            outputRange: [width, width, statusBarHeight + 100, statusBarHeight + 100]
        });
        const opacity = scrollAnimation.interpolate({
            inputRange: [0, 0, 100, 100],
            outputRange: [1, 1, 0, 0]
        });
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.header, { height } ]}>
                    <AnimatedImage style={[styles.cover, { height }]} source={Images.cover} />
                    <TouchableOpacity onPress={this.settings} style={styles.settings}>
                        <View>
                            <Icon name="settings" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Animated.View style={[styles.title, { opacity }]}>
                        <Text type="large" style={styles.outline}>{profile.outline}</Text>
                        <Text type="header2" style={styles.name}>{profile.name}</Text>
                    </Animated.View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </Animated.View>
                <Feed
                    store={userFeedStore}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }]
                    )}
                    {...{navigation}}
                />
            </View>
        );
    }
}

const avatarSize = 100;
const {width} = Dimensions.get("window");
const {statusBarHeight} = Constants;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        marginBottom: avatarSize * 0.5 + Theme.spacing.small
    },
    cover: {
        ...StyleSheet.absoluteFillObject,
        width
    },
    avatar: {
        position: "absolute",
        right: Theme.spacing.small,
        bottom: - avatarSize * 0.5
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
