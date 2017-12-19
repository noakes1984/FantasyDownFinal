// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, Image} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";
import {inject, observer} from "mobx-react/native";

import ProfileStore from "../ProfileStore";
import FeedStore from "../FeedStore";

import {Text, Avatar, Theme, RefreshIndicator, Post, FirstPost, Images} from "../../components";
import type {FeedEntry} from "../../components/Model";
import type {ScreenProps} from "../../components/Types";

type InjectedProps = {
    profileStore: ProfileStore,
    userFeedStore: FeedStore
};

@inject("profileStore", "userFeedStore") @observer
export default class ProfileComp extends React.Component<ScreenProps<> & InjectedProps> {

    componentWillMount() {
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
    keyExtractor(item: FeedEntry): string {
        return item.post.id;
    }

    renderHeader(): React.Node {
        const {profile} = this.props.profileStore;
        return (
            <View style={styles.header}>
                <Image style={styles.cover} source={Images.cover} />
                <View style={styles.settings}>
                {
                    profile && (
                        <TouchableOpacity onPress={this.settings}>
                            <View>
                                <Icon name="settings" size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                    )
                }
                </View>
                {
                    profile && (
                        <View style={styles.headerContent}>
                            <View style={styles.title}>
                                <Text type="large" style={styles.outline}>{profile.outline}</Text>
                                <Text type="header2" style={styles.name}>{profile.name}</Text>
                            </View>
                            <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                        </View>
                    )
                }
            </View>
        );
    }

    render(): React.Node {
        const {navigation, userFeedStore} = this.props;
        const {feed} = userFeedStore;
        const loading = feed === undefined;
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={feed}
                    keyExtractor={item => item.post.id}
                    scrollEventThrottle={1}
                    onEndReached={this.loadMore}
                    renderItem={({ item }) => (
                        <View style={styles.post}>
                            <Post
                                post={item.post}
                                profile={item.profile}
                                onUpdate={post => userFeedStore.updateFeed(post)} {...{navigation}}
                            />
                        </View>
                    )}
                    ListEmptyComponent={(
                        <View style={styles.post}>
                            {loading ? <RefreshIndicator refreshing={true} /> : <FirstPost {...{navigation}} />}
                        </View>
                    )}
                    ListHeaderComponent={this.renderHeader()}
                />
            </SafeAreaView>
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
        marginBottom: 50
    },
    headerContent: {
        ...StyleSheet.absoluteFillObject
    },
    cover: {
        height: width
    },
    avatar: {
        position: "absolute",
        right: Theme.spacing.small,
        bottom: -50
    },
    title: {
        position: "absolute",
        left: Theme.spacing.small,
        bottom: 50 + Theme.spacing.small
    },
    settings: {
        position: "absolute",
        top: Theme.spacing.small,
        right: Theme.spacing.base,
        backgroundColor: "transparent",
        zIndex: 10000
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)"
    },
    name: {
        color: "white"
    },
    list: {
        paddingBottom: 57 + Theme.spacing.small
    },
    post: {
        paddingHorizontal: Theme.spacing.small
    }
});
