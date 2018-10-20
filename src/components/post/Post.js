// @flow
import * as React from "react";
import moment from "moment";
import { StyleSheet, View, Dimensions, Platform } from "react-native";

import LikesAndComments from "./LikesAndComments";

import FeedStore from "../FeedStore";
import Text from "../Text";
import Avatar from "../Avatar";
import { Theme } from "../Theme";
import SmartImage from "../SmartImage";

import type { Post, Profile } from "../Model";
import type { NavigationProps } from "../Types";
import Triangle from "react-native-triangle";

type PostProps = NavigationProps<> & {
    post: Post,
    profile: Profile,
    store: FeedStore
};

type PostState = {
    post: Post,
    profile: Profile
};

export default class PostComp extends React.Component<PostProps, PostState> {
    state: $Shape<PostState> = {};

    unsubscribeToPost: () => void;
    unsubscribeToProfile: () => void;

    static getDerivedStateFromProps({ profile, post, choice }: PostProps): PostState {
        return { post, profile, choice };
    }

    componentDidMount() {
        const { post, store } = this.props;
        this.unsubscribeToPost = store.subscribeToPost(post.id, newPost => this.setState({ post: newPost }));
        // eslint-disable-next-line max-len
        this.unsubscribeToProfile = store.subscribeToProfile(post.uid, newProfile =>
            this.setState({ profile: newProfile })
        );
    }

    componentWillUnmount() {
        this.unsubscribeToPost();
        this.unsubscribeToProfile();
    }

    render(): React.Node {
        const { navigation } = this.props;
        const { post, profile } = this.state;
        const { likes, comments } = post;
        const contentStyle = [styles.content];
        const nameStyle = [styles.name];
        const textStyle = [styles.text];
        const dateStyle = [];
        if (post.picture) {
            contentStyle.push(StyleSheet.absoluteFill);
            contentStyle.push({ backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 5 });
            nameStyle.push({ color: "blue" });
            textStyle.push({ color: "green" });
            dateStyle.push({ color: "rgba(255, 255, 255, 0.8)" });
        }
        return (
            <View style={styles.container}>
                {post.picture && <SmartImage style={styles.picture} />}
                <View style={contentStyle}>
                    <View style={styles.header}>
                        <Avatar {...profile.picture} />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>{profile.name}</Text>
                            <Text style={dateStyle}>{moment(post.timestamp, "X").fromNow()}</Text>
                        </View>
                    </View>
                    <View style={styles.rectangleOne}>
                        <Text style={styles.rectangleOneText}>{post.choice}</Text>
                    </View>
                    <View style={styles.rectangleTwo}>
                        <Text style={styles.rectangleTwoText}>TB</Text>
                    </View>
                    <View>
                        <Text style={textStyle} gutterBottom>
                            {post.text}
                        </Text>
                    </View>
                    <View style={styles.header}>
                        <LikesAndComments
                            color={post.picture ? "white" : Theme.typography.color}
                            id={post.id}
                            {...{ navigation, likes, comments }}
                        />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>Competitor</Text>
                        </View>
                        <Avatar {...profile.picture} />
                    </View>
                </View>
            </View>
        );
    }
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        borderColor: Theme.palette.borderColor,
        borderWidth: Platform.OS === "ios" ? 0 : 1,
        marginVertical: Theme.spacing.small,
        backgroundColor: "lightblue"
    },
    rectangleOne: {
        backgroundColor: "#106ecf",
        height: 128,
        width: 310,
        alignItems: "center"
    },
    rectangleOneText: {
        fontSize: 100,
        paddingTop: 100,
        color: "white"
    },
    rectangleTwo: {
        backgroundColor: "#C83803",
        height: 128,
        width: 310,
        alignItems: "center"
    },
    rectangleTwoText: {
        fontSize: 100,
        paddingTop: 100,
        color: "white"
    },
    content: {
        padding: Theme.spacing.small
    },
    header: {
        flexDirection: "row",
        marginBottom: Theme.spacing.small
    },
    metadata: {
        marginLeft: Theme.spacing.small
    },
    name: {
        color: "black"
    },
    text: {
        flexWrap: "wrap"
    },
    picture: {
        height: width,
        borderRadius: 5
    }
});
