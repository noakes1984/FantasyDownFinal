// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, Image} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";
import {inject, observer} from "mobx-react/native";

import HomeStore from "../HomeStore";

import {Text, Avatar, Theme, RefreshIndicator, Post, FirstPost, Images} from "../../components";

import type {ScreenProps} from "../../components/Types";

@inject("store") @observer
export default class ProfileComp extends React.Component<ScreenProps<> & { store: HomeStore }> {

    @autobind
    settings() {
        const {profile} = this.props.store;
        this.props.navigation.navigate("Settings", { profile });
    }

    renderHeader(): React.Node {
        const {profile} = this.props.store;
        return (
            <View style={styles.header}>
                <Image style={styles.cover} source={Images.cover} />
                <SafeAreaView style={styles.settings}>
                {
                    profile && (
                        <TouchableOpacity onPress={this.settings}>
                            <View>
                                <Icon name="settings" size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                    )
                }
                </SafeAreaView>
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
        const {navigation, store} = this.props;
        const {profile, userFeed} = store;
        const loading = store.userFeed === undefined;
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={userFeed}
                    keyExtractor={post => post.id}
                    renderItem={({ item }) => (
                        <View style={styles.post}>
                            <Post post={item} {...{navigation, profile}} />
                        </View>
                    )}
                    ListEmptyComponent={(
                        <View style={styles.post}>
                            {loading ? <RefreshIndicator refreshing={true} /> : <FirstPost {...{navigation}} />}
                        </View>
                    )}
                    ListHeaderComponent={this.renderHeader()}
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
