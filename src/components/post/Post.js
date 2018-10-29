// @flow
import * as React from "react";
import moment from "moment";
import { StyleSheet, View, Dimensions, Platform, Text } from "react-native";

import LikesAndComments from "./LikesAndComments";

import FeedStore from "../FeedStore";
// import Text from "../Text";
import Avatar from "../Avatar";
import { Theme } from "../Theme";
import SmartImage from "../SmartImage";
import teamColor from '../../NFLColors';

import type { Post, Profile } from "../Model";
import type { NavigationProps } from "../Types";

type PostProps = NavigationProps<> & {
    post: Post,
    bettor: Profile,
    bettee: Profile,
    store: FeedStore
};

type PostState = {
    post: Post,
    bettor: Profile,
    bettee: Profile
};

export default class PostComp extends React.Component<PostProps, PostState> {
    state: $Shape<PostState> = {};

    unsubscribeToPost: () => void;
    unsubscribeToBettor: () => void;
    unsubscribeToBettee: () => void;

    static getDerivedStateFromProps({ bettor, bettee, post, choice }: PostProps): PostState {
        return { post, bettor, bettee, choice };
    }

    componentDidMount() {
        const { post, store } = this.props;

        this.unsubscribeToPost = store.subscribeToPost(post.id, newPost => this.setState({ post: newPost }));
        // eslint-disable-next-line max-len
        this.unsubscribeToBettor = store.subscribeToProfile(post.bettor.id, bettor =>
            this.setState({ bettor })
        );
        this.unsubscribeToBettee = store.subscribeToProfile(post.bettee.id, bettee =>
            this.setState({ bettee })
        );
    }

    componentWillUnmount() {
        this.unsubscribeToPost();
        this.unsubscribeToBettor();
        this.unsubscribeToBettee();
    }

    render(): React.Node {
        const { navigation } = this.props;
        const { post, bettor, bettee } = this.state;
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

        console.log('post bettor', bettor);
        console.log('post bettee', bettee);

        return (
            <View style={styles.container}>
                {post.picture && <SmartImage style={styles.picture} />}
                <View style={contentStyle}>
                    <View style={styles.header}>
                        <Avatar {...bettor.picture} />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>{bettor.name}</Text>
                            <Text style={dateStyle}>{moment(post.createdAt, 'X').fromNow()}</Text>
                        </View>
                    </View>
                    <View style={[styles.choicesWrapper, {backgroundColor: teamColor(post.bettee.choice).color}]}>
                        <View style={[styles.triangleTopLeftCorner, {position: 'absolute', borderTopColor: teamColor(post.bettor.choice).color}]}></View>
                        <View style={[styles.choice, styles.choiceBettor]}>
                            <Text style={styles.choiceText}>{post.bettor ? post.bettor.choice : ''}</Text>
                        </View>
                        <View style={[styles.choice, styles.choiceBettee]}>
                            <Text style={styles.choiceText}>{post.bettee ? post.bettee.choice : ''}</Text>
                        </View>
                    </View>
                    <View style={styles.header}>
                        <LikesAndComments
                            color={post.picture ? "white" : Theme.typography.color}
                            id={post.id}
                            {...{ navigation, likes, comments }}
                        />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>{bettee.name}</Text>
                        </View>
                        <Avatar {...bettee.picture} />
                    </View>
                </View>
            </View>
        );
    }
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        // borderRadius: 5,
        shadowColor: "black",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.14,
        // shadowRadius: 6,
        // borderColor: Theme.palette.borderColor,
        // borderWidth: Platform.OS === "ios" ? 0 : 1,
        marginVertical: Theme.spacing.small,
        backgroundColor: "#eeeeee"
    },
    triangleTopLeftCorner: {
        // width: 310,
        // height: 75,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 310,
        borderTopWidth: 150,
        borderRightColor: 'transparent',
        borderTopColor: '#106ecf'
    },
    choicesWrapper: {
        marginBottom: Theme.spacing.small,
    },
    choice: {
        height: 75,
    },
    choiceBettor: {
        paddingLeft: Theme.spacing.small
    },
    choiceBettee: {
        paddingRight: Theme.spacing.small,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    choiceText: {
        fontSize: 50,
        color: "white",
    },
    content: {
        padding: Theme.spacing.small
    },
    header: {
        flexDirection: "row",
        marginBottom: Theme.spacing.small
    },
    metadata: {
        marginHorizontal: Theme.spacing.tiny
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
