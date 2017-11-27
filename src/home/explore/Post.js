// @flow
import * as React from "react";
import moment from "moment";
import {StyleSheet, View, Dimensions} from "react-native";

import Likes from "./Likes";

import {Text, Avatar, Theme, SmartImage} from "../../components";
import type {Post} from "../../components/APIStore";

type PostProps = {
    post: Post
};

export default class PostComp extends React.Component<PostProps> {

    render(): React.Node {
        const {post} = this.props;
        const contentStyle = [styles.content];
        const nameStyle = [styles.name];
        const textStyle = [styles.text];
        const dateStyle = [];
        if (post.picture) {
            contentStyle.push(StyleSheet.absoluteFill);
            contentStyle.push({ backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 5 });
            nameStyle.push({ color: "white" });
            textStyle.push({ color: "white" });
            dateStyle.push({ color: "rgba(255, 255, 255, 0.8)" });
        }
        return (
            <View style={styles.container}>
                {
                    post.picture && (
                        <SmartImage
                            preview={post.picture.preview}
                            uri={post.picture.uri}
                            style={styles.picture}
                        />
                    )
                }
                <View style={contentStyle}>
                    <View style={styles.header}>
                        <Avatar {...post.profilePicture} />
                        <View style={styles.metadata}>
                            <Text style={nameStyle}>{post.name}</Text>
                            <Text style={dateStyle}>{moment(post.timestamp, "X").fromNow()}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={textStyle}>{post.text}</Text>
                    </View>
                    <View style={styles.likes}>
                        <Likes />
                    </View>
                </View>
            </View>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        marginVertical: Theme.spacing.small
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
    },
    likes: {
        flex: 1,
        justifyContent: "flex-end"
    }
});
