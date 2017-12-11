// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import moment from "moment"
import {FlatList, StyleSheet, View, Animated, SafeAreaView, RefreshControl, Platform} from "react-native";
import {Constants} from "expo";

import {Text, Theme, Avatar, RefreshIndicator, Firebase, Post, FirstPost} from "../../components";

import type {ScreenProps} from "../../components/Types";
import type {Post as PostModel, Profile} from "../../components/Model";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type Posts = { post: PostModel, profile: Profile }[];

type ExploreState = {
    scrollAnimation: Animated.Value,
    refreshing: boolean,
    posts: Posts,
    profile: Profile,
    loading: boolean
};

export default class Explore extends React.Component<ScreenProps<>, ExploreState> {

    @autobind
    onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => this.setState({ refreshing: false }), 3000);
    }

    async componentWillMount(): Promise<void> {
        this.setState({
            scrollAnimation: new Animated.Value(0),
            refreshing: false,
            loading: true
        });
        const {uid} = Firebase.auth.currentUser;
        const profileDoc = await Firebase.firestore.collection("users").doc(uid).get();
        const profile = profileDoc.data();
        const query = await Firebase.firestore.collection("feed").orderBy("timestamp", "desc").get();
        const posts: Posts = [];
        query.forEach(async postDoc => {
            const post = postDoc.data();
            const profileDoc = await Firebase.firestore.collection("users").doc(post.uid).get();
            const profile = profileDoc.data();
            posts.push({ post, profile });
        });
        this.setState({
            profile,
            posts,
            loading: false
        });
    }

    render(): React.Node {
        const {onRefresh} = this;
        const {navigation} = this.props;
        const {scrollAnimation, refreshing, posts, profile, loading} = this.state;
        const ListEmptyComponent = loading ? <RefreshIndicator refreshing={true} /> : <FirstPost {...{navigation}} />;
        const opacity = scrollAnimation.interpolate({
            inputRange: [0, 60],
            outputRange: [1, 0]
        });
        const translateY = scrollAnimation.interpolate({
            inputRange: [0, 0, 60],
            outputRange: [0, 0, -60]
        });
        const fontSize = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [36, 36, 24, 24]
        });
        const height = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [100, 100, 60, 60]
        });
        const marginTop = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [24, 24, 0, 0]
        });
        const shadowOpacity = scrollAnimation.interpolate({
            inputRange: [0, 0, 60, 60],
            outputRange: [0, 0, 0.25, 0.25]
        });
        return (
            <View style={styles.container}>
                <RefreshIndicator
                    style={styles.RefreshIndicator} {...{refreshing}}
                />
                <AnimatedSafeAreaView style={[styles.header, { shadowOpacity }]}>
                    <Animated.View style={[styles.innerHeader, { height }]}>
                        <View>
                            <AnimatedText
                                type="large"
                                style={{ position: "absolute", top: 0, opacity, transform: [{ translateY }] }}
                            >
                            New posts
                            </AnimatedText>
                            <AnimatedText
                                type="header2"
                                style={{ fontSize, marginTop }}
                            >
                            {moment().format("dddd")}
                            </AnimatedText>
                        </View>
                        { profile && <Avatar {...profile.picture} /> }
                    </Animated.View>
                </AnimatedSafeAreaView>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    keyExtractor={item => item.post.id}
                    renderItem={({ item }) => <Post post={item.post} profile={item.profile} {...{navigation}} />}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollAnimation
                                }
                            }
                        }]
                    )}
                    refreshControl={(Platform.OS === "ios" && (
                        <RefreshControl
                            tintColor="transparent"
                            colors={["transparent"]}
                            style={{ backgroundColor: "transparent" }}
                            {...{onRefresh, refreshing}}
                        />
                    ) || undefined)}
                    {...{ ListEmptyComponent }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    RefreshIndicator: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Constants.statusBarHeight + 100 + Theme.spacing.base
    },
    header: {
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 8,
        zIndex: 10000
    },
    innerHeader: {
        marginHorizontal: Theme.spacing.base,
        marginVertical: Theme.spacing.tiny,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    list: {
        paddingHorizontal: Theme.spacing.small
    }
})
