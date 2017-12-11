// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, Image} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import {Text, Avatar, Theme, Firebase, RefreshIndicator, Post, FirstPost, Images} from "../../components";

import type {ScreenProps} from "../../components/Types";
import type {Post as PostModel, Profile} from "../../components/Model";

type ProfileState = {
    loading: boolean,
    posts: PostModel[],
    profile: Profile
};

export default class ProfileComp extends React.Component<ScreenProps<>, ProfileState> {

    async componentWillMount(): Promise<void> {
        this.setState({
            loading: true
        });
        const {uid} = Firebase.auth.currentUser;
        const profileDoc = await Firebase.firestore.collection("users").doc(uid).get();
        const profile = profileDoc.data();
        const query = await Firebase.firestore.collection("feed")
                                                .where("uid", "==", uid)
                                                .orderBy("timestamp", "desc")
                                                .get();
        const posts: PostModel[] = [];
        query.forEach(doc => posts.push(doc.data()));
        this.setState({
            profile,
            posts,
            loading: false
        });
    }

    @autobind
    settings() {
        const {profile} = this.state;
        this.props.navigation.navigate("Settings", { profile });
    }

    renderHeader(): React.Node {
        const {profile} = this.state;
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
        const {navigation} = this.props;
        const {loading, posts, profile} = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
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
