// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView} from "react-native";
import {Feather as Icon} from "@expo/vector-icons";

import Post from "../explore/Post";
import FirstPost from "./FirstPost";

import {Text, SmartImage, APIStore, Avatar, Theme, Firebase, RefreshIndicator} from "../../components";
import type {ScreenProps} from "../../components/Types";
import type {Post as PostModel} from "../../components/APIStore";

type ProfileState = {
    loading: boolean,
    posts: PostModel[]
};

export default class Profile extends React.Component<ScreenProps<>, ProfileState> {

    async componentWillMount(): Promise<void> {
        this.setState({
            loading: true
        });
        const {uid} = Firebase.auth.currentUser;
        const query = await Firebase.firestore.collection("feed").where("uid", "==", uid).get();
        const posts: PostModel[] = [];
        query.forEach(doc => posts.push(doc.data()));
        this.setState({
            posts,
            loading: false
        });
    }

    @autobind
    logout() {
        Firebase.auth.signOut();
    }

    renderHeader(): React.Node {
        const {displayName} = Firebase.auth.currentUser.providerData[0];
        const profile = APIStore.profile();
        return (
            <View style={styles.header}>
                <SmartImage style={styles.cover} {...profile.cover} />
                <SafeAreaView style={styles.logout}>
                    <TouchableOpacity onPress={this.logout}>
                        <View>
                            <Icon name="log-out" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
                <View style={styles.headerContent}>
                    <View style={styles.title}>
                        <Text type="large" style={styles.outline}>{profile.outline}</Text>
                        <Text type="header2" style={styles.name}>{displayName}</Text>
                    </View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </View>
            </View>
        );
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {loading, posts} = this.state;
        const ListEmptyComponent = loading ? <RefreshIndicator refreshing={true} /> : <FirstPost {...{navigation}} />;
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    keyExtractor={post => post.id}
                    renderItem={({ item }) => (
                        <View style={styles.post}>
                            <Post post={item} {...{navigation}} />
                        </View>
                    )}
                    ListHeaderComponent={this.renderHeader()}
                    {...{ListEmptyComponent}}
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
    logout: {
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
